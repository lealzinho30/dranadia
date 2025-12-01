#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para atualizar automaticamente as imagens no site
Basta colocar as imagens na pasta images/ e executar este script
"""

import os
import re
from pathlib import Path

# Caminhos
BASE_DIR = Path(__file__).parent
IMAGES_DIR = BASE_DIR / "images"
HTML_FILE = BASE_DIR / "index.html"
CONFIG_FILE = BASE_DIR / "imagens-config.txt"

def ler_config():
    """Lê o arquivo de configuração de imagens"""
    config = {}
    if CONFIG_FILE.exists():
        with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    config[key.strip()] = value.strip()
    return config

def listar_imagens_disponiveis():
    """Lista todas as imagens disponíveis na pasta images/"""
    imagens = {}
    if IMAGES_DIR.exists():
        for arquivo in IMAGES_DIR.iterdir():
            if arquivo.is_file() and arquivo.suffix.lower() in ['.jpg', '.jpeg', '.png', '.webp']:
                imagens[arquivo.name.lower()] = arquivo.name
    return imagens

def atualizar_html(config, imagens_disponiveis):
    """Atualiza o arquivo HTML com as imagens configuradas"""
    if not HTML_FILE.exists():
        print(f"❌ Arquivo {HTML_FILE} não encontrado!")
        return False
    
    with open(HTML_FILE, 'r', encoding='utf-8') as f:
        conteudo = f.read()
    
    alteracoes = 0
    
    # Mapeamento de chaves de configuração para padrões no HTML
    mapeamento = {
        'hero-slide-1': (r"hero-slide active.*?url\('([^']+)'\)", 'hero-slide active'),
        'hero-slide-2': (r"hero-slide\"[^>]*?url\('([^']+)'\)", 'hero-slide'),
        'hero-slide-3': (r"hero-slide\"[^>]*?url\('([^']+)'\)", 'hero-slide'),
        'sobre-foto': (r'src="https://images\.unsplash\.com[^"]*" alt="Dra\. Nadia[^"]*"', 'sobre-img'),
        'diferencial-1': (r'<img src="https://images\.unsplash\.com[^"]*" alt="[^"]*atendimento humanizado[^"]*"', 'diferencial'),
        'diferencial-2': (r'<img src="https://images\.unsplash\.com[^"]*" alt="[^"]*Equipamentos modernos[^"]*"', 'diferencial'),
        'diferencial-3': (r'<img src="https://images\.unsplash\.com[^"]*" alt="[^"]*Família no consultório[^"]*"', 'diferencial'),
        'diferencial-4': (r'<img src="https://images\.unsplash\.com[^"]*" alt="[^"]*Consultório odontopediátrico moderno[^"]*"', 'diferencial'),
    }
    
    # Atualizar imagens do hero slider
    if 'hero-slide-1' in config and config['hero-slide-1'] in imagens_disponiveis:
        nome_arquivo = imagens_disponiveis[config['hero-slide-1'].lower()]
        novo_url = f"images/{nome_arquivo}"
        # Substituir primeira ocorrência do hero-slide active
        padrao = r'(<div class="hero-slide active"[^>]*?url\()\'[^\']+\''
        if re.search(padrao, conteudo):
            conteudo = re.sub(padrao, f"\\1'{novo_url}'", conteudo, count=1)
            alteracoes += 1
            print(f"✅ Hero slide 1 atualizado: {nome_arquivo}")
    
    if 'hero-slide-2' in config and config['hero-slide-2'] in imagens_disponiveis:
        nome_arquivo = imagens_disponiveis[config['hero-slide-2'].lower()]
        novo_url = f"images/{nome_arquivo}"
        # Substituir segunda ocorrência
        padrao = r'(<div class="hero-slide"[^>]*?url\()\'[^\']+\''
        matches = list(re.finditer(padrao, conteudo))
        if len(matches) >= 1:
            pos = matches[0].end()
            conteudo = conteudo[:matches[0].start()] + re.sub(r'url\()\'[^\']+\'', f"url('{novo_url}'", matches[0].group()) + conteudo[pos:]
            alteracoes += 1
            print(f"✅ Hero slide 2 atualizado: {nome_arquivo}")
    
    if 'hero-slide-3' in config and config['hero-slide-3'] in imagens_disponiveis:
        nome_arquivo = imagens_disponiveis[config['hero-slide-3'].lower()]
        novo_url = f"images/{nome_arquivo}"
        # Substituir terceira ocorrência
        padrao = r'(<div class="hero-slide"[^>]*?url\()\'[^\']+\''
        matches = list(re.finditer(padrao, conteudo))
        if len(matches) >= 2:
            pos = matches[1].end()
            conteudo = conteudo[:matches[1].start()] + re.sub(r'url\()\'[^\']+\'', f"url('{novo_url}'", matches[1].group()) + conteudo[pos:]
            alteracoes += 1
            print(f"✅ Hero slide 3 atualizado: {nome_arquivo}")
    
    # Atualizar foto da Dra. Nadia (sobre)
    if 'sobre-foto' in config and config['sobre-foto'] in imagens_disponiveis:
        nome_arquivo = imagens_disponiveis[config['sobre-foto'].lower()]
        novo_url = f"images/{nome_arquivo}"
        padrao = r'(<img src=")https://images\.unsplash\.com[^"]*(" alt="Dra\. Nadia[^"]*" class="sobre-img")'
        conteudo = re.sub(padrao, f"\\1{novo_url}\\2", conteudo, count=1)
        alteracoes += 1
        print(f"✅ Foto Dra. Nadia atualizada: {nome_arquivo}")
    
    # Atualizar diferenciais
    diferenciais_alt = [
        "atendimento humanizado",
        "Equipamentos modernos",
        "Família no consultório",
        "Consultório odontopediátrico moderno"
    ]
    for i, alt_text in enumerate(diferenciais_alt, 1):
        key = f'diferencial-{i}'
        if key in config and config[key] in imagens_disponiveis:
            nome_arquivo = imagens_disponiveis[config[key].lower()]
            novo_url = f"images/{nome_arquivo}"
            padrao = f'(<img src=")https://images\\.unsplash\\.com[^"]*(" alt="[^"]*{re.escape(alt_text)}[^"]*")'
            conteudo = re.sub(padrao, f"\\1{novo_url}\\2", conteudo, count=1)
            alteracoes += 1
            print(f"✅ Diferencial {i} atualizado: {nome_arquivo}")
    
    # Atualizar galeria (9 imagens)
    for i in range(1, 10):
        key = f'galeria-{i}'
        if key in config and config[key] in imagens_disponiveis:
            nome_arquivo = imagens_disponiveis[config[key].lower()]
            novo_url = f"images/{nome_arquivo}"
            # Substituir imagens da galeria (procurar por padrão genérico)
            padrao = r'(<img src=")https://images\.unsplash\.com[^"]*(" alt="[^"]*" class="galeria-img")'
            if re.search(padrao, conteudo):
                conteudo = re.sub(padrao, f"\\1{novo_url}\\2", conteudo, count=1)
                alteracoes += 1
                print(f"✅ Galeria {i} atualizada: {nome_arquivo}")
    
    # Atualizar dicas (6 imagens)
    dicas_alt = [
        "Primeira consulta",
        "escovando os dentes",
        "Alimentação saudável",
        "Aplicação de flúor",
        "Atendimento de emergência",
        "Consultas regulares"
    ]
    for i, alt_text in enumerate(dicas_alt, 1):
        key = f'dica-{i}'
        if key in config and config[key] in imagens_disponiveis:
            nome_arquivo = imagens_disponiveis[config[key].lower()]
            novo_url = f"images/{nome_arquivo}"
            padrao = f'(<img src=")https://images\\.unsplash\\.com[^"]*(" alt="[^"]*{re.escape(alt_text)}[^"]*")'
            conteudo = re.sub(padrao, f"\\1{novo_url}\\2", conteudo, count=1)
            alteracoes += 1
            print(f"✅ Dica {i} atualizada: {nome_arquivo}")
    
    # Salvar arquivo atualizado
    with open(HTML_FILE, 'w', encoding='utf-8') as f:
        f.write(conteudo)
    
    return alteracoes > 0

def main():
    print("=" * 60)
    print("📸 ATUALIZADOR DE IMAGENS - Site Dra. Nadia")
    print("=" * 60)
    print()
    
    # Verificar se a pasta images existe
    if not IMAGES_DIR.exists():
        print(f"📁 Criando pasta {IMAGES_DIR}...")
        IMAGES_DIR.mkdir()
    
    # Listar imagens disponíveis
    imagens = listar_imagens_disponiveis()
    print(f"📷 Imagens encontradas na pasta images/: {len(imagens)}")
    if imagens:
        print("   Arquivos:")
        for nome in sorted(imagens.values()):
            print(f"   - {nome}")
    print()
    
    # Ler configuração
    config = ler_config()
    if not config:
        print("⚠️  Arquivo imagens-config.txt não encontrado ou vazio.")
        print("   Criando arquivo de exemplo...")
        criar_config_exemplo()
        print("   ✅ Arquivo criado! Edite-o e execute o script novamente.")
        return
    
    print(f"⚙️  Configurações encontradas: {len(config)}")
    print()
    
    # Atualizar HTML
    print("🔄 Atualizando HTML...")
    sucesso = atualizar_html(config, imagens)
    
    print()
    if sucesso:
        print("=" * 60)
        print("✅ SITE ATUALIZADO COM SUCESSO!")
        print("=" * 60)
        print()
        print("💡 Dica: Abra o index.html no navegador para ver as mudanças.")
    else:
        print("⚠️  Nenhuma alteração foi feita.")
        print("   Verifique se:")
        print("   - As imagens estão na pasta images/")
        print("   - Os nomes no imagens-config.txt correspondem aos arquivos")

def criar_config_exemplo():
    """Cria um arquivo de configuração de exemplo"""
    exemplo = """# 📸 CONFIGURAÇÃO DE IMAGENS
