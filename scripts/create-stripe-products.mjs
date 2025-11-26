#!/usr/bin/env node
/**
 * Script para criar produtos e preços no Stripe
 * Execute com: node scripts/create-stripe-products.mjs
 * 
 * Após a execução, copie os Price IDs gerados para:
 * - .env.local (desenvolvimento)
 * - Variáveis de ambiente da DigitalOcean (produção)
 */

import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY não definida!');
  console.log('Execute: export STRIPE_SECRET_KEY=sk_test_...');
  process.exit(1);
}

const stripe = new Stripe(STRIPE_SECRET_KEY);

async function createProducts() {
  console.log('🚀 Criando produtos no Stripe...\n');

  try {
    // Produto PRO
    console.log('📦 Criando produto PRO...');
    const proProd = await stripe.products.create({
      name: 'Air X Control PRO',
      description: 'Plano profissional para copropriedades de aeronaves. 3 aeronaves incluídas, usuários ilimitados.',
      metadata: {
        plan: 'PRO',
      },
    });

    const proPrice = await stripe.prices.create({
      product: proProd.id,
      unit_amount: 39700, // R$ 397,00 em centavos
      currency: 'brl',
      recurring: {
        interval: 'month',
      },
      metadata: {
        plan: 'PRO',
      },
    });

    console.log(`✅ PRO criado!`);
    console.log(`   Product ID: ${proProd.id}`);
    console.log(`   Price ID: ${proPrice.id}`);
    console.log(`   Preço: R$ 397,00/mês\n`);

    // Produto ENTERPRISE
    console.log('📦 Criando produto ENTERPRISE...');
    const entProd = await stripe.products.create({
      name: 'Air X Control ENTERPRISE',
      description: 'Plano enterprise para operações completas. Aeronaves ilimitadas, módulo de manutenção, suporte dedicado.',
      metadata: {
        plan: 'ENTERPRISE',
      },
    });

    const entPrice = await stripe.prices.create({
      product: entProd.id,
      unit_amount: 69700, // R$ 697,00 em centavos
      currency: 'brl',
      recurring: {
        interval: 'month',
      },
      metadata: {
        plan: 'ENTERPRISE',
      },
    });

    console.log(`✅ ENTERPRISE criado!`);
    console.log(`   Product ID: ${entProd.id}`);
    console.log(`   Price ID: ${entPrice.id}`);
    console.log(`   Preço: R$ 697,00/mês\n`);

    // Addon de aeronave
    console.log('📦 Criando addon de aeronave...');
    const addonProd = await stripe.products.create({
      name: 'Aeronave Adicional',
      description: 'Adicione uma aeronave extra ao seu plano.',
      metadata: {
        type: 'addon',
      },
    });

    const addonPrice = await stripe.prices.create({
      product: addonProd.id,
      unit_amount: 9700, // R$ 97,00 em centavos
      currency: 'brl',
      recurring: {
        interval: 'month',
      },
      metadata: {
        type: 'addon',
      },
    });

    console.log(`✅ Addon criado!`);
    console.log(`   Product ID: ${addonProd.id}`);
    console.log(`   Price ID: ${addonPrice.id}`);
    console.log(`   Preço: R$ 97,00/mês\n`);

    // Resumo final
    console.log('═══════════════════════════════════════════════════');
    console.log('📋 ADICIONE AO SEU .env.local:');
    console.log('═══════════════════════════════════════════════════');
    console.log(`STRIPE_PRO_PRICE_ID="${proPrice.id}"`);
    console.log(`STRIPE_ENTERPRISE_PRICE_ID="${entPrice.id}"`);
    console.log(`STRIPE_ADDON_PRICE_ID="${addonPrice.id}"`);
    console.log('═══════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Erro ao criar produtos:', error.message);
    process.exit(1);
  }
}

createProducts();
