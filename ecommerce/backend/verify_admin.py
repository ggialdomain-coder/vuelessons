"""
Quick script to verify admin registrations
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shopvue.settings')
django.setup()

from django.contrib import admin
from api.models import Category, Product, Address, CartItem, Order, OrderItem

print("=" * 60)
print("Checking Admin Registrations")
print("=" * 60)

models_to_check = [
    ('Category', Category),
    ('Product', Product),
    ('Address', Address),
    ('CartItem', CartItem),
    ('Order', Order),
    ('OrderItem', OrderItem),
]

for name, model in models_to_check:
    is_registered = admin.site.is_registered(model)
    status = "[OK] REGISTERED" if is_registered else "[X] NOT REGISTERED"
    print(f"{name:20} - {status}")

print("\n" + "=" * 60)
print("All models should show as REGISTERED above")
print("=" * 60)

# Count records
print("\nRecord Counts:")
print(f"Categories: {Category.objects.count()}")
print(f"Products: {Product.objects.count()}")
print(f"Addresses: {Address.objects.count()}")
print(f"Cart Items: {CartItem.objects.count()}")
print(f"Orders: {Order.objects.count()}")
print(f"Order Items: {OrderItem.objects.count()}")

print("\n[OK] If all show REGISTERED, they should appear in admin panel!")
print("   Go to: http://localhost:8000/admin/")
print("   Look for 'Ecommerce API' section")

