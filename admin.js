// Configuração global
const API_BASE = 'http://localhost:8001/api';
let siteConfig = {};
let cropper = null;
let currentImageFile = null;
let currentImageKey = null;
let currentPreviewId = null;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    console.log('Iniciando painel admin...');
    gerarImageUploadItems(); // Gerar todos os campos de upload primeiro
    setupNavigation();
    setupQualitySlider();
    carregarServicos();
    carregarDepoimentos();
    carregarConfig(); // Carregar config por último para preencher os campos
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
        mostrarErroServidor();
        criarConfigPadrao();
    }
}

function mostrarErroServidor() {
    const statusDiv = document.getElementById('statusMessage');
    if (statusDiv) {
        statusDiv.innerHTML = '⚠️ <strong>Servidor não está rodando!</strong> Execute INICIAR-ADMIN-SIMPLES.bat';
        statusDiv.className = 'status-message error show';
    }
}

function criarConfigPadrao() {
    siteConfig = {
        contato: { telefone: '', email: '', endereco: '', horario: '' },
        redesSociais: { instagram: '', google: '' },
        textos: { heroTitle1: '', heroTitle2: '', heroSubtitle: '', sobreCompromisso: '' },
        imagens: {},
        servicos: [],
        depoimentos: []
    };
}

function preencherFormularios() {
    if (siteConfig.contato) {
        const telefone = document.getElementById('telefone');
        const email = document.getElementById('email');
        const endereco = document.getElementById('endereco');
        const horario = document.getElementById('horario');
        if (telefone) telefone.value = siteConfig.contato.telefone || '';
        if (email) email.value = siteConfig.contato.email || '';
        if (endereco) endereco.value = siteConfig.contato.endereco || '';
        if (horario) horario.value = siteConfig.contato.horario || '';
    }
    
    if (siteConfig.redesSociais) {
        const instagram = document.getElementById('instagram');
        const google = document.getElementById('google');
        if (instagram) instagram.value = siteConfig.redesSociais.instagram || '';
        if (google) google.value = siteConfig.redesSociais.google || '';
    }
    
    if (siteConfig.textos) {
        const heroTitle1 = document.getElementById('hero-title-1');
        const heroTitle2 = document.getElementById('hero-title-2');
        const heroSubtitle = document.getElementById('hero-subtitle');
        const sobreCompromisso = document.getElementById('sobre-compromisso');
        if (heroTitle1) heroTitle1.value = siteConfig.textos.heroTitle1 || '';
        if (heroTitle2) heroTitle2.value = siteConfig.textos.heroTitle2 || '';
        if (heroSubtitle) heroSubtitle.value = siteConfig.textos.heroSubtitle || '';
        if (sobreCompromisso) sobreCompromisso.value = siteConfig.textos.sobreCompromisso || '';
    }
    
    if (siteConfig.imagens) {
        Object.keys(siteConfig.imagens).forEach(key => {
            const filename = siteConfig.imagens[key];
            const input = document.querySelector(`.filename-input[data-key="${key}"]`);
            if (input) input.value = filename;
        });
    }
}

const imageKeyToPreviewId = {
    'hero-slide-1': 'hero-1',
    'hero-slide-2': 'hero-2',
    'sobre-foto': 'sobre',
    // Galeria, diferenciais e dicas usam o mesmo ID (galeria-1, diferencial-1, dica-1, etc)
};

function carregarPreviews() {
    if (!siteConfig || !siteConfig.imagens) {
        console.log('Nenhuma imagem configurada');
        return;
    }
    
    console.log('Carregando previews:', Object.keys(siteConfig.imagens).length, 'imagens');
    
        Object.keys(siteConfig.imagens).forEach(key => {
            const filename = siteConfig.imagens[key];
        if (!filename || !filename.trim()) {
            return;
        }
        
        const previewId = imageKeyToPreviewId[key] || key;
        const preview = document.getElementById(`preview-${previewId}`);
        if (!preview) {
            console.warn(`Preview não encontrado: preview-${previewId}`);
            return;
        }
        
        // Verificar se já existe uma imagem carregada
        const existingImg = preview.querySelector('img');
        if (existingImg && existingImg.src && !existingImg.src.includes('blob:')) {
            console.log(`✓ Preview já carregado: ${key}`);
            return; // Não recarregar se já está carregado
        }
        
        preview.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Carregando...</span>';
        
                const img = document.createElement('img');
        img.style.width = '100%';
        img.style.height = 'auto';
        img.style.display = 'block';
        
        const baseUrl = API_BASE.replace('/api', '');
        const timestamp = Date.now();
        const cleanFilename = filename.trim();
        
        const urls = [
            `${baseUrl}/images/${encodeURIComponent(cleanFilename)}?t=${timestamp}`,
            `${baseUrl}/images/${cleanFilename}?t=${timestamp}`,
            `images/${encodeURIComponent(cleanFilename)}?t=${timestamp}`,
            `images/${cleanFilename}?t=${timestamp}`
        ];
        
        let urlIndex = 0;
        let loaded = false;
        
        function tryNextUrl() {
            if (loaded) return;
            
            if (urlIndex >= urls.length) {
                    preview.innerHTML = '<i class="fas fa-image"></i><span>Imagem não encontrada</span>';
                return;
            }
            
            const currentUrl = urls[urlIndex];
            urlIndex++;
            
            const testImg = new Image();
            testImg.onload = () => {
                if (!loaded) {
                    loaded = true;
                    img.src = currentUrl;
                    preview.innerHTML = '';
                    preview.appendChild(img);
                    console.log(`✓ ${key} carregado`);
                }
            };
            
            testImg.onerror = () => {
                setTimeout(tryNextUrl, 50);
            };
            
            testImg.src = currentUrl;
        }
        
        tryNextUrl();
    });
}

// Upload e preview de imagem
async function previewImage(input, previewId) {
    const file = input.files[0];
    if (!file) return;
    
    currentImageFile = file;
    currentImageKey = input.getAttribute('data-key');
    currentPreviewId = previewId;
    
    console.log('Imagem selecionada:', file.name, 'para', currentImageKey);
    
    const preview = document.getElementById(`preview-${previewId}`);
    if (!preview) {
        console.error(`Preview não encontrado: preview-${previewId}`);
        return;
    }
    
    preview.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Carregando...</span>';
    
    const reader = new FileReader();
    reader.onerror = () => {
        preview.innerHTML = '<i class="fas fa-exclamation-triangle"></i><span>Erro</span>';
        mostrarStatus('❌ Erro ao carregar imagem', 'error');
    };
    
    reader.onload = (e) => {
            preview.innerHTML = '';
            const img = document.createElement('img');
            img.src = e.target.result;
        img.style.width = '100%';
        img.style.height = 'auto';
        img.style.display = 'block';
            preview.appendChild(img);
        console.log('Preview mostrado com sucesso');
        
        setTimeout(() => abrirEditor(e.target.result), 100);
    };
    
    reader.readAsDataURL(file);
}

function abrirEditor(imageSrc) {
    const modal = document.getElementById('imageEditorModal');
    const editorImage = document.getElementById('editorImage');
    
    if (!modal || !editorImage || typeof Cropper === 'undefined') {
        mostrarStatus('⚠️ Editor não disponível', 'warning');
        return;
    }
    
    editorImage.src = imageSrc;
    editorImage.onload = () => {
        if (cropper) cropper.destroy();
        
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
                const widthInput = document.getElementById('editorWidth');
                const heightInput = document.getElementById('editorHeight');
                if (widthInput) widthInput.value = width;
                if (heightInput) heightInput.value = height;
                originalAspectRatio = height / width;
                atualizarPreview();
            }
        });
        
        editorImage.addEventListener('crop', atualizarControles);
        modal.classList.add('show');
    };
}

