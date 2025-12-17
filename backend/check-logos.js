const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkRestaurants() {
  try {
    const restaurants = await prisma.restaurant.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        ownerId: true,
      }
    });
    
    console.log('\n🍽️ Tüm Restoranlar:\n');
    restaurants.forEach(r => {
      console.log(`${r.name} (${r.slug})`);
      console.log(`  - ID: ${r.id}`);
      console.log(`  - Owner: ${r.ownerId}`);
      console.log(`  - Logo: ${r.logo || 'YOK'}`);
      console.log('');
    });

    // Demo user'ın restaurant'ını bul
    const demoRestaurant = restaurants.find(r => r.name === 'Lezzetli Lokanta');
    if (demoRestaurant) {
      console.log('🎯 Demo Restaurant bulundu:', demoRestaurant.slug);
      console.log('Logo URL:', demoRestaurant.logo);
    }
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkRestaurants();