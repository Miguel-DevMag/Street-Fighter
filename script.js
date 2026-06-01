document.addEventListener('DOMContentLoaded', () => {


    // 1. Lógica do cursor HUD tático
    const cursor = document.querySelector('.cursor-tatico');
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    document.addEventListener('mousedown', () => cursor.classList.add('clique'));
    document.addEventListener('mouseup', () => cursor.classList.remove('clique'));

    // 2. Parallax dinâmico no Frame de Mira (Hero)
    const frameMira = document.querySelector('.frame-mira');
    document.addEventListener('mousemove', (e) => {
        if (frameMira) {
            const x = (window.innerWidth / 2 - e.clientX) / 25;
            const y = (window.innerHeight / 2 - e.clientY) / 25;
            frameMira.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
        }
    });
});

    // Efeito Typewriter para Sinopse ,Seleciona os elementos individualmente na ordem exata de execução
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
            // Sinaliza que o título terminou para liberar o próximo
            if (elemento.classList.contains('titulo-sinopse')) {
                document.body.classList.add('titulo-pronto');
            }
        }
    };

    const verificarEIniciar = () => {
        if (jaIniciado) return;

        // Se for o texto, ele só inicia se o título já tiver terminado
        if (elemento.classList.contains('texto-sinopse')) {
            if (document.body.classList.contains('titulo-pronto')) {
                jaIniciado = true;
                digitar();
            } else {
                // Tenta novamente em 100ms se o título ainda estiver digitando
                setTimeout(verificarEIniciar, 100);
            }
        } else {
            // Se for o título, inicia imediatamente ao aparecer na tela
            jaIniciado = true;
            digitar();
        }
    };

    const observadorTexto = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
                verificarEIniciar();
            }
        });
    }, { threshold: 0.5 });

    observadorTexto.observe(elemento);
});
 // Lógica de cartões expansíveis e reset de status
    const cartoes = document.querySelectorAll('.cartao');

    const animarBarras = (container) => {
        const preenchimentos = container.querySelectorAll('.preenchimento');
        preenchimentos.forEach(preenchimento => {
            const largura = preenchimento.style.width;
            preenchimento.style.width = '0';
            setTimeout(() => preenchimento.style.width = largura, 100);
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

    // Seleção dos botões de controle do carrossel (anterior e próximo)
    const btnPrev = document.querySelector('.btn-prev');
    const btnNext = document.querySelector('.btn-next');

    // Verifica se os botões existem no DOM antes de adicionar os ouvintes
    if (btnPrev && btnNext) {
        // Função auxiliar para mudar o lutador ativo baseado no offset (-1 ou 1)
        const alternarLutador = (offset) => {
            const listaCartoes = Array.from(cartoes);
            const indexAtivo = listaCartoes.findIndex(c => c.classList.contains('ativa'));
            
            if (indexAtivo !== -1) {
                // Calcula o próximo índice utilizando lógica circular (loop infinito)
                let novoIndex = (indexAtivo + offset) % listaCartoes.length;
                if (novoIndex < 0) {
                    novoIndex = listaCartoes.length - 1;
                }
                
                const proximoCartao = listaCartoes[novoIndex];
                
                // Reseta a classe ativa de todos e atribui ao próximo lutador selecionado
                cartoes.forEach(c => c.classList.remove('ativa'));
                proximoCartao.classList.add('ativa');
                
                // Executa a animação de preenchimento das barras de status
                animarBarras(proximoCartao);
            }
        };

        // Ouvinte de clique para retroceder no carrossel
        btnPrev.addEventListener('click', () => alternarLutador(-1));

        // Ouvinte de clique para avançar no carrossel
        btnNext.addEventListener('click', () => alternarLutador(1));
    }

