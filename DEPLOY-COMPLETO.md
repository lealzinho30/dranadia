# 🚀 Deploy Completo - Site Dra. Nadia

Este guia contém todas as informações necessárias para fazer o deploy do site no GitHub Pages.

## ✅ Arquivos de Deploy Criados

- ✅ `.gitignore` - Ignora arquivos desnecessários
- ✅ `.nojekyll` - Necessário para GitHub Pages funcionar corretamente
- ✅ `deploy-rapido.ps1` - Script automatizado de deploy
- ✅ `deploy.ps1` - Script de deploy interativo

## 🎯 Método Rápido (Recomendado)

### Opção 1: Script Automatizado

1. Abra o PowerShell como Administrador
2. Navegue até a pasta do projeto:
```powershell
cd "C:\Users\suzan\Downloads\site odontopediatra"
```

3. Execute o script:
```powershell
.\deploy-rapido.ps1
```

O script irá:
- ✅ Verificar se o Git está instalado
- ✅ Inicializar o repositório Git (se necessário)
- ✅ Adicionar todos os arquivos
- ✅ Fazer commit
- ✅ Configurar o remote do GitHub
- ✅ Fazer push para o GitHub

### Opção 2: Comandos Manuais

Se preferir fazer manualmente:

```powershell
# 1. Navegar para a pasta
cd "C:\Users\suzan\Downloads\site odontopediatra"

# 2. Inicializar Git
git init

# 3. Adicionar arquivos
git add .

# 4. Fazer commit
git commit -m "Deploy inicial - Site Dra. Nadia Odontopediatra"

# 5. Configurar remote
git remote add origin https://github.com/lealzinho30/dranadia.git

# 6. Renomear branch para main
git branch -M main

# 7. Fazer push
git push -u origin main
```

## 📝 Configurar GitHub Pages

Após fazer o push:

1. Acesse: https://github.com/lealzinho30/dranadia
2. Clique em **Settings** (Configurações)
3. No menu lateral, clique em **Pages**
4. Em **Source**, selecione:
   - **Deploy from a branch**
   - **Branch:** `main`
   - **Folder:** `/ (root)`
5. Clique em **Save**

## ⏳ Aguardar Deploy

- Aguarde 1-2 minutos
- O GitHub irá processar o deploy
- Você receberá uma notificação quando estiver pronto

## 🌐 Acessar o Site

Seu site estará disponível em:
**https://lealzinho30.github.io/dranadia/**

## 🔧 Solução de Problemas

### Erro: "Repository not found"
- Verifique se o repositório `dranadia` existe no GitHub
- Verifique se você tem permissão para fazer push
- Crie o repositório no GitHub primeiro se não existir

### Erro: "Authentication failed"
- Você precisará fazer login no GitHub
- Use um Personal Access Token se necessário
- Configure suas credenciais: `git config --global user.name "Seu Nome"`

### Erro: "Repository already has content"
- Execute primeiro: `git pull origin main --allow-unrelated-histories`
- Depois: `git push -u origin main`

### Site não aparece após configurar Pages
- Aguarde alguns minutos (pode levar até 10 minutos)
- Verifique se a branch está correta (deve ser `main`)
- Verifique se o arquivo `index.html` está na raiz do projeto
- Verifique se o arquivo `.nojekyll` existe

## 📦 Arquivos Importantes para Deploy

Certifique-se de que estes arquivos estão presentes:
- ✅ `index.html` - Página principal
- ✅ `styles.css` - Estilos
- ✅ `script.js` - JavaScript
- ✅ `images/` - Pasta com imagens
- ✅ `.nojekyll` - Arquivo para GitHub Pages
- ✅ `.gitignore` - Ignora arquivos desnecessários

## 🎉 Pronto!

Após seguir estes passos, seu site estará online e acessível publicamente!

