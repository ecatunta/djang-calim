# Generated by Django 5.1 on 2024-11-16 20:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appcalim', '0038_ingreso_ingreso_comprador_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='producto',
            name='producto_sigla',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]