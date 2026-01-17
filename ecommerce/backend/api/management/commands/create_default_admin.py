"""
Management command to create default admin user
"""
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User


class Command(BaseCommand):
    help = 'Creates a default admin user'

    def handle(self, *args, **options):
        username = 'admin'
        email = 'admin@shopvue.com'
        password = 'admin123'
        
        if User.objects.filter(username=username).exists():
            self.stdout.write(self.style.WARNING(f'User "{username}" already exists.'))
        else:
            User.objects.create_superuser(username=username, email=email, password=password)
            self.stdout.write(self.style.SUCCESS(f'Successfully created superuser "{username}" with password "{password}"'))
            self.stdout.write(self.style.SUCCESS('You can now login at http://localhost:8000/admin/'))












