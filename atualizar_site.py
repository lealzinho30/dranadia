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
    print("=" * 60)
    print("🔄 ATUALIZANDO SITE...")
    print("=" * 60)
    
    if not CONFIG_FILE.exists():
        print("❌ Arquivo config.json não encontrado!")
        return False
    
    if not HTML_FILE.exists():
        print("❌ Arquivo index.html não encontrado!")
        return False
    
    # Carregar configuração
    with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
        config = json.load(f)
    
    print(f"✓ Configuração carregada: {len(config.get('imagens', {}))} imagem(ns) configurada(s)")
    
    # Carregar HTML
    with open(HTML_FILE, 'r', encoding='utf-8') as f:
        html = f.read()
    
    print("✓ HTML carregado")
    print()
    
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
    
    print()
    print("=" * 60)
    print("✅ SITE ATUALIZADO COM SUCESSO!")
    print("=" * 60)
    
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
    alteracoes = 0
    
    if not imagens:
        print("⚠️  Nenhuma imagem configurada no config.json")
        return html
    
    print(f"📸 Atualizando {len(imagens)} imagem(ns)...")
    
    # Hero Slides - mapear hero-slide-1 → data-slide="0", hero-slide-2 → data-slide="1"
    hero_slides_map = {
        'hero-slide-1': 0,  # Primeiro slide (data-slide="0")
        'hero-slide-2': 1   # Segundo slide (data-slide="1")
    }
    
    for key, slide_index in hero_slides_map.items():
        # Procurar por div com data-slide correspondente
        padrao = rf'(<div class="hero-slide[^"]*"[^>]*data-slide="{slide_index}"[^>]*style="[^\"]*)(url\(\'images/[^\']+\'\))?([^\"]*\")'
        
        if key in imagens and imagens[key]:
            # Atualizar com nova imagem
            filename = imagens[key]
            # Limpar filename de caracteres problemáticos e garantir que não tenha duplicações
            filename = filename.strip()
            # Remover duplicações de "-editado.webp" usando regex
            import re as re_module
            filename = re_module.sub(r'\)-editado\.webp\)+', ')-editado.webp', filename)
            novo_url = f"url('images/{filename}')"
            
            # Limpar duplicações primeiro
            padrao_duplicacao = rf'(url\(\'images/[^\']+\'\))(-editado\.webp\'\))+'
            html = re.sub(padrao_duplicacao, r'\1', html)
            
            # Substituir url() completo - usar busca mais específica
            match = re.search(padrao, html)
            if match:
                # Se já tem uma imagem, substituir; se não, adicionar
                if match.group(2):  # Já tem url()
                    html = html[:match.start(2)] + novo_url + html[match.end(2):]
                else:  # Não tem url(), adicionar antes do fechamento do style
                    style_end = match.end(1)
                    html = html[:style_end] + f"background-image: {novo_url}; " + html[style_end:]
                alteracoes += 1
                print(f"  ✓ Hero slide {slide_index+1} atualizado: {filename}")
            else:
                # Fallback: buscar por ordem
                padrao_fallback = r'(<div class="hero-slide[^"]*"[^>]*style="[^\"]*)(url\(\'images/[^\']+\'\))?([^\"]*\")'
                matches = list(re.finditer(padrao_fallback, html))
                if slide_index < len(matches):
                    match = matches[slide_index]
                    if match.group(2):  # Já tem url()
                        html = html[:match.start(2)] + novo_url + html[match.end(2):]
                    else:  # Não tem url(), adicionar
                        style_end = match.end(1)
                        html = html[:style_end] + f"background-image: {novo_url}; " + html[style_end:]
                    alteracoes += 1
                    print(f"  ✓ Hero slide {slide_index+1} atualizado: {filename}")
                else:
                    print(f"  ⚠️  Hero slide {slide_index+1} não encontrado")
        else:
            # Remover imagem se não estiver mais no config
            match = re.search(padrao, html)
            if match and match.group(2):  # Se tem url() para remover
                # Remover o url() mas manter o style
                html = html[:match.start(2)] + html[match.end(2):]
                alteracoes += 1
                print(f"  ✓ Hero slide {slide_index+1} removido (imagem não configurada)")
    
    # Foto Dra. Nadia - class="sobre-img"
    if 'sobre-foto' in imagens:
        filename = imagens['sobre-foto']
        novo_url = f"images/{filename}"
        padrao = r'(<img[^>]*class="[^"]*sobre-img[^"]*"[^>]*src=")([^"]*)(")'
        if re.search(padrao, html):
            html = re.sub(padrao, f'\\1{novo_url}\\3', html, count=1)
            alteracoes += 1
            print(f"  ✓ Foto Dra. Nadia atualizada: {filename}")
    
    # Galeria - substituir imagens com class="galeria-img" na ordem
    galeria_keys = [f'galeria-{i}' for i in range(1, 10)]
    galeria_imagens = []
    for key in galeria_keys:
        if key in imagens:
            galeria_imagens.append(imagens[key])
    
    if galeria_imagens:
        # Encontrar todas as imagens com class="galeria-img"
        padrao = r'(<img[^>]*class="[^"]*galeria-img[^"]*"[^>]*src=")([^"]*)(")'
        matches = list(re.finditer(padrao, html))
        
        for i, filename in enumerate(galeria_imagens):
            if i < len(matches):
                match = matches[i]
                novo_url = f"images/{filename}"
                html = html[:match.start(2)] + novo_url + html[match.end(2):]
                alteracoes += 1
                print(f"  ✓ Galeria {i+1} atualizada: {filename}")
    
    # Diferenciais - por alt text
    diferenciais_map = {
        'diferencial-1': 'atendimento humanizado',
        'diferencial-2': 'Equipamentos modernos',
        'diferencial-3': 'Família no consultório',
        'diferencial-4': 'Consultório odontopediátrico moderno'
    }
    
    for key, alt_text in diferenciais_map.items():
        if key in imagens:
            filename = imagens[key]
            novo_url = f"images/{filename}"
            # Procurar por img com alt contendo o texto
            padrao = r'(<img[^>]*src=")([^"]*)("[^>]*alt="[^"]*' + re.escape(alt_text) + r'[^"]*")'
            if re.search(padrao, html, re.IGNORECASE):
                html = re.sub(padrao, f'\\1{novo_url}\\3', html, count=1, flags=re.IGNORECASE)
                alteracoes += 1
                print(f"  ✓ Diferencial {key} atualizado: {filename}")
    
    # Dicas - por alt text
    dicas_map = {
        'dica-1': 'Primeira consulta',
        'dica-2': 'escovando os dentes',
        'dica-3': 'Alimentação saudável',
        'dica-4': 'Aplicação de flúor',
        'dica-5': 'Atendimento de emergência',
        'dica-6': 'Consultas regulares'
    }
    
    for key, alt_text in dicas_map.items():
        if key in imagens:
            filename = imagens[key]
            novo_url = f"images/{filename}"
            # Procurar por img com alt contendo o texto
            padrao = r'(<img[^>]*src=")([^"]*)("[^>]*alt="[^"]*' + re.escape(alt_text) + r'[^"]*")'
            if re.search(padrao, html, re.IGNORECASE):
                html = re.sub(padrao, f'\\1{novo_url}\\3', html, count=1, flags=re.IGNORECASE)
                alteracoes += 1
                print(f"  ✓ Dica {key} atualizada: {filename}")
    
    if alteracoes > 0:
        print(f"\n✅ Total de {alteracoes} imagem(ns) atualizada(s)")
    else:
        print("⚠️  Nenhuma imagem foi atualizada.")
        print("   Verifique se:")
        print("   - As imagens estão no config.json")
        print("   - Os nomes das chaves estão corretos (hero-slide-1, galeria-1, etc.)")
        print("   - As imagens existem na pasta images/")
    
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


