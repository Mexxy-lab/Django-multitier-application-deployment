from django.urls import path, include # type: ignore
from rest_framework.routers import DefaultRouter # type: ignore
from .views import ItemViewSet, CartViewSet, RegisterView, LoginView, LogoutView, OrderCreateView

router = DefaultRouter()
router.register(r'items', ItemViewSet)
router.register(r'cart', CartViewSet, basename='cart')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name="register"),
    path('login/', LoginView.as_view(), name="login"),
    path('logout/', LogoutView.as_view(), name="logout"),
    path('orders/', OrderCreateView.as_view(), name="create-order"),  # New route
]
