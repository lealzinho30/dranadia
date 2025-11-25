// Configuração global
const API_BASE = 'http://localhost:8001/api';
let siteConfig = {};
let cropper = null;
let currentImageFile = null;
let currentImageKey = null;
let currentPreviewId = null;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    carregarConfig();
    setupNavigation();
    carregarServicos();
    carregarDepoimentos();
    gerarImageUploadItems();
    setupQualitySlider();
});

// Navegação entre seções
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item[data-section]');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.getAttribute('data-section');
            mostrarSecao(section);
            
            navItems.forEach(ni => ni.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

function mostrarSecao(sectionId) {
    document.querySelectorAll('.admin-section').forEach(sec => {
        sec.classList.remove('active');
    });
    
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
        
        const titles = {
            'imagens': 'Gerenciar Imagens',
            'contato': 'Informações de Contato',
            'redes-sociais': 'Redes Sociais',
            'textos': 'Editar Textos',
            'servicos': 'Gerenciar Serviços',
            'depoimentos': 'Gerenciar Depoimentos'
        };
        document.getElementById('sectionTitle').textContent = titles[sectionId] || 'Painel Admin';
    }
}

// Carregar configuração do servidor
async function carregarConfig() {
    try {
        const response = await fetch(`${API_BASE}/config`);
        if (response.ok) {
            siteConfig = await response.json();
            preencherFormularios();
            carregarPreviews();
        } else {
            console.warn('Resposta do servidor não OK, usando configuração padrão');
            criarConfigPadrao();
        }
    } catch (error) {
        console.error('Erro ao conectar com servidor:', error);
        mostrarErroServidor();
        criarConfigPadrao();
    }
}

function mostrarErroServidor() {
    const statusDiv = document.getElementById('statusMessage');
    if (statusDiv) {
        statusDiv.innerHTML = '⚠️ <strong>Servidor não está rodando!</strong> Execute INICIAR-ADMIN-SIMPLES.bat';
        statusDiv.className = 'status-message error show';
        
        // Adicionar link de ajuda após 2 segundos
        setTimeout(() => {
            const helpLink = document.createElement('a');
            helpLink.href = 'admin-offline.html';
            helpLink.target = '_blank';
            helpLink.textContent = 'Ver Instruções';
            helpLink.style.marginLeft = '10px';
            helpLink.style.color = 'white';
            helpLink.style.textDecoration = 'underline';
            statusDiv.appendChild(helpLink);
        }, 2000);
    } else {
        // Se não existir, criar um alerta no topo
        const alert = document.createElement('div');
        alert.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#e74c3c;color:white;padding:15px;text-align:center;z-index:10000;';
        alert.innerHTML = '⚠️ <strong>Servidor não está rodando!</strong> Execute INICIAR-ADMIN-SIMPLES.bat | ';
        const link = document.createElement('a');
        link.href = 'admin-offline.html';
        link.target = '_blank';
        link.textContent = 'Ver Instruções';
        link.style.color = 'white';
        link.style.textDecoration = 'underline';
        alert.appendChild(link);
        document.body.insertBefore(alert, document.body.firstChild);
    }
}

function criarConfigPadrao() {
    siteConfig = {
        contato: {
            telefone: '5511913141625',
            email: 'dranadiaodontopediatra@gmail.com',
            endereco: 'Rua Fernando Falcão, 1111\nEdifício Bernini - Sala 810, 8° andar\nMooca - SP | CEP: 03180-003',
            horario: 'De Segunda a Sábado\nDas 8h00 às 17h00'
        },
        redesSociais: {
            instagram: 'https://www.instagram.com/dra_nadia_odontopediatra/',
            google: 'https://share.google.com/C4zChttSybrBBCZWW'
        },
        textos: {
            heroTitle1: 'Especialista em',
            heroTitle2: 'Saúde Bucal Infantil',
            heroSubtitle: 'Atendemos todas as necessidades de saúde bucal de crianças e adolescentes. Ambiente acolhedor e lúdico pensado especialmente para os pequenos!',
            sobreCompromisso: 'Nosso compromisso é proporcionar um ambiente acolhedor e seguro, onde nossos pequenos pacientes possam sentir-se confortáveis e confiantes durante seus tratamentos.'
        },
        imagens: {},
        servicos: [],
        depoimentos: []
    };
    preencherFormularios();
}

