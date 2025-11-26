#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para atualizar o site baseado na configuração do admin
"""

import json
import re
from pathlib import Path

BASE_DIR = Path(__file__).parent
CONFIG_FILE = BASE_DIR / "config.json"
HTML_FILE = BASE_DIR / "index.html"

def carregar_config():
    """Carrega a configuração do arquivo JSON"""
    if not CONFIG_FILE.exists():
        print("❌ Arquivo config.json não encontrado!")
        print("   Execute o admin.html primeiro e salve as configurações.")
        return None
    
    with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def atualizar_contato(html, config):
    """Atualiza informações de contato"""
    contato = config.get('contato', {})
    
    # Telefone/WhatsApp
    telefone = contato.get('telefone', '')
    if telefone:
        # Atualizar links do WhatsApp
        html = re.sub(r'href="https://wa\.me/\d+"', f'href="https://wa.me/{telefone}"', html)
        html = re.sub(r'href="tel:\+?\d+"', f'href="tel:+{telefone}"', html)
        # Atualizar texto do telefone
        html = re.sub(r'\(11\)\s*\d{5}-\d{4}', f'({telefone[2:4]}) {telefone[4:9]}-{telefone[9:]}', html)
    
    # E-mail
    email = contato.get('email', '')
    if email:
        html = re.sub(r'mailto:[^"]+', f'mailto:{email}', html)
        html = re.sub(r'>[^<]*@[^<]*<', f'>{email}<', html, count=1)
    
    # Endereço
    endereco = contato.get('endereco', '')
    if endereco:
        # Substituir endereço na seção de contato
        padrao = r'<div class="info-content">\s*<h4>Endereço</h4>\s*<p>[^<]+</p>'
        novo = f'<div class="info-content">\n                            <h4>Endereço</h4>\n                            <p>{endereco.replace(chr(10), "<br>")}</p>'
        html = re.sub(padrao, novo, html, flags=re.DOTALL)
    
    # Horário
    horario = contato.get('horario', '')
    if horario:
        padrao = r'<div class="info-content">\s*<h4>Horário[^<]+</h4>\s*<p>[^<]+</p>'
        novo = f'<div class="info-content">\n                            <h4>Horário de Atendimento</h4>\n                            <p>{horario.replace(chr(10), "<br>")}</p>'
        html = re.sub(padrao, novo, html, flags=re.DOTALL)
    
    return html

def atualizar_redes_sociais(html, config):
    """Atualiza links de redes sociais"""
    redes = config.get('redesSociais', {})
    
    # Instagram
    instagram = redes.get('instagram', '')
    if instagram:
        html = re.sub(r'href="https://www\.instagram\.com/[^"]+"', f'href="{instagram}"', html)
    
    # Google
    google = redes.get('google', '')
    if google:
        html = re.sub(r'href="https://share\.google\.com/[^"]+"', f'href="{google}"', html)
    
    return html

def atualizar_textos(html, config):
    """Atualiza textos principais"""
    textos = config.get('textos', {})
    
    # Hero Title
    title1 = textos.get('heroTitle1', '')
    title2 = textos.get('heroTitle2', '')
    if title1 and title2:
        padrao = r'<span class="title-line">[^<]+</span>\s*<span class="title-line highlight">[^<]+</span>'
        novo = f'<span class="title-line">{title1}</span>\n                    <span class="title-line highlight">{title2}</span>'
        html = re.sub(padrao, novo, html)
    
    # Hero Subtitle
    subtitle = textos.get('heroSubtitle', '')
    if subtitle:
        padrao = r'<p class="hero-subtitle">[^<]+</p>'
        html = re.sub(padrao, f'<p class="hero-subtitle">{subtitle}</p>', html)
    
    # Sobre Compromisso
    compromisso = textos.get('sobreCompromisso', '')
    if compromisso:
        padrao = r'<p class="sobre-compromisso">[^<]+</p>'
        html = re.sub(padrao, f'<p class="sobre-compromisso">"{compromisso}"</p>', html)
    
    return html

def atualizar_imagens(html, config):
    """Atualiza imagens do site"""
    imagens = config.get('imagens', {})
    
    # Hero Slides
    for i in range(1, 4):
        key = f'hero-slide-{i}'
        if key in imagens:
            filename = imagens[key]
            novo_url = f"images/{filename}"
            # Substituir no background do hero-slide
            if i == 1:
                padrao = r'(<div class="hero-slide active"[^>]*?url\()\'[^\']+\''
            else:
                padrao = r'(<div class="hero-slide"[^>]*?url\()\'[^\']+\''
            matches = list(re.finditer(padrao, html))
            if matches and i <= len(matches):
                pos = matches[i-1].end()
                html = html[:matches[i-1].start()] + f"url('{novo_url}'" + html[pos:]
    
    # Foto Dra. Nadia
    if 'sobre-foto' in imagens:
        filename = imagens['sobre-foto']
        novo_url = f"images/{filename}"
        html = re.sub(r'(<img src=")https://images\.unsplash\.com[^"]*(" alt="Dra\. Nadia[^"]*" class="sobre-img")', 
                     f'\\1{novo_url}\\2', html)
    
    # Galeria
    for i in range(1, 10):
        key = f'galeria-{i}'
        if key in imagens:
            filename = imagens[key]
            novo_url = f"images/{filename}"
            # Substituir primeira imagem da galeria encontrada
            html = re.sub(r'(<img src=")https://images\.unsplash\.com[^"]*(" alt="[^"]*" class="galeria-img")', 
                         f'\\1{novo_url}\\2', html, count=1)
    
    # Diferenciais
    diferenciais_alt = [
        "atendimento humanizado",
        "Equipamentos modernos",
        "Família no consultório",
        "Consultório odontopediátrico moderno"
    ]
    for i, alt_text in enumerate(diferenciais_alt, 1):
        key = f'diferencial-{i}'
        if key in imagens:
            filename = imagens[key]
            novo_url = f"images/{filename}"
            padrao = f'(<img src=")https://images\\.unsplash\\.com[^"]*(" alt="[^"]*{re.escape(alt_text)}[^"]*")'
            html = re.sub(padrao, f'\\1{novo_url}\\2', html, count=1)
    
    # Dicas
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
        if key in imagens:
            filename = imagens[key]
            novo_url = f"images/{filename}"
            padrao = f'(<img src=")https://images\\.unsplash\\.com[^"]*(" alt="[^"]*{re.escape(alt_text)}[^"]*")'
            html = re.sub(padrao, f'\\1{novo_url}\\2', html, count=1)
    
    return html

def main():
    print("=" * 60)
    print("🔄 ATUALIZADOR DE SITE - Painel Admin")
    print("=" * 60)
    print()
    
    # Carregar configuração
    config = carregar_config()
    if not config:
        return
    
    # Carregar HTML
    if not HTML_FILE.exists():
        print(f"❌ Arquivo {HTML_FILE} não encontrado!")
        return
    
    with open(HTML_FILE, 'r', encoding='utf-8') as f:
        html = f.read()
    
    print("📝 Atualizando site...")
    
    # Aplicar atualizações
    html = atualizar_contato(html, config)
    html = atualizar_redes_sociais(html, config)
    html = atualizar_textos(html, config)
    html = atualizar_imagens(html, config)
    
    # Salvar HTML atualizado
    with open(HTML_FILE, 'w', encoding='utf-8') as f:
        f.write(html)
    
    print()
    print("=" * 60)
    print("✅ SITE ATUALIZADO COM SUCESSO!")
    print("=" * 60)
    print()
    print("💡 Dica: Recarregue o site no navegador para ver as mudanças.")

if __name__ == "__main__":
    main()




