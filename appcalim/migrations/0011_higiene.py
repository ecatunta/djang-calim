# Generated by Django 5.1 on 2024-08-16 16:58

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appcalim', '0010_alter_subcategoria_subcategoria_imagen'),
    ]

    operations = [
        migrations.CreateModel(
            name='Higiene',
            fields=[
                ('producto', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='appcalim.producto')),
                ('higiene_marca', models.CharField(blank=True, max_length=50, null=True)),
                ('higiene_talla', models.CharField(blank=True, max_length=30, null=True)),
                ('higiene_peso_inicio', models.FloatField(blank=True, null=True)),
                ('higiene_peso_fin', models.FloatField(blank=True, null=True)),
                ('higiene_tiempo_proteccion', models.IntegerField(blank=True, null=True)),
                ('higiene_jaba_paquete', models.IntegerField(blank=True, null=True)),
                ('higiene_jaba_peso', models.FloatField(blank=True, null=True)),
                ('higiene_jaba_precio', models.FloatField(blank=True, null=True)),
                ('higiene_paquete_unidad', models.IntegerField(blank=True, null=True)),
                ('higiene_paquete_medida', models.CharField(blank=True, max_length=100, null=True)),
                ('higiene_paquete_peso', models.FloatField(blank=True, null=True)),
                ('higiene_paquete_precio', models.FloatField(blank=True, null=True)),
                ('higiene_color', models.CharField(blank=True, max_length=50, null=True)),
                ('higiene_descripcion', models.CharField(blank=True, max_length=250, null=True)),
            ],
            options={
                'db_table': 'higiene',
            },
        ),
    ]
