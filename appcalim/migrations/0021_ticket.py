# Generated by Django 5.1 on 2024-08-24 05:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appcalim', '0020_delete_categoria2'),
    ]

    operations = [
        migrations.CreateModel(
            name='Ticket',
            fields=[
                ('ticket_id', models.BigAutoField(primary_key=True, serialize=False)),
                ('ticket_numero', models.BigIntegerField()),
                ('ticket_fecha', models.DateTimeField()),
                ('ticket_estado', models.CharField(max_length=100)),
            ],
            options={
                'db_table': 'ticket',
            },
        ),
    ]
