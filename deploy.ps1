# Script PowerShell para Deploy no GitHub Pages
# Execute este script na pasta do projeto

Write-Host "🚀 Iniciando deploy no GitHub Pages..." -ForegroundColor Green
Write-Host ""

# Verificar se Git está instalado
try {
    $gitVersion = git --version
    Write-Host "✓ Git encontrado: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Git não encontrado! Instale em: https://git-scm.com" -ForegroundColor Red
    exit 1
}

# Solicitar nome de usuário do GitHub
$username = Read-Host "Digite seu nome de usuário do GitHub"

if ([string]::IsNullOrWhiteSpace($username)) {
    Write-Host "✗ Nome de usuário não pode estar vazio!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Preparando arquivos..." -ForegroundColor Yellow

# Inicializar Git (se não estiver inicializado)
if (-not (Test-Path .git)) {
    git init
    Write-Host "✓ Repositório Git inicializado" -ForegroundColor Green
}

# Adicionar arquivos
git add .
Write-Host "✓ Arquivos adicionados" -ForegroundColor Green

# Verificar se há mudanças para commitar
$status = git status --porcelain
if ($status) {
    git commit -m "Deploy inicial - Site Dra. Nadia"
    Write-Host "✓ Commit criado" -ForegroundColor Green
} else {
    Write-Host "⚠ Nenhuma mudança para commitar" -ForegroundColor Yellow
}

# Configurar remote
$remoteUrl = "https://github.com/$username/dranadia.git"
$existingRemote = git remote get-url origin 2>$null

if ($LASTEXITCODE -ne 0) {
    git remote add origin $remoteUrl
    Write-Host "✓ Remote 'origin' configurado" -ForegroundColor Green
} elseif ($existingRemote -ne $remoteUrl) {
    git remote set-url origin $remoteUrl
    Write-Host "✓ Remote 'origin' atualizado" -ForegroundColor Green
} else {
    Write-Host "✓ Remote 'origin' já configurado" -ForegroundColor Green
}

# Renomear branch para main
git branch -M main 2>$null
Write-Host "✓ Branch configurada como 'main'" -ForegroundColor Green

Write-Host ""
Write-Host "📤 Enviando para GitHub..." -ForegroundColor Yellow
Write-Host ""

# Push para GitHub
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Deploy concluído com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Próximos passos:" -ForegroundColor Cyan
    Write-Host "1. Acesse: https://github.com/$username/dranadia" -ForegroundColor White
    Write-Host "2. Vá em Settings → Pages" -ForegroundColor White
    Write-Host "3. Selecione 'Deploy from a branch'" -ForegroundColor White
    Write-Host "4. Escolha 'main' e '/ (root)'" -ForegroundColor White
    Write-Host "5. Salve e aguarde 1-2 minutos" -ForegroundColor White
    Write-Host ""
    Write-Host "🌐 Seu site estará em: https://$username.github.io/dranadia/" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Erro ao fazer push. Verifique:" -ForegroundColor Red
    Write-Host "- Se o repositório 'dranadia' existe no GitHub" -ForegroundColor Yellow
    Write-Host "- Se você tem permissão para fazer push" -ForegroundColor Yellow
    Write-Host "- Suas credenciais do GitHub" -ForegroundColor Yellow
}





