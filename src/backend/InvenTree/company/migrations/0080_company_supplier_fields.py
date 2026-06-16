"""Migration: add GoProduct custom supplier fields to Company model."""

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    """Add custom supplier fields: razao_social, contato_nome, endereco, porto, dados_bancarios, incoterm, termo_pagamento."""

    dependencies = [
        ('company', '0079_auto_20260212_1054'),
    ]

    operations = [
        migrations.AddField(
            model_name='company',
            name='razao_social',
            field=models.CharField(
                blank=True,
                default='',
                help_text='Razão social da empresa',
                max_length=500,
                verbose_name='Razão Social',
            ),
        ),
        migrations.AddField(
            model_name='company',
            name='contato_nome',
            field=models.CharField(
                blank=True,
                default='',
                help_text='Nome do contato principal',
                max_length=200,
                verbose_name='Contato',
            ),
        ),
        migrations.AddField(
            model_name='company',
            name='endereco',
            field=models.TextField(
                blank=True,
                default='',
                help_text='Endereço do fornecedor',
                verbose_name='Endereço',
            ),
        ),
        migrations.AddField(
            model_name='company',
            name='porto',
            field=models.CharField(
                blank=True,
                default='',
                help_text='Porto de embarque',
                max_length=200,
                verbose_name='Porto',
            ),
        ),
        migrations.AddField(
            model_name='company',
            name='dados_bancarios',
            field=models.TextField(
                blank=True,
                default='',
                help_text='Dados bancários do fornecedor',
                verbose_name='Dados Bancários',
            ),
        ),
        migrations.AddField(
            model_name='company',
            name='incoterm',
            field=models.CharField(
                blank=True,
                choices=[
                    ('EXW', 'EXW'),
                    ('FOB', 'FOB'),
                    ('FCA', 'FCA'),
                    ('CPT', 'CPT'),
                    ('CIP', 'CIP'),
                    ('DAP', 'DAP'),
                    ('DPU', 'DPU'),
                    ('DDP', 'DDP'),
                    ('FAS', 'FAS'),
                    ('CFR', 'CFR'),
                    ('CIF', 'CIF'),
                ],
                default='',
                help_text='Termos de entrega internacional (Incoterms)',
                max_length=10,
                verbose_name='Incoterm',
            ),
        ),
        migrations.AddField(
            model_name='company',
            name='termo_pagamento',
            field=models.TextField(
                blank=True,
                default='',
                help_text='Condições de pagamento do fornecedor',
                verbose_name='Termo de Pagamento',
            ),
        ),
    ]
