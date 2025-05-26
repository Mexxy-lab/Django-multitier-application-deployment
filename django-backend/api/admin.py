from django.contrib import admin # type: ignore
from .models import Item, Cart, Order

admin.site.register(Item)
admin.site.register(Cart)
admin.site.register(Order)
