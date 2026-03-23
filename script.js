/**
 * Life 80+ - JavaScript Principal
 * Site Premium de Envelhecimento Ativo
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar AOS (Animate on Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50
    });

    // Inicializar todas as funcionalidades
    initParticles();
    initNavbar();
    initAccessibility();
    initStats();
    initOficinasFilter();
    initContactForm();
    initSmoothScroll();
});

/* ========================================
   PARTÍCULAS FLUTUANTES
   ======================================== */
function initParticles() {
    const container = document.getElementById('particlesContainer');
    if (!container) return;
    
    // Verificar preferência de movimento reduzido
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }
    
    // Criar partículas iniciais
    for (let i = 0; i < 6; i++) {
        setTimeout(() => createParticle(container), i * 400);
    }
    
    // Criar partículas periodicamente
    setInterval(() => {
        if (document.hidden) return;
        createParticle(container);
    }, 4000);
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Posição aleatória
    particle.style.left = Math.random() * 100 + '%';
    
    // Tamanho aleatório
    const size = 8 + Math.random() * 12;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    // Duração aleatória
    const duration = 10 + Math.random() * 8;
    particle.style.animationDuration = duration + 's';
    
    container.appendChild(particle);
    
    // Remover após animação
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, duration * 1000);
}

/* ========================================
   NAVBAR SCROLL EFFECT
   ======================================== */
function initNavbar() {
    const navbar = document.getElementById('mainNav');
    if (!navbar) return;
    
    function handleScroll() {
        if (window.pageYOffset > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    // Throttle scroll events
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Verificar estado inicial
    handleScroll();
    
    // Fechar menu mobile ao clicar em link
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.getElementById('navbarNav');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) bsCollapse.hide();
            }
        });
    });
}

/* ========================================
   ACESSIBILIDADE
   ======================================== */
function initAccessibility() {
    const fabToggle = document.getElementById('fabToggle');
    const fabOptions = document.getElementById('fabOptions');
    const increaseFontBtn = document.getElementById('increaseFontBtn');
    const decreaseFontBtn = document.getElementById('decreaseFontBtn');
    
    if (!fabToggle || !fabOptions) return;
    
    let currentFontSize = parseInt(localStorage.getItem('fontSize')) || 1;
    
    // Aplicar configurações salvas
    updateFontSize(currentFontSize);
    
    // Toggle painel de acessibilidade
    fabToggle.addEventListener('click', function() {
        fabOptions.classList.toggle('active');
    });
    
    // Fechar ao clicar fora
    document.addEventListener('click', function(e) {
        if (!fabToggle.contains(e.target) && !fabOptions.contains(e.target)) {
            fabOptions.classList.remove('active');
        }
    });
    
    // Aumentar fonte
    if (increaseFontBtn) {
        increaseFontBtn.addEventListener('click', function() {
            if (currentFontSize < 5) {
                currentFontSize++;
                updateFontSize(currentFontSize);
                localStorage.setItem('fontSize', currentFontSize);
            }
        });
    }
    
    // Diminuir fonte
    if (decreaseFontBtn) {
        decreaseFontBtn.addEventListener('click', function() {
            if (currentFontSize > 1) {
                currentFontSize--;
                updateFontSize(currentFontSize);
                localStorage.setItem('fontSize', currentFontSize);
            }
        });
    }
}

function updateFontSize(size) {
    const html = document.documentElement;
    
    // Remover classes anteriores
    for (let i = 1; i <= 5; i++) {
        html.classList.remove('font-size-' + i);
    }
    
    // Adicionar nova classe
    html.classList.add('font-size-' + size);
}

/* ========================================
   CONTADOR DE ESTATÍSTICAS
   ======================================== */
function initStats() {
    const stats = document.querySelectorAll('.stat-value');
    if (!stats.length) return;
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    stats.forEach(stat => observer.observe(stat));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (target - start) * easeOutQuart);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }
    
    requestAnimationFrame(update);
}

/* ========================================
   FILTRO DE OFICINAS
   ======================================== */
function initOficinasFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const oficinasGrid = document.getElementById('oficinasGrid');
    
    if (!filterBtns.length || !oficinasGrid) return;
    
    const oficinas = oficinasGrid.querySelectorAll('[data-category]');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Atualizar botão ativo
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filtrar cards
            oficinas.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.display = '';
                } else {
                    card.classList.add('hidden');
                    card.style.display = 'none';
                }
            });
            
            // Reinicializar AOS para os elementos visíveis
            AOS.refresh();
        });
    });
}