let originalAspectRatio = 1;

function atualizarControles() {
    if (!cropper) return;
    
        const canvas = cropper.getCanvasData();
        const width = Math.round(canvas.width);
        const height = Math.round(canvas.height);
    
    const widthInput = document.getElementById('editorWidth');
    const heightInput = document.getElementById('editorHeight');
    
    if (widthInput) widthInput.value = width;
    if (heightInput) heightInput.value = height;
    
    const sizePreview = document.getElementById('sizePreview');
    if (sizePreview) sizePreview.textContent = `${width} x ${height} px`;
}

function atualizarPreview() {
    atualizarControles();
}

function toggleAspectRatio() {
    const maintainAspect = document.getElementById('maintainAspect').checked;
    if (maintainAspect && cropper) {
        const canvas = cropper.getCanvasData();
        originalAspectRatio = canvas.height / canvas.width;
    }
}

function aplicarProporcao() {
    const aspectSelect = document.getElementById('aspectRatio');
    const aspectValue = aspectSelect.value;
    
    if (!aspectValue || !cropper) return;
    
    const [w, h] = aspectValue.split(':').map(Number);
    const aspectRatio = h / w;
    
    cropper.setAspectRatio(aspectRatio);
    originalAspectRatio = aspectRatio;
    
    document.getElementById('maintainAspect').checked = true;
}

function ajustarTamanho() {
    if (!cropper) return;
    
    const width = parseInt(document.getElementById('editorWidth').value);
    const height = parseInt(document.getElementById('editorHeight').value);
    const maintainAspect = document.getElementById('maintainAspect').checked;
    
    if (maintainAspect && originalAspectRatio) {
        const newHeight = Math.round(width * originalAspectRatio);
        document.getElementById('editorHeight').value = newHeight;
        cropper.setCanvasData({ width: width, height: newHeight });
    } else {
        cropper.setCanvasData({ width: width, height: height });
    }
    
    atualizarControles();
}

function girarImagem(graus) {
    if (cropper) cropper.rotate(graus);
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

async function aplicarEdicao() {
    if (!cropper || !currentImageKey) {
        mostrarStatus('❌ Nenhuma imagem selecionada', 'error');
        return;
    }
    
    mostrarStatus('Processando e salvando imagem...', 'info');
    
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
            mostrarStatus('❌ Erro ao processar imagem', 'error');
            return;
        }
        
        const filenameInput = document.querySelector(`.filename-input[data-key="${currentImageKey}"]`);
        let filename = filenameInput ? filenameInput.value.trim() : '';
        
        if (!filename) {
            const originalName = currentImageFile ? currentImageFile.name : 'imagem';
            const extension = originalName.split('.').pop() || 'webp';
            const baseName = originalName.replace(/\.[^/.]+$/, '') || 'imagem';
            filename = `${baseName}-editado.${extension}`;
            if (filenameInput) filenameInput.value = filename;
        }
        
        console.log('Enviando imagem:', filename);
        
        const reader = new FileReader();
        reader.onload = async () => {
            try {
                const response = await fetch(`${API_BASE}/upload`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        filename: filename,
                        key: currentImageKey,
                        data: reader.result
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    console.log('Upload bem-sucedido!');
                    
                    if (!siteConfig.imagens) siteConfig.imagens = {};
                    siteConfig.imagens[currentImageKey] = filename;
                    
                    const preview = document.getElementById(`preview-${currentPreviewId}`);
                    if (preview) {
                        preview.innerHTML = '';
                        const img = document.createElement('img');
                        img.style.width = '100%';
                        img.style.height = 'auto';
                        img.style.display = 'block';
                        
                        const blobUrl = URL.createObjectURL(blob);
                        img.src = blobUrl;
                        preview.appendChild(img);
                        console.log('Preview atualizado');
                    }
                    
                    mostrarStatus(result.message || '✅ Imagem salva e deploy iniciado!', 'success');
                    fecharEditor();
                } else {
                    console.error('Erro no upload:', result);
                    mostrarStatus('❌ Erro: ' + (result.error || 'Erro desconhecido'), 'error');
                }
            } catch (error) {
                console.error('Erro ao fazer upload:', error);
                mostrarStatus('❌ Erro ao fazer upload: ' + error.message, 'error');
            }
        };
        
        reader.readAsDataURL(blob);
    }, 'image/webp', quality);
}

