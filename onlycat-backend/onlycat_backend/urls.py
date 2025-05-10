from django.contrib import admin
from django.urls import path, include
from django.conf import settings


urlpatterns = [
    path('api/admin/', admin.site.urls),
    path('api/user/', include('apps.user.urls')),
    path('api/post/', include('apps.post.urls'))
]


# DRF-spectacular
if settings.DEBUG:
    from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
    urlpatterns += [
        path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
        path('api/swagger/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger'),
        path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    ]
