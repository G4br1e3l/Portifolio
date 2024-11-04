// GSAP Animations
gsap.to(".hero-content", {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power2.out"
});

// Animate project cards on scroll
const projectCards = document.querySelectorAll('.project-card');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            gsap.to(entry.target, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out"
            });
        }
    });
}, { threshold: 0.1 });
projectCards.forEach(card => observer.observe(card));

// Skill hover effect with scale and shadow
const skills = document.querySelectorAll('.skill');
skills.forEach(skill => {
    skill.addEventListener('mouseover', () => {
        gsap.to(skill, { scale: 1.1, duration: 0.3, boxShadow: '0 0 20px var(--primary)' });
    });
    skill.addEventListener('mouseout', () => {
        gsap.to(skill, { scale: 1, duration: 0.3, boxShadow: 'none' });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const skills = document.querySelectorAll('.skill');
    let activeCard = null;

    skills.forEach(skill => {
        skill.addEventListener('click', function() {
            const skillName = this.textContent.toLowerCase();
            const projectCard = document.querySelector(`.project-card[data-skills*="${skillName}"]`);

            if (projectCard) {
                // Remove o efeito glow do card anterior
                if (activeCard) {
                    activeCard.classList.remove('glow-effect');
                }

                // Remove classe active de todas as skills
                skills.forEach(s => s.classList.remove('active'));

                // Adiciona classe active na skill clicada
                this.classList.add('active');

                // Scroll suave até o project-card
                projectCard.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });

                // Adiciona o efeito de glow
                projectCard.classList.add('glow-effect');
                activeCard = projectCard;
            }
        });
    });
});

// Substituir a seção do efeito de digitação por este novo código
const letters = ['e', 's', '!', 'e', '4', 'c', 'u', 'r', 'i', 'r', 't', 'y', 'e'];
const lastLetterElement = document.querySelector('.last-letter');
let letterIndex = 0;
let isGlitching = false;

function typeEffect() {
    const currentLetter = letters[letterIndex];
    lastLetterElement.textContent = currentLetter;

    if (Math.random() < 0.1 && !isGlitching) {
        isGlitching = true;
        lastLetterElement.classList.add('glitch');
        setTimeout(() => {
            lastLetterElement.classList.remove('glitch');
            isGlitching = false;
        }, 200);
    }

    letterIndex = (letterIndex + 1) % letters.length;
    setTimeout(typeEffect, 300);
}

setTimeout(typeEffect, 1000);

// Security Lab Simulation
class SecurityLab {
    constructor() {
        this.canvas = document.getElementById('connectionCanvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.attacks = [];
        this.mouse = { x: 0, y: 0 };
        this.activeNode = null;

        this.setupCanvas();
        this.createNodes();
        this.setupEventListeners();
        this.animate();
        this.startAutoLog();

        // Adiciona referência à simulação do firewall
        this.firewallSim = null;
    }

    setupCanvas() {
        const resize = () => {
            const parent = this.canvas.parentElement;
            const rect = parent.getBoundingClientRect();

            // Define dimensões fixas baseadas no elemento pai
            this.canvas.width = rect.width;
            this.canvas.height = rect.height;

            // Reposiciona os nós quando o canvas é redimensionado
            this.nodes.forEach(node => {
                if (node.x > this.canvas.width || node.y > this.canvas.height) {
                    // Reposiciona nós que estão fora dos limites
                    node.x = Math.random() * (this.canvas.width - node.radius * 2) + node.radius;
                    node.y = Math.random() * (this.canvas.height - node.radius * 2) + node.radius;
                }
            });
        };

        // Chama resize inicialmente
        resize();

        // Adiciona listener de redimensionamento
        window.addEventListener('resize', resize);

        // Observa mudanças no tamanho do container
        const resizeObserver = new ResizeObserver(() => {
            resize();
        });
        resizeObserver.observe(this.canvas.parentElement);

        // Adiciona listener de mouse
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
    }

    createNodes() {
        // Ajusta o número de nós baseado no tamanho do canvas
        const area = this.canvas.width * this.canvas.height;
        const numNodes = Math.min(15, Math.max(5, Math.floor(area / 20000)));

        this.nodes = [];
        const types = ['server', 'client', 'security'];

        for (let i = 0; i < numNodes; i++) {
            const radius = 4 + Math.random() * 3;
            this.nodes.push({
                x: Math.random() * (this.canvas.width - radius * 2) + radius,
                y: Math.random() * (this.canvas.height - radius * 2) + radius,
                radius: radius,
                color: 'rgba(0, 255, 136, 0.7)',
                type: types[Math.floor(Math.random() * types.length)],
                velocity: {
                    x: (Math.random() - 0.5) * 0.5,
                    y: (Math.random() - 0.5) * 0.5
                },
                pulsePhase: Math.random() * Math.PI * 2
            });
        }

        window.securityLab = this;
    }

    drawNode(node, index) {
        const time = Date.now() * 0.001;
        const pulse = Math.sin(time + node.pulsePhase) * 0.5 + 0.5;

        // Efeito de brilho
        const gradient = this.ctx.createRadialGradient(
            node.x, node.y, 0,
            node.x, node.y, node.radius * 3
        );
        gradient.addColorStop(0, `rgba(0, 255, 136, ${0.3 + pulse * 0.2})`);
        gradient.addColorStop(1, 'rgba(0, 255, 136, 0)');

        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, node.radius * 3, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();

        // Nó central
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = node.color;
        this.ctx.fill();

        // Anel externo
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, node.radius * 1.5, 0, Math.PI * 2);
        this.ctx.strokeStyle = `rgba(0, 255, 136, ${0.2 + pulse * 0.3})`;
        this.ctx.stroke();
    }

