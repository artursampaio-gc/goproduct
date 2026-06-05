/**
 * AI Chat Dashboard Widget — Claude-powered inventory assistant.
 *
 * To remove this widget:
 *   1. Delete this file.
 *   2. In DashboardWidgetLibrary.tsx, remove the import and the AiChatDashboardWidget() call.
 *   3. In InvenTree/urls.py (backend), remove the ai-chat import and path entry.
 *   4. Delete src/backend/InvenTree/InvenTree/ai_chat_api.py.
 */

import { t } from '@lingui/core/macro';
import {
  ActionIcon,
  Box,
  Center,
  Group,
  Loader,
  Paper,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  ThemeIcon
} from '@mantine/core';
import { IconRobot, IconSend, IconUser } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';

import { useApi } from '../../../contexts/ApiContext';
import type { DashboardWidgetProps } from '../DashboardWidget';

// ── types ─────────────────────────────────────────────────────────────────────

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  isError?: boolean;
}

// ── sub-components ────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <Center h={240}>
      <Stack align='center' gap='xs'>
        <ThemeIcon size={48} radius='xl' variant='light' color='blue'>
          <IconRobot size={28} />
        </ThemeIcon>
        <Text size='sm' c='dimmed' ta='center' maw={220}>
          {t`Ask about parts, stock levels, assemblies or orders`}
        </Text>
      </Stack>
    </Center>
  );
}

function MessageBubble({ msg }: Readonly<{ msg: ChatMessage }>) {
  const isUser = msg.role === 'user';

  return (
    <Group justify={isUser ? 'flex-end' : 'flex-start'} align='flex-start' gap='xs'>
      {!isUser && (
        <ThemeIcon size='sm' radius='xl' variant='light' color={msg.isError ? 'red' : 'blue'} mt={2}>
          <IconRobot size={12} />
        </ThemeIcon>
      )}

      <Paper
        p='xs'
        radius='md'
        maw='78%'
        bg={isUser ? 'blue.6' : msg.isError ? 'red.0' : 'gray.1'}
        style={{ wordBreak: 'break-word' }}
      >
        <Text
          size='sm'
          c={isUser ? 'white' : msg.isError ? 'red.7' : 'dark'}
          style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}
        >
          {msg.content}
        </Text>
      </Paper>

      {isUser && (
        <ThemeIcon size='sm' radius='xl' variant='light' color='blue' mt={2}>
          <IconUser size={12} />
        </ThemeIcon>
      )}
    </Group>
  );
}

function TypingIndicator() {
  return (
    <Group justify='flex-start' align='flex-start' gap='xs'>
      <ThemeIcon size='sm' radius='xl' variant='light' color='blue' mt={2}>
        <IconRobot size={12} />
      </ThemeIcon>
      <Paper p='xs' radius='md' bg='gray.1'>
        <Loader size='xs' type='dots' color='blue' />
      </Paper>
    </Group>
  );
}

// ── main widget component ─────────────────────────────────────────────────────

function AiChatWidget() {
  const api = useApi();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({
        top: viewportRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setLoading(true);

    try {
      const resp = await api.post('/api/ai-chat/chat/', { message: text });
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: resp.data.response }
      ]);
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.error ?? t`Failed to get a response. Please try again.`;
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: errMsg, isError: true }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Stack gap='xs' h='100%'>
      {/* Scrollable message area — comfortable fixed height */}
      <ScrollArea
        h={440}
        viewportRef={viewportRef}
        scrollbarSize={6}
        style={{ flex: 1 }}
      >
        <Box p='xs'>
          {messages.length === 0 ? (
            <EmptyState />
          ) : (
            <Stack gap='xs'>
              {messages.map((msg, idx) => (
                // Using index as key is fine here — messages are append-only
                // eslint-disable-next-line react/no-array-index-key
                <MessageBubble key={idx} msg={msg} />
              ))}
              {loading && <TypingIndicator />}
            </Stack>
          )}
        </Box>
      </ScrollArea>

      {/* Input row */}
      <Group gap='xs' px='xs' pb='xs'>
        <TextInput
          flex={1}
          size='sm'
          radius='md'
          placeholder={t`Ask about parts, stock...`}
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          rightSection={loading ? <Loader size='xs' /> : undefined}
        />
        <ActionIcon
          size='lg'
          radius='md'
          variant='filled'
          color='blue'
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          aria-label={t`Send message`}
        >
          <IconSend size={16} />
        </ActionIcon>
      </Group>
    </Stack>
  );
}

// ── widget descriptor ─────────────────────────────────────────────────────────

export default function AiChatDashboardWidget(): DashboardWidgetProps {
  return {
    label: 'ai-chat',
    title: t`AI Assistant`,
    description: t`Ask questions about your inventory using AI (Claude)`,
    minWidth: 12, // full-width row (12-column grid)
    minHeight: 7, // ~508px tall — matches the 440px chat area + input
    render: () => <AiChatWidget />
  };
}
