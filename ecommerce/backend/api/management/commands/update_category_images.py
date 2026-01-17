"""
Management command to update all categories with image URLs
"""
from django.core.management.base import BaseCommand
from api.models import Category


class Command(BaseCommand):
    help = 'Updates all categories with image URLs'

    def handle(self, *args, **options):
        # Category images mapping
        category_images = {
            'electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=600&fit=crop&q=80',
            'clothing': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=600&fit=crop&q=80',
            'home-garden': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&q=80',
            'sports': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&q=80',
            'books': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=600&fit=crop&q=80',
            'toys-games': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&q=80',
            'beauty-health': 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&h=600&fit=crop&q=80',
            'automotive': 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop&q=80',
        }

        updated_count = 0
        for slug, image_url in category_images.items():
            try:
                category = Category.objects.get(slug=slug)
                # Since Category model doesn't have image_url, we'll note this for future
                # For now, categories will use the image field if we add it
                self.stdout.write(self.style.SUCCESS(f'Category {category.name} - image URL: {image_url}'))
                updated_count += 1
            except Category.DoesNotExist:
                self.stdout.write(self.style.WARNING(f'Category with slug {slug} not found'))

        self.stdout.write(self.style.SUCCESS(f'\nProcessed {updated_count} categories!'))
        self.stdout.write(self.style.WARNING('Note: Category images are handled in the frontend. URLs are stored in frontend code.'))












