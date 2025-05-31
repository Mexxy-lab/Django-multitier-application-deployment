from django.core.management.base import BaseCommand # type: ignore
from api.models import Item

class Command(BaseCommand):
    help = 'Seeds the database with initial store items'

    def handle(self, *args, **kwargs):
        items = [
            {'name': 'Wireless Mouse', 'description': 'Bluetooth-enabled ergonomic mouse'},
            {'name': 'Laptop Stand', 'description': 'Adjustable aluminum stand'},
            {'name': 'USB-C Hub', 'description': '7-in-1 USB-C hub with HDMI, USB, SD slots'},
            {'name': 'Mechanical Keyboard', 'description': 'RGB backlit keyboard with blue switches'},
            {'name': 'Noise Cancelling Headphones', 'description': 'Over-ear wireless headphones'},
            {'name': 'Wireless Pad', 'description': 'Bluetooth-enabled'},
            {'name': 'Laptop Charger', 'description': 'Adjustable aluminum charger'},
            {'name': 'USB-A Hub', 'description': '8-in-1 USB-C hub with HDMI, USB, SD slots'},
            {'name': 'Wired Keyboard', 'description': 'RGB backlit keyboard with blue switches'},
            {'name': 'Noiseless-charger', 'description': 'Over-ear wireless chargers'},
        ]

        created_count = 0
        for item in items:
            obj, created = Item.objects.get_or_create(name=item['name'], defaults={'description': item['description']})
            if created:
                created_count += 1

        self.stdout.write(self.style.SUCCESS(f"Seeded {created_count} new items."))
