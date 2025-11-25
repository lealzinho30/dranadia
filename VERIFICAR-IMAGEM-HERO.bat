@echo off
chcp 65001 >nul
cls
echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║                                                          ║
echo ║     🔍 VERIFICANDO IMAGEM DO HERO                        ║
echo ║                                                          ║
echo ╚══════════════════════════════════════════════════════════╝
echo.
echo.
echo 📋 Verificando configurações...
echo.

REM Verificar se a imagem existe localmente
echo 1️⃣ Verificando se a imagem existe localmente...
if exist "images\2025-11-21 (1)-editado.webp" (
    echo    ✅ Imagem existe: images\2025-11-21 (1^)-editado.webp
    for %%A in ("images\2025-11-21 (1)-editado.webp") do (
        echo    📏 Tamanho: %%~zA bytes
    )
) else (
    echo    ❌ Imagem NÃO existe: images\2025-11-21 (1^)-editado.webp
)
echo.

REM Verificar se está no Git
echo 2️⃣ Verificando se está no Git (commitada^)...
git ls-files "images/2025-11-21 (1)-editado.webp" >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✅ Imagem está no Git (commitada^)
) else (
    echo    ❌ Imagem NÃO está no Git
    echo    ⚠️  Execute: git add images/ ^&^& git commit -m "Add hero image" ^&^& git push
)
echo.

REM Verificar config.json
echo 3️⃣ Verificando config.json...
findstr /C:"hero-slide-1" config.json >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✅ hero-slide-1 está configurado em config.json
    findstr /C:"2025-11-21" config.json
) else (
    echo    ❌ hero-slide-1 NÃO está em config.json
)
echo.

REM Verificar index.html
echo 4️⃣ Verificando index.html...
findstr /C:"2025-11-21 (1)-editado.webp" index.html >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✅ Imagem está configurada em index.html
    findstr /C:"2025-11-21 (1)-editado.webp" index.html
) else (
    echo    ❌ Imagem NÃO está em index.html
    echo    ⚠️  Execute: python atualizar_site.py
)
echo.

REM Verificar status do Git
echo 5️⃣ Verificando status do Git...
git status --short
if %errorlevel% equ 0 (
    echo    ℹ️  Mudanças pendentes acima (se houver^)
)
echo.

echo.
echo ═══════════════════════════════════════════════════════════
echo.
echo 🔧 DIAGNÓSTICO:
echo.
echo Se TODOS os itens acima estiverem ✅, o problema é:
echo.
echo    1. Cache do navegador (mais provável^)
echo       → Solução: Use FORCAR-ATUALIZACAO.html
echo.
echo    2. GitHub Pages ainda não atualizou
echo       → Solução: Aguarde 2-3 minutos
echo.
echo    3. Você está vendo o site local, não o do GitHub
echo       → Solução: Acesse https://lealzinho30.github.io/dranadia/
echo.
echo ═══════════════════════════════════════════════════════════
echo.
echo 🚀 AÇÕES SUGERIDAS:
echo.
echo [1] Forçar deploy da imagem para GitHub
echo [2] Abrir ferramenta de atualização
echo [3] Abrir site no navegador
echo [4] Sair
echo.
set /p opcao="Escolha uma opção (1-4): "

if "%opcao%"=="1" goto deploy
if "%opcao%"=="2" goto ferramenta
if "%opcao%"=="3" goto site
if "%opcao%"=="4" goto fim

:deploy
echo.
echo 🚀 Fazendo deploy...
git add images/ config.json index.html
git commit -m "Deploy imagem hero"
git push origin main
echo.
echo ✅ Deploy concluído! Aguarde 2-3 minutos.
timeout /t 3 >nul
goto fim

:ferramenta
start FORCAR-ATUALIZACAO.html
echo.
echo ✅ Ferramenta aberta!
timeout /t 2 >nul
goto fim

:site
start https://lealzinho30.github.io/dranadia/
echo.
echo ✅ Site aberto!
timeout /t 2 >nul
goto fim

:fim
echo.
pause

