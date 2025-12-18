// ===== MOUSE INTERACTIVE BACKGROUND =====
document.addEventListener('DOMContentLoaded', () => {
    const blobs = document.querySelectorAll('.bg-blob');
    if (blobs.length === 0) return;
    
    let rafId = null;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    
    const updateBlobs = () => {
        const normalizedX = (mouseX / window.innerWidth) * 2 - 1;
        const normalizedY = (mouseY / window.innerHeight) * 2 - 1;
        
        blobs.forEach((blob, index) => {
            const intensity = (index + 1) * 0.2;
            const moveX = normalizedX * 80 * intensity;
            const moveY = normalizedY * 80 * intensity;
            const scale = 1 + Math.abs(normalizedX) * 0.15;
            blob.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scale})`;
        });
        
        rafId = null;
    };
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (!rafId) {
            rafId = requestAnimationFrame(updateBlobs);
        }
    }, { passive: true });
});

// ===== MENU MOBILE =====
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// ===== HEADER SCROLL EFFECT =====
const header = document.getElementById('header');
let ticking = false;

function updateHeader() {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
    }
}, { passive: true });

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        const target = document.querySelector(href);
        if (target) {
            const headerOffset = 120;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: Math.max(0, offsetPosition),
                behavior: 'smooth'
            });
            
            // Foco no primeiro campo do formulário se for o formulário
            if (href === '#formulario-contato') {
                setTimeout(() => {
                    const firstInput = target.querySelector('input[type="text"]');
                    if (firstInput) {
                        firstInput.focus();
                    }
                }, 500);
            }
        }
    });
});


// ===== SCROLL ANIMATIONS MELHORADAS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('scroll-animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Animar elementos ao scrollar com classes CSS
const animateElements = document.querySelectorAll('.servico-card, .sobre-item, .porque-card, .info-card, .diferencial-card, .feature-item, .formacao-card, .galeria-item, .endereco-card, .depoimento-card');
animateElements.forEach((el, index) => {
    el.classList.add('scroll-animate');
    if (index % 3 === 1) el.classList.add('scroll-animate-delay-1');
    if (index % 3 === 2) el.classList.add('scroll-animate-delay-2');
    observer.observe(el);
});

// Animar cards de formação com delay
const formacaoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-delay') || 0;
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, delay);
            formacaoObserver.unobserve(entry.target); // Para de observar após animar
        }
    });
}, observerOptions);

const formacaoCards = document.querySelectorAll('.formacao-card.scroll-fade-in');
formacaoCards.forEach(card => {
    formacaoObserver.observe(card);
});


// ===== SERVIÇOS - VER MAIS =====
const verMaisServicosBtn = document.getElementById('verMaisServicos');
const servicosHidden = document.querySelectorAll('.servico-card.servico-hidden');
const servicosMoreContainer = document.querySelector('.servicos-more-container');

if (verMaisServicosBtn && servicosHidden.length > 0) {
    verMaisServicosBtn.addEventListener('click', () => {
        servicosHidden.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('show');
            }, index * 150);
        });
        
        // Esconder botão após mostrar todas
        setTimeout(() => {
            servicosMoreContainer.classList.add('hidden');
        }, servicosHidden.length * 150 + 300);
    });
} else if (servicosHidden.length === 0 && servicosMoreContainer) {
    // Se não houver cards ocultos, esconder o botão
    servicosMoreContainer.classList.add('hidden');
}

// ===== LIGHTBOX =====
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
let currentImageIndex = 0;
let visibleImages = [];

// Coletar todas as imagens visíveis
function updateVisibleImages() {
    const galeriaItems = document.querySelectorAll('.galeria-item');
    visibleImages = Array.from(galeriaItems)
        .map(item => item.querySelector('.galeria-img').src);
}

// Adicionar event listeners para as imagens da galeria
document.querySelectorAll('.galeria-item').forEach((item, index) => {
    item.addEventListener('click', () => {
        updateVisibleImages();
        const img = item.querySelector('.galeria-img');
        currentImageIndex = visibleImages.indexOf(img.src);
        openLightbox(img.src);
    });
});

function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % visibleImages.length;
    lightboxImg.src = visibleImages[currentImageIndex];
}

function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + visibleImages.length) % visibleImages.length;
    lightboxImg.src = visibleImages[currentImageIndex];
}

lightboxClose.addEventListener('click', closeLightbox);
lightboxNext.addEventListener('click', showNextImage);
lightboxPrev.addEventListener('click', showPrevImage);

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Navegação com teclado
document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNextImage();
        if (e.key === 'ArrowLeft') showPrevImage();
    }
});

// ===== FORM SUBMISSION COM FEEDBACK VISUAL =====
const contactForm = document.getElementById('contactForm');
const submitButton = contactForm ? contactForm.querySelector('button[type="submit"]') : null;

if (contactForm && submitButton) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Adicionar estado de loading
        contactForm.classList.add('form-submitting');
        submitButton.classList.add('btn-submitting');
        submitButton.disabled = true;
        
        // Coletar dados do formulário
        const formData = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            telefone: document.getElementById('telefone').value,
            mensagem: document.getElementById('mensagem').value
        };

        // Simular delay para melhor UX (mostrar feedback)
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Salvar mensagem no localStorage para o painel admin
        try {
            const messages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
            const newMessage = {
                id: Date.now(),
                ...formData,
                date: new Date().toISOString(),
                read: false
            };
            messages.push(newMessage);
            localStorage.setItem('contact_messages', JSON.stringify(messages));
        } catch (error) {
            console.error('Erro ao salvar mensagem:', error);
        }

        // Criar mensagem para WhatsApp
        const whatsappMessage = `Olá! Meu nome é ${formData.nome}.\n\nEmail: ${formData.email}\nTelefone: ${formData.telefone}\n\nMensagem: ${formData.mensagem}`;
        const whatsappURL = `https://wa.me/5511913141625?text=${encodeURIComponent(whatsappMessage)}`;
        
        // Remover estado de loading
        contactForm.classList.remove('form-submitting');
        submitButton.classList.remove('btn-submitting');
        submitButton.disabled = false;
        
        // Mostrar mensagem de confirmação
        showFormSuccessMessage(formData.nome);
        
        // Limpar formulário
        contactForm.reset();
        
        // Abrir WhatsApp após um breve delay
        setTimeout(() => {
            window.open(whatsappURL, '_blank');
        }, 2000);
    });
}

