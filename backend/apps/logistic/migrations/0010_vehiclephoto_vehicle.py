# Generated by Django 5.0.6 on 2024-07-31 08:35

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('logistic', '0009_vehiclephoto'),
    ]

    operations = [
        migrations.AddField(
            model_name='vehiclephoto',
            name='vehicle',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='photos', to='logistic.vehicle'),
            preserve_default=False,
        ),
    ]