# 
# INSTRUÇÕES:
# 1. Coloque suas imagens na pasta "images/"
# 2. Preencha os nomes dos arquivos abaixo (só o nome, sem caminho)
# 3. Salve e execute: python atualizar-imagens.py
#
# ============================================
# HERO SLIDER (3 imagens principais)
# ============================================
hero-slide-1=hero-1.jpg
hero-slide-2=hero-2.jpg
hero-slide-3=hero-3.jpg

# ============================================
# SEÇÃO SOBRE (Foto da Dra. Nadia)
# ============================================
sobre-foto=dra-nadia.jpg

# ============================================
# DIFERENCIAIS (4 imagens pequenas)
# ============================================
diferencial-1=diferencial-1.jpg
diferencial-2=diferencial-2.jpg
diferencial-3=diferencial-3.jpg
diferencial-4=diferencial-4.jpg

# ============================================
# GALERIA (9 imagens)
# ============================================
galeria-1=galeria-1.jpg
galeria-2=galeria-2.jpg
galeria-3=galeria-3.jpg
galeria-4=galeria-4.jpg
galeria-5=galeria-5.jpg
galeria-6=galeria-6.jpg
galeria-7=galeria-7.jpg
galeria-8=galeria-8.jpg
galeria-9=galeria-9.jpg

# ============================================
# DICAS (6 imagens)
# ============================================
dica-1=dica-1.jpg
dica-2=dica-2.jpg
dica-3=dica-3.jpg
dica-4=dica-4.jpg
dica-5=dica-5.jpg
dica-6=dica-6.jpg
"""
    with open(CONFIG_FILE, 'w', encoding='utf-8') as f:
        f.write(exemplo)

if __name__ == "__main__":
    main()





