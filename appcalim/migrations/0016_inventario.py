# Generated by Django 5.1 on 2024-08-22 13:06

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appcalim', '0015_venta'),
    ]

    operations = [
        migrations.CreateModel(
            name='Inventario',
            fields=[
                ('inv_id', models.BigAutoField(primary_key=True, serialize=False)),
                ('inv_modo', models.CharField(max_length=100)),
                ('inv_fechaUltActualizacion', models.DateTimeField()),
                ('inv_cantidadAnterior', models.BigIntegerField()),
                ('inv_cantidad', models.BigIntegerField()),
                ('inv_cantidadactual', models.BigIntegerField()),
                ('producto', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='appcalim.producto')),
            ],
            options={
                'db_table': 'inventario',
            },
        ),
    ]
