# 🚀 Deploy no GitHub Pages - Guia Completo

Este guia vai te ajudar a publicar seu site no GitHub Pages usando o repositório "dranadia".

## 📋 Pré-requisitos

1. Conta no GitHub (se não tiver, crie em: https://github.com)
2. Git instalado no seu computador (baixe em: https://git-scm.com)

## 🔧 Passo a Passo

### 1. Instalar Git (se ainda não tiver)

- Windows: Baixe em https://git-scm.com/download/win
- Instale com as opções padrão

### 2. Abrir Terminal/PowerShell

- Pressione `Win + R`
- Digite `powershell` e pressione Enter
- Navegue até a pasta do projeto:
```powershell
cd "C:\Users\suzan\Downloads\site odontopediatra"
```

### 3. Inicializar Git no Projeto

```powershell
git init
```

### 4. Adicionar Todos os Arquivos

```powershell
git add .
```

### 5. Fazer o Primeiro Commit

```powershell
git commit -m "Primeiro commit - Site Dra. Nadia"
```

### 6. Conectar ao Repositório GitHub

**IMPORTANTE:** Substitua `SEU-USUARIO` pelo seu nome de usuário do GitHub!

```powershell
git remote add origin https://github.com/SEU-USUARIO/dranadia.git
```

### 7. Renomear Branch para Main (se necessário)

```powershell
git branch -M main
```

### 8. Enviar para o GitHub

```powershell
git push -u origin main
```

**Nota:** Você precisará fazer login no GitHub quando solicitado.

### 9. Ativar GitHub Pages

1. Acesse: https://github.com/SEU-USUARIO/dranadia
2. Clique em **Settings** (Configurações)
3. No menu lateral, clique em **Pages**
4. Em **Source**, selecione **Deploy from a branch**
5. Selecione **main** como branch
6. Selecione **/ (root)** como pasta
7. Clique em **Save**

### 10. Aguardar Deploy

- Aguarde 1-2 minutos
- Seu site estará disponível em: `https://SEU-USUARIO.github.io/dranadia/`

## 🎯 Comandos Rápidos (Copiar e Colar)

```powershell
# Navegar para a pasta
cd "C:\Users\suzan\Downloads\site odontopediatra"

# Inicializar Git
git init

# Adicionar arquivos
git add .

# Fazer commit
git commit -m "Site Dra. Nadia - Deploy inicial"

# Conectar ao GitHub (SUBSTITUA SEU-USUARIO)
git remote add origin https://github.com/SEU-USUARIO/dranadia.git

# Renomear branch
git branch -M main

# Enviar para GitHub
git push -u origin main
```

## ⚠️ Importante

1. **Substitua `SEU-USUARIO`** pelo seu nome de usuário do GitHub em TODOS os comandos
2. Se o repositório já existir e tiver arquivos, você pode precisar fazer:
   ```powershell
   git pull origin main --allow-unrelated-histories
   ```
   antes do `git push`

## 🔄 Atualizar o Site (Após Mudanças)

Sempre que fizer alterações no site:

```powershell
git add .
git commit -m "Descrição das mudanças"
git push
```

O GitHub Pages atualiza automaticamente em 1-2 minutos!

## ❓ Problemas Comuns

### Erro: "remote origin already exists"
```powershell
git remote remove origin
git remote add origin https://github.com/SEU-USUARIO/dranadia.git
```

### Erro: "authentication failed"
- Use um Personal Access Token em vez de senha
- Crie em: GitHub → Settings → Developer settings → Personal access tokens

### Site não aparece
- Verifique se o GitHub Pages está ativado em Settings → Pages
- Aguarde alguns minutos (pode demorar até 10 minutos na primeira vez)

## 📞 Precisa de Ajuda?

Se tiver problemas, me avise que eu ajudo!

---

**Dica:** Depois do primeiro deploy, você pode usar o GitHub Desktop (interface gráfica) para facilitar os próximos deploys!



