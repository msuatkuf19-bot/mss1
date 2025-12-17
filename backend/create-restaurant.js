const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createRestaurantForUser() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'msuatkuf19@gmail.com' }
    });
    
    if (!user) {
      console.log('❌ Kullanıcı bulunamadı');
      return;
    }
    
    console.log('👤 Kullanıcı bulundu:', user.name);
    
    // Restoran oluştur
    const restaurant = await prisma.restaurant.create({
      data: {
        name: 'Test Restoran',
        slug: 'test-restoran-mss',
        description: 'Test amaçlı restoran',
        address: 'Test Adresi',
        phone: '555 123 4567',
        email: 'test@restaurant.com',
        themeColor: '#3B82F6',
        workingHours: JSON.stringify({
          monday: { isOpen: true, hours: '09:00-22:00' },
          tuesday: { isOpen: true, hours: '09:00-22:00' },
          wednesday: { isOpen: true, hours: '09:00-22:00' },
          thursday: { isOpen: true, hours: '09:00-22:00' },
          friday: { isOpen: true, hours: '09:00-23:00' },
          saturday: { isOpen: true, hours: '09:00-23:00' },
          sunday: { isOpen: true, hours: '10:00-22:00' }
        }),
        isActive: true,
        ownerId: user.id,
      }
    });
    
    console.log('🏪 Restoran oluşturuldu:');
    console.log(`  - Adı: ${restaurant.name}`);
    console.log(`  - Slug: ${restaurant.slug}`);
    console.log(`  - ID: ${restaurant.id}`);
    console.log(`  - Menü URL: http://localhost:3000/menu/${restaurant.slug}`);
    console.log('\n✅ Şimdi bu restoran için logo yükleyebilirsiniz!');
    
  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createRestaurantForUser();