# 🔧 Solução Definitiva: Hero e Deploy

## 📋 Problemas Identificados

### 1. **Problema do Hero:**
- O HTML tinha duplicações de `background-image` no hero-slide
- O sistema estava confuso entre background do slide e imagem principal
- O `atualizar_site.py` não estava encontrando corretamente a imagem principal

### 2. **Problema do Deploy:**
- O workflow do GitHub Actions pode estar faltando permissões
- Pode precisar de configuração adicional no GitHub Pages

## ✅ Correções Aplicadas

### Hero:
1. ✅ Removidas duplicações de `background-image` no HTML
2. ✅ Melhorado o `atualizar_site.py` para encontrar a imagem principal corretamente
3. ✅ Sistema agora limpa duplicações antes de adicionar nova imagem
4. ✅ Hero-slide-1 atualiza apenas a imagem principal (hero-main-image)
5. ✅ Hero-slide-2 atualiza apenas o background do slide

### Deploy:
1. ✅ Workflow simplificado para site estático
2. ✅ Verificar se GitHub Pages está configurado corretamente

## 🚀 Como Usar Agora

### Para Atualizar o Hero:

1. **Abra o sistema de upload:**
   ```
   ABRIR-UPLOAD-SIMPLES.bat
   ```

2. **Faça upload da imagem**

3. **Clique em "Usar no Hero"**

4. **O sistema vai:**
   - Salvar a imagem
   - Atualizar o config.json com `hero-slide-1`
   - Atualizar o index.html automaticamente
   - Fazer deploy para GitHub

### Para Verificar o Deploy:

1. **Acesse:** https://github.com/lealzinho30/dranadia/settings/pages

2. **Verifique:**
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)

3. **Se não estiver configurado:**
   - Configure conforme acima
   - Clique em Save
   - Aguarde 2-3 minutos

## 🎯 Estrutura do Hero (Explicação)

O hero tem **DUAS partes**:

1. **Hero Slider (Background):**
   - São os slides que aparecem atrás do conteúdo
   - Controlados por `hero-slide` com `data-slide`
   - Usam `background-image` no CSS

2. **Hero Main Image (Imagem Principal):**
   - É a imagem grande que aparece ao lado do texto
   - Controlada por `<img id="hero-main-image">`
   - Esta é a que você quer trocar!

**IMPORTANTE:** Quando você usa "hero-slide-1", o sistema atualiza APENAS a imagem principal (`hero-main-image`), não o background do slide.

## 🔍 Se Ainda Não Funcionar

### Hero:
1. Verifique se a imagem está na pasta `images/`
2. Verifique o `config.json` - deve ter `"hero-slide-1": "nome-da-imagem.jpg"`
3. Execute manualmente: `python atualizar_site.py`
4. Verifique o `index.html` - procure por `id="hero-main-image"`

### Deploy:
1. Verifique os logs do GitHub Actions: https://github.com/lealzinho30/dranadia/actions
2. Se houver erro, copie a mensagem de erro
3. Verifique se o repositório é público (GitHub Pages gratuito só funciona com repositórios públicos)