function preencherFormularios() {
    // Contato
    if (siteConfig.contato) {
        document.getElementById('telefone').value = siteConfig.contato.telefone || '';
        document.getElementById('email').value = siteConfig.contato.email || '';
        document.getElementById('endereco').value = siteConfig.contato.endereco || '';
        document.getElementById('horario').value = siteConfig.contato.horario || '';
    }
    
    // Redes Sociais
    if (siteConfig.redesSociais) {
        document.getElementById('instagram').value = siteConfig.redesSociais.instagram || '';
        document.getElementById('google').value = siteConfig.redesSociais.google || '';
    }
    
    // Textos
    if (siteConfig.textos) {
        document.getElementById('hero-title-1').value = siteConfig.textos.heroTitle1 || '';
        document.getElementById('hero-title-2').value = siteConfig.textos.heroTitle2 || '';
        document.getElementById('hero-subtitle').value = siteConfig.textos.heroSubtitle || '';
        document.getElementById('sobre-compromisso').value = siteConfig.textos.sobreCompromisso || '';
    }
    
    // Imagens - preencher nomes de arquivos
    if (siteConfig.imagens) {
        Object.keys(siteConfig.imagens).forEach(key => {
            const filename = siteConfig.imagens[key];
            const input = document.querySelector(`.filename-input[data-key="${key}"]`);
            if (input) {
                input.value = filename;
            }
        });
    }
}

// Mapeamento entre keys de imagens e IDs de preview
const imageKeyToPreviewId = {
    'hero-slide-1': 'hero-1',
    'hero-slide-2': 'hero-2',
    'sobre-foto': 'sobre'
};

function carregarPreviews() {
    if (siteConfig.imagens) {
        Object.keys(siteConfig.imagens).forEach(key => {
            const filename = siteConfig.imagens[key];
            if (!filename) return;
            
            // Mapear key para previewId
            let previewId = imageKeyToPreviewId[key];
            if (!previewId) {
                // Para galeria, diferenciais e dicas, usar a própria key
                previewId = key;
            }
            const preview = document.getElementById(`preview-${previewId}`);
            if (!preview) {
                console.warn(`Preview não encontrado: preview-${previewId}`);
                return;
            }
            
            // Limpar preview primeiro
            preview.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Carregando...</span>';
            
            const img = document.createElement('img');
            img.style.maxWidth = '100%';
            img.style.maxHeight = '100%';
            img.style.objectFit = 'contain';
            
            // Construir URL da imagem - tentar múltiplas opções
            const baseUrl = API_BASE.replace('/api', '');
            const urls = [
                `${baseUrl}/images/${encodeURIComponent(filename)}?t=${Date.now()}`,
                `images/${encodeURIComponent(filename)}?t=${Date.now()}`,
                `${baseUrl}/images/${filename}?t=${Date.now()}`,
                `images/${filename}?t=${Date.now()}`
            ];
            
            let urlIndex = 0;
            
            function tryNextUrl() {
                if (urlIndex >= urls.length) {
                    preview.innerHTML = '<i class="fas fa-image"></i><span>Imagem não encontrada</span>';
                    console.error(`Não foi possível carregar: ${filename}`);
                    return;
                }
                
                img.src = urls[urlIndex];
                urlIndex++;
            }
            
            img.onerror = () => {
                console.warn(`Erro ao carregar ${urls[urlIndex - 1]}, tentando próximo...`);
                tryNextUrl();
            };
            
            img.onload = () => {
                preview.innerHTML = '';
                preview.appendChild(img);
                console.log(`Imagem carregada: ${filename}`);
            };
            
            // Começar a tentar carregar
            tryNextUrl();
        });
    }
}

