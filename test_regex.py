#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Teste para entender o problema da regex"""

import re

# HTML atual com o erro
html_com_erro = """<div class="hero-slide active" data-slide="0" style="background: linear-gradient(135deg, rgba(255, 107, 157, 0.85) 0%, rgba(255, 182, 193, 0.85) 100%), url('images/2025-11-21 (1)-editado.webp')-editado.webp') center/cover; background-size: cover; background-position: center; background-repeat: no-repeat;">"""

# HTML correto esperado
html_correto = """<div class="hero-slide active" data-slide="0" style="background: linear-gradient(135deg, rgba(255, 107, 157, 0.85) 0%, rgba(255, 182, 193, 0.85) 100%), url('images/2025-11-21 (1)-editado.webp') center/cover; background-size: cover; background-position: center; background-repeat: no-repeat;">"""

print("=" * 60)
print("TESTE 1: Regex atual para limpar")
print("=" * 60)

# Regex atual (que não está funcionando)
padrao_limpar = r"(<div class=\"hero-slide[^\"]*\"[^>]*data-slide=\"0\"[^>]*style=\"[^\"]*url\([^)]+\))(-editado\.webp\))+([^\"]*\")"
print(f"Padrão: {padrao_limpar}")
print(f"HTML com erro: {html_com_erro[:100]}...")

match = re.search(padrao_limpar, html_com_erro)
if match:
    print(f"✓ Match encontrado!")
    print(f"  Group 1: {match.group(1)[:80]}...")
    print(f"  Group 2: {match.group(2)}")
    print(f"  Group 3: {match.group(3)}")
else:
    print("✗ Nenhum match encontrado com a regex atual")

print("\n" + "=" * 60)
print("TESTE 2: Regex melhorada")
print("=" * 60)

# Regex melhorada - capturar tudo até o final do url() incluindo duplicações
padrao_melhorado = r"(<div class=\"hero-slide[^\"]*\"[^>]*data-slide=\"0\"[^>]*style=\"[^\"]*url\('images/[^']+'\))(-editado\.webp\))+([^\"]*\")"
print(f"Padrão melhorado: {padrao_melhorado}")

match2 = re.search(padrao_melhorado, html_com_erro)
if match2:
    print(f"✓ Match encontrado!")
    print(f"  Group 1: {match2.group(1)}")
    print(f"  Group 2: {match2.group(2)}")
    print(f"  Group 3: {match2.group(3)}")
    
    # Testar substituição
    resultado = re.sub(padrao_melhorado, r'\1\3', html_com_erro)
    print(f"\nResultado da substituição:")
    print(f"  {resultado[:100]}...")
    print(f"\n✓ Correto? {resultado == html_correto}")
else:
    print("✗ Nenhum match encontrado")

print("\n" + "=" * 60)
print("TESTE 3: Análise do problema")
print("=" * 60)

# O problema real: o HTML tem: url('images/2025-11-21 (1)-editado.webp')-editado.webp')
# Isso significa que há um ')' extra antes do '-editado.webp'

# Vamos ver o que está dentro do url()
padrao_url = r"url\('images/[^']+'\)"
match_url = re.search(padrao_url, html_com_erro)
if match_url:
    print(f"URL encontrada: {match_url.group()}")
    print(f"Problema: há texto após o url() que não deveria estar lá")

# Vamos ver o que vem depois
padrao_depois = r"url\('images/[^']+'\)([^'\"]*)"
match_depois = re.search(padrao_depois, html_com_erro)
if match_depois:
    print(f"Depois do url(): '{match_depois.group(1)}'")
    print(f"Este é o problema! Deveria ser apenas: ' center/cover")

