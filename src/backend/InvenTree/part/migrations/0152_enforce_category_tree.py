"""Enforce the fixed category taxonomy: Categoria > Sub-Categoria > Modelo.

Data-only migration which normalises existing data to the new rules:

- A product (Part) may only live directly inside a Modelo (a level-2 category).
  Any part outside that rule (pinned to a Categoria/Sub-Categoria, or with no
  category at all) is removed.
- The ``structural`` flag of every PartCategory is derived from its depth:
  levels 0 (Categoria) and 1 (Sub-Categoria) are structural; level 2 (Modelo)
  is the only level that may hold parts.
"""

from django.db import migrations


def enforce_category_tree(apps, schema_editor):
    """Normalise existing data to the fixed taxonomy rules."""
    PartCategory = apps.get_model('part', 'PartCategory')
    Part = apps.get_model('part', 'Part')

    # 1. Remove any product that is not directly inside a Modelo (level 2).
    Part.objects.exclude(category__level=2).delete()

    # 2. structural = (level < 2)
    PartCategory.objects.filter(level__lt=2).update(structural=True)
    PartCategory.objects.filter(level__gte=2).update(structural=False)


def reverse(apps, schema_editor):
    """No-op reverse: previous ``structural`` values are not restorable."""


class Migration(migrations.Migration):
    """Data migration enforcing the fixed Categoria/Sub-Categoria/Modelo tree."""

    dependencies = [
        ('part', '0151_part_codigo_barras_part_cor_part_fob_and_more'),
    ]

    operations = [
        migrations.RunPython(enforce_category_tree, reverse),
    ]
