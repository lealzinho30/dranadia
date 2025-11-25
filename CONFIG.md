# 📋 Guia de Configuração Rápida

Este arquivo contém todas as informações que você precisa personalizar no site.

## 📞 Informações de Contato

### Telefone/WhatsApp
**Localização no código:** Procure por `5511999999999` em `index.html`

**Formato:** 
- Código do país (55) + DDD (11) + Número (999999999)
- Exemplo: `5511999999999`

**Onde alterar:**
- Linha ~30: Botão WhatsApp no header
- Linha ~280: Link WhatsApp na seção de contato
- Linha ~320: Link WhatsApp no footer
- `script.js` linha ~60: URL do WhatsApp no formulário

### E-mail
**Localização:** Procure por `contato@dranadiaodontopediatra.com.br`

**Onde alterar:**
- Seção de contato (info-card)
- Footer

### Endereço
**Localização:** Seção de contato, info-card de endereço

**Formato:**
```html
Rua Exemplo, 123<br>Bairro, Cidade - SP<br>CEP: 12345-678
```

### Horário de Atendimento
**Localização:** Seção de contato, último info-card

**Formato atual:**
```html
Segunda a Sexta: 8h às 18h<br>Sábado: 8h às 12h
```

## 🔗 Links de Redes Sociais

### Instagram
**URL atual:** `https://www.instagram.com/dra_nadia_odontopediatra/`

**Onde alterar:**
- Seção de contato (social-links)
- Footer (footer-social)

### Google Meu Negócio
**URL atual:** `https://share.google/C4zChttSybrBBCZWW`

**Onde alterar:**
- Seção de contato (social-links)

## 📊 Estatísticas do Hero

**Localização:** Seção Hero, hero-stats

**Valores atuais:**
- +500 Crianças Atendidas
- +10 Anos de Experiência
- 100% Satisfação

**Como alterar:** Edite os valores em `index.html` na seção `.hero-stats`

## 🎨 Cores do Site

**Localização:** `styles.css`, seção `:root`

**Cores principais:**
- `--primary-color: #4ECDC4` (Azul esverdeado - cor principal)
- `--secondary-color: #FF6B9D` (Rosa - cor secundária)
- `--accent-color: #FFE66D` (Amarelo - destaques)

**Dica:** Use ferramentas como [Coolors.co](https://coolors.co) para criar paletas harmoniosas.

## 📝 Conteúdo Textual

### Título Principal (Hero)
**Localização:** `.hero-title`

**Texto atual:**
- "Cuidando do Sorriso"
- "do seu Filho"

### Subtítulo do Hero
**Localização:** `.hero-subtitle`

**Texto atual:**
"Odontopediatria com carinho, cuidado e dedicação. Transformando a experiência do dentista em algo especial para as crianças."

### Seção Sobre
**Localização:** Seção `.sobre`

Personalize:
- Título da seção
- Descrição da Dra. Nadia
- Itens de formação, abordagem e atendimento

### Serviços
**Localização:** Seção `.servicos`

Cada card de serviço pode ser editado:
- Ícone (Font Awesome)
- Título
- Descrição
- Lista de itens

### Depoimentos
**Localização:** Seção `.depoimentos`

Adicione ou edite depoimentos reais de clientes.

## 🖼️ Adicionar Imagens

### Passo a passo:

1. **Criar pasta de imagens:**
   ```
   mkdir images
   ```

2. **Adicionar imagens:**
   - Foto da Dra. Nadia: `images/dra-nadia.jpg`
   - Foto da clínica: `images/clinica.jpg`
   - Logo (se houver): `images/logo.png`

3. **Atualizar HTML:**
   - Na seção `.sobre-image`, substitua o `.image-card` por:
   ```html
   <img src="images/dra-nadia.jpg" alt="Dra. Nadia - Odontopediatra">
   ```

## 🔧 Configurações Avançadas

### Alterar Fontes
**Localização:** `index.html`, tag `<head>`

**Fontes atuais:**
- Poppins (corpo do texto)
- Playfair Display (títulos)

**Como alterar:** Substitua o link do Google Fonts e atualize as variáveis em `styles.css`

### Alterar Animações
**Localização:** `styles.css`

- Velocidade das animações: ajuste `transition` e `animation-duration`
- Efeitos de hover: modifique `:hover` nos elementos

### Integrar Formulário com Backend

**Opção 1: EmailJS (Gratuito)**
1. Crie conta em [EmailJS](https://www.emailjs.com)
2. Configure template de email
3. Adicione script no `index.html`:
```html
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
```
4. Atualize `script.js` com suas credenciais

**Opção 2: Formspree (Gratuito)**
1. Crie conta em [Formspree](https://formspree.io)
2. Substitua action do formulário:
```html
<form action="https://formspree.io/f/SEU_ID" method="POST">
```

## ✅ Checklist de Personalização

- [ ] Atualizar telefone/WhatsApp
- [ ] Atualizar e-mail
- [ ] Atualizar endereço
- [ ] Atualizar horários
- [ ] Verificar links de redes sociais
- [ ] Atualizar estatísticas (se necessário)
- [ ] Adicionar imagens reais
- [ ] Revisar todos os textos
- [ ] Testar formulário de contato
- [ ] Testar em diferentes dispositivos
- [ ] Verificar links externos

## 🚀 Deploy

Após personalizar tudo:

1. **Teste localmente** abrindo `index.html` no navegador
2. **Teste responsividade** redimensionando a janela
3. **Teste formulário** enviando uma mensagem de teste
4. **Faça deploy** em um serviço de hospedagem

---

**Dica:** Mantenha uma cópia de backup antes de fazer alterações significativas!