    drawConnections() {
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const dx = this.nodes[j].x - this.nodes[i].x;
                const dy = this.nodes[j].y - this.nodes[i].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    const time = Date.now() * 0.001;
                    const alpha = (1 - distance / 150) * 0.5;

                    // Linha principal
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.nodes[i].x, this.nodes[i].y);
                    this.ctx.lineTo(this.nodes[j].x, this.nodes[j].y);
                    this.ctx.strokeStyle = `rgba(0, 255, 136, ${alpha})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();

                    // Partícula em movimento na conexão
                    const particlePos = Math.sin(time) * 0.5 + 0.5;
                    const px = this.nodes[i].x + dx * particlePos;
                    const py = this.nodes[i].y + dy * particlePos;

                    this.ctx.beginPath();
                    this.ctx.arc(px, py, 2, 0, Math.PI * 2);
                    this.ctx.fillStyle = `rgba(0, 255, 136, ${alpha * 2})`;
                    this.ctx.fill();
                }
            }
        }
    }

    updateNodes() {
        this.nodes.forEach(node => {
            // Atualiza posição
            node.x += node.velocity.x;
            node.y += node.velocity.y;

            // Colisão com bordas com padding
            const padding = node.radius;
            if (node.x <= padding || node.x >= this.canvas.width - padding) {
                node.velocity.x *= -1;
                node.x = Math.max(padding, Math.min(this.canvas.width - padding, node.x));
            }
            if (node.y <= padding || node.y >= this.canvas.height - padding) {
                node.velocity.y *= -1;
                node.y = Math.max(padding, Math.min(this.canvas.height - padding, node.y));
            }

            // Interação com o mouse
            const dx = this.mouse.x - node.x;
            const dy = this.mouse.y - node.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                const angle = Math.atan2(dy, dx);
                const force = (100 - distance) * 0.001;
                node.velocity.x -= Math.cos(angle) * force;
                node.velocity.y -= Math.sin(angle) * force;
            }

            // Limitar velocidade
            const speed = Math.sqrt(node.velocity.x ** 2 + node.velocity.y ** 2);
            if (speed > 2) {
                node.velocity.x *= 2 / speed;
                node.velocity.y *= 2 / speed;
            }
        });
    }

    animateAttacks() {
        this.attacks = this.attacks.filter(attack => {
            attack.progress += 0.02;

            // Efeito de onda de ataque
            const radius = attack.progress * this.canvas.width * 0.5;
            const alpha = 1 - attack.progress;

            this.ctx.beginPath();
            this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, radius, 0, Math.PI * 2);
            this.ctx.strokeStyle = `rgba(255, 0, 0, ${alpha * 0.5})`;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            // Efeito de partículas
            for (let i = 0; i < 5; i++) {
                const angle = (Math.PI * 2 / 5) * i + attack.progress * Math.PI;
                const x = this.canvas.width / 2 + Math.cos(angle) * radius;
                const y = this.canvas.height / 2 + Math.sin(angle) * radius;

                this.ctx.beginPath();
                this.ctx.arc(x, y, 3, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`;
                this.ctx.fill();
            }

            return attack.progress < 1;
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Fundo com gradiente
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width / 2, this.canvas.height / 2, 0,
            this.canvas.width / 2, this.canvas.height / 2, this.canvas.width / 2
        );
        gradient.addColorStop(0, 'rgba(0, 20, 40, 0.2)');
        gradient.addColorStop(1, 'rgba(0, 10, 20, 0.1)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.updateNodes();
        this.drawConnections();
        this.nodes.forEach(this.drawNode.bind(this));
        this.animateAttacks();

        requestAnimationFrame(() => this.animate());
    }

    setupEventListeners() {
        const controls = document.querySelectorAll('.control-btn');
        controls.forEach(btn => {
            btn.addEventListener('click', () => {
                const simulationType = btn.dataset.simulation;
                // Usa a simulação do firewall para processar o ataque
                if (this.firewallSim) {
                    this.firewallSim.simulateAttack(simulationType);
                }
            });
        });
    }

    startAutoLog() {
        const messages = [{
                blocked: "Unauthorized access attempt blocked",
                passed: "WARNING: Unauthorized access successful - Security compromised"
            },
            {
                blocked: "Suspicious activity detected and blocked",
                passed: "WARNING: Suspicious activity detected - No protection active"
            },
            {
                blocked: "Failed login attempt blocked from unknown IP",
                passed: "WARNING: Unknown IP accessed system - No firewall protection"
            },
            {
                blocked: "Security policy violation prevented",
                passed: "WARNING: Security policy violated - Protection inactive"
            },
            {
                blocked: "Access token validation failed - Access denied",
                passed: "WARNING: Invalid access token gained entry - System vulnerable"
            }
        ];

        setInterval(() => {
            // Verifica o estado do firewall
            const firewallEnabled = document.getElementById('firewallToggle').classList.contains('active');

            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            const logEntry = {
                timestamp: new Date().toLocaleTimeString(),
                type: firewallEnabled ? 'blocked' : 'passed',
                message: firewallEnabled ? randomMessage.blocked : randomMessage.passed
            };
            this.addLogEntry(logEntry);
        }, 5000);
    }

    addLogEntry(entry) {
        const logContent = document.querySelector('.log-content');
        const entryElement = document.createElement('div');
        entryElement.className = 'log-entry';

        // Adiciona classe baseada no tipo de entrada
        entryElement.classList.add(entry.type === 'blocked' ? 'blocked-entry' : 'passed-entry');

        entryElement.innerHTML = `
            <span class="timestamp">${entry.timestamp}</span>
            <span class="entry-type ${entry.type}">${entry.type}</span>
            <span class="entry-message">${entry.message}</span>
        `;

        // Adiciona efeito visual para entradas "passed"
        if (entry.type === 'passed') {
            entryElement.style.borderLeft = '3px solid #ff3333';
            entryElement.style.background = 'rgba(255, 0, 0, 0.05)';
        }

        logContent.insertBefore(entryElement, logContent.firstChild);

        // Manter apenas os últimos 5 logs
        if (logContent.children.length > 5) {
            logContent.removeChild(logContent.lastChild);
        }
    }

    updateNodesColor(isProtected) {
        this.nodes.forEach(node => {
            node.color = isProtected ?
                'rgba(0, 255, 136, 0.7)' :
                'rgba(255, 0, 0, 0.7)';
        });
    }
}

