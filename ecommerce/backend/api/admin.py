"""
Django Admin Configuration
"""
from django.contrib import admin
from .models import Category, Product, Address, CartItem, Order, OrderItem


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'created_at']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'stock', 'is_active', 'created_at']
    list_filter = ['category', 'is_active', 'created_at']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'user', 'city', 'country', 'is_default', 'created_at']
    list_filter = ['country', 'address_type', 'is_default', 'created_at']
    search_fields = ['full_name', 'user__username', 'city', 'address']
    readonly_fields = ['created_at', 'updated_at']
    list_per_page = 25


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ['user', 'product', 'quantity', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__username', 'product__name']


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product', 'product_name', 'quantity', 'price', 'total']
    can_delete = False
    verbose_name = "Order Item"
    verbose_name_plural = "Order Items"


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'product_name', 'quantity', 'price', 'total']
    list_filter = ['order__status', 'order__created_at']
    search_fields = ['product_name', 'order__order_number']
    readonly_fields = ['order', 'product', 'product_name', 'quantity', 'price', 'total']
    list_per_page = 25


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_number', 'user', 'status', 'total', 'subtotal', 'created_at']
    list_filter = ['status', 'created_at', 'payment_method']
    search_fields = ['order_number', 'user__username', 'user__email']
    readonly_fields = ['order_number', 'created_at', 'updated_at']
    inlines = [OrderItemInline]
    list_per_page = 25
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Order Information', {
            'fields': ('order_number', 'user', 'status', 'delivery_address')
        }),
        ('Payment & Totals', {
            'fields': ('subtotal', 'shipping_cost', 'discount', 'total', 'payment_method')
        }),
        ('Additional Information', {
            'fields': ('notes', 'created_at', 'updated_at')
        }),
    )

