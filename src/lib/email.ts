import { Resend } from 'resend';

// Inicializa o cliente Resend apenas se tiver API key
const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Domínio de envio (configurar no Resend dashboard)
const FROM_EMAIL = process.env.EMAIL_FROM || 'Air X Control <noreply@airxcontrol.com>';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://air-x-control-9tnmi.ondigitalocean.app';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

/**
 * Envia um email usando Resend
 */
export async function sendEmail(options: EmailOptions) {
  // Se não tiver cliente Resend, loga e retorna
  if (!resend) {
    console.warn('[Email] RESEND_API_KEY não configurada. Email não enviado:', options.subject);
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    if (error) {
      console.error('[Email] Erro ao enviar:', error);
      return { success: false, error };
    }

    console.log('[Email] Enviado com sucesso:', data?.id);
    return { success: true, id: data?.id };
  } catch (error) {
    console.error('[Email] Erro inesperado:', error);
    return { success: false, error };
  }
}

/**
 * Template base para emails
 */
function emailTemplate(content: string) {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Air X Control</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f1f5f9;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                ✈️ Air X Control
              </h1>
              <p style="margin: 8px 0 0; color: #bfdbfe; font-size: 14px;">
                Gestão Inteligente para Aviação Compartilhada
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 8px; color: #64748b; font-size: 12px;">
                © 2025 Air X Control. Todos os direitos reservados.
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 11px;">
                Este email foi enviado para você porque você se cadastrou no Air X Control.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

/**
 * Email de boas-vindas após cadastro
 */
export async function sendWelcomeEmail(to: string, name: string, verificationToken?: string) {
  const firstName = name.split(' ')[0];
  
  const verificationLink = verificationToken 
    ? `${APP_URL}/verify-email?token=${verificationToken}`
    : null;

  const content = `
    <h2 style="margin: 0 0 16px; color: #1e293b; font-size: 24px;">
      Bem-vindo ao Air X Control, ${firstName}! 🎉
    </h2>
    
    <p style="margin: 0 0 16px; color: #475569; font-size: 16px; line-height: 1.6;">
      Sua conta foi criada com sucesso! Agora você pode gerenciar suas aeronaves, 
      registrar voos, controlar despesas e muito mais.
    </p>
    
    ${verificationLink ? `
    <div style="background-color: #fef3c7; border-radius: 12px; padding: 16px; margin: 24px 0;">
      <p style="margin: 0 0 12px; color: #92400e; font-size: 14px; font-weight: 600;">
        ⚠️ Confirme seu email
      </p>
      <p style="margin: 0 0 16px; color: #a16207; font-size: 14px;">
        Para ativar todas as funcionalidades, confirme seu email clicando no botão abaixo:
      </p>
      <a href="${verificationLink}" 
         style="display: inline-block; background-color: #f59e0b; color: #ffffff; text-decoration: none; 
                padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px;">
        Confirmar Email
      </a>
    </div>
    ` : ''}
    
    <div style="background-color: #f1f5f9; border-radius: 12px; padding: 20px; margin: 24px 0;">
      <h3 style="margin: 0 0 12px; color: #1e293b; font-size: 16px;">
        🚀 Próximos passos:
      </h3>
      <ul style="margin: 0; padding: 0 0 0 20px; color: #475569; font-size: 14px; line-height: 1.8;">
        <li>Cadastre suas aeronaves</li>
        <li>Adicione os sócios da aeronave</li>
        <li>Comece a registrar voos e despesas</li>
        <li>Acompanhe tudo pelo dashboard</li>
      </ul>
    </div>
    
    <a href="${APP_URL}/dashboard" 
       style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; 
              padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px; margin-top: 8px;">
      Acessar Dashboard
    </a>
    
    <p style="margin: 24px 0 0; color: #94a3b8; font-size: 14px;">
      Dúvidas? Responda este email ou acesse nossa central de ajuda.
    </p>
  `;

  return sendEmail({
    to,
    subject: `🎉 Bem-vindo ao Air X Control, ${firstName}!`,
    html: emailTemplate(content),
  });
}

/**
 * Email de verificação de conta
 */
export async function sendVerificationEmail(to: string, name: string, token: string) {
  const firstName = name.split(' ')[0];
  const verificationLink = `${APP_URL}/verify-email?token=${token}`;

  const content = `
    <h2 style="margin: 0 0 16px; color: #1e293b; font-size: 24px;">
      Confirme seu email, ${firstName}
    </h2>
    
    <p style="margin: 0 0 24px; color: #475569; font-size: 16px; line-height: 1.6;">
      Clique no botão abaixo para verificar seu endereço de email e ativar 
      todas as funcionalidades da sua conta.
    </p>
    
    <a href="${verificationLink}" 
       style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; 
              padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px;">
      Verificar Email
    </a>
    
    <p style="margin: 24px 0 0; color: #94a3b8; font-size: 13px;">
      Se você não criou uma conta no Air X Control, ignore este email.
    </p>
    
    <p style="margin: 16px 0 0; color: #94a3b8; font-size: 12px;">
      Link: ${verificationLink}
    </p>
  `;

  return sendEmail({
    to,
    subject: '✉️ Confirme seu email - Air X Control',
    html: emailTemplate(content),
  });
}

/**
 * Email de recuperação de senha
 */
export async function sendPasswordResetEmail(to: string, name: string, token: string) {
  const firstName = name.split(' ')[0];
  const resetLink = `${APP_URL}/reset-password?token=${token}`;

  const content = `
    <h2 style="margin: 0 0 16px; color: #1e293b; font-size: 24px;">
      Redefinir sua senha
    </h2>
    
    <p style="margin: 0 0 16px; color: #475569; font-size: 16px; line-height: 1.6;">
      Olá ${firstName}, recebemos uma solicitação para redefinir a senha da sua conta.
    </p>
    
    <p style="margin: 0 0 24px; color: #475569; font-size: 16px; line-height: 1.6;">
      Clique no botão abaixo para criar uma nova senha:
    </p>
    
    <a href="${resetLink}" 
       style="display: inline-block; background-color: #dc2626; color: #ffffff; text-decoration: none; 
              padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px;">
      Redefinir Senha
    </a>
    
    <div style="background-color: #fef2f2; border-radius: 12px; padding: 16px; margin: 24px 0;">
      <p style="margin: 0; color: #991b1b; font-size: 14px;">
        ⚠️ Este link expira em <strong>1 hora</strong>. Se você não solicitou 
        a redefinição de senha, ignore este email.
      </p>
    </div>
    
    <p style="margin: 16px 0 0; color: #94a3b8; font-size: 12px;">
      Link: ${resetLink}
    </p>
  `;

  return sendEmail({
    to,
    subject: '🔐 Redefinir senha - Air X Control',
    html: emailTemplate(content),
  });
}

/**
 * Email de convite para organização
 */
export async function sendOrganizationInviteEmail(
  to: string, 
  inviterName: string, 
  organizationName: string,
  shareCode: string
) {
  const joinLink = `${APP_URL}/register?code=${shareCode}`;

  const content = `
    <h2 style="margin: 0 0 16px; color: #1e293b; font-size: 24px;">
      Você foi convidado! 🎉
    </h2>
    
    <p style="margin: 0 0 16px; color: #475569; font-size: 16px; line-height: 1.6;">
      <strong>${inviterName}</strong> convidou você para participar da organização 
      <strong>"${organizationName}"</strong> no Air X Control.
    </p>
    
    <div style="background-color: #f0fdf4; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center;">
      <p style="margin: 0 0 8px; color: #166534; font-size: 14px; font-weight: 600;">
        Código de Convite
      </p>
      <p style="margin: 0; color: #15803d; font-size: 28px; font-weight: bold; letter-spacing: 2px; font-family: monospace;">
        ${shareCode}
      </p>
    </div>
    
    <a href="${joinLink}" 
       style="display: inline-block; background-color: #16a34a; color: #ffffff; text-decoration: none; 
              padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px;">
      Aceitar Convite
    </a>
    
    <p style="margin: 24px 0 0; color: #64748b; font-size: 14px; line-height: 1.6;">
      Com o Air X Control você poderá:
    </p>
    <ul style="margin: 8px 0 0; padding: 0 0 0 20px; color: #64748b; font-size: 14px; line-height: 1.8;">
      <li>Ver voos e reservas da aeronave</li>
      <li>Acompanhar despesas compartilhadas</li>
      <li>Reservar a aeronave pelo calendário</li>
    </ul>
  `;

  return sendEmail({
    to,
    subject: `✈️ ${inviterName} convidou você para ${organizationName}`,
    html: emailTemplate(content),
  });
}

/**
 * Email de notificação de nova reserva
 */
export async function sendBookingNotificationEmail(
  to: string,
  bookerName: string,
  aircraftTailNumber: string,
  startDate: string,
  endDate: string,
  purpose?: string
) {
  const content = `
    <h2 style="margin: 0 0 16px; color: #1e293b; font-size: 24px;">
      Nova Reserva Agendada 📅
    </h2>
    
    <p style="margin: 0 0 16px; color: #475569; font-size: 16px; line-height: 1.6;">
      <strong>${bookerName}</strong> fez uma nova reserva:
    </p>
    
    <div style="background-color: #eff6ff; border-radius: 12px; padding: 20px; margin: 24px 0;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Aeronave:</td>
          <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600;">${aircraftTailNumber}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Início:</td>
          <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600;">${startDate}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Fim:</td>
          <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600;">${endDate}</td>
        </tr>
        ${purpose ? `
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Finalidade:</td>
          <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600;">${purpose}</td>
        </tr>
        ` : ''}
      </table>
    </div>
    
    <a href="${APP_URL}/calendar" 
       style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; 
              padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px;">
      Ver Calendário
    </a>
  `;

  return sendEmail({
    to,
    subject: `📅 Nova reserva: ${aircraftTailNumber} - ${startDate}`,
    html: emailTemplate(content),
  });
}

// ============================================
// EMAILS SAAS - Trial e Assinatura
// ============================================

/**
 * Email de início do trial PRO
 */
export async function sendTrialStartedEmail(to: string, name: string, trialDays: number) {
  const firstName = name.split(' ')[0];

  const content = `
    <h2 style="margin: 0 0 16px; color: #1e293b; font-size: 24px;">
      Seu Trial PRO começou! 🚀
    </h2>
    
    <p style="margin: 0 0 16px; color: #475569; font-size: 16px; line-height: 1.6;">
      Olá ${firstName}, parabéns! Você agora tem acesso a todas as funcionalidades 
      do plano <strong>Profissional</strong> por <strong>${trialDays} dias</strong>.
    </p>
    
    <div style="background-color: #eff6ff; border-radius: 12px; padding: 20px; margin: 24px 0;">
      <h3 style="margin: 0 0 12px; color: #1e40af; font-size: 16px;">
        ✨ O que você pode fazer agora:
      </h3>
      <ul style="margin: 0; padding: 0 0 0 20px; color: #3b82f6; font-size: 14px; line-height: 1.8;">
        <li>Cadastrar até 3 aeronaves</li>
        <li>Adicionar usuários ilimitados</li>
        <li>Dashboard completo com gráficos</li>
        <li>Relatórios em PDF</li>
        <li>Suporte por email prioritário</li>
      </ul>
    </div>
    
    <p style="margin: 0 0 24px; color: #475569; font-size: 14px; line-height: 1.6;">
      Ao final do período de teste, você será automaticamente convertido para o plano 
      <strong>Essencial (gratuito)</strong>. Para continuar com todos os recursos, 
      faça upgrade a qualquer momento.
    </p>
    
    <a href="${APP_URL}/dashboard" 
       style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; 
              padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px;">
      Aproveitar Agora
    </a>
  `;

  return sendEmail({
    to,
    subject: `🚀 Seu Trial PRO de ${trialDays} dias começou!`,
    html: emailTemplate(content),
  });
}

/**
 * Email de trial expirando (2 dias antes)
 */
export async function sendTrialExpiringEmail(to: string, name: string, daysLeft: number) {
  const firstName = name.split(' ')[0];

  const content = `
    <h2 style="margin: 0 0 16px; color: #1e293b; font-size: 24px;">
      Seu trial expira em ${daysLeft} dia${daysLeft > 1 ? 's' : ''}! ⏰
    </h2>
    
    <p style="margin: 0 0 16px; color: #475569; font-size: 16px; line-height: 1.6;">
      Olá ${firstName}, seu período de teste do plano <strong>Profissional</strong> 
      está acabando. Faça upgrade agora para não perder acesso aos recursos premium.
    </p>
    
    <div style="background-color: #fef3c7; border-radius: 12px; padding: 20px; margin: 24px 0;">
      <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
        <strong>⚠️ O que acontece após o trial:</strong><br>
        • Sua conta será convertida para o plano Essencial (gratuito)<br>
        • Limite de 1 aeronave e 2 usuários<br>
        • Seus dados serão mantidos, mas acesso pode ser limitado
      </p>
    </div>
    
    <p style="margin: 0 0 24px; color: #475569; font-size: 14px; line-height: 1.6;">
      Continue com acesso completo por apenas <strong>R$ 397/mês</strong>.
    </p>
    
    <a href="${APP_URL}/pricing" 
       style="display: inline-block; background-color: #f59e0b; color: #ffffff; text-decoration: none; 
              padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px;">
      Fazer Upgrade Agora
    </a>
    
    <p style="margin: 24px 0 0; color: #64748b; font-size: 13px;">
      Precisa de ajuda? Responda este email ou entre em contato conosco.
    </p>
  `;

  return sendEmail({
    to,
    subject: `⏰ Seu trial PRO expira em ${daysLeft} dia${daysLeft > 1 ? 's' : ''}!`,
    html: emailTemplate(content),
  });
}

/**
 * Email de trial expirado
 */
export async function sendTrialExpiredEmail(to: string, name: string) {
  const firstName = name.split(' ')[0];

  const content = `
    <h2 style="margin: 0 0 16px; color: #1e293b; font-size: 24px;">
      Seu trial PRO expirou 😢
    </h2>
    
    <p style="margin: 0 0 16px; color: #475569; font-size: 16px; line-height: 1.6;">
      Olá ${firstName}, seu período de teste terminou. Sua conta foi convertida 
      para o plano <strong>Essencial (gratuito)</strong>.
    </p>
    
    <div style="background-color: #f1f5f9; border-radius: 12px; padding: 20px; margin: 24px 0;">
      <h3 style="margin: 0 0 12px; color: #475569; font-size: 14px;">
        Plano atual: Essencial
      </h3>
      <ul style="margin: 0; padding: 0 0 0 20px; color: #64748b; font-size: 14px; line-height: 1.8;">
        <li>1 aeronave</li>
        <li>2 usuários</li>
        <li>Dashboard básico</li>
      </ul>
    </div>
    
    <p style="margin: 0 0 24px; color: #475569; font-size: 14px; line-height: 1.6;">
      Sentimos sua falta no plano PRO! Volte quando quiser - todos os seus dados 
      foram preservados.
    </p>
    
    <a href="${APP_URL}/pricing" 
       style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; 
              padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px;">
      Ver Planos
    </a>
  `;

  return sendEmail({
    to,
    subject: '😢 Seu trial PRO expirou - Air X Control',
    html: emailTemplate(content),
  });
}

/**
 * Email de pagamento confirmado
 */
export async function sendPaymentConfirmedEmail(
  to: string, 
  name: string, 
  planName: string,
  amount: number,
  nextBillingDate: string
) {
  const firstName = name.split(' ')[0];
  const formattedAmount = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount / 100); // Stripe usa centavos

  const content = `
    <h2 style="margin: 0 0 16px; color: #1e293b; font-size: 24px;">
      Pagamento Confirmado! ✅
    </h2>
    
    <p style="margin: 0 0 16px; color: #475569; font-size: 16px; line-height: 1.6;">
      Olá ${firstName}, seu pagamento foi processado com sucesso!
    </p>
    
    <div style="background-color: #f0fdf4; border-radius: 12px; padding: 20px; margin: 24px 0;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Plano:</td>
          <td style="padding: 8px 0; color: #15803d; font-size: 14px; font-weight: 600;">${planName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Valor:</td>
          <td style="padding: 8px 0; color: #15803d; font-size: 14px; font-weight: 600;">${formattedAmount}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Próxima cobrança:</td>
          <td style="padding: 8px 0; color: #15803d; font-size: 14px; font-weight: 600;">${nextBillingDate}</td>
        </tr>
      </table>
    </div>
    
    <p style="margin: 0 0 24px; color: #475569; font-size: 14px; line-height: 1.6;">
      Obrigado por confiar no Air X Control! Continue aproveitando todos os 
      recursos do seu plano.
    </p>
    
    <a href="${APP_URL}/dashboard" 
       style="display: inline-block; background-color: #16a34a; color: #ffffff; text-decoration: none; 
              padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px;">
      Acessar Dashboard
    </a>
    
    <p style="margin: 24px 0 0; color: #64748b; font-size: 13px;">
      Você pode gerenciar sua assinatura em <a href="${APP_URL}/settings" style="color: #2563eb;">Configurações</a>.
    </p>
  `;

  return sendEmail({
    to,
    subject: '✅ Pagamento confirmado - Air X Control',
    html: emailTemplate(content),
  });
}