function fecharEditor() {
    const modal = document.getElementById('imageEditorModal');
    if (modal) modal.classList.remove('show');
    
    if (cropper) {
        try {
        cropper.destroy();
        } catch (e) {}
        cropper = null;
    }
    
    currentImageFile = null;
    currentImageKey = null;
    currentPreviewId = null;
}

async function removerImagem(key, previewId) {
    if (!confirm('Tem certeza que deseja remover esta imagem?')) return;
    
    const preview = document.getElementById(`preview-${previewId}`);
    if (preview) preview.innerHTML = '<i class="fas fa-image"></i><span>Sem imagem</span>';
    
    const fileInput = document.querySelector(`input[type="file"][data-key="${key}"]`);
    if (fileInput) fileInput.value = '';
    
    const filenameInput = document.querySelector(`.filename-input[data-key="${key}"]`);
    if (filenameInput) filenameInput.value = '';
    
    // Remover do config local
    if (siteConfig.imagens && siteConfig.imagens[key]) {
        delete siteConfig.imagens[key];
    }
    
    // Salvar automaticamente a remoção
    try {
        const dados = {
            contato: {
                telefone: document.getElementById('telefone')?.value || '',
                email: document.getElementById('email')?.value || '',
                endereco: document.getElementById('endereco')?.value || '',
                horario: document.getElementById('horario')?.value || ''
            },
            redesSociais: {
                instagram: document.getElementById('instagram')?.value || '',
                google: document.getElementById('google')?.value || ''
            },
            textos: {
                heroTitle1: document.getElementById('hero-title-1')?.value || '',
                heroTitle2: document.getElementById('hero-title-2')?.value || '',
                heroSubtitle: document.getElementById('hero-subtitle')?.value || '',
                sobreCompromisso: document.getElementById('sobre-compromisso')?.value || ''
            },
            imagens: { ...siteConfig.imagens }, // Usar config atualizado (sem a imagem removida)
            servicos: siteConfig.servicos || [],
            depoimentos: siteConfig.depoimentos || []
        };
        
        // Coletar imagens dos inputs (mas não incluir a removida)
        document.querySelectorAll('.filename-input').forEach(input => {
            const inputKey = input.getAttribute('data-key');
            const value = input.value.trim();
            if (value && inputKey !== key) { // Não incluir a imagem removida
                dados.imagens[inputKey] = value;
            }
        });
        
        const response = await fetch(`${API_BASE}/save-config`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        
        const result = await response.json();
        
        if (result.success) {
            siteConfig = dados; // Atualizar config local
            mostrarStatus('✅ Imagem removida e salva com sucesso!', 'success');
        } else {
            mostrarStatus('⚠️ Imagem removida localmente. Clique em "Salvar Tudo" para aplicar.', 'warning');
        }
    } catch (error) {
        console.error('Erro ao salvar remoção:', error);
        mostrarStatus('⚠️ Imagem removida localmente. Clique em "Salvar Tudo" para aplicar.', 'warning');
    }
}

async function editarImagemExistente(key, previewId) {
    const filenameInput = document.querySelector(`.filename-input[data-key="${key}"]`);
    const filename = filenameInput ? filenameInput.value.trim() : '';
    
    if (!filename) {
        mostrarStatus('⚠️ Nenhuma imagem encontrada', 'warning');
        return;
    }
    
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
        mostrarStatus('❌ Erro ao carregar imagem', 'error');
    };
    
    const baseUrl = API_BASE.replace('/api', '');
    img.src = `${baseUrl}/images/${filename}?t=${Date.now()}`;
}

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
        imagens: siteConfig.imagens || {}, // Manter imagens existentes
        servicos: siteConfig.servicos || [],
        depoimentos: siteConfig.depoimentos || []
    };
    
    // Coletar imagens dos inputs (atualizar, adicionar ou remover)
    // Primeiro, limpar todas as imagens do config
    dados.imagens = {};
    
    // Depois, adicionar apenas as que têm valor
    document.querySelectorAll('.filename-input').forEach(input => {
        const key = input.getAttribute('data-key');
        const value = input.value.trim();
        if (value) {
            dados.imagens[key] = value;
        }
        // Se não tiver valor, a imagem será removida (não será adicionada ao objeto)
    });
    
    try {
        const response = await fetch(`${API_BASE}/save-config`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('Salvamento bem-sucedido!');
            siteConfig = dados; // Atualizar config local
            mostrarStatus(result.message || '✅ Tudo salvo com sucesso!', 'success');
            // NÃO recarregar previews - manter imagens visíveis
            console.log('Previews mantidos sem recarregar');
        } else {
            console.error('Erro ao salvar:', result);
            mostrarStatus('❌ Erro: ' + result.error, 'error');
        }
    } catch (error) {
        mostrarStatus('❌ Erro ao salvar: ' + error.message, 'error');
    }
}

