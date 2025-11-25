#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para atualizar o site HTML baseado na configuração
"""

import json
import re
from pathlib import Path

BASE_DIR = Path(__file__).parent
CONFIG_FILE = BASE_DIR / "config.json"
HTML_FILE = BASE_DIR / "index.html"

def atualizar_site_completo():
    """Atualiza o site completo baseado na configuração"""
    if not CONFIG_FILE.exists():
        print("❌ Arquivo config.json não encontrado!")
        return False
    
    if not HTML_FILE.exists():
        print("❌ Arquivo index.html não encontrado!")
        return False
    
    # Carregar configuração
    with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
        config = json.load(f)
    
    # Carregar HTML
    with open(HTML_FILE, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Aplicar atualizações
    html = atualizar_contato(html, config)
    html = atualizar_redes_sociais(html, config)
    html = atualizar_textos(html, config)
    html = atualizar_imagens(html, config)
    html = atualizar_servicos(html, config)
    html = atualizar_depoimentos(html, config)
    
    # Salvar HTML atualizado
    with open(HTML_FILE, 'w', encoding='utf-8') as f:
        f.write(html)
    
    return True

def atualizar_contato(html, config):
    """Atualiza informações de contato"""
    contato = config.get('contato', {})
    
    # Telefone/WhatsApp
    telefone = contato.get('telefone', '')
    if telefone:
        html = re.sub(r'href="https://wa\.me/\d+"', f'href="https://wa.me/{telefone}"', html)
        html = re.sub(r'href="tel:\+?\d+"', f'href="tel:+{telefone}"', html)
        # Formatar telefone para exibição
        if len(telefone) >= 11:
            tel_formatado = f"({telefone[2:4]}) {telefone[4:9]}-{telefone[9:]}"
            html = re.sub(r'\(11\)\s*\d{5}-\d{4}', tel_formatado, html)
    
    # E-mail
    email = contato.get('email', '')
    if email:
        html = re.sub(r'mailto:[^"]+', f'mailto:{email}', html)
        # Atualizar texto do email
        padrao = r'<a href="mailto:[^"]+"[^>]*>([^<]+)</a>'
        html = re.sub(padrao, f'<a href="mailto:{email}" style="color: inherit; text-decoration: none;">{email}</a>', html, count=1)
    
    # Endereço
    endereco = contato.get('endereco', '')
    if endereco:
        endereco_html = endereco.replace('\n', '<br>')
        padrao = r'(<div class="info-content">\s*<h4>Endereço</h4>\s*<p>)[^<]+(</p>)'
        html = re.sub(padrao, f'\\1{endereco_html}\\2', html, flags=re.DOTALL)
    
    # Horário
    horario = contato.get('horario', '')
    if horario:
        horario_html = horario.replace('\n', '<br>')
        padrao = r'(<div class="info-content">\s*<h4>Horário[^<]+</h4>\s*<p>)[^<]+(</p>)'
        html = re.sub(padrao, f'\\1{horario_html}\\2', html, flags=re.DOTALL)
    
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
    hero_slides = []
    for i in range(1, 4):
        key = f'hero-slide-{i}'
        if key in imagens:
            hero_slides.append(imagens[key])
    
    if hero_slides:
        # Substituir hero slides
        padrao = r'<div class="hero-slide[^"]*"[^>]*style="[^"]*url\([^)]+\)'
        matches = list(re.finditer(padrao, html))
        for i, filename in enumerate(hero_slides[:3]):
            if i < len(matches):
                match = matches[i]
                novo_style = match.group(0).split('url(')[0] + f"url('images/{filename}')"
                html = html[:match.start()] + novo_style + html[match.end():]
    
    # Foto Dra. Nadia
    if 'sobre-foto' in imagens:
        filename = imagens['sobre-foto']
        novo_url = f"images/{filename}"
        html = re.sub(r'(<img src=")https://images\.unsplash\.com[^"]*(" alt="Dra\. Nadia[^"]*" class="sobre-img")', 
                     f'\\1{novo_url}\\2', html)
    
    # Galeria
    galeria_keys = [f'galeria-{i}' for i in range(1, 10)]
    for key in galeria_keys:
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

def atualizar_servicos(html, config):
    """Atualiza serviços (se implementado)"""
    # Implementar se necessário
    return html

def atualizar_depoimentos(html, config):
    """Atualiza depoimentos (se implementado)"""
    # Implementar se necessário
    return html

if __name__ == "__main__":
    if atualizar_site_completo():
        print("✅ Site atualizado com sucesso!")
    else:
        print("❌ Erro ao atualizar site")

