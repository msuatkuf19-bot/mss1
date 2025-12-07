const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('Admin123!', 10);
  
  // Admin kullanıcısını oluştur veya güncelle
  const admin = await prisma.user.upsert({
    where: { email: 'admin@benmedya.com' },
    update: {
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      isActive: true,
    },
    create: {
      email: 'admin@benmedya.com',
      password: hashedPassword,
      name: 'Ben Medya Admin',
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });
  
  console.log('✅ Admin kullanıcısı oluşturuldu/güncellendi:');
  console.log('   Email: admin@benmedya.com');
  console.log('   Şifre: Admin123!');
  console.log('   Rol: SUPER_ADMIN');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
