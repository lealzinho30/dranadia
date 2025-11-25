#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Servidor simples para o painel administrativo
Permite upload de imagens e atualização do site
"""

import http.server
import socketserver
import json
import os
import urllib.parse
from pathlib import Path
import shutil

BASE_DIR = Path(__file__).parent
IMAGES_DIR = BASE_DIR / "images"
CONFIG_FILE = BASE_DIR / "config.json"
HTML_FILE = BASE_DIR / "index.html"

# Criar pasta images se não existir
IMAGES_DIR.mkdir(exist_ok=True)

class AdminHandler(http.server.SimpleHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_GET(self):
        if self.path == '/api/config':
            self.send_config()
        elif self.path == '/api/images':
            self.send_images_list()
        else:
            super().do_GET()
    
    def do_POST(self):
        if self.path == '/api/upload':
            self.handle_upload()
        elif self.path == '/api/save-config':
            self.handle_save_config()
        elif self.path == '/api/update-site':
            self.handle_update_site()
        else:
            super().do_POST()
    
    def send_config(self):
        """Envia a configuração atual"""
        try:
            if CONFIG_FILE.exists():
                with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
                    config = json.load(f)
            else:
                config = self.get_default_config()
            
            self.send_json_response(config)
        except Exception as e:
            self.send_error_response(str(e))
    
    def send_images_list(self):
        """Lista todas as imagens disponíveis"""
        try:
            images = []
            if IMAGES_DIR.exists():
                for file in IMAGES_DIR.iterdir():
                    if file.is_file() and file.suffix.lower() in ['.jpg', '.jpeg', '.png', '.webp', '.gif']:
                        images.append({
                            'name': file.name,
                            'size': file.stat().st_size,
                            'path': f'images/{file.name}'
                        })
            
            self.send_json_response({'images': images})
        except Exception as e:
            self.send_error_response(str(e))
    
    def handle_upload(self):
        """Processa upload de imagem"""
        try:
            content_type = self.headers.get('Content-Type', '')
            
            if 'multipart/form-data' in content_type:
                # Parse multipart form data
                content_length = int(self.headers.get('Content-Length', 0))
                post_data = self.rfile.read(content_length)
                
                # Simple multipart parser
                boundary = content_type.split('boundary=')[1].encode()
                parts = post_data.split(boundary)
                
                filename = None
                file_data = None
                key = None
                
                for part in parts:
                    if b'Content-Disposition' in part:
                        # Extract filename
                        if b'filename=' in part:
                            filename_line = part.split(b'filename=')[1].split(b'\r\n')[0]
                            filename = filename_line.strip(b'"').decode('utf-8')
                        
                        # Extract field name
                        if b'name="key"' in part:
                            key_line = part.split(b'name="key"')[1].split(b'\r\n\r\n')[1].split(b'\r\n')[0]
                            key = key_line.decode('utf-8')
                    
                    # Extract file data
                    if b'\r\n\r\n' in part and filename:
                        file_data = part.split(b'\r\n\r\n', 1)[1]
                        if file_data.endswith(b'\r\n--'):
                            file_data = file_data[:-4]
                
                if filename and file_data:
                    # Save file
                    file_path = IMAGES_DIR / filename
                    with open(file_path, 'wb') as f:
                        f.write(file_data)
                    
                    # Update config
                    config = self.load_config()
                    if 'imagens' not in config:
                        config['imagens'] = {}
                    if key:
                        config['imagens'][key] = filename
                    self.save_config(config)
                    
                    self.send_json_response({
                        'success': True,
                        'message': 'Imagem salva com sucesso!',
                        'filename': filename,
                        'path': f'images/{filename}'
                    })
                else:
                    self.send_error_response('Erro ao processar upload')
            else:
                # JSON upload
                content_length = int(self.headers.get('Content-Length', 0))
                post_data = self.rfile.read(content_length)
                data = json.loads(post_data.decode('utf-8'))
                
                filename = data.get('filename')
                key = data.get('key')
                image_data = data.get('data')  # Base64
                
                if filename and image_data:
                    # Decode base64
                    import base64
                    if ',' in image_data:
                        image_data = image_data.split(',')[1]
                    file_data = base64.b64decode(image_data)
                    
                    # Save file
                    file_path = IMAGES_DIR / filename
                    with open(file_path, 'wb') as f:
                        f.write(file_data)
                    
                    # Update config
                    config = self.load_config()
                    if 'imagens' not in config:
                        config['imagens'] = {}
                    if key:
                        config['imagens'][key] = filename
                    self.save_config(config)
                    
                    self.send_json_response({
                        'success': True,
                        'message': 'Imagem salva com sucesso!',
                        'filename': filename,
                        'path': f'images/{filename}'
                    })
                else:
                    self.send_error_response('Dados inválidos')
                    
        except Exception as e:
            self.send_error_response(str(e))
    
    def handle_save_config(self):
        """Salva a configuração"""
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            config = json.loads(post_data.decode('utf-8'))
            
            self.save_config(config)
            
            self.send_json_response({
                'success': True,
                'message': 'Configuração salva com sucesso!'
            })
        except Exception as e:
            self.send_error_response(str(e))
    
    def handle_update_site(self):
        """Atualiza o site HTML baseado na configuração"""
        try:
            import sys
            import importlib.util
            
            # Importar módulo atualizar_site
            spec = importlib.util.spec_from_file_location("atualizar_site", BASE_DIR / "atualizar_site.py")
            atualizar_site_module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(atualizar_site_module)
            
            if hasattr(atualizar_site_module, 'atualizar_site_completo'):
                atualizar_site_module.atualizar_site_completo()
                self.send_json_response({
                    'success': True,
                    'message': 'Site atualizado com sucesso!'
                })
            else:
                self.send_error_response('Função atualizar_site_completo não encontrada')
        except Exception as e:
            import traceback
            self.send_error_response(f'Erro ao atualizar site: {str(e)}\n{traceback.format_exc()}')
    
    def load_config(self):
        """Carrega configuração"""
        if CONFIG_FILE.exists():
            with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        return self.get_default_config()
    
    def save_config(self, config):
        """Salva configuração"""
        with open(CONFIG_FILE, 'w', encoding='utf-8') as f:
            json.dump(config, f, indent=2, ensure_ascii=False)
    
    def get_default_config(self):
        """Retorna configuração padrão"""
        return {
            "contato": {
                "telefone": "5511913141625",
                "email": "dranadiaodontopediatra@gmail.com",
                "endereco": "Rua Fernando Falcão, 1111\nEdifício Bernini - Sala 810, 8° andar\nMooca - SP | CEP: 03180-003",
                "horario": "De Segunda a Sábado\nDas 8h00 às 17h00"
            },
            "redesSociais": {
                "instagram": "https://www.instagram.com/dra_nadia_odontopediatra/",
                "google": "https://share.google.com/C4zChttSybrBBCZWW"
            },
            "textos": {
                "heroTitle1": "Especialista em",
                "heroTitle2": "Saúde Bucal Infantil",
                "heroSubtitle": "Atendemos todas as necessidades de saúde bucal de crianças e adolescentes. Ambiente acolhedor e lúdico pensado especialmente para os pequenos!",
                "sobreCompromisso": "Nosso compromisso é proporcionar um ambiente acolhedor e seguro, onde nossos pequenos pacientes possam sentir-se confortáveis e confiantes durante seus tratamentos."
            },
            "imagens": {},
            "servicos": [],
            "depoimentos": []
        }
    
    def send_json_response(self, data):
        """Envia resposta JSON"""
        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))
    
    def send_error_response(self, message):
        """Envia resposta de erro"""
        self.send_response(400)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps({
            'success': False,
            'error': message
        }, ensure_ascii=False).encode('utf-8'))
    
    def log_message(self, format, *args):
        """Override para reduzir logs"""
        pass

def run_server(port=8001):
    """Inicia o servidor"""
    handler = AdminHandler
    with socketserver.TCPServer(("", port), handler) as httpd:
        print("=" * 60)
        print("🚀 SERVIDOR ADMIN INICIADO")
        print("=" * 60)
        print(f"📡 Acesse: http://localhost:{port}/admin.html")
        print(f"📡 Site principal: http://localhost:8000")
        print("=" * 60)
        print("Pressione Ctrl+C para parar")
        print()
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\nServidor encerrado.")

if __name__ == "__main__":
    run_server()

