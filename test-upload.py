#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Script de teste para verificar se o sistema de upload está funcionando"""

import requests
import json
import os
from pathlib import Path

API_BASE = 'http://localhost:8001/api'
IMAGES_DIR = Path('images')

print("🧪 Testando sistema de upload...")
print("=" * 60)

# Test 1: Verificar se servidor está rodando
try:
    response = requests.get(f'{API_BASE}/config', timeout=2)
    if response.ok:
        print("✅ Servidor está rodando")
    else:
        print("❌ Servidor retornou erro:", response.status_code)
        exit(1)
except requests.exceptions.ConnectionError:
    print("❌ Servidor não está rodando! Execute: python admin-server.py")
    exit(1)
except Exception as e:
    print(f"❌ Erro: {e}")
    exit(1)

# Test 2: Listar imagens
try:
    response = requests.get(f'{API_BASE}/images')
    if response.ok:
        data = response.json()
        print(f"✅ Lista de imagens: {len(data.get('images', []))} imagens encontradas")
    else:
        print("❌ Erro ao listar imagens")
except Exception as e:
    print(f"❌ Erro ao listar imagens: {e}")

# Test 3: Verificar config
try:
    response = requests.get(f'{API_BASE}/config')
    if response.ok:
        config = response.json()
        hero = config.get('imagens', {}).get('hero-slide-1')
        if hero:
            print(f"✅ Hero atual: {hero}")
        else:
            print("⚠️  Nenhuma imagem do hero configurada")
    else:
        print("❌ Erro ao carregar config")
except Exception as e:
    print(f"❌ Erro: {e}")

print("=" * 60)
print("✅ Testes concluídos!")

