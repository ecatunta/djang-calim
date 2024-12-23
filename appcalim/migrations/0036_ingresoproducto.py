# Generated by Django 5.1 on 2024-10-19 13:22

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appcalim', '0035_producto_producto_nombredesc_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='IngresoProducto',
            fields=[
                ('iproducto_id', models.BigAutoField(primary_key=True, serialize=False)),
                ('iproducto_codigo', models.CharField(blank=True, max_length=100, null=True)),
                ('iproducto_fechaVencimiento', models.DateTimeField(blank=True, null=True)),
                ('iproducto_estado', models.CharField(max_length=1)),
                ('iproducto_descripcion', models.CharField(blank=True, max_length=100, null=True)),
                ('ingreso', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='appcalim.ingreso')),
            ],
            options={
                'db_table': 'ingreso_producto',
            },
        ),
    ]
