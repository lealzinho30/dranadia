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
import socket
import webbrowser
import threading
import time
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
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_GET(self):
        if self.path == '/api/config':
            self.send_config()
        elif self.path == '/api/images':
            self.send_images_list()
        elif self.path.startswith('/images/'):
            # Servir imagens diretamente
            self.serve_image()
        else:
            super().do_GET()
    
    def serve_image(self):
        """Serve uma imagem específica"""
        try:
            # Decodificar URL e remover /images/
            filename = urllib.parse.unquote(self.path.replace('/images/', ''))
            file_path = IMAGES_DIR / filename
            
            # Se não encontrar com o nome exato, tentar encontrar arquivos similares
            if not file_path.exists() or not file_path.is_file():
                # Tentar encontrar arquivo com nome similar (case-insensitive)
                filename_lower = filename.lower()
                for file in IMAGES_DIR.iterdir():
                    if file.is_file() and file.name.lower() == filename_lower:
                        file_path = file
                        break
                else:
                    self.send_error(404, f"File not found: {filename}")
                    return
            
            # Determinar content type
            ext = file_path.suffix.lower()
            content_types = {
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.webp': 'image/webp',
                '.gif': 'image/gif'
            }
            content_type = content_types.get(ext, 'application/octet-stream')
            
            self.send_response(200)
            self.send_header('Content-Type', content_type)
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Content-Length', str(file_path.stat().st_size))
            self.end_headers()
            
            with open(file_path, 'rb') as f:
                self.wfile.write(f.read())
        except Exception as e:
            import traceback
            self.send_error(500, f"Error serving image: {str(e)}\n{traceback.format_exc()}")
    
    def do_POST(self):
        if self.path == '/api/upload':
            self.handle_upload()
        elif self.path == '/api/config':
            self.handle_save_config()
        elif self.path == '/api/save-config':
            self.handle_save_config()
        elif self.path == '/api/update-site':
            self.handle_update_site()
        else:
            super().do_POST()
    
    def do_DELETE(self):
        if self.path.startswith('/api/images/'):
            self.handle_delete_image()
        else:
            self.send_error(404, "Not Found")
    
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
                        images.append(file.name)
            
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
                        
                        # Extract field name (key or image)
                        if b'name="key"' in part:
                            key_line = part.split(b'name="key"')[1].split(b'\r\n\r\n')[1].split(b'\r\n')[0]
                            key = key_line.decode('utf-8')
                        elif b'name="image"' in part:
                            # New system uses "image" field
                            pass
                    
                    # Extract file data
                    if b'\r\n\r\n' in part and filename:
                        file_data = part.split(b'\r\n\r\n', 1)[1]
                        if file_data.endswith(b'\r\n--'):
                            file_data = file_data[:-4]
                
                if filename and file_data:
                    # Clean filename - remove special characters
                    import re
                    safe_filename = re.sub(r'[^\w\s\-_\.]', '', filename)
                    safe_filename = safe_filename.strip()
                    
                    # Save file
                    file_path = IMAGES_DIR / safe_filename
                    with open(file_path, 'wb') as f:
                        f.write(file_data)
                    print(f"✓ Imagem salva: {safe_filename}")
                    
                    # Update config only if key is provided
                    if key:
                        config = self.load_config()
                        if 'imagens' not in config:
                            config['imagens'] = {}
                        config['imagens'][key] = safe_filename
                        self.save_config(config)
                    
                    # Return success
                    self.send_json_response({
                        'success': True,
                        'message': '✅ Imagem salva com sucesso!',
                        'filename': safe_filename,
                        'path': f'images/{safe_filename}'
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
                    print(f"✓ Imagem salva: {filename}")
                    
                    # Update config
                    config = self.load_config()
                    if 'imagens' not in config:
                        config['imagens'] = {}
                    if key:
                        config['imagens'][key] = filename
                    self.save_config(config)
                    
                    # Atualizar site
                    try:
                        import sys
                        import importlib.util
                        spec = importlib.util.spec_from_file_location("atualizar_site", BASE_DIR / "atualizar_site.py")
                        atualizar_site_module = importlib.util.module_from_spec(spec)
                        spec.loader.exec_module(atualizar_site_module)
                        if hasattr(atualizar_site_module, 'atualizar_site_completo'):
                            atualizar_site_module.atualizar_site_completo()
                            print("✓ Site atualizado")
                    except Exception as e:
                        print(f"⚠️ Erro ao atualizar site: {e}")
                    
                    # Fazer deploy automaticamente
                    deploy_result = self.deploy_to_github()
                    if deploy_result:
                        self.send_json_response({
                            'success': True,
                            'message': '✅ Imagem salva, site atualizado e deploy concluído!',
                            'filename': filename,
                            'path': f'images/{filename}'
                        })
                    else:
                        self.send_json_response({
                            'success': True,
                            'message': '✅ Imagem salva e site atualizado. ⚠️ Deploy falhou - execute deploy-rapido.ps1 manualmente.',
                            'filename': filename,
                            'path': f'images/{filename}'
                        })
                else:
                    self.send_error_response('Dados inválidos')
                    
        except Exception as e:
            import traceback
            error_msg = f"{str(e)}\n{traceback.format_exc()}"
            print(f"ERRO no upload: {error_msg}")
            self.send_error_response(str(e))
    
    def handle_delete_image(self):
        """Remove uma imagem"""
        try:
            # Extract filename from path /api/images/filename
            filename = urllib.parse.unquote(self.path.replace('/api/images/', ''))
            file_path = IMAGES_DIR / filename
            
            if file_path.exists() and file_path.is_file():
                file_path.unlink()
                print(f"✓ Imagem removida: {filename}")
                self.send_json_response({
                    'success': True,
                    'message': f'✅ Imagem "{filename}" removida com sucesso!'
                })
            else:
                self.send_error_response(f'Imagem não encontrada: {filename}')
        except Exception as e:
            self.send_error_response(str(e))
    
    def handle_save_config(self):
        """Salva a configuração e atualiza o site automaticamente"""
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            config = json.loads(post_data.decode('utf-8'))
            
            # Salvar configuração
            self.save_config(config)
            
            # Atualizar site automaticamente
            update_success = False
            update_message = ""
            try:
                import sys
                import importlib.util
                
                spec = importlib.util.spec_from_file_location("atualizar_site", BASE_DIR / "atualizar_site.py")
                atualizar_site_module = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(atualizar_site_module)
                
                if hasattr(atualizar_site_module, 'atualizar_site_completo'):
                    atualizar_site_module.atualizar_site_completo()
                    update_success = True
                    update_message = 'Site atualizado localmente. '
                else:
                    update_message = 'Erro ao atualizar site localmente. '
            except Exception as update_error:
                update_message = f'Erro ao atualizar site: {str(update_error)}. '
            
            # Fazer deploy para GitHub automaticamente
            deploy_success = False
            deploy_message = ""
            try:
                print("Iniciando deploy para GitHub...")
                deploy_result = self.deploy_to_github()
                print(f"Resultado do deploy: {deploy_result}")
                if deploy_result:
                    deploy_success = True
                    deploy_message = "Deploy para GitHub concluído! O site será atualizado em 1-2 minutos."
                else:
                    deploy_message = "Deploy para GitHub falhou. Verifique os logs do servidor ou execute deploy-rapido.ps1 manualmente."
            except Exception as deploy_error:
                import traceback
                error_trace = traceback.format_exc()
                print(f"EXCEÇÃO no deploy: {error_trace}")
                deploy_message = f"Erro no deploy: {str(deploy_error)}. Execute deploy-rapido.ps1 manualmente."
            
            # Resposta final
            if update_success and deploy_success:
                self.send_json_response({
                    'success': True,
                    'message': '✅ Tudo salvo, site atualizado e deploy para GitHub concluído! O site será atualizado em 1-2 minutos.'
                })
            elif update_success:
                self.send_json_response({
                    'success': True,
                    'message': f'✅ Configuração salva e site atualizado localmente. ⚠️ {deploy_message}'
                })
            else:
                self.send_json_response({
                    'success': True,
                    'message': f'✅ Configuração salva. ⚠️ {update_message}{deploy_message}'
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
                "horario": "De Segunda a Sábado\nDas 8h00 às 20h00"
            },
            "redesSociais": {
                "instagram": "https://www.instagram.com/dra_nadia_odontopediatra/",
                "google": "https://share.google.com/C4zChttSybrBBCZWW"
            },
            "textos": {
                "heroTitle1": "Especialista em",
                "heroTitle2": "Saúde Bucal Infantil",
                "heroSubtitle": "Atendemos todas as necessidades de saúde bucal de bebês, crianças e adolescentes. Ambiente acolhedor e lúdico pensado especialmente para os pequenos!",
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
    
    def deploy_to_github(self):
        """Faz deploy automático para GitHub"""
        try:
            import subprocess
            import os
            
            print(f"Verificando repositório Git em: {BASE_DIR}")
            
            # Verificar se está em um repositório git
            if not (BASE_DIR / ".git").exists():
                print("❌ Repositório Git não encontrado")
                return False
            
            print("✓ Repositório Git encontrado")
            
            # Adicionar todos os arquivos (incluindo imagens)
            print("Adicionando arquivos ao Git...")
            result = subprocess.run(
                ['git', 'add', '.'],
                cwd=str(BASE_DIR),
                capture_output=True,
                text=True,
                timeout=30,
                shell=False
            )
            
            if result.returncode != 0:
                print(f"❌ Erro ao adicionar arquivos: {result.stderr}")
                return False
            
            print("✓ Arquivos adicionados")
            
            # Verificar se há mudanças
            print("Verificando mudanças...")
            result = subprocess.run(
                ['git', 'status', '--porcelain'],
                cwd=str(BASE_DIR),
                capture_output=True,
                text=True,
                timeout=30,
                shell=False
            )
            
            if not result.stdout.strip():
                # Nenhuma mudança - já está atualizado
                print("ℹ️  Nenhuma mudança para commitar (já está atualizado)")
                return True
            
            print(f"✓ Mudanças encontradas: {len(result.stdout.strip().split(chr(10)))} arquivo(s)")
            
            # Fazer commit
            print("Fazendo commit...")
            result = subprocess.run(
                ['git', 'commit', '-m', 'Atualização automática do site via painel admin'],
                cwd=str(BASE_DIR),
                capture_output=True,
                text=True,
                timeout=30,
                shell=False
            )
            
            if result.returncode != 0:
                print(f"❌ Erro ao fazer commit: {result.stderr}")
                if "nothing to commit" in result.stdout.lower():
                    print("ℹ️  Nada para commitar (arquivos já commitados)")
                    return True
                return False
            
            print("✓ Commit criado")
            
            # Fazer push
            print("Fazendo push para GitHub...")
            result = subprocess.run(
                ['git', 'push', 'origin', 'main'],
                cwd=str(BASE_DIR),
                capture_output=True,
                text=True,
                timeout=120,
                shell=False
            )
            
            if result.returncode == 0:
                print("✅ Deploy concluído com sucesso!")
                print(f"   Output: {result.stdout}")
                return True
            else:
                print(f"❌ Erro no push: {result.stderr}")
                print(f"   Output: {result.stdout}")
                if "no changes" in result.stdout.lower() or "up to date" in result.stdout.lower():
                    print("ℹ️  Repositório já está atualizado")
                    return True
                # Tentar configurar remote se não existir
                if "remote" in result.stderr.lower() or "origin" in result.stderr.lower():
                    print("⚠️  Tentando configurar remote...")
                    subprocess.run(['git', 'remote', 'add', 'origin', 'https://github.com/lealzinho30/dranadia.git'], 
                                 cwd=str(BASE_DIR), capture_output=True, timeout=10)
                    subprocess.run(['git', 'branch', '-M', 'main'], 
                                 cwd=str(BASE_DIR), capture_output=True, timeout=10)
                    # Tentar push novamente
                    result2 = subprocess.run(['git', 'push', '-u', 'origin', 'main'],
                                            cwd=str(BASE_DIR), capture_output=True, text=True, timeout=120)
                    if result2.returncode == 0:
                        print("✅ Deploy concluído após configurar remote!")
                        return True
                return False
            
        except subprocess.TimeoutExpired:
            print("❌ Timeout no deploy")
            return False
        except Exception as e:
            print(f"❌ Erro no deploy: {e}")
            import traceback
            print(traceback.format_exc())
            return False
    
    def log_message(self, format, *args):
        """Override para reduzir logs"""
        pass

def run_server(port=8001):
    """Inicia o servidor"""
    handler = AdminHandler
    
    # Verificar se a porta está disponível
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex(('127.0.0.1', port))
    sock.close()
    
    if result == 0:
        print("=" * 60)
        print("⚠️  ERRO: Porta {} já está em uso!".format(port))
        print("=" * 60)
        print("Possíveis soluções:")
        print("1. Feche outros programas usando a porta {}".format(port))
        print("2. Ou altere a porta no código (linha 312)")
        print("=" * 60)
        return
    
    try:
        with socketserver.TCPServer(("", port), handler) as httpd:
            url = f"http://localhost:{port}/admin.html"
            print("=" * 60)
            print("🚀 SERVIDOR ADMIN INICIADO")
            print("=" * 60)
            print(f"📡 Acesse: {url}")
            print(f"📡 Site principal: http://localhost:8000")
            print("=" * 60)
            print("Pressione Ctrl+C para parar")
            print()
            
            # Abrir navegador automaticamente após 1 segundo
            def abrir_navegador():
                time.sleep(1.5)  # Aguardar servidor iniciar
                try:
                    webbrowser.open(url)
                    print(f"✅ Navegador aberto automaticamente!")
                except:
                    print(f"⚠️  Não foi possível abrir o navegador automaticamente.")
                    print(f"   Acesse manualmente: {url}")
            
            threading.Thread(target=abrir_navegador, daemon=True).start()
            
            try:
                httpd.serve_forever()
            except KeyboardInterrupt:
                print("\n\nServidor encerrado.")
    except OSError as e:
        print("=" * 60)
        print("❌ ERRO ao iniciar servidor!")
        print("=" * 60)
        print(f"Erro: {e}")
        print("=" * 60)
        print("Possíveis causas:")
        print("1. Porta {} já está em uso".format(port))
        print("2. Permissões insuficientes")
        print("3. Firewall bloqueando a porta")
        print("=" * 60)

if __name__ == "__main__":
    run_server()

