"""
Management command to create sample data
"""
from django.core.management.base import BaseCommand
from api.models import Category, Product


class Command(BaseCommand):
    help = 'Creates sample categories and products'

    def handle(self, *args, **options):
        # Create Categories
        categories_data = [
            {'name': 'Electronics', 'slug': 'electronics', 'description': 'Latest gadgets and electronics'},
            {'name': 'Clothing', 'slug': 'clothing', 'description': 'Fashion and apparel'},
            {'name': 'Home & Garden', 'slug': 'home-garden', 'description': 'Home improvement and garden supplies'},
            {'name': 'Sports', 'slug': 'sports', 'description': 'Sports equipment and gear'},
            {'name': 'Books', 'slug': 'books', 'description': 'Books and literature'},
            {'name': 'Toys & Games', 'slug': 'toys-games', 'description': 'Toys and games for all ages'},
            {'name': 'Beauty & Health', 'slug': 'beauty-health', 'description': 'Beauty and health products'},
            {'name': 'Automotive', 'slug': 'automotive', 'description': 'Automotive parts and accessories'},
        ]

        categories = {}
        for cat_data in categories_data:
            category, created = Category.objects.get_or_create(
                slug=cat_data['slug'],
                defaults=cat_data
            )
            categories[cat_data['slug']] = category
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created category: {category.name}'))

        # Create Products
        products_data = [
            {
                'name': 'Wireless Headphones',
                'slug': 'wireless-headphones',
                'description': 'Premium noise-cancelling wireless headphones with 30-hour battery',
                'image': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop&q=80',
                'price': 199.99,
                'original_price': 249.99,
                'discount': 20,
                'category': 'electronics',
                'stock': 50,
                'rating': 4.5,
                'reviews_count': 128
            },
            {
                'name': 'Smart Watch Pro',
                'slug': 'smart-watch-pro',
                'description': 'Advanced fitness tracking and health monitoring smartwatch',
                'image': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop&q=80',
                'price': 299.99,
                'original_price': None,
                'discount': 0,
                'category': 'electronics',
                'stock': 30,
                'rating': 4.8,
                'reviews_count': 256
            },
            {
                'name': 'Laptop Stand',
                'slug': 'laptop-stand',
                'description': 'Ergonomic aluminum laptop stand for better posture',
                'image': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=600&fit=crop&q=80',
                'price': 49.99,
                'original_price': 69.99,
                'discount': 29,
                'category': 'electronics',
                'stock': 100,
                'rating': 4.3,
                'reviews_count': 89
            },
            {
                'name': 'Cotton T-Shirt',
                'slug': 'cotton-tshirt',
                'description': '100% organic cotton comfortable t-shirt',
                'image': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop&q=80',
                'price': 24.99,
                'original_price': None,
                'discount': 0,
                'category': 'clothing',
                'stock': 200,
                'rating': 4.2,
                'reviews_count': 156
            },
            {
                'name': 'Running Shoes',
                'slug': 'running-shoes',
                'description': 'Lightweight running shoes with cushioned sole',
                'image': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop&q=80',
                'price': 89.99,
                'original_price': 119.99,
                'discount': 25,
                'category': 'sports',
                'stock': 75,
                'rating': 4.6,
                'reviews_count': 342
            },
            {
                'name': 'Garden Tool Set',
                'slug': 'garden-tool-set',
                'description': 'Complete garden tool set with storage case',
                'image': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop&q=80',
                'price': 79.99,
                'original_price': 99.99,
                'discount': 20,
                'category': 'home-garden',
                'stock': 40,
                'rating': 4.4,
                'reviews_count': 67
            },
            {
                'name': 'Python Programming Book',
                'slug': 'python-programming-book',
                'description': 'Complete guide to Python programming for beginners',
                'image': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=600&fit=crop&q=80',
                'price': 39.99,
                'original_price': None,
                'discount': 0,
                'category': 'books',
                'stock': 150,
                'rating': 4.7,
                'reviews_count': 234
            },
            {
                'name': 'Board Game Collection',
                'slug': 'board-game-collection',
                'description': 'Family board game collection with 5 popular games',
                'image': 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&h=600&fit=crop&q=80',
                'price': 59.99,
                'original_price': 79.99,
                'discount': 25,
                'category': 'toys-games',
                'stock': 60,
                'rating': 4.5,
                'reviews_count': 123
            },
        ]

        for prod_data in products_data:
            category_slug = prod_data.pop('category')
            category = categories.get(category_slug)
            image_url = prod_data.pop('image', None)
            
            product, created = Product.objects.get_or_create(
                slug=prod_data['slug'],
                defaults={
                    **prod_data,
                    'category': category,
                    'image_url': image_url
                }
            )
            
            # Update image URL if product already exists
            if not created and image_url:
                product.image_url = image_url
                product.save(update_fields=['image_url'])
            
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created product: {product.name} with image'))
            elif image_url:
                self.stdout.write(self.style.SUCCESS(f'Updated product: {product.name} with image'))

        self.stdout.write(self.style.SUCCESS('Sample data created successfully!'))

