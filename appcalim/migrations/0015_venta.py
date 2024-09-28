# Generated by Django 5.1 on 2024-08-22 13:01

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appcalim', '0014_parametroatributo_patributo_label_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Venta',
            fields=[
                ('venta_id', models.BigAutoField(primary_key=True, serialize=False)),
                ('venta_estado', models.CharField(max_length=1)),
                ('venta_fecha', models.DateTimeField()),
                ('venta_precioUnitario', models.FloatField()),
                ('venta_cantidad', models.BigIntegerField(blank=True, null=True)),
                ('venta_precioTotal', models.FloatField()),
                ('producto', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='appcalim.producto')),
            ],
            options={
                'db_table': 'venta',
            },
        ),
    ]
