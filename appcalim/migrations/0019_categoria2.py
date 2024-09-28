# Generated by Django 5.1 on 2024-08-23 13:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appcalim', '0018_inventarioventa'),
    ]

    operations = [
        migrations.CreateModel(
            name='Categoria2',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('categoria_nombre', models.CharField(max_length=100)),
                ('categoria_icon', models.CharField(max_length=50, null=True)),
            ],
            options={
                'db_table': 'categoria2',
            },
        ),
    ]
