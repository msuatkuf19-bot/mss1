import { PrismaClient, UserRole } from '@prisma/client';
import { hashPassword } from '../src/utils/bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Süper Admin oluştur
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@qrmenu.com' },
    update: {},
    create: {
      email: 'admin@qrmenu.com',
      password: await hashPassword('admin123'),
      name: 'Super Admin',
      role: UserRole.SUPER_ADMIN,
    },
  });

  console.log('✅ Super Admin created:', superAdmin.email);

  // Örnek Restoran 1
  const restaurant1Owner = await prisma.user.upsert({
    where: { email: 'restaurant1@example.com' },
    update: {},
    create: {
      email: 'restaurant1@example.com',
      password: await hashPassword('password123'),
      name: 'Restaurant 1 Owner',
      role: UserRole.RESTAURANT_ADMIN,
    },
  });

  const restaurant1 = await prisma.restaurant.upsert({
    where: { slug: 'lezzetli-lokanta' },
    update: {},
    create: {
      name: 'Lezzetli Lokanta',
      slug: 'lezzetli-lokanta',
      description: 'Geleneksel Türk mutfağının en lezzetli örnekleri',
      address: 'Kadıköy, İstanbul',
      phone: '+90 555 111 22 33',
      email: 'info@lezzetlilokanta.com',
      themeColor: '#E74C3C',
      ownerId: restaurant1Owner.id,
      workingHours: JSON.stringify({
        pazartesi: '09:00-22:00',
        sali: '09:00-22:00',
        carsamba: '09:00-22:00',
        persembe: '09:00-22:00',
        cuma: '09:00-23:00',
        cumartesi: '10:00-23:00',
        pazar: '10:00-22:00',
      }),
    },
  });

  console.log('✅ Restaurant 1 created:', restaurant1.name);

  // Restaurant 1 Kategoriler
  const category1 = await prisma.category.create({
    data: {
      name: 'Başlangıçlar',
      description: 'Yemeğe başlamak için ideal seçenekler',
      order: 1,
      restaurantId: restaurant1.id,
    },
  });

  const category2 = await prisma.category.create({
    data: {
      name: 'Ana Yemekler',
      description: 'Özenle hazırlanmış ana yemeklerimiz',
      order: 2,
      restaurantId: restaurant1.id,
    },
  });

  const category3 = await prisma.category.create({
    data: {
      name: 'İçecekler',
      description: 'Serinletici ve ısıtıcı içecekler',
      order: 3,
      restaurantId: restaurant1.id,
    },
  });

  console.log('✅ Categories created');

  // Restaurant 1 Ürünler
  await prisma.product.createMany({
    data: [
      // Başlangıçlar
      {
        name: 'Mercimek Çorbası',
        description: 'Geleneksel Türk mercimek çorbası, taze limon ile servis edilir',
        price: 45,
        categoryId: category1.id,
        isPopular: true,
        order: 1,
      },
      {
        name: 'Sigara Böreği',
        description: 'Çıtır çıtır sigara böreği (6 adet), peynir veya kıymalı',
        price: 65,
        categoryId: category1.id,
        order: 2,
      },
      {
        name: 'Humus',
        description: 'Taze nohuttan hazırlanmış, tahin ve zeytinyağı ile',
        price: 55,
        categoryId: category1.id,
        isNew: true,
        order: 3,
      },
      // Ana Yemekler
      {
        name: 'İskender Kebap',
        description: 'Özel soslu döner, tereyağı ve yoğurt ile',
        price: 185,
        categoryId: category2.id,
        isPopular: true,
        order: 1,
      },
      {
        name: 'Adana Kebap',
        description: 'Közde pişirilmiş acılı köfte, pirinç pilav ile servis',
        price: 165,
        categoryId: category2.id,
        order: 2,
      },
      {
        name: 'Karışık Izgara',
        description: 'Adana, şiş, pirzola ve köfte bir arada',
        price: 225,
        categoryId: category2.id,
        order: 3,
      },
      {
        name: 'Mantı',
        description: 'El açması mantı, yoğurt ve tereyağlı sos ile',
        price: 95,
        categoryId: category2.id,
        isPopular: true,
        order: 4,
      },
      // İçecekler
      {
        name: 'Türk Çayı',
        description: 'Taze demlenmiş Türk çayı',
        price: 15,
        categoryId: category3.id,
        order: 1,
      },
      {
        name: 'Ayran',
        description: 'Ev yapımı ayran',
        price: 20,
        categoryId: category3.id,
        order: 2,
      },
      {
        name: 'Taze Sıkılmış Portakal Suyu',
        description: 'Doğal portakal suyu',
        price: 45,
        categoryId: category3.id,
        isNew: true,
        order: 3,
      },
    ],
  });

  console.log('✅ Products created');

  // QR Kod oluştur
  await prisma.qRCode.create({
    data: {
      code: `${restaurant1.slug}-general-${Date.now()}`,
      restaurantId: restaurant1.id,
    },
  });

  console.log('✅ QR Code created');
  console.log('\n🎉 Seeding completed successfully!');
  console.log('\n📝 Login credentials:');
  console.log('Super Admin:');
  console.log('  Email: admin@qrmenu.com');
  console.log('  Password: admin123');
  console.log('\nRestaurant Admin:');
  console.log('  Email: restaurant1@example.com');
  console.log('  Password: password123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
