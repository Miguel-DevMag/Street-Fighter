document.addEventListener('DOMContentLoaded', () => {

    // Cursor HUD tático
    const cursor = document.querySelector('.cursor-tatico');
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    document.addEventListener('mousedown', () => cursor.classList.add('clique'));
    document.addEventListener('mouseup', () => cursor.classList.remove('clique'));

    // Parallax no Frame de Mira
    const frameMira = document.querySelector('.frame-mira');
    document.addEventListener('mousemove', (e) => {
        if (frameMira) {
            const x = (window.innerWidth / 2 - e.clientX) / 25;
            const y = (window.innerHeight / 2 - e.clientY) / 25;
            frameMira.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
        }
    });

    // Hambúrguer — menu mobile
    const btnHamb = document.getElementById('btn-hamburguer');
    const navMenu = document.getElementById('nav-menu');
    if (btnHamb && navMenu) {
        btnHamb.addEventListener('click', () => {
            btnHamb.classList.toggle('aberto');
            navMenu.classList.toggle('aberta');
        });
        // Fecha ao clicar em qualquer link
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                btnHamb.classList.remove('aberto');
                navMenu.classList.remove('aberta');
            });
        });
    }

    // Desativa cursor custom em dispositivos touch
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
        if (cursor) cursor.style.display = 'none';
    }

    // Cartões expansíveis
    const cartoes = document.querySelectorAll('.cartao');

    const animarBarras = (container) => {
        container.querySelectorAll('.preenchimento').forEach(p => {
            const w = p.style.width;
            p.style.width = '0';
            setTimeout(() => p.style.width = w, 100);
        });
    };

    cartoes.forEach(cartao => {
        cartao.addEventListener('click', () => {
            if (!cartao.classList.contains('ativa')) {
                cartoes.forEach(c => c.classList.remove('ativa'));
                cartao.classList.add('ativa');
                animarBarras(cartao);
            }
        });
    });

    // Botões do carrossel
    const btnPrev = document.querySelector('.btn-prev');
    const btnNext = document.querySelector('.btn-next');

    if (btnPrev && btnNext) {
        const alternarLutador = (offset) => {
            const lista = Array.from(cartoes);
            const idx = lista.findIndex(c => c.classList.contains('ativa'));
            if (idx !== -1) {
                let novo = (idx + offset) % lista.length;
                if (novo < 0) novo = lista.length - 1;
                cartoes.forEach(c => c.classList.remove('ativa'));
                lista[novo].classList.add('ativa');
                animarBarras(lista[novo]);
            }
        };
        btnPrev.addEventListener('click', () => alternarLutador(-1));
        btnNext.addEventListener('click', () => alternarLutador(1));
    }

    // Scroll Reveal
    const revelar = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('revelada');
                revelar.unobserve(entrada.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.secao-revelar').forEach(el => revelar.observe(el));

    // Partículas sobre cartas-fanart
    const canvas = document.getElementById('canvas-particulas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const imgEl = canvas.previousElementSibling;

        const redimensionar = () => {
            canvas.width  = imgEl.offsetWidth;
            canvas.height = imgEl.offsetHeight;
        };
        redimensionar();
        window.addEventListener('resize', redimensionar);

        const cores = ['#00a2ff', '#ff4500', '#ffd700', '#ff0000', '#ffffff'];

        class Particula {
            constructor() { this.resetar(); }
            resetar() {
                this.x    = Math.random() * canvas.width;
                this.y    = canvas.height + Math.random() * 40;
                this.r    = Math.random() * 2.5 + 0.5;
                this.vy   = -(Math.random() * 0.8 + 0.3);
                this.vx   = (Math.random() - 0.5) * 0.4;
                this.alfa = Math.random() * 0.7 + 0.2;
                this.cor  = cores[Math.floor(Math.random() * cores.length)];
            }
            atualizar() {
                this.x += this.vx;
                this.y += this.vy;
                this.alfa -= 0.003;
                if (this.y < -10 || this.alfa <= 0) this.resetar();
            }
            desenhar() {
                ctx.save();
                ctx.globalAlpha = this.alfa;
                ctx.fillStyle   = this.cor;
                ctx.shadowColor = this.cor;
                ctx.shadowBlur  = 6;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        const particulas = Array.from({ length: 60 }, () => new Particula());

        const animar = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particulas.forEach(p => { p.atualizar(); p.desenhar(); });
            requestAnimationFrame(animar);
        };
        animar();
    }
});

// Typewriter para Sinopse (fora do DOMContentLoaded — funciona igual)
const elementosTypewriter = document.querySelectorAll('.texto-sinopse, .titulo-sinopse');

elementosTypewriter.forEach((elemento) => {
    const texto = elemento.getAttribute('data-text') || elemento.textContent.trim();
    let index = 0;
    let jaIniciado = false;
    elemento.style.position = 'relative';
    elemento.innerHTML = `<span style="visibility: hidden;">${texto}</span><span class="typewriter-render" style="position: absolute; left: 0; top: 0; width: 100%;"></span>`;
    const areaDigitacao = elemento.querySelector('.typewriter-render');

    const digitar = () => {
        if (index < texto.length) {
            areaDigitacao.innerHTML += texto.charAt(index);
            index++;
            setTimeout(digitar, 30);
        } else {
            areaDigitacao.style.borderRight = "none";
            if (elemento.classList.contains('titulo-sinopse')) {
                document.body.classList.add('titulo-pronto');
            }
        }
    };

    const verificarEIniciar = () => {
        if (jaIniciado) return;
        if (elemento.classList.contains('texto-sinopse')) {
            if (document.body.classList.contains('titulo-pronto')) {
                jaIniciado = true;
                digitar();
            } else {
                setTimeout(verificarEIniciar, 100);
            }
        } else {
            jaIniciado = true;
            digitar();
        }
    };

    const observadorTexto = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
            if (entrada.isIntersecting) verificarEIniciar();
        });
    }, { threshold: 0.5 });

    observadorTexto.observe(elemento);
});