// Upload e preview de imagem
async function previewImage(input, previewId) {
    const file = input.files[0];
    if (!file) return;
    
    currentImageFile = file;
    currentImageKey = input.getAttribute('data-key');
    currentPreviewId = previewId;
    
    // Mostrar preview imediato
    const reader = new FileReader();
    reader.onload = (e) => {
        const preview = document.getElementById(`preview-${previewId}`);
        if (preview) {
            preview.innerHTML = '';
            const img = document.createElement('img');
            img.src = e.target.result;
            preview.appendChild(img);
        }
        
        // Abrir editor
        abrirEditor(e.target.result);
    };
    reader.readAsDataURL(file);
}

// Abrir editor de imagem
function abrirEditor(imageSrc) {
    const modal = document.getElementById('imageEditorModal');
    const editorImage = document.getElementById('editorImage');
    
    editorImage.src = imageSrc;
    editorImage.onload = () => {
        if (cropper) {
            cropper.destroy();
        }
        
        cropper = new Cropper(editorImage, {
            aspectRatio: NaN,
            viewMode: 1,
            dragMode: 'move',
            autoCropArea: 0.8,
            restore: false,
            guides: true,
            center: true,
            highlight: true,
            cropBoxMovable: true,
            cropBoxResizable: true,
            responsive: true,
            ready: function() {
                const canvas = cropper.getCanvasData();
                const width = Math.round(canvas.width);
                const height = Math.round(canvas.height);
                document.getElementById('editorWidth').value = width;
                document.getElementById('editorHeight').value = height;
                originalAspectRatio = height / width;
                atualizarPreview();
            }
        });
        
        editorImage.addEventListener('crop', atualizarControles);
        modal.classList.add('show');
    };
}

function atualizarControles() {
    if (cropper) {
        const canvas = cropper.getCanvasData();
        const width = Math.round(canvas.width);
        const height = Math.round(canvas.height);
        document.getElementById('editorWidth').value = width;
        document.getElementById('editorHeight').value = height;
        atualizarPreview();
    }
}

let maintainAspect = true;
let originalAspectRatio = 1;

function setupQualitySlider() {
    const qualitySlider = document.getElementById('editorQuality');
    const qualityValue = document.getElementById('qualityValue');
    if (qualitySlider && qualityValue) {
        qualitySlider.addEventListener('input', (e) => {
            qualityValue.textContent = e.target.value + '%';
        });
    }
    
    const widthInput = document.getElementById('editorWidth');
    const heightInput = document.getElementById('editorHeight');
    
    if (widthInput && heightInput) {
        widthInput.addEventListener('input', () => {
            atualizarTamanho();
            atualizarPreview();
        });
        
        heightInput.addEventListener('input', () => {
            atualizarTamanho();
            atualizarPreview();
        });
    }
}

function toggleAspectRatio() {
    const checkbox = document.getElementById('maintainAspect');
    maintainAspect = checkbox.checked;
    if (cropper && maintainAspect) {
        const canvas = cropper.getCanvasData();
        originalAspectRatio = canvas.height / canvas.width;
    }
}

function atualizarTamanho() {
    if (!cropper) return;
    
    const widthInput = document.getElementById('editorWidth');
    const heightInput = document.getElementById('editorHeight');
    const width = parseInt(widthInput.value);
    const height = parseInt(heightInput.value);
    
    if (maintainAspect && widthInput === document.activeElement) {
        const newHeight = Math.round(width * originalAspectRatio);
        heightInput.value = newHeight;
        cropper.setCanvasData({ width: width, height: newHeight });
    } else if (maintainAspect && heightInput === document.activeElement) {
        const newWidth = Math.round(height / originalAspectRatio);
        widthInput.value = newWidth;
        cropper.setCanvasData({ width: newWidth, height: height });
    } else {
        cropper.setCanvasData({ width: width, height: height });
    }
}