// Função para mostrar mensagem de confirmação
function showFormSuccessMessage(nome) {
    // Remover mensagem existente se houver
    const existingMessage = document.querySelector('.form-success-message');
    const existingOverlay = document.querySelector('.form-success-overlay');
    if (existingMessage) existingMessage.remove();
    if (existingOverlay) existingOverlay.remove();
    
    // Criar overlay
    const overlay = document.createElement('div');
    overlay.className = 'form-success-overlay';
    
    // Criar mensagem
    const message = document.createElement('div');
    message.className = 'form-success-message';
    message.innerHTML = `
        <div class="form-success-message-icon">
            <i class="fas fa-check"></i>
        </div>
        <h3>Mensagem Enviada!</h3>
        <p>Olá, <strong>${nome}</strong>! Sua mensagem foi enviada com sucesso.</p>
        <p>Você será redirecionado para o WhatsApp em instantes...</p>
        <button class="btn btn-primary" onclick="closeFormSuccessMessage()" style="margin-top: var(--spacing-md);">
            <i class="fas fa-times"></i>
            <span>Fechar</span>
        </button>
    `;
    
    document.body.appendChild(overlay);
    document.body.appendChild(message);
    
    // Fechar automaticamente após 5 segundos
    setTimeout(() => {
        closeFormSuccessMessage();
    }, 5000);
}

// Função para fechar mensagem de confirmação
function closeFormSuccessMessage() {
    const message = document.querySelector('.form-success-message');
    const overlay = document.querySelector('.form-success-overlay');
    if (message) {
        message.style.animation = 'slideInDown 0.3s ease-out reverse';
        setTimeout(() => message.remove(), 300);
    }
    if (overlay) {
        overlay.style.animation = 'fadeIn 0.3s ease-out reverse';
        setTimeout(() => overlay.remove(), 300);
    }
}

// Tornar função global para uso no onclick
window.closeFormSuccessMessage = closeFormSuccessMessage;

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Remover notificação existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Criar notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    // Adicionar estilos inline
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#00B4A6' : '#FF6B9D'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;

    document.body.appendChild(notification);

    // Remover após 5 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Adicionar animações CSS para notificações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .notification-content i {
        font-size: 1.2rem;
    }
