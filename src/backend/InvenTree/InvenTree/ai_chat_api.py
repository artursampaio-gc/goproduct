"""AI Chat API endpoint – InvenTree dashboard assistant (Claude).

To enable:
    Set the ANTHROPIC_API_KEY environment variable (e.g. in docker.dev.env).

To remove:
    1. Delete this file.
    2. In InvenTree/urls.py remove the import and the path('ai-chat/', ...) line.
    3. Delete src/frontend/src/components/dashboard/widgets/AiChatDashboardWidget.tsx
    4. Remove the AiChatDashboardWidget import/call from DashboardWidgetLibrary.tsx
"""

import logging
import os

import requests as http_requests
from django.urls import path
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

logger = logging.getLogger('inventree')

# ── tuneable constants ──────────────────────────────────────────────────────────
GROQ_MODEL = 'llama-3.3-70b-versatile'
GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
MAX_CONTEXT_PARTS = 10
MAX_TOKENS = 1024
REQUEST_TIMEOUT_S = 30
# ────────────────────────────────────────────────────────────────────────────────


def _get_api_key() -> str:
    """Return the Groq API key (env var GROQ_API_KEY)."""
    return os.environ.get('GROQ_API_KEY', '')


def _fetch_parts_context(message: str) -> list:
    """Search InvenTree parts that are relevant to the user message."""
    from django.db.models import Q, Sum

    from part.models import Part
    from stock.models import StockItem

    # Extract words longer than 3 chars as search tokens
    tokens = [w.strip('.,?!;:') for w in message.split() if len(w.strip('.,?!;:')) > 3]

    if not tokens:
        total = Part.objects.filter(active=True).count()
        return [{'summary': f'Total active parts in inventory: {total}'}]

    query = Q()
    for token in tokens[:5]:
        query |= Q(name__icontains=token) | Q(description__icontains=token) | Q(IPN__icontains=token)

    parts = Part.objects.filter(query, active=True).select_related('category')[:MAX_CONTEXT_PARTS]

    context = []
    for part in parts:
        stock_total = (
            StockItem.objects.filter(part=part)
            .aggregate(total=Sum('quantity'))
            .get('total') or 0
        )
        context.append({
            'name': part.name,
            'description': part.description or '',
            'IPN': part.IPN or '',
            'stock': float(stock_total),
            'category': str(part.category) if part.category else 'N/A',
            'is_assembly': part.assembly,
            'minimum_stock': float(part.minimum_stock or 0),
        })

    return context


def _call_groq(api_key: str, message: str, context: list) -> str:
    """Send the message + inventory context to Groq (LLaMA 3.3 70B) and return the reply."""
    system_prompt = (
        'You are InvenTree Assistant, an AI specialized in inventory management. '
        'Help users with questions about parts, stock levels, assemblies, and orders. '
        'Be concise and precise. Use the inventory context when available. '
        'Never answer about stock unless clearly asked about it. '
        'If you cannot find the answer easily, never suppose - answer that the user must check that information with the responsible employee. '
        'What is named "IPN" is supposed to be called "SKU", always replace when answering.'
    )

    context_block = ''
    if context:
        context_block = '\n\n[Current inventory context]\n'
        for item in context:
            if 'summary' in item:
                context_block += item['summary'] + '\n'
            else:
                line = f"• {item['name']}"
                if item['IPN']:
                    line += f" (IPN: {item['IPN']})"
                line += f" — stock: {item['stock']}"
                if item['minimum_stock']:
                    line += f", min: {item['minimum_stock']}"
                if item['category'] != 'N/A':
                    line += f", category: {item['category']}"
                if item['is_assembly']:
                    line += ', assembly: yes'
                if item['description']:
                    line += f"\n  {item['description']}"
                context_block += line + '\n'

    resp = http_requests.post(
        GROQ_API_URL,
        headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
        },
        json={
            'model': GROQ_MODEL,
            'max_tokens': MAX_TOKENS,
            'messages': [
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': message + context_block},
            ],
        },
        timeout=REQUEST_TIMEOUT_S,
    )
    resp.raise_for_status()
    return resp.json()['choices'][0]['message']['content']


class AiChatView(APIView):
    """POST /api/ai-chat/chat/ — receives a message, returns an AI reply."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        message = (request.data.get('message') or '').strip()
        if not message:
            return Response({'error': 'message is required.'}, status=400)

        api_key = _get_api_key()
        if not api_key:
            return Response(
                {
                    'error': (
                        'GROQ_API_KEY is not set. '
                        'Add it to docker-compose.dev.yml and recreate the container.'
                    )
                },
                status=503,
            )

        try:
            context = _fetch_parts_context(message)
            reply = _call_groq(api_key, message, context)
            return Response({'response': reply})
        except http_requests.HTTPError as exc:
            try:
                body = exc.response.json()
            except Exception:
                body = exc.response.text
            logger.error('AI Chat – Groq HTTP %s: %s', exc.response.status_code, body)
            return Response(
                {'error': f'Groq API error {exc.response.status_code}: {body}'},
                status=502,
            )
        except Exception as exc:
            logger.exception('AI Chat – unexpected error')
            return Response({'error': str(exc)}, status=500)


# Registered in InvenTree/urls.py under path('ai-chat/', ...)
ai_chat_api_urls = [
    path('chat/', AiChatView.as_view(), name='ai-chat'),
]