function mostrarStatus(message, type = 'success') {
    const status = document.getElementById('statusMessage');
    if (status) {
        status.textContent = message;
        status.className = `status-message ${type} show`;
        setTimeout(() => status.classList.remove('show'), 5000);
    }
}

function setupQualitySlider() {
    const slider = document.getElementById('editorQuality');
    const display = document.getElementById('qualityDisplay');
    if (slider && display) {
        slider.addEventListener('input', () => {
            display.textContent = slider.value + '%';
        });
    }
}

function gerarImageUploadItems() {
    console.log('Gerando itens de upload de imagens...');
    
    // Galeria (9 imagens)
    const galeriaGrid = document.getElementById('galeria-grid');
    if (galeriaGrid) {
        galeriaGrid.innerHTML = ''; // Limpar antes de adicionar
        for (let i = 1; i <= 9; i++) {
            const key = `galeria-${i}`;
            const item = document.createElement('div');
            item.className = 'image-upload-item';
            item.innerHTML = `
                <div class="image-item-header">
                    <div>
                        <label>Galeria ${i}</label>
                        <span class="image-hint">Foto ${i} da galeria</span>
                    </div>
                    <button class="btn-remove-image" onclick="removerImagem('${key}', '${key}')" title="Remover">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="image-preview" id="preview-${key}">
                    <i class="fas fa-image"></i><span>Sem imagem</span>
                </div>
                <input type="file" accept="image/*" data-key="${key}" onchange="previewImage(this, '${key}')">
                <input type="text" placeholder="Nome do arquivo..." class="filename-input" data-key="${key}">
                <button class="btn btn-small" onclick="editarImagemExistente('${key}', '${key}')" style="margin-top:0.5rem;">
                    <i class="fas fa-edit"></i> Editar
                </button>
            `;
            galeriaGrid.appendChild(item);
        }
        console.log('✓ 9 itens de galeria gerados');
    }
    
    // Diferenciais (4 imagens)
    const diferenciaisGrid = document.getElementById('diferenciais-grid');
    if (diferenciaisGrid) {
        diferenciaisGrid.innerHTML = ''; // Limpar antes de adicionar
        for (let i = 1; i <= 4; i++) {
            const key = `diferencial-${i}`;
            const item = document.createElement('div');
            item.className = 'image-upload-item';
            item.innerHTML = `
                <div class="image-item-header">
                    <div>
                        <label>Diferencial ${i}</label>
                        <span class="image-hint">Imagem diferencial ${i}</span>
                    </div>
                    <button class="btn-remove-image" onclick="removerImagem('${key}', '${key}')" title="Remover">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="image-preview" id="preview-${key}">
                    <i class="fas fa-image"></i><span>Sem imagem</span>
                </div>
                <input type="file" accept="image/*" data-key="${key}" onchange="previewImage(this, '${key}')">
                <input type="text" placeholder="Nome do arquivo..." class="filename-input" data-key="${key}">
                <button class="btn btn-small" onclick="editarImagemExistente('${key}', '${key}')" style="margin-top:0.5rem;">
                    <i class="fas fa-edit"></i> Editar
                </button>
            `;
            diferenciaisGrid.appendChild(item);
        }
        console.log('✓ 4 itens de diferenciais gerados');
    }
    
    // Dicas (6 imagens) - ESSAS SÃO AS DO "LER MAIS"
    const dicasGrid = document.getElementById('dicas-grid');
    if (dicasGrid) {
        dicasGrid.innerHTML = ''; // Limpar antes de adicionar
        const dicasTitulos = [
            'Escovação Correta',
            'Primeira Visita',
            'Alimentação Saudável',
            'Uso do Fio Dental',
            'Chupeta e Mamadeira',
            'Cuidados com os Dentes'
        ];
        
        for (let i = 1; i <= 6; i++) {
            const key = `dica-${i}`;
            const item = document.createElement('div');
            item.className = 'image-upload-item';
            item.innerHTML = `
        <div class="image-item-header">
            <div>
                        <label>Dica ${i}: ${dicasTitulos[i-1]}</label>
                        <span class="image-hint">Imagem do card "${dicasTitulos[i-1]}"</span>
            </div>
                    <button class="btn-remove-image" onclick="removerImagem('${key}', '${key}')" title="Remover">
                <i class="fas fa-trash"></i>
            </button>
        </div>
                <div class="image-preview" id="preview-${key}">
                    <i class="fas fa-image"></i><span>Sem imagem</span>
        </div>
        <input type="file" accept="image/*" data-key="${key}" onchange="previewImage(this, '${key}')">
        <input type="text" placeholder="Nome do arquivo..." class="filename-input" data-key="${key}">
                <button class="btn btn-small" onclick="editarImagemExistente('${key}', '${key}')" style="margin-top:0.5rem;">
            <i class="fas fa-edit"></i> Editar
        </button>
    `;
            dicasGrid.appendChild(item);
        }
        console.log('✓ 6 itens de dicas gerados');
}

    console.log('✅ Todos os itens de upload gerados!');
}

