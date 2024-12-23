# Generated by Django 5.1 on 2024-11-17 13:40

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appcalim', '0040_ingresoproducto_producto'),
    ]

    operations = [
        migrations.CreateModel(
            name='Item',
            fields=[
                ('item_id', models.BigAutoField(primary_key=True, serialize=False)),
                ('item_codigo', models.CharField(blank=True, max_length=100, null=True)),
                ('item_fechaVencimiento', models.DateTimeField(blank=True, null=True)),
                ('item_estado', models.CharField(max_length=1)),
                ('item_descripcion', models.CharField(blank=True, max_length=100, null=True)),
                ('ingreso', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='appcalim.ingreso')),
                ('producto', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='appcalim.producto')),
            ],
            options={
                'db_table': 'item',
            },
        ),
        migrations.DeleteModel(
            name='IngresoProducto',
        ),
    ]
