const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        restaurants: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
          }
        }
      }
    });
    
    console.log('\n👤 Tüm Kullanıcılar ve Restoranları:\n');
    users.forEach(user => {
      console.log(`${user.name} (${user.email})`);
      console.log(`  - ID: ${user.id}`);
      if (user.restaurants.length > 0) {
        console.log('  - Restoranları:');
        user.restaurants.forEach(r => {
          console.log(`    * ${r.name} (${r.slug})`);
          console.log(`      Logo: ${r.logo || 'YOK'}`);
        });
      } else {
        console.log('  - Restoranı yok');
      }
      console.log('');
    });

    // msuatkuf19@gmail.com kullanıcısını bul
    const targetUser = users.find(u => u.email === 'msuatkuf19@gmail.com');
    if (targetUser) {
      console.log('🎯 Hedef kullanıcı bulundu:', targetUser.name);
      if (targetUser.restaurants.length > 0) {
        console.log('Restoranları:', targetUser.restaurants.map(r => r.name).join(', '));
      } else {
        console.log('❌ Bu kullanıcının restoranı yok!');
        console.log('💡 Çözüm: restaurant1@example.com ile giriş yapın veya yeni restoran oluşturun');
      }
    }
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();