function aplicarProporcao() {
    const select = document.getElementById('aspectRatio');
    const ratio = select.value;
    if (!ratio || !cropper) return;
    
    const [w, h] = ratio.split(':').map(Number);
    const aspectRatio = h / w;
    
    const widthInput = document.getElementById('editorWidth');
    const currentWidth = parseInt(widthInput.value) || 800;
    const newHeight = Math.round(currentWidth * aspectRatio);
    
    document.getElementById('editorHeight').value = newHeight;
    originalAspectRatio = aspectRatio;
    cropper.setAspectRatio(w / h);
    atualizarTamanho();
}

function aplicarTamanho(width, height) {
    if (!cropper) return;
    
    document.getElementById('editorWidth').value = width;
    document.getElementById('editorHeight').value = height;
    cropper.setCanvasData({ width: width, height: height });
    originalAspectRatio = height / width;
    atualizarPreview();
}

function atualizarPreview() {
    const width = document.getElementById('editorWidth').value;
    const height = document.getElementById('editorHeight').value;
    document.getElementById('sizePreview').textContent = `${width} x ${height} px`;
}

// Remover imagem
async function removerImagem(key, previewId) {
    if (!confirm('Tem certeza que deseja remover esta imagem?')) {
        return;
    }
    
    // Limpar preview
    const preview = document.getElementById(`preview-${previewId}`);
    if (preview) {
        preview.innerHTML = '<i class="fas fa-image"></i><span>Sem imagem</span>';
    }
    
    // Limpar input de arquivo
    const fileInput = document.querySelector(`input[type="file"][data-key="${key}"]`);
    if (fileInput) {
        fileInput.value = '';
    }
    
    // Limpar nome do arquivo
    const filenameInput = document.querySelector(`.filename-input[data-key="${key}"]`);
    if (filenameInput) {
        filenameInput.value = '';
    }
    
    // Remover da configuração
    if (siteConfig.imagens && siteConfig.imagens[key]) {
        delete siteConfig.imagens[key];
    }
    
    mostrarStatus('✅ Imagem removida. Clique em "Salvar Tudo" para aplicar.', 'success');
}

// Editar imagem existente
async function editarImagemExistente(key, previewId) {
    const filenameInput = document.querySelector(`.filename-input[data-key="${key}"]`);
    const filename = filenameInput ? filenameInput.value.trim() : '';
    
    if (!filename) {
        mostrarStatus('⚠️ Nenhuma imagem encontrada. Selecione uma imagem primeiro.', 'warning');
        return;
    }
    
    // Carregar imagem existente
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        currentImageKey = key;
        currentPreviewId = previewId;
        abrirEditor(canvas.toDataURL('image/jpeg'));
    };
    img.onerror = () => {
        mostrarStatus('❌ Erro ao carregar imagem. Verifique se o arquivo existe.', 'error');
    };
    // Construir URL da imagem
    let imageUrl;
    if (API_BASE.includes('localhost') || API_BASE.includes('127.0.0.1')) {
        const baseUrl = API_BASE.replace('/api', '');
        imageUrl = `${baseUrl}/images/${filename}?t=${Date.now()}`;
    } else {
        imageUrl = `images/${filename}?t=${Date.now()}`;
    }
    img.src = imageUrl;
    img.onerror = () => {
        img.src = `images/${filename}?t=${Date.now()}`;
    };
}

function girarImagem(graus) {
    if (cropper) {
        cropper.rotate(graus);
    }
}

function espelharImagem() {
    if (cropper) {
        const scaleX = cropper.getImageData().scaleX || 1;
        cropper.scaleX(-scaleX);
    }
}

function resetarImagem() {
    if (cropper) {
        cropper.reset();
        atualizarControles();
    }
}