// Inicializar Security Lab quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    const securityLab = new SecurityLab();
    const firewallSim = new FirewallSimulation();
});

// Modificar a parte do blog no final do arquivo
document.addEventListener('DOMContentLoaded', function() {
    const blogGrid = document.querySelector('.blog-grid');
    const nextBtn = document.querySelector('.blog-nav-btn.next');
    const hiddenCard = document.querySelector('.blog-card.hidden');
    const visibleCards = document.querySelectorAll('.blog-card:not(.hidden)');
    let isExpanded = false;

    nextBtn.addEventListener('click', function() {
        if (!isExpanded) {
            // Expandir grid
            hiddenCard.classList.add('show');

            // Timeline para expansão
            gsap.timeline({
                    defaults: {
                        duration: 0.6,
                        ease: "power3.inOut"
                    }
                })
                .set(hiddenCard, {
                    display: 'block',
                    opacity: 0,
                    scale: 0.8,
                    x: 50
                })
                .to(blogGrid, {
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    duration: 0.4,
                    ease: "power2.inOut"
                })
                .to(visibleCards, {
                    x: -20,
                    scale: 0.98,
                    stagger: 0.1,
                    duration: 0.4
                }, "<")
                .to(hiddenCard, {
                    opacity: 1,
                    scale: 1,
                    x: 0,
                    duration: 0.4
                }, "-=0.3")
                .to(visibleCards, {
                    x: 0,
                    scale: 1,
                    stagger: 0.1,
                    duration: 0.4
                }, "-=0.2");

            // Animar o botão
            gsap.to(nextBtn, {
                rotate: 180,
                duration: 0.4,
                ease: "back.out(1.7)"
            });

        } else {
            // Timeline para recolhimento
            gsap.timeline({
                    defaults: {
                        duration: 0.6,
                        ease: "power3.inOut"
                    }
                })
                .to(hiddenCard, {
                    opacity: 0,
                    scale: 0.8,
                    x: 50,
                    duration: 0.4
                })
                .to(visibleCards, {
                    x: 20,
                    scale: 0.98,
                    stagger: 0.1,
                    duration: 0.4
                }, "<")
                .to(blogGrid, {
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    duration: 0.4,
                    onComplete: () => {
                        hiddenCard.classList.remove('show');
                    }
                }, "-=0.2")
                .to(visibleCards, {
                    x: 0,
                    scale: 1,
                    stagger: 0.1,
                    duration: 0.4
                }, "-=0.2");

            // Animar o botão de volta
            gsap.to(nextBtn, {
                rotate: 0,
                duration: 0.4,
                ease: "back.out(1.7)"
            });
        }

        isExpanded = !isExpanded;
    });

    // Ajuste responsivo melhorado
    function checkResponsive() {
        if (window.innerWidth <= 768) {
            gsap.set(blogGrid, {
                gridTemplateColumns: '1fr',
                duration: 0
            });
            if (isExpanded) {
                gsap.set(hiddenCard, {
                    gridColumn: 'auto',
                    duration: 0
                });
            }
        } else {
            gsap.set(blogGrid, {
                gridTemplateColumns: isExpanded ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
                duration: 0
            });
            if (isExpanded) {
                gsap.set(hiddenCard, {
                    gridColumn: '3',
                    duration: 0
                });
            }
        }
    }

    window.addEventListener('resize', checkResponsive);
});

