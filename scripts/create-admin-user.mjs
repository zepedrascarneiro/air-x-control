// Script para criar usuário administrador master
import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Verificar se já existe
    const existing = await prisma.user.findUnique({
      where: { email: 'admin@airx.com' }
    });

    if (existing) {
      console.log('✅ Usuário admin@airx.com já existe!');
      console.log('   Role:', existing.role);
      console.log('   Status:', existing.status);
      return;
    }

    // Criar senha hash
    const password = 'AirX2024Admin!';
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Criar usuário admin
    const admin = await prisma.user.create({
      data: {
        email: 'admin@airx.com',
        name: 'Administrador Master',
        hashedPassword,
        role: 'ADMIN',
        status: 'ACTIVE',
        phone: null
      }
    });

    console.log('🎉 Usuário administrador criado com sucesso!');
    console.log('');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Senha:', password);
    console.log('👤 Nome:', admin.name);
    console.log('🎭 Papel:', admin.role);
    console.log('✅ Status:', admin.status);
    console.log('');
    console.log('🌐 Faça login em: https://air-x-control-9tnmi.ondigitalocean.app/login');

  } catch (error) {
    console.error('❌ Erro ao criar admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
