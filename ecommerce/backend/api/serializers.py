"""
API Serializers for converting models to JSON
"""
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import Category, Product, Address, CartItem, Order, OrderItem


class CategorySerializer(serializers.ModelSerializer):
    """Category Serializer"""
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image', 'created_at']
    
    def to_representation(self, instance):
        """Override to provide default image if none exists"""
        representation = super().to_representation(instance)
        # Map category slugs to default images if no image is set
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
        
        # If no image uploaded, use default from mapping
        if not representation.get('image') and instance.slug in category_images:
            representation['image'] = category_images[instance.slug]
        elif not representation.get('image'):
            representation['image'] = 'https://via.placeholder.com/800x600?text=Category'
        
        return representation


class ProductSerializer(serializers.ModelSerializer):
    """Product Serializer"""
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True,
        required=False
    )

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'image', 'image_url', 'price',
            'original_price', 'discount', 'category', 'category_id',
            'stock', 'rating', 'reviews_count', 'is_active', 'created_at'
        ]
        read_only_fields = ['rating', 'reviews_count']
    
    def to_representation(self, instance):
        """Override to use image_url if available, otherwise use image"""
        representation = super().to_representation(instance)
        # Use image_url if available, otherwise use image field
        if instance.image_url:
            representation['image'] = instance.image_url
        elif instance.image:
            request = self.context.get('request')
            if request:
                representation['image'] = request.build_absolute_uri(instance.image.url)
            else:
                representation['image'] = instance.image.url if instance.image else None
        else:
            representation['image'] = None
        return representation


class UserSerializer(serializers.ModelSerializer):
    """User Serializer"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']


class RegisterSerializer(serializers.ModelSerializer):
    """User Registration Serializer"""
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'first_name', 'last_name']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
        )
        return user


class AddressSerializer(serializers.ModelSerializer):
    """Address Serializer"""
    class Meta:
        model = Address
        fields = [
            'id', 'full_name', 'phone', 'address', 'city', 'state',
            'zip_code', 'country', 'address_type', 'is_default',
            'lat', 'lng', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class CartItemSerializer(serializers.ModelSerializer):
    """Cart Item Serializer"""
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.filter(is_active=True),
        source='product',
        write_only=True
    )
    total_price = serializers.ReadOnlyField()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity', 'total_price', 'created_at']
        read_only_fields = ['id', 'created_at']


class OrderItemSerializer(serializers.ModelSerializer):
    """Order Item Serializer"""
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price', 'total']


class OrderSerializer(serializers.ModelSerializer):
    """Order Serializer"""
    items = OrderItemSerializer(many=True, read_only=True)
    delivery_address = AddressSerializer(read_only=True)
    delivery_address_id = serializers.PrimaryKeyRelatedField(
        queryset=Address.objects.all(),
        source='delivery_address',
        write_only=True,
        required=False
    )

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'delivery_address', 'delivery_address_id',
            'status', 'subtotal', 'shipping_cost', 'discount', 'total',
            'payment_method', 'notes', 'items', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'order_number', 'created_at', 'updated_at']

