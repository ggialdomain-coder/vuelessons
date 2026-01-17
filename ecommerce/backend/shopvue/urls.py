"""
URL configuration for shopvue project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]

# Serve media files (needed for uploaded product/category images when not using image_url)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)












