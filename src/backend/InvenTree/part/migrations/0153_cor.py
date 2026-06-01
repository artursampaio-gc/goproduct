"""Migration to add the Cor (Color) model."""

from django.db import migrations, models


class Migration(migrations.Migration):
    """Create the Cor (Color) table."""

    dependencies = [
        ('part', '0152_enforce_category_tree'),
    ]

    operations = [
        migrations.CreateModel(
            name='Cor',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('metadata', models.JSONField(blank=True, help_text='JSON metadata field, for use by external plugins', null=True, verbose_name='Plugin Metadata')),
                ('nome_pt', models.CharField(help_text='Nome da cor em português', max_length=100, verbose_name='Nome (Português)')),
                ('nome_en', models.CharField(help_text='Colour name in English', max_length=100, verbose_name='Name (English)')),
                ('pantone', models.CharField(blank=True, help_text='Código Pantone (opcional)', max_length=50, null=True, verbose_name='Pantone')),
                ('hex_code', models.CharField(blank=True, help_text='Código hexadecimal da cor, ex.: #FF5733', max_length=7, null=True, verbose_name='Código Hex')),
                ('textura', models.ImageField(blank=True, help_text='Imagem de textura representando a cor (opcional)', null=True, upload_to='cor/texturas/', verbose_name='Textura')),
            ],
            options={
                'verbose_name': 'Cor',
                'verbose_name_plural': 'Cores',
                'ordering': ['nome_pt'],
            },
        ),
    ]