function carregarServicos() {
    const container = document.getElementById('servicosContainer');
    if (!container) return;
    
    if (!siteConfig.servicos) siteConfig.servicos = [];
    
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
    `;
    return div;
}

function adicionarServico() {
    if (!siteConfig.servicos) siteConfig.servicos = [];
    siteConfig.servicos.push({ titulo: '', descricao: '' });
    carregarServicos();
}

function removerServico(index) {
    if (confirm('Tem certeza que deseja remover este serviço?')) {
        siteConfig.servicos.splice(index, 1);
        carregarServicos();
    }
}

function carregarDepoimentos() {
    const container = document.getElementById('depoimentosContainer');
    if (!container) return;
    
    if (!siteConfig.depoimentos) siteConfig.depoimentos = [];
    
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
            <input type="number" class="form-control depoimento-avaliacao" min="1" max="5" value="${depoimento.avaliacao || 5}" data-index="${index}">
        </div>
    `;
    return div;
}

function adicionarDepoimento() {
    if (!siteConfig.depoimentos) siteConfig.depoimentos = [];
    siteConfig.depoimentos.push({ nome: '', texto: '', avaliacao: 5 });
    carregarDepoimentos();
}

function removerDepoimento(index) {
    if (confirm('Tem certeza que deseja remover este depoimento?')) {
        siteConfig.depoimentos.splice(index, 1);
        carregarDepoimentos();
    }
}