// Adicione este código ao final do arquivo scripts.js

class FirewallSimulation {
    constructor() {
        this.firewallEnabled = true;
        this.rules = {
            blockIPs: true,
            preventSQLInjection: true,
            enableMFA: true
        };
        this.setupEventListeners();

        // Conecta com o SecurityLab
        if (window.securityLab) {
            window.securityLab.firewallSim = this;
        }
    }

    setupEventListeners() {
        const firewallToggle = document.getElementById('firewallToggle');
        const ruleBtns = document.querySelectorAll('.rule-btn');
        const networkMap = document.querySelector('.network-map');

        firewallToggle.addEventListener('click', () => {
            this.firewallEnabled = !this.firewallEnabled;

            // Atualiza visual do botão
            firewallToggle.classList.toggle('active', this.firewallEnabled);
            const statusText = firewallToggle.querySelector('.status-text');
            statusText.textContent = this.firewallEnabled ? 'Protected' : 'Vulnerable';
            statusText.className = `status-text ${this.firewallEnabled ? 'protected' : 'vulnerable'}`;

            // Atualiza ícone
            const toggleIcon = firewallToggle.querySelector('.toggle-icon');
            toggleIcon.textContent = this.firewallEnabled ? '🛡️' : '⚠️';

            // Atualiza visual do canvas
            networkMap.classList.toggle('vulnerable', !this.firewallEnabled);

            // Atualiza estado das regras
            ruleBtns.forEach(btn => {
                const rule = btn.dataset.rule;
                if (!this.firewallEnabled) {
                    btn.disabled = true;
                    btn.classList.remove('active');
                    this.rules[rule] = false;
                } else {
                    btn.disabled = false;
                    btn.classList.add('active');
                    this.rules[rule] = true;
                }
            });
        });

        // Atualiza regras individuais
        ruleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (!this.firewallEnabled) return;

                const rule = btn.dataset.rule;
                this.rules[rule] = !this.rules[rule];
                btn.classList.toggle('active', this.rules[rule]);
            });
        });
    }

    simulateAttack(type) {
        let blocked = false;
        let message = '';
        let details = '';

        // Primeiro verifica se o firewall está ativo
        if (this.firewallEnabled) {
            // Depois verifica a regra específica
            switch (type) {
                case 'brute-force':
                    blocked = this.rules.enableMFA;
                    message = blocked ?
                        'Brute force attack blocked by MFA' :
                        'WARNING: Brute force attack succeeded - MFA disabled';
                    details = 'Multiple login attempts from IP 192.168.1.100';
                    break;

                case 'sql-injection':
                    blocked = this.rules.preventSQLInjection;
                    message = blocked ?
                        'SQL injection attempt blocked' :
                        'WARNING: SQL injection succeeded - Database compromised';
                    details = 'Malicious SQL query detected: OR 1=1--';
                    break;

                case 'unauthorized-access':
                    blocked = this.rules.blockIPs;
                    message = blocked ?
                        'Unauthorized access blocked' :
                        'WARNING: Unauthorized access successful';
                    details = 'Access attempt from blacklisted IP 10.0.0.100';
                    break;
            }
        } else {
            // Se o firewall estiver desativado
            message = `WARNING: ${type.replace('-', ' ')} attack successful - Firewall disabled`;
            details = 'System vulnerable - No protection active';
            blocked = false;
        }

        // Adiciona o log
        this.addLogEntry({
            timestamp: new Date().toLocaleTimeString(),
            type: blocked ? 'blocked' : 'passed',
            message: message,
            details: details
        });

        // Atualiza visual se o ataque passou
        if (!blocked) {
            this.triggerAttackVisual();
        }

        // Adiciona efeito de ataque no canvas
        if (window.securityLab) {
            window.securityLab.attacks.push({
                type,
                progress: 0,
                success: !blocked
            });
        }
    }

    addLogEntry(entry) {
        const logContent = document.querySelector('.log-content');
        const entryElement = document.createElement('div');
        entryElement.className = 'log-entry';
        entryElement.innerHTML = `
            <span class="timestamp">${entry.timestamp}</span>
            <span class="entry-type ${entry.type}">${entry.type}</span>
            <span class="entry-message">${entry.message}</span>
            <div class="entry-details">${entry.details}</div>
        `;
        logContent.insertBefore(entryElement, logContent.firstChild);

        // Manter apenas os últimos 5 logs
        if (logContent.children.length > 5) {
            logContent.removeChild(logContent.lastChild);
        }
    }

    triggerAttackVisual() {
        // Adiciona efeito visual de ataque bem-sucedido
        const labVisualization = document.querySelector('.lab-visualization');
        labVisualization.style.border = '2px solid #ff3333';
        labVisualization.style.animation = 'shake 0.5s';

        setTimeout(() => {
            labVisualization.style.border = '1px solid rgba(0, 255, 136, 0.2)';
            labVisualization.style.animation = '';
        }, 1000);
    }
}

// Inicializar simulação quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    const securityLab = new SecurityLab();
    const firewallSim = new FirewallSimulation();
});

// Adicione esta animação ao seu CSS