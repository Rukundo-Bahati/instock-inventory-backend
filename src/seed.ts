import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ItemsService } from './items/items.service';
import { CategoriesService } from './categories/categories.service';
import { LocationsService } from './locations/locations.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const itemsService = app.get(ItemsService);
  const categoriesService = app.get(CategoriesService);
  const locationsService = app.get(LocationsService);

  console.log('🌱 Seeding database...');

  // Seed Categories
  const categories = [
    { name: 'Electronics', description: 'Electronic devices and accessories', color: '#3B82F6' },
    { name: 'Furniture', description: 'Office and home furniture', color: '#10B981' },
    { name: 'Stationery', description: 'Office supplies and stationery', color: '#F59E0B' },
    { name: 'Clothing', description: 'Apparel and accessories', color: '#8B5CF6' },
  ];

  const createdCategories: any[] = [];
  for (const cat of categories) {
    try {
      const created = await categoriesService.create(cat);
      createdCategories.push(created);
      console.log(`✓ Created category: ${cat.name}`);
    } catch (error) {
      console.log(`- Category ${cat.name} already exists`);
      const existing = await categoriesService.findAll();
      createdCategories.push(...existing);
    }
  }

  // Seed Locations
  const locations = [
    { name: 'Main Warehouse', address: '123 Storage St, City, State', type: 'warehouse' },
    { name: 'Store #1', address: '456 Retail Ave, City, State', type: 'store' },
    { name: 'Office', address: '789 Business Blvd, City, State', type: 'office' },
  ];

  const createdLocations: any[] = [];
  for (const loc of locations) {
    try {
      const created = await locationsService.create(loc);
      createdLocations.push(created);
      console.log(`✓ Created location: ${loc.name}`);
    } catch (error) {
      console.log(`- Location ${loc.name} already exists`);
      const existing = await locationsService.findAll();
      createdLocations.push(...existing);
    }
  }

  // Seed Items
  const items = [
    {
      name: 'Wireless Mouse',
      sku: 'ELEC-001',
      description: 'Ergonomic wireless mouse with USB receiver',
      price: 29.99,
      quantity: 45,
      minStock: 20,
      categoryId: createdCategories[0]?.id,
      locationId: createdLocations[0]?.id,
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
      tags: ['electronics', 'accessories'],
      status: 'active',
    },
    {
      name: 'Office Chair',
      sku: 'FURN-001',
      description: 'Ergonomic office chair with lumbar support',
      price: 299.99,
      quantity: 8,
      minStock: 10,
      categoryId: createdCategories[1]?.id,
      locationId: createdLocations[0]?.id,
      image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400',
      tags: ['furniture', 'office'],
      status: 'active',
    },
    {
      name: 'Notebook Set',
      sku: 'STAT-001',
      description: 'Pack of 5 spiral notebooks',
      price: 12.99,
      quantity: 150,
      minStock: 50,
      categoryId: createdCategories[2]?.id,
      locationId: createdLocations[1]?.id,
      image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=400',
      tags: ['stationery', 'office'],
      status: 'active',
    },
    {
      name: 'Mechanical Keyboard',
      sku: 'ELEC-002',
      description: 'RGB mechanical keyboard with blue switches',
      price: 89.99,
      quantity: 0,
      minStock: 15,
      categoryId: createdCategories[0]?.id,
      locationId: createdLocations[0]?.id,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
      tags: ['electronics', 'gaming'],
      status: 'active',
    },
    {
      name: 'Standing Desk',
      sku: 'FURN-002',
      description: 'Adjustable height standing desk',
      price: 499.99,
      quantity: 5,
      minStock: 8,
      categoryId: createdCategories[1]?.id,
      locationId: createdLocations[0]?.id,
      image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=400',
      tags: ['furniture', 'office'],
      status: 'active',
    },
    {
      name: 'Pen Set',
      sku: 'STAT-002',
      description: 'Premium ballpoint pen set',
      price: 24.99,
      quantity: 75,
      minStock: 30,
      categoryId: createdCategories[2]?.id,
      locationId: createdLocations[1]?.id,
      image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400',
      tags: ['stationery', 'writing'],
      status: 'active',
    },
    {
      name: 'USB-C Hub',
      sku: 'ELEC-003',
      description: '7-in-1 USB-C hub with HDMI and card reader',
      price: 49.99,
      quantity: 3,
      minStock: 10,
      categoryId: createdCategories[0]?.id,
      locationId: createdLocations[0]?.id,
      image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400',
      tags: ['electronics', 'accessories'],
      status: 'active',
    },
    {
      name: 'T-Shirt',
      sku: 'CLTH-001',
      description: 'Cotton crew neck t-shirt',
      price: 19.99,
      quantity: 120,
      minStock: 50,
      categoryId: createdCategories[3]?.id,
      locationId: createdLocations[1]?.id,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
      tags: ['clothing', 'casual'],
      status: 'active',
    },
  ];

  for (const item of items) {
    try {
      await itemsService.create(item);
      console.log(`✓ Created item: ${item.name}`);
    } catch (error) {
      console.log(`- Item ${item.name} already exists`);
    }
  }

  console.log('✅ Seeding completed!');
  await app.close();
}

bootstrap();