// Aplicar edições e fazer upload
async function aplicarEdicao() {
    if (!cropper || !currentImageKey) return;
    
    mostrarStatus('Processando imagem...', 'info');
    
    const quality = parseInt(document.getElementById('editorQuality').value) / 100;
    const width = parseInt(document.getElementById('editorWidth').value);
    const height = parseInt(document.getElementById('editorHeight').value);
    
    const canvas = cropper.getCroppedCanvas({
        width: width,
        height: height,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high'
    });
    
    canvas.toBlob(async (blob) => {
        if (!blob) {
            mostrarStatus('❌ Erro ao processar imagem. Tente novamente.', 'error');
            return;
        }
        
        // Atualizar preview do tamanho do arquivo
        const fileSize = (blob.size / 1024).toFixed(2);
        const fileSizeElement = document.getElementById('fileSizePreview');
        if (fileSizeElement) {
            fileSizeElement.textContent = `${fileSize} KB`;
        }
        
        // Gerar nome do arquivo
        const filenameInput = document.querySelector(`.filename-input[data-key="${currentImageKey}"]`);
        let filename = filenameInput ? filenameInput.value.trim() : '';
        
        if (!filename || filename === (currentImageFile ? currentImageFile.name : '')) {
            const originalName = currentImageFile ? currentImageFile.name : 'imagem';
            const extension = originalName.split('.').pop() || 'jpg';
            const baseName = originalName.replace(/\.[^/.]+$/, '') || 'imagem';
            filename = `${baseName}-editado.${extension}`;
            if (filenameInput) {
                filenameInput.value = filename;
            }
        }
        
        console.log('Fazendo upload da imagem:', filename);
        
        // Converter blob para base64
        const reader = new FileReader();
        reader.onload = async () => {
            const base64 = reader.result;
            
            // Fazer upload
            try {
                const response = await fetch(`${API_BASE}/upload`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        filename: filename,
                        key: currentImageKey,
                        data: base64
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    console.log('Upload bem-sucedido:', result);
                    
                    // Atualizar config local primeiro
                    if (!siteConfig.imagens) {
                        siteConfig.imagens = {};
                    }
                    siteConfig.imagens[currentImageKey] = filename;
                    
                    // Atualizar preview - usar múltiplas tentativas
                    const preview = document.getElementById(`preview-${currentPreviewId}`);
                    if (preview) {
                        // Limpar preview
                        preview.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Carregando...</span>';
                        
                        // Criar imagem
                        const img = document.createElement('img');
                        img.style.maxWidth = '100%';
                        img.style.maxHeight = '100%';
                        img.style.objectFit = 'contain';
                        
                        // Construir URLs para tentar
                        const baseUrl = API_BASE.replace('/api', '');
                        const urls = [
                            `${baseUrl}/images/${encodeURIComponent(filename)}?t=${Date.now()}`,
                            `images/${encodeURIComponent(filename)}?t=${Date.now()}`,
                            `${baseUrl}/images/${filename}?t=${Date.now()}`,
                            `images/${filename}?t=${Date.now()}`
                        ];
                        
                        let urlIndex = 0;
                        
                        // Guardar blob para fallback
                        const imageBlob = blob;
                        
                        function tryNextUrl() {
                            if (urlIndex >= urls.length) {
                                // Se nenhuma URL funcionar, usar o blob diretamente
                                try {
                                    const blobUrl = URL.createObjectURL(imageBlob);
                                    img.src = blobUrl;
                                    preview.innerHTML = '';
                                    preview.appendChild(img);
                                    console.warn('Usando blob URL como fallback');
                                } catch (e) {
                                    console.error('Erro ao criar blob URL:', e);
                                    preview.innerHTML = '<i class="fas fa-image"></i><span>Imagem salva (recarregue a página)</span>';
                                }
                                return;
                            }
                            
                            img.src = urls[urlIndex];
                            console.log(`Tentando carregar imagem: ${urls[urlIndex]}`);
                            urlIndex++;
                        }
                        
                        img.onerror = () => {
                            console.warn(`Erro ao carregar ${urls[urlIndex - 1]}, tentando próximo...`);
                            tryNextUrl();
                        };
                        
                        img.onload = () => {
                            console.log(`Imagem carregada com sucesso: ${urls[urlIndex - 1]}`);
                            preview.innerHTML = '';
                            preview.appendChild(img);
                        };
                        
                        // Começar a tentar carregar
                        tryNextUrl();
                    } else {
                        console.error(`Preview não encontrado: preview-${currentPreviewId}`);
                    }
                    
                    mostrarStatus('✅ Imagem salva com sucesso!', 'success');
                    fecharEditor();
                } else {
                    console.error('Erro no upload:', result);
                    mostrarStatus('❌ Erro ao salvar: ' + (result.error || 'Erro desconhecido'), 'error');
                }
            } catch (error) {
                console.error('Erro ao fazer upload:', error);
                mostrarStatus('❌ Erro ao fazer upload: ' + error.message, 'error');
            }
        };
        reader.readAsDataURL(blob);
    }, 'image/jpeg', quality);
}

