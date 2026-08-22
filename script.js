/* ==========================================================================
   WILLIAN ELETRICISTA - JAVASCRIPT ENGINE (3D CANVAS, TILT & INTERACTIVITY)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. CANVAS 3D INTERATIVO DE PARTÍCULAS / REDE ELÉTRICA (HERO BACKGROUND - DESKTOP ONLY)
    // ==========================================================================
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        let animationId = null;
        
        let mouse = { x: width / 2, y: height / 2, active: false };

        const isDesktop = () => window.innerWidth >= 768;

        window.addEventListener('mousemove', (e) => {
            if (!isDesktop()) return;
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            mouse.active = true;
        });

        // Configuração dos nós de energia
        const numParticles = 65;
        const particles = [];

        for (let i = 0; i < numParticles; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                radius: Math.random() * 2 + 1,
                color: Math.random() > 0.3 ? '#FFD700' : '#00E5FF'
            });
        }

        function animateCanvas() {
            if (!isDesktop()) {
                ctx.clearRect(0, 0, width, height);
                return;
            }

            ctx.clearRect(0, 0, width, height);

            // Atualiza e desenha partículas
            for (let i = 0; i < particles.length; i++) {
                let p = particles[i];
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();

                // Conexão entre partículas próximas (Simulação de faíscas/arcos elétricos)
                for (let j = i + 1; j < particles.length; j++) {
                    let p2 = particles[j];
                    let dx = p.x - p2.x;
                    let dy = p.y - p2.y;
                    let dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = p.color === '#FFD700' ? `rgba(255, 215, 0, ${1 - dist / 120})` : `rgba(0, 229, 255, ${1 - dist / 120})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }

                // Reação com o mouse
                if (mouse.active) {
                    let mdx = p.x - mouse.x;
                    let mdy = p.y - mouse.y;
                    let mdist = Math.sqrt(mdx * mdx + mdy * mdy);

                    if (mdist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.strokeStyle = `rgba(255, 215, 0, ${0.8 - mdist / 150})`;
                        ctx.lineWidth = 1.2;
                        ctx.stroke();
                    }
                }
            }

            animationId = requestAnimationFrame(animateCanvas);
        }

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            if (isDesktop()) {
                if (!animationId) animateCanvas();
            } else {
                if (animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
                ctx.clearRect(0, 0, width, height);
            }
        });

        if (isDesktop()) {
            animateCanvas();
        }
    }

    // ==========================================================================
    // 2. EFEITO TILT 3D NOS CARDS (PERSPECTIVA INTERATIVA - APENAS COM MOUSE)
    // ==========================================================================
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const tiltCards = document.querySelectorAll('.tilt-card-3d');
        
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -8; // Máximo 8 graus
                const rotateY = ((x - centerX) / centerX) * 8;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
            });
        });
    }

    // ==========================================================================
    // 3. ROLETA DE FOTOS E VÍDEOS (6 EM 6) COM LIGHTBOX E NAVEGAÇÃO
    // ==========================================================================
    const galleryGrid = document.getElementById('galleryGrid');
    const galleryViewport = document.getElementById('galleryViewport');
    const galleryPrevBtn = document.getElementById('galleryPrevBtn');
    const galleryNextBtn = document.getElementById('galleryNextBtn');
    const galleryIndicators = document.getElementById('galleryIndicators');
    const currentPageNum = document.getElementById('currentPageNum');
    const totalPagesNum = document.getElementById('totalPagesNum');
    const lightbox = document.getElementById('lightbox');
    const lightboxContent = document.getElementById('lightboxContent');
    const closeLightbox = document.querySelector('.close-lightbox');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Catálogo estruturado com títulos descritivos para SEO Local
    const totalImagens = 24;
    const totalVideos = 5;

    const regioes = ['Francisco Morato', 'Franco da Rocha', 'Caieiras', 'Campo Limpo Paulista', 'Botujuru', 'Mairiporã'];
    const tiposServicos = [
        'Quadro de Distribuição Montado', 
        'Troca de Fiação Residencial', 
        'Instalação de Chuveiro Seguro', 
        'Iluminação LED de Alto Padrão', 
        'Manutenção de Curto-Circuito', 
        'Padrão de Entrada Enel'
    ];

    // Montagem da lista completa de itens (Fotos e Vídeos)
    const galleryItems = [];

    for (let i = 1; i <= totalImagens; i++) {
        const regiao = regioes[(i - 1) % regioes.length];
        const servico = tiposServicos[(i - 1) % tiposServicos.length];
        galleryItems.push({
            id: `foto-${i}`,
            type: 'foto',
            src: `assets/img/imagem${i}.jpeg`,
            alt: `Serviço de Eletricista: ${servico} em ${regiao} - Foto ${i}`,
            title: `${servico} (${regiao})`
        });
    }

    for (let i = 1; i <= totalVideos; i++) {
        const regiao = regioes[(i - 1) % regioes.length];
        galleryItems.push({
            id: `video-${i}`,
            type: 'video',
            src: `assets/videos/video${i}.mp4`,
            poster: `assets/videos/video${i}.mp4#t=0.5`,
            alt: `Vídeo de Execução Elétrica em ${regiao} - Obra ${i}`,
            title: `Vídeo de Obra Executada (${regiao})`
        });
    }

    let currentFilter = 'all';
    let currentPage = 0;
    const itemsPerPage = 6; // Exibição estrita de 6 em 6

    function getFilteredItems() {
        if (currentFilter === 'all') return galleryItems;
        return galleryItems.filter(item => item.type === currentFilter);
    }

    function renderRoulette() {
        if (!galleryGrid) return;

        const filtered = getFilteredItems();
        const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;

        if (currentPage >= totalPages) currentPage = totalPages - 1;
        if (currentPage < 0) currentPage = 0;

        const startIndex = currentPage * itemsPerPage;
        const pageItems = filtered.slice(startIndex, startIndex + itemsPerPage);

        // Limpa e renderiza os 6 itens da página atual com animação
        galleryGrid.innerHTML = '';
        galleryGrid.style.animation = 'none';
        void galleryGrid.offsetHeight; // Força reflow para reiniciar animação CSS
        galleryGrid.style.animation = 'roulettePageIn 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)';

        pageItems.forEach(item => {
            const card = document.createElement('div');
            card.className = `gallery-item ${item.type}`;
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', item.title || item.alt);

            if (item.type === 'foto') {
                card.innerHTML = `<img src="${item.src}" alt="${item.alt}" loading="lazy" decoding="async">`;
                card.addEventListener('click', () => {
                    openLightbox(`<img src="${item.src}" alt="${item.alt}">`);
                });
            } else {
                card.innerHTML = `
                    <video src="${item.poster}" preload="metadata" muted playsinline></video>
                    <div class="play-overlay">
                        <div class="play-icon-badge">▶</div>
                    </div>
                `;
                card.addEventListener('click', () => {
                    openLightbox(`<video src="${item.src}" controls autoplay playsinline style="width: 100%; max-height: 80vh; border-radius: 12px;"></video>`);
                });
            }

            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });

            galleryGrid.appendChild(card);
        });

        // Atualiza indicadores de texto
        if (currentPageNum) currentPageNum.textContent = currentPage + 1;
        if (totalPagesNum) totalPagesNum.textContent = totalPages;

        // Atualiza estado dos botões da roleta
        if (galleryPrevBtn) {
            galleryPrevBtn.disabled = (currentPage === 0);
            galleryPrevBtn.classList.toggle('disabled', currentPage === 0);
        }
        if (galleryNextBtn) {
            galleryNextBtn.disabled = (currentPage === totalPages - 1);
            galleryNextBtn.classList.toggle('disabled', currentPage === totalPages - 1);
        }

        // Renderiza dots/indicadores
        if (galleryIndicators) {
            galleryIndicators.innerHTML = '';
            for (let i = 0; i < totalPages; i++) {
                const dot = document.createElement('button');
                dot.className = `roulette-dot ${i === currentPage ? 'active' : ''}`;
                dot.setAttribute('aria-label', `Ir para página ${i + 1}`);
                dot.addEventListener('click', () => {
                    currentPage = i;
                    renderRoulette();
                });
                galleryIndicators.appendChild(dot);
            }
        }
    }

    // Navegação por Botões
    if (galleryPrevBtn) {
        galleryPrevBtn.addEventListener('click', () => {
            if (currentPage > 0) {
                currentPage--;
                renderRoulette();
            }
        });
    }

    if (galleryNextBtn) {
        galleryNextBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(getFilteredItems().length / itemsPerPage);
            if (currentPage < totalPages - 1) {
                currentPage++;
                renderRoulette();
            }
        });
    }

    // Navegação por Gesto de Arraste/Swipe no Mobile
    let touchStartX = 0;
    let touchEndX = 0;

    const targetSwipe = galleryViewport || galleryGrid;
    if (targetSwipe) {
        targetSwipe.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        targetSwipe.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }

    function handleSwipe() {
        const threshold = 45;
        const totalPages = Math.ceil(getFilteredItems().length / itemsPerPage);

        if (touchEndX < touchStartX - threshold) {
            // Swipe para a esquerda -> Avançar
            if (currentPage < totalPages - 1) {
                currentPage++;
                renderRoulette();
            }
        } else if (touchEndX > touchStartX + threshold) {
            // Swipe para a direita -> Voltar
            if (currentPage > 0) {
                currentPage--;
                renderRoulette();
            }
        }
    }

    // Inicialização da Galeria
    renderRoulette();

    // Lightbox Controls
    function openLightbox(conteudo) {
        if (lightbox && lightboxContent) {
            lightboxContent.innerHTML = conteudo;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function fecharLightbox() {
        if (lightbox && lightboxContent) {
            lightbox.classList.remove('active');
            lightboxContent.innerHTML = '';
            document.body.style.overflow = 'auto';
        }
    }

    if (closeLightbox) closeLightbox.addEventListener('click', fecharLightbox);
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) fecharLightbox();
        });
    }

    // Filtros de Galeria
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            currentFilter = btn.getAttribute('data-filter') || 'all';
            currentPage = 0; // Volta para a primeira página da roleta no novo filtro
            renderRoulette();
        });
    });

    // ==========================================================================
    // 4. FAQ ACCORDION
    // ==========================================================================
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        if (questionBtn) {
            questionBtn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Fecha outros abertos
                faqItems.forEach(otherItem => otherItem.classList.remove('active'));
                
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

    // ==========================================================================
    // 5. MENU MOBILE DRAWER TOGGLE
    // ==========================================================================
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('nav-menu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Fechar menu ao clicar num link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

});

// ==========================================================================
// 6. GERADOR DE MENSAGEM DO WHATSAPP (DIAGNOSTIC WIDGET)
// ==========================================================================
function enviarWhatsappDiagnostic() {
    const serviceSelect = document.getElementById('serviceType');
    const citySelect = document.getElementById('userCity');

    const servico = serviceSelect ? serviceSelect.value : 'Atendimento Elétrico';
    const cidade = citySelect ? citySelect.value : 'Francisco Morato';

    const textoMensagem = `Olá Willian! Vim pelo seu site. Gostaria de solicitar um orçamento para: *${servico}* na cidade de *${cidade}*. Poderia me passar mais detalhes?`;
    
    const url = `https://wa.me/5511932184544?text=${encodeURIComponent(textoMensagem)}`;
    window.open(url, '_blank');
}