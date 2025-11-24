# 🚀 DEPLOY DO AIR X - GUIA RÁPIDO

## Opção 1: Vercel (RECOMENDADO - Mais Fácil)

### Pré-requisitos:
- Conta GitHub com o repositório pushado
- Conta Vercel (gratuita)

### Passos:

1. **Fazer Push do Código para GitHub**
```bash
cd ~/Desktop/Air\ X\ /Air\ X/
git add .
git commit -m "Air X - Pronto para deploy"
git push origin main
```

2. **Ir para Vercel**
   - Abra: https://vercel.com
   - Faça login com GitHub
   - Clique em "Import Project"
   - Selecione o repositório `air-x-control`
   - Clique em "Import"

3. **Configurar Variáveis de Ambiente**
   - Em "Environment Variables", adicione:
   ```
   DATABASE_URL=file:./prisma/dev.db
   NEXTAUTH_SECRET=sua-chave-secreta-aleatorias
   NEXTAUTH_URL=https://seu-projeto.vercel.app
   ```

4. **Deploy**
   - Clique em "Deploy"
   - Aguarde ~3 minutos
   - Seu projeto estará em: `https://seu-projeto.vercel.app`

---

## Opção 2: Digital Ocean (Para Produção)

### Pré-requisitos:
- Conta Digital Ocean ($5/mês)
- SSH Key configurada

### Passos (Resumido):

1. Criar App Platform em Digital Ocean
2. Conectar repositório GitHub
3. Configurar variáveis de ambiente
4. Deploy automático

---

## Opção 3: Tunnel com ngrok (TESTE RÁPIDO)

Se só quer testar rapidinho:

```bash
# 1. Instalar ngrok
brew install ngrok/ngrok/ngrok

# 2. Fazer login (cria conta em https://ngrok.com)
ngrok config add-authtoken SEU_TOKEN

# 3. Expor a porta 3000
ngrok http 3000
```

Seu amigo acessa por: `https://xxxxx-xx-xxxxx-xxxxx.ngrok-free.app`

---

## Qual Escolher?

| Opção | Facilidade | Custo | Tempo | Ideal Para |
|-------|-----------|-------|-------|-----------|
| **Local (WiFi)** | ⭐⭐⭐⭐⭐ | Grátis | 1 min | Teste rápido na rede |
| **Vercel** | ⭐⭐⭐⭐ | Grátis | 5 min | Compartilhar URL permanente |
| **ngrok** | ⭐⭐⭐ | Grátis (limitado) | 2 min | Teste rápido na internet |
| **Digital Ocean** | ⭐⭐ | $5/mês | 15 min | Produção |

---

## 📱 Após o Deploy

Compartilhe com seu amigo:

```
🚁 Teste o Air X - Gestão de Aeronaves

Link: [COPIE O LINK ACIMA]

Credenciais de Teste:
Email: admin@airx.com
Senha: Senha123!

Funcionalidades para testar:
✅ Login (5 papéis diferentes)
✅ Criar Aeronave
✅ Criar Voo (com 15+ campos)
✅ Editar/Deletar Voos
✅ Criar Despesas Fixas/Variáveis
✅ Dashboard com estatísticas
✅ Upload de Anexos

Tempo de teste: 20 minutos
```

---

## ✨ Novo - Campos Recentes Adicionados

- Aeronave e Piloto aparecem PRIMEIRO
- Campo "Utilizado por" para registrar quem usou
- Campo "Custo hora voada" (antes era "Custo total")
- Horários de Apresentação e Corte de Motor
- Upload de Anexos em Voos
- Despesas separadas em Fixas e Variáveis

---

**Quer ajuda em qual opção?**