/**
 * Email de falha no pagamento
 */
export async function sendPaymentFailedEmail(to: string, name: string, planName: string) {
  const firstName = name.split(' ')[0];

  const content = `
    <h2 style="margin: 0 0 16px; color: #dc2626; font-size: 24px;">
      Problema com seu pagamento ⚠️
    </h2>
    
    <p style="margin: 0 0 16px; color: #475569; font-size: 16px; line-height: 1.6;">
      Olá ${firstName}, tivemos um problema ao processar o pagamento da sua 
      assinatura do plano <strong>${planName}</strong>.
    </p>
    
    <div style="background-color: #fef2f2; border-radius: 12px; padding: 20px; margin: 24px 0;">
      <p style="margin: 0; color: #991b1b; font-size: 14px; line-height: 1.6;">
        <strong>⚠️ O que pode ter acontecido:</strong><br>
        • Cartão expirado ou com limite insuficiente<br>
        • Dados do cartão incorretos<br>
        • Bloqueio pelo banco emissor
      </p>
    </div>
    
    <p style="margin: 0 0 24px; color: #475569; font-size: 14px; line-height: 1.6;">
      Por favor, atualize seus dados de pagamento para evitar a suspensão do seu acesso.
    </p>
    
    <a href="${APP_URL}/settings" 
       style="display: inline-block; background-color: #dc2626; color: #ffffff; text-decoration: none; 
              padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px;">
      Atualizar Pagamento
    </a>
    
    <p style="margin: 24px 0 0; color: #64748b; font-size: 13px;">
      Se precisar de ajuda, entre em contato conosco respondendo este email.
    </p>
  `;

  return sendEmail({
    to,
    subject: '⚠️ Problema com seu pagamento - Air X Control',
    html: emailTemplate(content),
  });
}