function fecharEditor() {
    const modal = document.getElementById('imageEditorModal');
    modal.classList.remove('show');
    
    if (cropper) {
        cropper.destroy();
        cropper = null;
    }
    
    currentImageFile = null;
    currentImageKey = null;
    currentPreviewId = null;
}

// Salvar tudo
async function salvarTudo() {
    mostrarStatus('Salvando configurações...', 'info');
    
    const dados = {
        contato: {
            telefone: document.getElementById('telefone').value,
            email: document.getElementById('email').value,
            endereco: document.getElementById('endereco').value,
            horario: document.getElementById('horario').value
        },
        redesSociais: {
            instagram: document.getElementById('instagram').value,
            google: document.getElementById('google').value
        },
        textos: {
            heroTitle1: document.getElementById('hero-title-1').value,
            heroTitle2: document.getElementById('hero-title-2').value,
            heroSubtitle: document.getElementById('hero-subtitle').value,
            sobreCompromisso: document.getElementById('sobre-compromisso').value
        },
        imagens: {},
        servicos: siteConfig.servicos || [],
        depoimentos: siteConfig.depoimentos || []
    };
    
    // Coletar imagens
    document.querySelectorAll('.filename-input').forEach(input => {
        const key = input.getAttribute('data-key');
        const value = input.value.trim();
        if (value) {
            dados.imagens[key] = value;
        }
    });
    
    try {
        // Salvar configuração
        const response = await fetch(`${API_BASE}/save-config`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Mostrar mensagem do servidor (pode incluir info sobre deploy)
            mostrarStatus(result.message || '✅ Tudo salvo com sucesso!', 'success');
            siteConfig = dados;
            
            // Recarregar previews para mostrar as imagens atualizadas
            setTimeout(() => {
                carregarPreviews();
            }, 500);
        } else {
            mostrarStatus('❌ Erro ao salvar: ' + result.error, 'error');
        }
    } catch (error) {
        mostrarStatus('❌ Erro de conexão: ' + error.message, 'error');
    }
}

// Gerar itens de upload
function gerarImageUploadItems() {
    const galeriaGrid = document.getElementById('galeria-grid');
    if (galeriaGrid) {
        for (let i = 1; i <= 9; i++) {
            galeriaGrid.appendChild(criarImageUploadItem(`galeria-${i}`, `Galeria ${i}`));
        }
    }
    
    const diferenciaisGrid = document.getElementById('diferenciais-grid');
    if (diferenciaisGrid) {
        for (let i = 1; i <= 4; i++) {
            diferenciaisGrid.appendChild(criarImageUploadItem(`diferencial-${i}`, `Diferencial ${i}`));
        }
    }
    
    const dicasGrid = document.getElementById('dicas-grid');
    if (dicasGrid) {
        for (let i = 1; i <= 6; i++) {
            dicasGrid.appendChild(criarImageUploadItem(`dica-${i}`, `Dica ${i}`));
        }
    }
}

