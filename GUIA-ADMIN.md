# 🎛️ Guia do Painel Administrativo

## 🚀 Como Usar o Painel Admin

### 1. Acessar o Painel

Abra o arquivo `admin.html` no navegador:
- Clique duas vezes no arquivo, ou
- Arraste para o navegador, ou
- Se o servidor estiver rodando: `http://localhost:8000/admin.html`

### 2. Navegação

O painel possui 6 seções principais:

#### 📸 **Imagens**
- Hero Slider (3 imagens principais)
- Foto da Dra. Nadia
- Galeria (9 imagens)
- Diferenciais (4 imagens)
- Dicas (6 imagens)

**Como usar:**
1. Clique em "Escolher arquivo" ou arraste a imagem
2. A imagem aparecerá no preview
3. Digite o nome do arquivo (ou deixe o nome sugerido)
4. **Importante:** Copie a imagem para a pasta `images/` com o nome que você digitou

#### 📞 **Contato**
- Telefone/WhatsApp
- E-mail
- Endereço
- Horário de Atendimento

#### 🔗 **Redes Sociais**
- Instagram
- Google Meu Negócio

#### ✏️ **Textos**
- Título do Hero (2 linhas)
- Subtítulo do Hero
- Texto de Compromisso (Seção Sobre)

#### 💼 **Serviços**
- Adicionar/Editar/Remover serviços
- Cada serviço tem: Título, Descrição, Ícone

#### 💬 **Depoimentos**
- Adicionar/Editar/Remover depoimentos
- Cada depoimento tem: Nome, Texto, Avaliação (1-5)

### 3. Salvar Alterações

1. Faça todas as alterações desejadas
2. Clique no botão **"Salvar Tudo"** no topo
3. O arquivo `config.json` será atualizado
4. Execute o script Python para aplicar no site:
   ```bash
   python atualizar-site.py
   ```

### 4. Ver as Mudanças

Após executar o script:
1. Recarregue o site no navegador (F5 ou Ctrl+F5)
2. As alterações estarão visíveis!

---

## 📋 Fluxo Completo de Trabalho

### Para Adicionar Imagens:

1. **No Painel Admin:**
   - Vá em "Imagens"
   - Selecione a imagem desejada
   - Anote o nome do arquivo que você digitou

2. **Copiar Imagem:**
   - Copie a imagem para a pasta `images/`
   - Use exatamente o nome que você digitou no painel
   - Exemplo: Se digitou `hero-1.jpg`, o arquivo deve ser `images/hero-1.jpg`

3. **Salvar:**
   - Clique em "Salvar Tudo" no painel
   - Execute: `python atualizar-site.py`
   - Recarregue o site

### Para Editar Textos:

1. Vá na seção "Textos" ou "Contato"
2. Edite os campos desejados
3. Clique em "Salvar Tudo"
4. Execute: `python atualizar-site.py`
5. Recarregue o site

---

## ⚠️ Importante

### Sobre Imagens:

- **Sempre copie as imagens para a pasta `images/`** após selecioná-las no painel
- O nome do arquivo no painel deve corresponder ao nome real do arquivo
- Formatos aceitos: `.jpg`, `.jpeg`, `.png`, `.webp`
- Tamanhos recomendados estão no arquivo `GUIA-RAPIDO-IMAGENS.md`

### Sobre o Arquivo config.json:

- Este arquivo armazena todas as configurações
- É criado automaticamente quando você salva no painel
- Você pode editá-lo manualmente se preferir (formato JSON)

### Backup:

- Sempre faça backup do `index.html` antes de grandes alterações
- O arquivo `config.json` também é importante manter backup

---

## 🔧 Solução de Problemas

### "Imagens não aparecem no site"

1. Verifique se a imagem está na pasta `images/`
2. Verifique se o nome do arquivo está correto (case-sensitive)
3. Execute `python atualizar-site.py` novamente
4. Limpe o cache do navegador (Ctrl+F5)

### "Mudanças não aparecem"

1. Certifique-se de ter clicado em "Salvar Tudo"
2. Execute `python atualizar-site.py`
3. Recarregue o site com Ctrl+F5 (limpar cache)

### "Erro ao salvar"

- O arquivo `config.json` será baixado automaticamente
- Copie o conteúdo para um arquivo `config.json` na pasta do site
- Execute `python atualizar-site.py`

---

## 📁 Estrutura de Arquivos

```
site odontopediatra/
├── admin.html              ← Painel administrativo
├── admin.css               ← Estilos do painel
├── admin.js                ← Lógica do painel
├── config.json             ← Configurações (gerado pelo painel)
├── atualizar-site.py       ← Script para aplicar mudanças
├── images/                 ← Pasta de imagens
├── index.html              ← Site principal (atualizado pelo script)
└── ...
```

---

## 💡 Dicas

1. **Teste sempre:** Após fazer alterações, visualize o site antes de publicar
2. **Backup:** Mantenha backups regulares do `config.json` e `index.html`
3. **Organização:** Use nomes descritivos para as imagens (ex: `clinica-fachada.jpg`)
4. **Preview:** Use o preview no painel para ver como ficará antes de salvar

---

## 🎯 Próximos Passos

Após configurar tudo no painel:
1. Execute `python atualizar-site.py`
2. Visualize o site em `http://localhost:8000`
3. Faça ajustes finais se necessário
4. Publique o site!

---

**Precisa de ajuda?** Consulte os outros arquivos de documentação ou me avise! 😊