/**
 * Email de assinatura cancelada
 */
export async function sendSubscriptionCanceledEmail(
  to: string, 
  name: string, 
  planName: string,
  endDate: string,
  immediate: boolean
) {
  const firstName = name.split(' ')[0];

  const content = `
    <h2 style="margin: 0 0 16px; color: #1e293b; font-size: 24px;">
      Assinatura Cancelada 😢
    </h2>
    
    <p style="margin: 0 0 16px; color: #475569; font-size: 16px; line-height: 1.6;">
      Olá ${firstName}, sua assinatura do plano <strong>${planName}</strong> foi cancelada.
    </p>
    
    ${immediate ? `
    <div style="background-color: #fef2f2; border-radius: 12px; padding: 20px; margin: 24px 0;">
      <p style="margin: 0; color: #991b1b; font-size: 14px; line-height: 1.6;">
        Sua conta foi convertida para o plano <strong>Essencial (gratuito)</strong> imediatamente.
      </p>
    </div>
    ` : `
    <div style="background-color: #fef3c7; border-radius: 12px; padding: 20px; margin: 24px 0;">
      <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
        Você ainda pode usar o plano ${planName} até <strong>${endDate}</strong>. 
        Após essa data, sua conta será convertida para o plano Essencial.
      </p>
    </div>
    `}
    
    <p style="margin: 0 0 24px; color: #475569; font-size: 14px; line-height: 1.6;">
      Sentiremos sua falta! Se mudar de ideia, você pode reativar sua assinatura 
      a qualquer momento.
    </p>
    
    <a href="${APP_URL}/pricing" 
       style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; 
              padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px;">
      Reativar Assinatura
    </a>
    
    <p style="margin: 24px 0 0; color: #64748b; font-size: 13px;">
      Podemos saber o motivo do cancelamento? Responda este email com seu feedback - 
      isso nos ajuda a melhorar.
    </p>
  `;

  return sendEmail({
    to,
    subject: '😢 Assinatura cancelada - Air X Control',
    html: emailTemplate(content),
  });
}
