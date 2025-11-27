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
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 120;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: Math.max(0, offsetPosition),
                behavior: 'smooth'
            });
        }
    });
});


// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target); // Para de observar após animar
        }
    });
}, observerOptions);

// Animar elementos ao scrollar
const animateElements = document.querySelectorAll('.servico-card, .sobre-item, .porque-card, .info-card, .diferencial-card, .feature-item, .dica-card');
animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
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

// ===== DICAS - LER MAIS =====
const dicasLerMaisBtn = document.getElementById('dicasLerMais');
const dicasHidden = document.querySelectorAll('.dica-card.dica-hidden');
const dicasMoreContainer = document.querySelector('.dicas-more-container');

if (dicasLerMaisBtn && dicasHidden.length > 0) {
    dicasLerMaisBtn.addEventListener('click', () => {
        dicasHidden.forEach((dica, index) => {
            setTimeout(() => {
                dica.classList.add('show');
            }, index * 100);
        });
        
        // Esconder botão após mostrar todas
        setTimeout(() => {
            dicasMoreContainer.classList.add('hidden');
        }, dicasHidden.length * 100 + 300);
    });
} else if (dicasHidden.length === 0 && dicasMoreContainer) {
    // Se não houver dicas ocultas, esconder o botão
    dicasMoreContainer.classList.add('hidden');
}

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

// ===== FORM SUBMISSION =====
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Coletar dados do formulário
    const formData = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        mensagem: document.getElementById('mensagem').value
    };

    // Criar mensagem para WhatsApp
    const whatsappMessage = `Olá! Meu nome é ${formData.nome}.\n\nEmail: ${formData.email}\nTelefone: ${formData.telefone}\n\nMensagem: ${formData.mensagem}`;
    const whatsappURL = `https://wa.me/5511913141625?text=${encodeURIComponent(whatsappMessage)}`;
    
    // Abrir WhatsApp
    window.open(whatsappURL, '_blank');
    
    // Mostrar mensagem de sucesso
    showNotification('Mensagem enviada! Redirecionando para o WhatsApp...', 'success');
    
    // Limpar formulário
    contactForm.reset();
});

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

// ===== FAQ ACCORDION =====
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Fechar todos os outros
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });
        
        // Toggle do item atual
        item.classList.toggle('active', !isActive);
    });
});

// ===== DICA MODAL =====
const dicaCards = document.querySelectorAll('.dica-card');
const dicaModal = document.getElementById('dicaModal');
const dicaModalClose = document.getElementById('dicaModalClose');
const dicaModalOverlay = document.getElementById('dicaModalOverlay');
const dicaModalBody = document.getElementById('dicaModalBody');

