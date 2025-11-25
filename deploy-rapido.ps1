# Script de Deploy Rápido para GitHub Pages
# Repositório: lealzinho30/dranadia

Write-Host "🚀 Deploy para GitHub Pages - dranadia" -ForegroundColor Green
Write-Host ""

# Navegar para a pasta do projeto
$projectPath = "C:\Users\suzan\Downloads\site odontopediatra"
Set-Location $projectPath

Write-Host "📁 Pasta: $projectPath" -ForegroundColor Cyan
Write-Host ""

# Verificar se Git está instalado
try {
    git --version | Out-Null
    Write-Host "✓ Git encontrado" -ForegroundColor Green
} catch {
    Write-Host "✗ Git não encontrado! Instale em: https://git-scm.com" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Preparando arquivos..." -ForegroundColor Yellow

# Inicializar Git se necessário
if (-not (Test-Path .git)) {
    git init
    Write-Host "✓ Repositório Git inicializado" -ForegroundColor Green
}

# Adicionar todos os arquivos
git add .
Write-Host "✓ Arquivos adicionados" -ForegroundColor Green

# Verificar se há mudanças
$status = git status --porcelain
if ($status) {
    git commit -m "Deploy inicial - Site Dra. Nadia Odontopediatra"
    Write-Host "✓ Commit criado" -ForegroundColor Green
} else {
    Write-Host "⚠ Nenhuma mudança para commitar" -ForegroundColor Yellow
}

# Configurar remote
$remoteUrl = "https://github.com/lealzinho30/dranadia.git"
$existingRemote = git remote get-url origin 2>$null

if ($LASTEXITCODE -ne 0) {
    git remote add origin $remoteUrl
    Write-Host "✓ Remote configurado: $remoteUrl" -ForegroundColor Green
} elseif ($existingRemote -ne $remoteUrl) {
    git remote set-url origin $remoteUrl
    Write-Host "✓ Remote atualizado: $remoteUrl" -ForegroundColor Green
} else {
    Write-Host "✓ Remote já configurado" -ForegroundColor Green
}

# Configurar branch main
git branch -M main 2>$null
Write-Host "✓ Branch: main" -ForegroundColor Green

Write-Host ""
Write-Host "📤 Enviando para GitHub..." -ForegroundColor Yellow
Write-Host ""

# Tentar fazer pull primeiro se o repositório já existir
Write-Host "🔄 Verificando se o repositório já existe..." -ForegroundColor Yellow
$remoteExists = git ls-remote --heads origin main 2>$null

if ($LASTEXITCODE -eq 0 -and $remoteExists) {
    Write-Host "⚠ Repositório já existe. Fazendo pull primeiro..." -ForegroundColor Yellow
    git pull origin main --allow-unrelated-histories --no-edit 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠ Aviso: Não foi possível fazer pull. Continuando com push..." -ForegroundColor Yellow
    }
}

# Push para GitHub
Write-Host "📤 Fazendo push para o GitHub..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Deploy concluído com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 PRÓXIMOS PASSOS:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Acesse: https://github.com/lealzinho30/dranadia" -ForegroundColor White
    Write-Host "2. Clique em 'Settings' (Configurações)" -ForegroundColor White
    Write-Host "3. No menu lateral, clique em 'Pages'" -ForegroundColor White
    Write-Host "4. Em 'Source', selecione:" -ForegroundColor White
    Write-Host "   - Deploy from a branch" -ForegroundColor Yellow
    Write-Host "   - Branch: main" -ForegroundColor Yellow
    Write-Host "   - Folder: / (root)" -ForegroundColor Yellow
    Write-Host "5. Clique em 'Save'" -ForegroundColor White
    Write-Host ""
    Write-Host "⏳ Aguarde 1-2 minutos para o site ficar online" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🌐 Seu site estará em:" -ForegroundColor Green
    Write-Host "   https://lealzinho30.github.io/dranadia/" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Erro ao fazer push. Possíveis causas:" -ForegroundColor Red
    Write-Host ""
    Write-Host "1. Repositório não existe ou você não tem permissão" -ForegroundColor Yellow
    Write-Host "2. Precisa fazer login no GitHub" -ForegroundColor Yellow
    Write-Host "3. Repositório já tem conteúdo (precisa fazer pull primeiro)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "💡 Solução para repositório com conteúdo:" -ForegroundColor Cyan
    Write-Host "   git pull origin main --allow-unrelated-histories" -ForegroundColor White
    Write-Host "   git push -u origin main" -ForegroundColor White
}

