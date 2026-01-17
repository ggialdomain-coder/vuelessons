"""
Management command to update all products with image URLs
"""
from django.core.management.base import BaseCommand
from api.models import Product


class Command(BaseCommand):
    help = 'Updates all products with image URLs'

    def handle(self, *args, **options):
        # Product images mapping
        product_images = {
            'wireless-headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop&q=80',
            'smart-watch-pro': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop&q=80',
            'laptop-stand': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=600&fit=crop&q=80',
            'cotton-tshirt': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop&q=80',
            'running-shoes': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop&q=80',
            'garden-tool-set': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop&q=80',
            'python-programming-book': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=600&fit=crop&q=80',
            'board-game-collection': 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&h=600&fit=crop&q=80',
        }

        updated_count = 0
        for slug, image_url in product_images.items():
            try:
                product = Product.objects.get(slug=slug)
                product.image_url = image_url
                product.save(update_fields=['image_url'])
                updated_count += 1
                self.stdout.write(self.style.SUCCESS(f'Updated {product.name} with image'))
            except Product.DoesNotExist:
                self.stdout.write(self.style.WARNING(f'Product with slug {slug} not found'))

        self.stdout.write(self.style.SUCCESS(f'\nSuccessfully updated {updated_count} products with images!'))












