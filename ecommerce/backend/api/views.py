"""
API Views for handling HTTP requests
"""
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.db.models import Q
from .models import Category, Product, Address, CartItem, Order, OrderItem
from .serializers import (
    CategorySerializer, ProductSerializer, UserSerializer, RegisterSerializer,
    AddressSerializer, CartItemSerializer, OrderSerializer, OrderItemSerializer
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """Category ViewSet - Read only"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'

    @action(detail=True, methods=['get'])
    def products(self, request, slug=None):
        """Get products for a category"""
        category = self.get_object()
        products = Product.objects.filter(category=category, is_active=True)
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """Product ViewSet - Read only for now"""
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'name', 'created_at', 'discount']
    ordering = ['-created_at']
    lookup_field = 'slug'

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category__slug=category)
        return queryset

    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search products"""
        query = request.query_params.get('q', '')
        if query:
            products = self.queryset.filter(
                Q(name__icontains=query) | Q(description__icontains=query)
            )
            serializer = self.get_serializer(products, many=True)
            return Response(serializer.data)
        return Response([])


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """User Registration"""
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'token': str(refresh.access_token)  # Also include 'token' for compatibility
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """User Login (Simple - for development)"""
    from django.contrib.auth import authenticate
    
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response(
            {'error': 'Username and password required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = authenticate(username=username, password=password)
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'token': str(refresh.access_token),
            'refresh': str(refresh)
        })
    
    return Response(
        {'error': 'Invalid credentials'},
        status=status.HTTP_401_UNAUTHORIZED
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request):
    """Get current user"""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


class AddressViewSet(viewsets.ModelViewSet):
    """Address ViewSet"""
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CartItemViewSet(viewsets.ModelViewSet):
    """Cart Item ViewSet"""
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        cart_item, created = CartItem.objects.get_or_create(
            user=self.request.user,
            product=serializer.validated_data['product'],
            defaults={'quantity': serializer.validated_data.get('quantity', 1)}
        )
        if not created:
            cart_item.quantity += serializer.validated_data.get('quantity', 1)
            cart_item.save()

    @action(detail=False, methods=['get'])
    def total(self, request):
        """Get cart total"""
        cart_items = self.get_queryset()
        total = sum(item.total_price for item in cart_items)
        return Response({'total': total, 'count': cart_items.count()})


class OrderViewSet(viewsets.ModelViewSet):
    """Order ViewSet"""
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def create_order(self, request):
        """Create order from cart"""
        from decimal import Decimal
        
        cart_items = CartItem.objects.filter(user=request.user)
        if not cart_items.exists():
            return Response(
                {'error': 'Cart is empty'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Calculate totals
        subtotal = sum(item.total_price for item in cart_items)
        shipping_cost = Decimal(request.data.get('shipping_cost', 0))
        discount = Decimal(request.data.get('discount', 0))
        total = subtotal + shipping_cost - discount

        # Create order
        order = Order.objects.create(
            user=request.user,
            delivery_address_id=request.data.get('delivery_address_id'),
            subtotal=subtotal,
            shipping_cost=shipping_cost,
            discount=discount,
            total=total,
            payment_method=request.data.get('payment_method', ''),
            notes=request.data.get('notes', '')
        )

        # Create order items
        for cart_item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                product_name=cart_item.product.name,
                quantity=cart_item.quantity,
                price=cart_item.product.price,
                total=cart_item.total_price
            )

        # Clear cart
        cart_items.delete()

        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

