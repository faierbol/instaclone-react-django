# Generated by Django 3.1.3 on 2020-12-01 04:56

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('server', '0017_auto_20201201_1148'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='postlike',
            name='user',
        ),
        migrations.AddField(
            model_name='postlike',
            name='user',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='auth.user', to_field='username'),
            preserve_default=False,
        ),
    ]
