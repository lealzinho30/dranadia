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
            criarConfigPadrao();
        }
    } catch (error) {
        console.log('Servidor não disponível, usando modo offline...');
        criarConfigPadrao();
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

function carregarPreviews() {
    if (siteConfig.imagens) {
        Object.keys(siteConfig.imagens).forEach(key => {
            const filename = siteConfig.imagens[key];
            const previewId = `preview-${key.replace(/-/g, '-')}`;
            const preview = document.getElementById(previewId);
            if (preview && filename) {
                const img = document.createElement('img');
                img.src = `images/${filename}`;
                img.onerror = () => {
                    preview.innerHTML = '<i class="fas fa-image"></i><span>Imagem não encontrada</span>';
                };
                img.onload = () => {
                    preview.innerHTML = '';
                    preview.appendChild(img);
                };
            }
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
    img.src = `images/${filename}?t=${Date.now()}`;
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
        // Atualizar preview do tamanho do arquivo
        const fileSize = (blob.size / 1024).toFixed(2);
        document.getElementById('fileSizePreview').textContent = `${fileSize} KB`;
        
        // Gerar nome do arquivo
        const filenameInput = document.querySelector(`.filename-input[data-key="${currentImageKey}"]`);
        let filename = filenameInput ? filenameInput.value : currentImageFile.name;
        
        if (!filename || filename === currentImageFile.name) {
            const extension = currentImageFile.name.split('.').pop();
            const baseName = currentImageFile.name.replace(/\.[^/.]+$/, '');
            filename = `${baseName}-editado.${extension}`;
            if (filenameInput) {
                filenameInput.value = filename;
            }
        }
        
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
                    // Atualizar preview
                    const preview = document.getElementById(`preview-${currentPreviewId}`);
                    if (preview) {
                        preview.innerHTML = '';
                        const img = document.createElement('img');
                        img.src = `images/${filename}?t=${Date.now()}`;
                        preview.appendChild(img);
                    }
                    
                    // Atualizar config local
                    if (!siteConfig.imagens) {
                        siteConfig.imagens = {};
                    }
                    siteConfig.imagens[currentImageKey] = filename;
                    
                    mostrarStatus('✅ Imagem salva com sucesso!', 'success');
                    fecharEditor();
                } else {
                    mostrarStatus('❌ Erro ao salvar: ' + result.error, 'error');
                }
            } catch (error) {
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
            // Atualizar site
            const updateResponse = await fetch(`${API_BASE}/update-site`, {
                method: 'POST'
            });
            
            const updateResult = await updateResponse.json();
            
            if (updateResult.success) {
                mostrarStatus('✅ Tudo salvo e site atualizado com sucesso!', 'success');
                siteConfig = dados;
            } else {
                mostrarStatus('⚠️ Configuração salva, mas erro ao atualizar site: ' + updateResult.error, 'warning');
            }
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
    status.textContent = message;
    status.className = `status-message ${type} show`;
    
    setTimeout(() => {
        status.classList.remove('show');
    }, 5000);
}