`;
document.head.appendChild(style);

// ===== COUNTER ANIMATION =====
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const text = element.textContent;
    const hasPlus = text.includes('+');
    const hasPercent = text.includes('%');
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + (hasPlus ? '+' : '') + (hasPercent ? '%' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + (hasPlus ? '+' : '') + (hasPercent ? '%' : '');
        }
    }, 16);
}

// Observar stats para animar quando visíveis
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            statsObserver.unobserve(entry.target); // Para de observar após animar
            const statNumber = entry.target.querySelector('.stat-number');
            const text = statNumber.textContent;
            const number = parseInt(text.replace(/\D/g, ''));
            
            if (number && !statNumber.dataset.animated) {
                statNumber.dataset.animated = 'true';
                statNumber.textContent = '0' + (text.includes('+') ? '+' : '') + 
                                        (text.includes('%') ? '%' : '');
                animateCounter(statNumber, number, 2000);
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach(stat => {
    statsObserver.observe(stat);
});

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
let navTicking = false;

function updateActiveNav() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
    navTicking = false;
}

window.addEventListener('scroll', () => {
    if (!navTicking) {
        window.requestAnimationFrame(updateActiveNav);
        navTicking = true;
    }
}, { passive: true });

// ===== LAZY LOADING IMAGES =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img); // Já estava otimizado
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== PREVENT FORM SPAM =====
let lastSubmitTime = 0;
const submitCooldown = 3000; // 3 segundos

contactForm.addEventListener('submit', (e) => {
    const currentTime = Date.now();
    if (currentTime - lastSubmitTime < submitCooldown) {
        e.preventDefault();
        showNotification('Por favor, aguarde alguns segundos antes de enviar novamente.', 'info');
        return false;
    }
    lastSubmitTime = currentTime;
});

// ===== MOBILE MENU CLOSE ON CLICK OUTSIDE =====
document.addEventListener('click', (e) => {
    const isClickInsideNav = navMenu.contains(e.target);
    const isClickOnToggle = menuToggle.contains(e.target);
    
    if (!isClickInsideNav && !isClickOnToggle && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
    }
});

// ===== SMOOTH IMAGE LOADING =====
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', function() {
        this.style.opacity = '1';
    });
    
    if (img.complete) {
        img.style.opacity = '1';
    } else {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    }
});


// ===== DEPOIMENTOS - LER MAIS =====
function initDepoimentosLerMais() {
    const depoimentosTexto = document.querySelectorAll('.depoimento-texto');
    
    if (depoimentosTexto.length === 0) {
        return;
    }
    
    depoimentosTexto.forEach((texto, index) => {
        // Remover qualquer botão existente
        const btnExistente = texto.parentNode.querySelector('.depoimento-ler-mais');
        if (btnExistente) {
            btnExistente.remove();
        }
        
        // Resetar classes
        texto.classList.remove('truncado', 'expandido');
        
        // Aguardar para garantir que o CSS foi aplicado
        setTimeout(() => {
            // Forçar reflow
            void texto.offsetHeight;
            
            // Salvar altura original ANTES de truncar
            const alturaOriginal = texto.scrollHeight;
            
            // Aplicar truncamento temporariamente para medir
            texto.classList.add('truncado');
            void texto.offsetHeight;
            const alturaTruncada = texto.scrollHeight;
            
            // Se a altura original é maior que a truncada, precisa do botão
            if (alturaOriginal > alturaTruncada + 20) {
                // Manter truncado e criar botão
                const lerMaisBtn = document.createElement('span');
                lerMaisBtn.className = 'depoimento-ler-mais';
                lerMaisBtn.innerHTML = 'Ler mais <i class="fas fa-chevron-down"></i>';
                
                // Adicionar evento de clique
                lerMaisBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const isExpanded = texto.classList.contains('expandido');
                    
                    if (isExpanded) {
                        // Colapsar
                        texto.classList.remove('expandido');
                        texto.classList.add('truncado');
                        lerMaisBtn.innerHTML = 'Ler mais <i class="fas fa-chevron-down"></i>';
                        lerMaisBtn.classList.remove('expandido');
                    } else {
                        // Expandir
                        texto.classList.remove('truncado');
                        texto.classList.add('expandido');
                        lerMaisBtn.innerHTML = 'Ler menos <i class="fas fa-chevron-up"></i>';
                        lerMaisBtn.classList.add('expandido');
                    }
                });
                
                // Inserir o botão logo após o texto
                texto.insertAdjacentElement('afterend', lerMaisBtn);
            } else {
                // Não precisa truncar, remover classe
                texto.classList.remove('truncado');
            }
        }, index * 150);
    });
}

// Executar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initDepoimentosLerMais, 500);
        setTimeout(initDepoimentosLerMais, 1000);
    });
} else {
    // DOM já carregado
    setTimeout(initDepoimentosLerMais, 100);
    setTimeout(initDepoimentosLerMais, 500);
}

// ===== LOADING SKELETON PARA IMAGENS =====
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.complete) {
                    img.classList.add('loaded');
                } else {
                    img.addEventListener('load', () => {
                        img.classList.add('loaded');
                    });
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
});

// ===== MICROINTERAÇÕES NOS BOTÕES (RIPPLE EFFECT) =====
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn, button, a.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Ripple effect já está no CSS via ::before
            // Adicionar feedback tátil adicional
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
});

// ===== CONSOLE MESSAGE =====
console.log('%c👋 Olá! Bem-vindo ao site da Dra. Nadia!', 'color: #00B4A6; font-size: 20px; font-weight: bold;');
console.log('%cSite desenvolvido com carinho para cuidar do sorriso das crianças! 😊', 'color: #FF6B9D; font-size: 14px;');