/* ========================================
   FORMULÁRIO DE CONTATO (WhatsApp)
   ======================================== */
function initContactForm() {
    const form = document.getElementById('whatsappForm');
    if (!form) return;
    
    const steps = form.querySelectorAll('.form-step');
    const progressBar = document.getElementById('progressBar');
    const totalSteps = steps.length;
    let currentStep = 1;
    
    // Botões de navegação
    const nextBtns = form.querySelectorAll('.btn-next');
    const prevBtns = form.querySelectorAll('.btn-prev');
    const submitBtn = document.getElementById('submitBtn');
    
    function showStep(stepNumber) {
        steps.forEach(step => {
            const stepNum = parseInt(step.getAttribute('data-step'));
            step.classList.toggle('active', stepNum === stepNumber);
        });
        
        // Atualizar barra de progresso
        const progress = (stepNumber / totalSteps) * 100;
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
        
        currentStep = stepNumber;
    }
    
    // Próximo step
    nextBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const nextStep = parseInt(this.getAttribute('data-next'));
            
            // Validar step atual
            if (validateStep(currentStep)) {
                showStep(nextStep);
            }
        });
    });
    
    // Step anterior
    prevBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const prevStep = parseInt(this.getAttribute('data-prev'));
            showStep(prevStep);
        });
    });
    
    // Enviar via WhatsApp
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            if (!validateStep(currentStep)) return;
            
            // Capturar dados
            const nome = document.getElementById('nome').value.trim();
            const interesses = form.querySelectorAll('input[name="interesse"]:checked');
            const tipo = form.querySelector('input[name="tipo"]:checked');
            
            // Montar lista de interesses
            let listaInteresses = '';
            interesses.forEach(item => {
                listaInteresses += `• ${item.value}\n`;
            });
            
            if (!listaInteresses) {
                listaInteresses = '• Informações Gerais\n';
            }
            
            // Configuração da mensagem
            const numeroTelefone = '5561999999999'; // Substituir pelo número real
            const saudacao = `Olá! Meu nome é *${nome}*.\n\n`;
            const tipoInfo = tipo ? `Perfil: *${tipo.value}*\n\n` : '';
            const corpoMensagem = `Gostaria de participar do projeto *Life 80+*.\n\n${tipoInfo}Meus interesses:\n${listaInteresses}`;
            
            // Codificar URL
            const mensagemFinal = encodeURIComponent(saudacao + corpoMensagem);
            const urlWhatsApp = `https://wa.me/${numeroTelefone}?text=${mensagemFinal}`;
            
            // Abrir WhatsApp
            window.open(urlWhatsApp, '_blank');
            
            // Feedback visual
            showSuccessMessage();
        });
    }
    
    function validateStep(step) {
        const currentStepEl = form.querySelector(`.form-step[data-step="${step}"]`);
        
        if (step === 1) {
            const nome = document.getElementById('nome');
            if (!nome.value.trim()) {
                nome.focus();
                shakeElement(nome);
                return false;
            }
        }
        
        if (step === 3) {
            const tipo = form.querySelector('input[name="tipo"]:checked');
            if (!tipo) {
                const radioGroup = currentStepEl.querySelector('.radio-grid');
                shakeElement(radioGroup);
                return false;
            }
        }
        
        return true;
    }
    
    function shakeElement(element) {
        element.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }
    
    function showSuccessMessage() {
        const formCard = document.querySelector('.contato-card');
        formCard.innerHTML = `
            <div class="text-center py-5">
                <div style="width: 100px; height: 100px; background: linear-gradient(135deg, #25D366, #128C7E); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 2rem;">
                    <i class="bi bi-check-lg" style="font-size: 3rem; color: white;"></i>
                </div>
                <h3 class="section-title" style="font-size: 2rem; margin-bottom: 1rem;">Mensagem Preparada!</h3>
                <p style="font-size: 1.125rem; color: #64748B; margin-bottom: 2rem;">
                    O WhatsApp foi aberto com sua mensagem.<br>Basta enviar!
                </p>
                <button type="button" class="btn btn-golden btn-lg" onclick="location.reload()">
                    <i class="bi bi-arrow-repeat me-2"></i>Enviar Nova Mensagem
                </button>
            </div>
        `;
    }
}

/* ========================================
   SMOOTH SCROLL
   ======================================== */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const navbarHeight = document.getElementById('mainNav').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}