function criarImageUploadItem(key, label) {
    const div = document.createElement('div');
    div.className = 'image-upload-item';
    const previewId = `preview-${key}`;
    
    // Descrições específicas para cada tipo de imagem
    const hints = {
        'galeria-1': 'Primeira foto da galeria - Clínica/Consultório',
        'galeria-2': 'Segunda foto da galeria - Atendimento',
        'galeria-3': 'Terceira foto da galeria - Equipamentos',
        'galeria-4': 'Quarta foto da galeria - Ambiente',
        'galeria-5': 'Quinta foto da galeria - Sala de espera',
        'galeria-6': 'Sexta foto da galeria - Tratamento',
        'galeria-7': 'Sétima foto da galeria - Crianças felizes',
        'galeria-8': 'Oitava foto da galeria - Profissional',
        'galeria-9': 'Nona foto da galeria - Resultados',
        'diferencial-1': 'Atendimento Humanizado - Criança sendo atendida com carinho',
        'diferencial-2': 'Equipamentos Modernos - Tecnologia de ponta',
        'diferencial-3': 'Atendimento Familiar - Família no consultório',
        'diferencial-4': 'Ambiente Acolhedor - Consultório moderno e lúdico',
        'dica-1': 'Primeira Consulta - Criança na primeira visita ao dentista',
        'dica-2': 'Escovação - Criança escovando os dentes corretamente',
        'dica-3': 'Alimentação - Frutas e alimentos saudáveis',
        'dica-4': 'Flúor e Selantes - Aplicação de proteção dental',
        'dica-5': 'Emergência - Atendimento de urgência/traumatismo',
        'dica-6': 'Consultas Regulares - Importância das visitas periódicas'
    };
    
    const hint = hints[key] || 'Imagem para esta seção';
    
    div.innerHTML = `
        <div class="image-item-header">
            <div>
                <label>${label}</label>
                <span class="image-hint">${hint}</span>
            </div>
            <button class="btn-remove-image" onclick="removerImagem('${key}', '${key}')" title="Remover imagem">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        <div class="image-preview" id="${previewId}">
            <i class="fas fa-image"></i>
            <span>Sem imagem</span>
        </div>
        <input type="file" accept="image/*" data-key="${key}" onchange="previewImage(this, '${key}')">
        <input type="text" placeholder="Nome do arquivo..." class="filename-input" data-key="${key}">
        <button class="btn btn-small" onclick="editarImagemExistente('${key}', '${key}')" style="margin-top: 0.5rem;">
            <i class="fas fa-edit"></i> Editar
        </button>
    `;
    return div;
}

// Serviços
function carregarServicos() {
    const container = document.getElementById('servicos-container');
    if (!siteConfig.servicos || siteConfig.servicos.length === 0) {
        container.innerHTML = '<p style="color: var(--gray); margin-bottom: 1rem;">Nenhum serviço cadastrado.</p>';
        return;
    }
    
    container.innerHTML = '';
    siteConfig.servicos.forEach((servico, index) => {
        container.appendChild(criarItemServico(servico, index));
    });
}

function criarItemServico(servico, index) {
    const div = document.createElement('div');
    div.className = 'servico-item';
    div.innerHTML = `
        <h4>
            Serviço ${index + 1}
            <button class="btn-remove" onclick="removerServico(${index})">
                <i class="fas fa-trash"></i> Remover
            </button>
        </h4>
        <div class="form-group">
            <label>Título</label>
            <input type="text" class="form-control servico-titulo" value="${servico.titulo || ''}" data-index="${index}">
        </div>
        <div class="form-group">
            <label>Descrição</label>
            <textarea class="form-control servico-descricao" rows="3" data-index="${index}">${servico.descricao || ''}</textarea>
        </div>
        <div class="form-group">
            <label>Ícone (Font Awesome)</label>
            <input type="text" class="form-control servico-icone" value="${servico.icone || ''}" placeholder="fas fa-tooth" data-index="${index}">
        </div>
    `;
    
    div.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('change', () => atualizarServico(index));
    });
    
    return div;
}

