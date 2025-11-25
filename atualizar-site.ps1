# Script para Atualizar o Site no GitHub após usar o Painel Admin
# Use este script DEPOIS de fazer alterações no painel admin

Write-Host "🔄 Atualizando site no GitHub..." -ForegroundColor Green
Write-Host ""

# Verificar se há mudanças
$status = git status --porcelain

if (-not $status) {
    Write-Host "⚠ Nenhuma mudança detectada!" -ForegroundColor Yellow
    Write-Host "   Você já fez todas as alterações no painel admin?" -ForegroundColor Yellow
    Write-Host ""
    exit 0
}

Write-Host "📦 Mudanças detectadas:" -ForegroundColor Cyan
git status --short
Write-Host ""

# Adicionar todos os arquivos
Write-Host "➕ Adicionando arquivos..." -ForegroundColor Yellow
git add .
Write-Host "✓ Arquivos adicionados" -ForegroundColor Green
Write-Host ""

# Fazer commit
$commitMessage = Read-Host "Digite uma mensagem para o commit (ou Enter para usar padrão)"
if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = "Atualizar site via painel admin - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
}

Write-Host ""
Write-Host "💾 Criando commit..." -ForegroundColor Yellow
git commit -m $commitMessage
Write-Host "✓ Commit criado" -ForegroundColor Green
Write-Host ""

# Push para GitHub
Write-Host "📤 Enviando para GitHub..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Site atualizado com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "⏳ Aguarde 1-2 minutos para o GitHub Pages atualizar" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🌐 Seu site estará em:" -ForegroundColor Cyan
    Write-Host "   https://lealzinho30.github.io/dranadia/" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Erro ao fazer push" -ForegroundColor Red
    Write-Host "   Verifique sua conexão e credenciais do GitHub" -ForegroundColor Yellow
    Write-Host ""
}

