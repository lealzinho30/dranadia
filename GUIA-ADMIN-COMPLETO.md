# 🎛️ Guia Completo do Painel Administrativo

## 🚀 Como Iniciar

### 1. Iniciar o Servidor Admin

**Opção 1 - Windows (Mais Fácil):**
- Clique duas vezes em `INICIAR-ADMIN.bat`

**Opção 2 - Manual:**
```bash
python admin-server.py
```

O servidor iniciará na porta **8001**

### 2. Acessar o Painel

Abra no navegador:
```
http://localhost:8001/admin.html
```

---

## ✨ Funcionalidades Principais

### 📸 **Gerenciar Imagens**

1. **Selecionar Imagem:**
   - Clique em "Escolher arquivo" ou arraste a imagem
   - A imagem será aberta automaticamente no editor

2. **Editar Imagem:**
   - **Cortar:** Arraste as bordas da área de corte
   - **Redimensionar:** Digite largura e altura nos campos
   - **Girar:** Use os botões "Girar Esquerda" ou "Girar Direita"
   - **Espelhar:** Use o botão "Espelhar"
   - **Qualidade:** Ajuste o slider (1-100%)

3. **Salvar:**
   - Clique em "Aplicar Edições"
   - A imagem será automaticamente:
     - Salva na pasta `images/`
     - Atualizada no preview
     - Configurada no site

### 📞 **Editar Contato**

- Telefone/WhatsApp
- E-mail
- Endereço (suporta quebras de linha)
- Horário de Atendimento

### 🔗 **Redes Sociais**

- Instagram
- Google Meu Negócio

### ✏️ **Textos**

- Título do Hero (2 linhas)
- Subtítulo do Hero
- Texto de Compromisso

### 💼 **Serviços**

- Adicionar novos serviços
- Editar serviços existentes
- Remover serviços

### 💬 **Depoimentos**

- Adicionar depoimentos
- Editar depoimentos
- Remover depoimentos

---

## 💾 Como Salvar

### Salvar Tudo (Recomendado)

1. Faça todas as alterações desejadas
2. Clique no botão **"Salvar Tudo"** no topo
3. O sistema irá:
   - Salvar todas as configurações
   - Fazer upload das imagens
   - Atualizar o site automaticamente
4. ✅ Pronto! As mudanças já estão no site!

### Ver as Mudanças

Após salvar, acesse:
```
http://localhost:8000
```

---

## 🎨 Editor de Imagens

### Controles Disponíveis:

- **Área de Corte:** Arraste as bordas para cortar
- **Mover:** Clique e arraste dentro da área de corte
- **Largura/Altura:** Digite valores específicos
- **Qualidade:** Ajuste de 1% a 100% (recomendado: 80-90%)
- **Girar:** Rotacionar a imagem
- **Espelhar:** Inverter horizontalmente
- **Resetar:** Voltar ao estado original

### Dicas:

- **Hero Slider:** Use imagens largas (1920x1080px recomendado)
- **Galeria:** Imagens quadradas ou retrato (1200x1200px)
- **Foto Dra. Nadia:** Formato retrato (800x1000px)
- **Qualidade:** Use 90% para fotos, 80% para imagens simples

---

## ⚠️ Solução de Problemas

### "Erro de conexão"

1. Verifique se o servidor está rodando:
   ```bash
   python admin-server.py
   ```
2. Certifique-se de acessar `http://localhost:8001/admin.html`

### "Imagem não aparece no site"

1. Verifique se clicou em "Salvar Tudo"
2. Verifique se a imagem está na pasta `images/`
3. Recarregue o site com Ctrl+F5 (limpar cache)

### "Erro ao fazer upload"

1. Verifique se a pasta `images/` existe
2. Verifique permissões de escrita na pasta
3. Tente novamente

---

## 📁 Estrutura de Arquivos

```
site odontopediatra/
├── admin.html              ← Painel administrativo
├── admin.css               ← Estilos
├── admin.js                ← Lógica JavaScript
├── admin-server.py         ← Servidor Python (BACKEND)
├── atualizar_site.py       ← Script de atualização
├── config.json             ← Configurações (gerado automaticamente)
├── images/                 ← Pasta de imagens (criada automaticamente)
├── index.html              ← Site principal
└── INICIAR-ADMIN.bat       ← Atalho para iniciar (Windows)
```

---

## 🔄 Fluxo de Trabalho

1. **Iniciar Servidor:**
   - Execute `INICIAR-ADMIN.bat` ou `python admin-server.py`

2. **Abrir Painel:**
   - Acesse `http://localhost:8001/admin.html`

3. **Fazer Alterações:**
   - Edite imagens, textos, contato, etc.

4. **Salvar:**
   - Clique em "Salvar Tudo"
   - Aguarde a confirmação

5. **Ver Resultado:**
   - Acesse `http://localhost:8000`
   - Recarregue a página (Ctrl+F5)

---

## 💡 Dicas Importantes

1. **Sempre inicie o servidor antes de usar o painel**
2. **Use "Salvar Tudo" para garantir que tudo seja salvo**
3. **As imagens são salvas automaticamente na pasta `images/`**
4. **O site é atualizado automaticamente após salvar**
5. **Mantenha o servidor rodando enquanto usa o painel**

---

## 🎯 Próximos Passos

Após configurar tudo:
1. Teste o site em `http://localhost:8000`
2. Verifique se todas as imagens aparecem
3. Teste em diferentes dispositivos (responsivo)
4. Publique o site!

---

**Precisa de ajuda?** Consulte os outros arquivos de documentação! 😊