function adicionarServico() {
    if (!siteConfig.servicos) {
        siteConfig.servicos = [];
    }
    siteConfig.servicos.push({
        titulo: 'Novo Serviço',
        descricao: 'Descrição do serviço...',
        icone: 'fas fa-tooth'
    });
    carregarServicos();
}

function removerServico(index) {
    if (confirm('Tem certeza que deseja remover este serviço?')) {
        siteConfig.servicos.splice(index, 1);
        carregarServicos();
    }
}

function atualizarServico(index) {
    const item = document.querySelector(`.servico-item:nth-child(${index + 1})`);
    if (item) {
        siteConfig.servicos[index] = {
            titulo: item.querySelector('.servico-titulo').value,
            descricao: item.querySelector('.servico-descricao').value,
            icone: item.querySelector('.servico-icone').value
        };
    }
}

// Depoimentos
function carregarDepoimentos() {
    const container = document.getElementById('depoimentos-container');
    if (!siteConfig.depoimentos || siteConfig.depoimentos.length === 0) {
        container.innerHTML = '<p style="color: var(--gray); margin-bottom: 1rem;">Nenhum depoimento cadastrado.</p>';
        return;
    }
    
    container.innerHTML = '';
    siteConfig.depoimentos.forEach((depoimento, index) => {
        container.appendChild(criarItemDepoimento(depoimento, index));
    });
}

function criarItemDepoimento(depoimento, index) {
    const div = document.createElement('div');
    div.className = 'depoimento-item';
    div.innerHTML = `
        <h4>
            Depoimento ${index + 1}
            <button class="btn-remove" onclick="removerDepoimento(${index})">
                <i class="fas fa-trash"></i> Remover
            </button>
        </h4>
        <div class="form-group">
            <label>Nome</label>
            <input type="text" class="form-control depoimento-nome" value="${depoimento.nome || ''}" data-index="${index}">
        </div>
        <div class="form-group">
            <label>Texto</label>
            <textarea class="form-control depoimento-texto" rows="4" data-index="${index}">${depoimento.texto || ''}</textarea>
        </div>
        <div class="form-group">
            <label>Avaliação (1-5)</label>
            <input type="number" min="1" max="5" class="form-control depoimento-avaliacao" value="${depoimento.avaliacao || 5}" data-index="${index}">
        </div>
    `;
    
    div.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('change', () => atualizarDepoimento(index));
    });
    
    return div;
}

function adicionarDepoimento() {
    if (!siteConfig.depoimentos) {
        siteConfig.depoimentos = [];
    }
    siteConfig.depoimentos.push({
        nome: 'Nome do Cliente',
        texto: 'Depoimento do cliente...',
        avaliacao: 5
    });
    carregarDepoimentos();
}

function removerDepoimento(index) {
    if (confirm('Tem certeza que deseja remover este depoimento?')) {
        siteConfig.depoimentos.splice(index, 1);
        carregarDepoimentos();
    }
}

function atualizarDepoimento(index) {
    const item = document.querySelector(`.depoimento-item:nth-child(${index + 1})`);
    if (item) {
        siteConfig.depoimentos[index] = {
            nome: item.querySelector('.depoimento-nome').value,
            texto: item.querySelector('.depoimento-texto').value,
            avaliacao: parseInt(item.querySelector('.depoimento-avaliacao').value)
        };
    }
}

// Status Message
function mostrarStatus(message, type = 'success') {
    const status = document.getElementById('statusMessage');
    if (status) {
        status.textContent = message;
        status.className = `status-message ${type} show`;
        console.log(`Status: [${type}] ${message}`);
        
        setTimeout(() => {
            status.classList.remove('show');
        }, 5000);
    } else {
        console.error('Elemento statusMessage não encontrado!');
        alert(message); // Fallback se o elemento não existir
    }
}
