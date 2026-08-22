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
    // 3. GALERIA DE FOTOS E VÍDEOS COM OTIMIZAÇÃO (LAZY LOADING)
    // ==========================================================================
    const galleryGrid = document.getElementById('galleryGrid');
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

    if (galleryGrid) {
        // Gerar Imagens no Grid com Lazy Loading e SEO ALTs
        for (let i = 1; i <= totalImagens; i++) {
            const div = document.createElement('div');
            div.className = 'gallery-item foto';
            
            const regiao = regioes[(i - 1) % regioes.length];
            const servico = tiposServicos[(i - 1) % tiposServicos.length];
            const altText = `Serviço de Eletricista: ${servico} em ${regiao} - Foto ${i}`;
            
            div.innerHTML = `<img src="assets/img/imagem${i}.jpeg" alt="${altText}" loading="lazy" decoding="async">`;
            
            div.addEventListener('click', () => {
                openLightbox(`<img src="assets/img/imagem${i}.jpeg" alt="${altText}">`);
            });
            
            galleryGrid.appendChild(div);
        }

        // Gerar Vídeos no Grid (Thumbnail com Play Overlay - Otimizado sem pre-load pesado)
        for (let i = 1; i <= totalVideos; i++) {
            const div = document.createElement('div');
            div.className = 'gallery-item video';
            
            const regiao = regioes[(i - 1) % regioes.length];
            
            div.innerHTML = `
                <video src="assets/videos/video${i}.mp4#t=0.5" preload="metadata" muted></video>
                <div class="play-overlay">
                    <div class="play-icon-badge">▶</div>
                </div>
            `;
            
            div.addEventListener('click', () => {
                openLightbox(`<video src="assets/videos/video${i}.mp4" controls autoplay style="width: 100%; max-height: 80vh;"></video>`);
            });
            
            galleryGrid.appendChild(div);
        }
    }

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

            const filtro = btn.getAttribute('data-filter');
            const itens = document.querySelectorAll('.gallery-item');

            itens.forEach(item => {
                if (filtro === 'all' || item.classList.contains(filtro)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
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