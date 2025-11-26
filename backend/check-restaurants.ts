import prisma from './src/config/database';

async function checkUser() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'msuatkuf19@gmail.com' },
      include: {
        restaurants: true,
      }
    });
    
    console.log('\n👤 Kullanıcı Bilgisi:\n');
    console.log(JSON.stringify(user, null, 2));
    
    if (!user) {
      console.log('\n⚠️  Kullanıcı bulunamadı!');
    } else if (user.restaurants.length === 0) {
      console.log('\n⚠️  Bu kullanıcının restoranı yok!');
      console.log('Çözüm: restaurant1@example.com / password123 ile giriş yapın veya süper admin ile yeni restoran oluşturun');
    }
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();
