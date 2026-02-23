document.addEventListener('DOMContentLoaded', () => {
    const galleryGrid = document.getElementById('galleryGrid');
    const lightbox = document.getElementById('lightbox');
    const lightboxContent = document.getElementById('lightboxContent');
    const closeLightbox = document.querySelector('.close-lightbox');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Quantidade de arquivos que você subiu
    const totalImagens = 24;
    const totalVideos = 5;
    
    // 1. GERAR AS IMAGENS DINAMICAMENTE
    for (let i = 1; i <= totalImagens; i++) {
        let div = document.createElement('div');
        div.className = 'gallery-item foto';
        
        // ATUALIZADO: Trocado de .jpg para .jpeg
        div.innerHTML = `<img src="imagem${i}.jpeg" alt="Serviço Elétrico ${i}" loading="lazy">`;
        
        // ATUALIZADO: Trocado de .jpg para .jpeg no Lightbox também
        div.addEventListener('click', () => {
            openLightbox(`<img src="imagem${i}.jpeg" alt="Serviço Elétrico ${i}">`);
        });
        
        galleryGrid.appendChild(div);
    }

    // 2. GERAR OS VÍDEOS DINAMICAMENTE
    for (let i = 1; i <= totalVideos; i++) {
        let div = document.createElement('div');
        div.className = 'gallery-item video';
        
        // Mostra o vídeo mudo no grid com um ícone de play por cima
        div.innerHTML = `
            <video src="video${i}.mp4" muted loop onmouseover="this.play()" onmouseout="this.pause()"></video>
            <div class="play-icon">▶</div>
        `;
        
        // Ao clicar, abre o vídeo com controles de volume e reprodução
        div.addEventListener('click', () => {
            openLightbox(`<video src="video${i}.mp4" controls autoplay></video>`);
        });
        
        galleryGrid.appendChild(div);
    }

    // 3. FUNÇÕES DO LIGHTBOX (Abrir e Fechar)
    function openLightbox(conteudo) {
        lightboxContent.innerHTML = conteudo;
        lightbox.classList.add('active');
    }

    // Fechar pelo botão (X)
    closeLightbox.addEventListener('click', () => {
        fecharLightbox();
    });

    // Fechar clicando fora da imagem/vídeo (no fundo preto)
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            fecharLightbox();
        }
    });

    function fecharLightbox() {
        lightbox.classList.remove('active');
        lightboxContent.innerHTML = ''; // Limpa o conteúdo (faz o vídeo parar de tocar ao fechar)
    }

    // 4. SISTEMA DE FILTROS (Todos / Fotos / Vídeos)
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove a classe ativa de todos os botões e põe no botão clicado
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filtro = btn.getAttribute('data-filter');
            const itens = document.querySelectorAll('.gallery-item');

            // Mostra ou esconde os itens baseado no filtro
            itens.forEach(item => {
                if (filtro === 'all') {
                    item.style.display = 'block';
                } else if (item.classList.contains(filtro)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
});