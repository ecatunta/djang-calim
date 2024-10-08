# Generated by Django 5.1 on 2024-08-13 19:03

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appcalim', '0005_alter_categoria_table_alter_subcategoria_table'),
    ]

    operations = [
        migrations.CreateModel(
            name='Producto',
            fields=[
                ('producto_id', models.BigAutoField(primary_key=True, serialize=False)),
                ('producto_gondola', models.BigIntegerField(blank=True, null=True)),
                ('producto_nombre', models.CharField(max_length=200)),
                ('producto_precio_uni', models.FloatField(blank=True, null=True)),
                ('producto_stock', models.FloatField(blank=True, null=True)),
                ('subcategoria', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='appcalim.subcategoria')),
            ],
            options={
                'db_table': 'producto',
            },
        ),
    ]
