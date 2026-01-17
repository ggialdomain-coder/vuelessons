"""
API URL Configuration
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet, basename='category')
router.register(r'products', views.ProductViewSet, basename='product')
router.register(r'addresses', views.AddressViewSet, basename='address')
router.register(r'cart', views.CartItemViewSet, basename='cart')
router.register(r'orders', views.OrderViewSet, basename='order')

urlpatterns = [
    # Router URLs
    path('', include(router.urls)),
    
    # Authentication
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login, name='login'),
    path('auth/user/', views.get_user, name='get_user'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Product search
    path('products/search/', views.ProductViewSet.as_view({'get': 'search'}), name='product-search'),
]