// Conteúdo detalhado de cada dica
const dicasDetalhadas = {
    'primeira-consulta': {
        titulo: 'Primeira Consulta',
        tag: 'Importante',
        imagem: 'images/dentista-examinando-condicao-dos-dentes-pequeno-paciente-editado.jpg',
        conteudo: `
            <h4>Por que a primeira consulta é tão importante?</h4>
            <p>A primeira consulta odontológica é um marco fundamental na vida da criança. Ela deve acontecer quando o primeiro dente nasce ou até o primeiro aniversário da criança, conforme recomendação da Associação Brasileira de Odontopediatria.</p>
            
            <h4>O que acontece na primeira consulta?</h4>
            <ul>
                <li><strong>Exame clínico:</strong> Avaliação da saúde bucal, desenvolvimento dos dentes e gengivas</li>
                <li><strong>Orientação aos pais:</strong> Explicação sobre higiene bucal, alimentação e cuidados preventivos</li>
                <li><strong>Prevenção:</strong> Identificação precoce de possíveis problemas</li>
                <li><strong>Adaptação:</strong> A criança se familiariza com o ambiente odontológico de forma positiva</li>
            </ul>
            
            <h4>Benefícios de começar cedo:</h4>
            <ul>
                <li>Previne o desenvolvimento de cáries e outros problemas</li>
                <li>Cria hábitos saudáveis desde cedo</li>
                <li>Estabelece uma relação positiva com o dentista</li>
                <li>Economiza tempo e dinheiro com tratamentos futuros</li>
            </ul>
            
            <p><strong>Lembre-se:</strong> Quanto mais cedo a primeira consulta, melhor para a saúde bucal do seu filho!</p>
        `
    },
    'escovacao': {
        titulo: 'Escovação Correta',
        tag: 'Higiene',
        imagem: 'images/retrato-de-crianca-segurando-o-icone-de-papel-editado.jpg',
        conteudo: `
            <h4>A importância da escovação correta</h4>
            <p>A escovação adequada é a base da saúde bucal. Quando feita corretamente desde cedo, previne cáries, gengivite e outros problemas dentários.</p>
            
            <h4>Como escolher a escova ideal?</h4>
            <ul>
                <li><strong>Cerdas macias:</strong> Escolha sempre escovas com cerdas macias para não machucar a gengiva</li>
                <li><strong>Tamanho adequado:</strong> A cabeça da escova deve ser pequena o suficiente para alcançar todos os dentes</li>
                <li><strong>Troca regular:</strong> Troque a escova a cada 3 meses ou quando as cerdas estiverem desgastadas</li>
            </ul>
            
            <h4>Quantidade de creme dental:</h4>
            <ul>
                <li><strong>0 a 3 anos:</strong> Quantidade equivalente a um grão de arroz</li>
                <li><strong>3 a 6 anos:</strong> Quantidade equivalente a um grão de ervilha</li>
                <li><strong>Acima de 6 anos:</strong> Quantidade equivalente a um grão de feijão</li>
            </ul>
            
            <h4>Frequência e técnica:</h4>
            <ul>
                <li>Escove pelo menos 2 vezes ao dia (manhã e antes de dormir)</li>
                <li>Ideal: após cada refeição</li>
                <li>Use movimentos suaves e circulares</li>
                <li>Não esqueça de escovar a língua</li>
                <li>Supervisione a escovação até os 8-9 anos</li>
            </ul>
            
            <p><strong>Dica:</strong> Torne a escovação uma atividade divertida! Use músicas, histórias ou cronômetros para tornar o momento mais agradável.</p>
        `
    },
    'alimentacao': {
        titulo: 'Alimentação Saudável',
        tag: 'Prevenção',
        imagem: 'images/vista-superior-de-uma-variedade-de-vegetais-em-um-saco-de-papel-editado.jpg',
        conteudo: `
            <h4>A relação entre alimentação e saúde bucal</h4>
            <p>A alimentação tem um papel fundamental na saúde bucal das crianças. Uma dieta equilibrada previne cáries e fortalece os dentes.</p>
            
            <h4>Alimentos que fazem bem aos dentes:</h4>
            <ul>
                <li><strong>Frutas e legumes:</strong> Maçã, cenoura e outros alimentos crocantes ajudam a limpar os dentes naturalmente</li>
                <li><strong>Laticínios:</strong> Leite, queijo e iogurte são ricos em cálcio, essencial para dentes fortes</li>
                <li><strong>Água:</strong> A melhor bebida para os dentes, ajuda a limpar a boca e manter a hidratação</li>
                <li><strong>Alimentos ricos em fósforo:</strong> Peixes, ovos e carnes magras</li>
            </ul>
            
            <h4>Alimentos que devem ser evitados:</h4>
            <ul>
                <li><strong>Açúcares:</strong> Doces, balas, chocolates e refrigerantes</li>
                <li><strong>Alimentos pegajosos:</strong> Balas de goma, chicletes e frutas secas</li>
                <li><strong>Refrigerantes:</strong> Contêm ácidos que desgastam o esmalte dos dentes</li>
            </ul>
            
            <h4>Dicas importantes:</h4>
            <ul>
                <li>Evite açúcares especialmente antes de dormir</li>
                <li>Prefira lanches saudáveis entre as refeições</li>
                <li>Se consumir doces, faça logo após as refeições principais</li>
                <li>Escove os dentes após consumir alimentos açucarados</li>
                <li>Limite o consumo de sucos, mesmo os naturais</li>
            </ul>
            
            <p><strong>Lembre-se:</strong> Uma alimentação equilibrada é fundamental para dentes saudáveis e um sorriso bonito!</p>
        `
    },
    'fluor': {
        titulo: 'Flúor e Selantes',
        tag: 'Proteção',
        imagem: 'images/2025-11-10-editado.webp',
        conteudo: `
            <h4>Flúor: proteção essencial</h4>
            <p>O flúor é um mineral natural que fortalece o esmalte dos dentes, tornando-os mais resistentes às cáries. É uma das formas mais eficazes de prevenção.</p>
            
            <h4>Como o flúor funciona?</h4>
            <ul>
                <li>Fortalece o esmalte dos dentes</li>
                <li>Repara pequenas lesões antes que se tornem cáries</li>
                <li>Reduz a capacidade das bactérias de produzirem ácidos</li>
                <li>Pode ser aplicado topicamente ou ingerido (água fluoretada)</li>
            </ul>
            
            <h4>Selantes dentários:</h4>
            <p>Os selantes são uma camada protetora aplicada nas superfícies de mastigação dos dentes posteriores (molares e pré-molares), onde as cáries são mais comuns.</p>
            
            <ul>
                <li><strong>Quando aplicar:</strong> Assim que os dentes permanentes nascem (geralmente entre 6-12 anos)</li>
                <li><strong>Duração:</strong> Podem durar até 10 anos com cuidados adequados</li>
                <li><strong>Benefícios:</strong> Reduzem em até 80% o risco de cáries nas superfícies tratadas</li>
            </ul>
            
            <h4>Quando usar cada proteção?</h4>
            <ul>
                <li><strong>Flúor:</strong> Indicado para todas as idades, através de creme dental, água fluoretada ou aplicação profissional</li>
                <li><strong>Selantes:</strong> Indicados principalmente para crianças com alto risco de cáries ou quando os dentes permanentes nascem</li>
            </ul>
            
            <p><strong>Importante:</strong> Converse com o odontopediatra sobre a melhor estratégia de prevenção para o seu filho. Cada criança tem necessidades específicas!</p>
        `
    },
    'traumatismo': {
        titulo: 'Traumatismo Dental',
        tag: 'Emergência',
        imagem: 'images/2025-11-21-editado.webp',
        conteudo: `
            <h4>O que fazer em caso de traumatismo dental?</h4>
            <p>Traumatismos dentais são muito comuns na infância, especialmente durante brincadeiras e atividades esportivas. Saber como agir rapidamente pode salvar o dente!</p>
            
            <h4>Primeiros socorros imediatos:</h4>
            <ul>
                <li><strong>Mantenha a calma:</strong> Tranquilize a criança</li>
                <li><strong>Controle o sangramento:</strong> Use gaze ou pano limpo para pressionar suavemente</li>
                <li><strong>Se o dente saiu completamente:</strong> Encontre o dente e segure pela coroa (parte branca), nunca pela raiz</li>
                <li><strong>Limpe suavemente:</strong> Lave o dente apenas com água ou soro fisiológico, sem esfregar</li>
                <li><strong>Conserve adequadamente:</strong> Coloque em leite, soro fisiológico ou saliva da própria criança</li>
            </ul>
            
            <h4>O que NÃO fazer:</h4>
            <ul>
                <li>Não limpe o dente com escova ou produtos químicos</li>
                <li>Não toque na raiz do dente</li>
                <li>Não deixe o dente secar</li>
                <li>Não tente recolocar o dente sozinho se não tiver certeza</li>
            </ul>
            
            <h4>Procure atendimento imediato se:</h4>
            <ul>
                <li>O dente saiu completamente (avulsão)</li>
                <li>O dente está quebrado ou lascado</li>
                <li>Há sangramento que não para</li>
                <li>A criança está com muita dor</li>
                <li>O dente mudou de posição</li>
            </ul>
            
            <h4>Importante:</h4>
            <p>O tempo é crucial! Quanto mais rápido o atendimento, maiores as chances de sucesso no tratamento. Procure um odontopediatra imediatamente ou vá a um pronto-socorro odontológico.</p>
            
            <p><strong>Prevenção:</strong> Use protetores bucais durante atividades esportivas e supervisione brincadeiras mais arriscadas.</p>
        `
    },
    'consultas': {
        titulo: 'Consultas Regulares',
        tag: 'Rotina',
        imagem: 'images/2024-12-06-editado.webp',
        conteudo: `
            <h4>Por que consultas regulares são essenciais?</h4>
            <p>As consultas periódicas ao odontopediatra são fundamentais para manter a saúde bucal da criança e prevenir problemas antes que se tornem mais sérios.</p>
            
            <h4>Frequência recomendada:</h4>
            <ul>
                <li><strong>Consulta preventiva:</strong> A cada 6 meses para a maioria das crianças</li>
                <li><strong>Alto risco de cáries:</strong> A cada 3-4 meses</li>
                <li><strong>Tratamento em andamento:</strong> Conforme orientação do odontopediatra</li>
            </ul>
            
            <h4>O que acontece em uma consulta regular?</h4>
            <ul>
                <li><strong>Exame clínico completo:</strong> Avaliação de dentes, gengivas e desenvolvimento</li>
                <li><strong>Limpeza profissional:</strong> Remoção de placa e tártaro</li>
                <li><strong>Aplicação de flúor:</strong> Quando necessário</li>
                <li><strong>Orientações:</strong> Atualização sobre técnicas de higiene e cuidados</li>
                <li><strong>Radiografias:</strong> Quando necessário para diagnóstico</li>
            </ul>
            
            <h4>Benefícios das consultas regulares:</h4>
            <ul>
                <li>Prevenção de cáries e outros problemas</li>
                <li>Detecção precoce de problemas ortodônticos</li>
                <li>Manutenção da saúde bucal</li>
                <li>Educação contínua para pais e crianças</li>
                <li>Economia com tratamentos mais complexos no futuro</li>
                <li>Criação de hábito positivo de cuidado com a saúde</li>
            </ul>
            
            <h4>Dicas para tornar as consultas mais agradáveis:</h4>
            <ul>
                <li>Explique de forma positiva o que vai acontecer</li>
                <li>Evite usar palavras que causem medo</li>
                <li>Recompense a criança após a consulta</li>
                <li>Mantenha uma rotina regular de consultas</li>
            </ul>
            
            <p><strong>Lembre-se:</strong> A prevenção é sempre melhor e mais econômica que o tratamento. Mantenha as consultas em dia!</p>
        `
    }
};

