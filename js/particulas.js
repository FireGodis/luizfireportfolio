document.addEventListener('DOMContentLoaded', () => {
    const particlesContainer = document.querySelector('.particles');
    const numParticles = 100; // Número de partículas
    const particles = [];
    const maxDistance = 50; // Máxima distância para conectar partículas

    // Função para criar uma partícula
    function createParticle() {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particlesContainer.appendChild(particle);

        // Adiciona partícula ao array para manipulação
        particles.push({
            element: particle,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2
        });
    }

    // Função para criar uma linha
    function createLine(x1, y1, x2, y2) {
        const line = document.createElement('div');
        line.classList.add('line');
        particlesContainer.appendChild(line);

        const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        line.style.width = `${length}px`;
        line.style.transform = `rotate(${Math.atan2(y2 - y1, x2 - x1)}rad)`;
        line.style.transformOrigin = '0 0';
        line.style.left = `${x1}px`;
        line.style.top = `${y1}px`;

        return line;
    }

    // Criação das partículas
    for (let i = 0; i < numParticles; i++) {
        createParticle();
    }

    // Atualiza a posição das partículas e desenha linhas
    function updateParticles() {
        const lines = [];

        particles.forEach(particle => {
            // Atualiza posição com base na velocidade
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Verifica limites da tela e inverte a direção se necessário
            if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1;
            if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1;

            // Atualiza a posição no DOM
            particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px)`;

            // Verifica as partículas próximas e cria linhas
            particles.forEach(otherParticle => {
                if (particle !== otherParticle) {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) { // Distância para conectar partículas
                        lines.push({
                            x1: particle.x,
                            y1: particle.y,
                            x2: otherParticle.x,
                            y2: otherParticle.y
                        });
                    }
                }
            });
        });

        // Remove linhas antigas
        document.querySelectorAll('.line').forEach(line => line.remove());

        // Desenha novas linhas
        lines.forEach(lineData => {
            createLine(lineData.x1, lineData.y1, lineData.x2, lineData.y2);
        });

        requestAnimationFrame(updateParticles);
    }

    updateParticles();

    // Efeito de movimento das partículas com interação do cursor (expulsão)
    document.addEventListener('mousemove', (e) => {
        particles.forEach(particle => {
            const rect = particle.element.getBoundingClientRect();
            const particleX = rect.left + rect.width / 2;
            const particleY = rect.top + rect.height / 2;

            const dx = e.clientX - particleX;
            const dy = e.clientY - particleY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {
                const repulsionForce = (maxDistance - distance) / maxDistance; // Força de repulsão
                particle.vx -= (dx / distance) * repulsionForce * 0.5;
                particle.vy -= (dy / distance) * repulsionForce * 0.5;
            }
        });
    });
});
