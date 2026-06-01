import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('part', '0153_cor'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='part',
            name='cor',
        ),
        migrations.AddField(
            model_name='part',
            name='cor',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='parts',
                to='part.cor',
                verbose_name='Cor',
                help_text='Cor do produto',
            ),
        ),
    ]