// Abrir modal ao clicar na dica
dicaCards.forEach(card => {
    const dicaBtn = card.querySelector('.dica-btn');
    const dicaId = card.getAttribute('data-dica');
    
    [card, dicaBtn].forEach(element => {
        if (element) {
            element.addEventListener('click', (e) => {
                e.stopPropagation();
                if (dicasDetalhadas[dicaId]) {
                    openDicaModal(dicasDetalhadas[dicaId]);
                }
            });
        }
    });
});

function openDicaModal(dica) {
    // Adiciona timestamp para evitar cache e força recarregamento
    const imageUrl = `${dica.imagem}?v=${Date.now()}&nocache=${Math.random()}`;
    dicaModalBody.innerHTML = `
        <div class="dica-modal-image">
            <img src="${imageUrl}" alt="${dica.titulo}" loading="eager">
        </div>
        <div class="dica-modal-header">
            <div class="dica-tag">${dica.tag}</div>
            <h2>${dica.titulo}</h2>
        </div>
        <div class="dica-modal-content-text">
            ${dica.conteudo}
        </div>
    `;
    dicaModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeDicaModal() {
    dicaModal.classList.remove('active');
    document.body.style.overflow = '';
}

dicaModalClose.addEventListener('click', closeDicaModal);
dicaModalOverlay.addEventListener('click', closeDicaModal);

// Fechar modal com ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dicaModal.classList.contains('active')) {
        closeDicaModal();
    }
});

// ===== CONSOLE MESSAGE =====
console.log('%c👋 Olá! Bem-vindo ao site da Dra. Nadia!', 'color: #00B4A6; font-size: 20px; font-weight: bold;');
console.log('%cSite desenvolvido com carinho para cuidar do sorriso das crianças! 😊', 'color: #FF6B9D; font-size: 14px;');
