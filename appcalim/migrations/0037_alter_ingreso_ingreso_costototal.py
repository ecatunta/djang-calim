# Generated by Django 5.1 on 2024-10-30 12:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appcalim', '0036_ingresoproducto'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ingreso',
            name='ingreso_costoTotal',
            field=models.FloatField(blank=True, null=True),
        ),
    ]
