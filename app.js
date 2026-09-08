/* ============================================================
   CAPOEIRA LIBERDADE E EXPRESSÃO — app.js (Sprint 1 & 2)
   ------------------------------------------------------------
   Este arquivo é organizado em módulos independentes. Todos os
   dados vêm dos arrays em DATA, no MESMO formato dos documentos
   do Firestore usados pelo CMS (site_equipe, site_agenda,
   site_locais, site_loja). Na Sprint 3, basta substituir a leitura
   dos arrays abaixo por `getDocs(collection(db, "..."))`, como já
   é feito em main.js/gerenciador-site.js — nenhuma outra função
   de render precisa mudar.

   Observação honesta sobre o briefing: efeitos que dependiam de
   ATIVOS que não foram fornecidos (vídeo em loop por atleta,
   mascote em Lottie, modelo 3D real de berimbau/pandeiro) foram
   aproximados com Three.js/CSS puro (partículas, tilt 3D, glow)
   em vez de referenciar arquivos inexistentes.
   ============================================================ */

/* ==================== 0. DADOS (placeholder — Sprint 3 pluga aqui) ==================== */
const DATA = {
    equipe: [
        { id: 'eq1', nome: 'Mestre Coruja', titulo: 'Mestre Fundador', coverImg: 'https://images.unsplash.com/photo-1599839619722-39751411ea63?w=600', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', bio: 'Mais de 30 anos dedicados à capoeira, fundador do grupo Liberdade e Expressão.', whats: '5567991293269', stats: { anos: '30+', alunos: '400' } },
        { id: 'eq2', nome: 'Contra-Mestre Vento', titulo: 'Berimbau & Ritmo', coverImg: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200', bio: 'Responsável pela bateria e formação musical dos alunos mais novos.', whats: '5567991293269', stats: { anos: '18', alunos: '150' } },
        { id: 'eq3', nome: 'Professora Ginga', titulo: 'Turmas Infantis', coverImg: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600', img: 'https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?w=200', bio: 'Especialista em capoeira lúdica para crianças de 4 a 12 anos.', whats: '5567991293269', stats: { anos: '9', alunos: '210' } },
        { id: 'eq4', nome: 'Instrutor Aço', titulo: 'Preparação Física', coverImg: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200', bio: 'Cuida do condicionamento físico e prevenção de lesões da equipe de competição.', whats: '5567991293269', stats: { anos: '7', alunos: '95' } },
        { id: 'eq5', nome: 'Mestranda Lua', titulo: 'Roda & Competição', coverImg: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600', img: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200', bio: 'Campeã regional, representa o grupo em batizados por todo o Centro-Oeste.', whats: '5567991293269', stats: { anos: '12', alunos: '130' } },
        { id: 'eq6', nome: 'Professor Fogo', titulo: 'Maculelê', coverImg: 'https://images.unsplash.com/photo-1526401485004-46910ecc8e51?w=600', img: 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=200', bio: 'Conduz as oficinas de maculelê e cultura afro-brasileira do grupo.', whats: '5567991293269', stats: { anos: '15', alunos: '80' } }
    ],
    agenda: [
        { id: 'ag1', dataReal: '2026-10-18T19:00:00', dataStr: '18 DE OUT', hora: '19h00', titulo: 'Roda de Rua — Praça do Rádio', local: 'Praça do Rádio, Campo Grande - MS', fotosLink: '' },
        { id: 'ag2', dataReal: '2026-11-08T09:00:00', dataStr: '08 DE NOV', hora: '9h00', titulo: 'Batizado e Troca de Cordas', local: 'Ginásio Guanandizão, Campo Grande - MS', fotosLink: '' },
        { id: 'ag3', dataReal: '2026-06-20T18:30:00', dataStr: '20 DE JUN', hora: '18h30', titulo: 'Roda Aberta de Aniversário', local: 'Parque das Nações Indígenas, Campo Grande - MS', fotosLink: 'https://photos.google.com' }
    ],
    locais: [
        { id: 'lo1', nome: 'Rancho Alegre', prof: 'Contra-Mestre Vento', dias: 'Seg/Qua — 19h', endereco: 'Rua das Garças, Rancho Alegre, Campo Grande - MS' },
        { id: 'lo2', nome: 'Tiradentes', prof: 'Professora Ginga', dias: 'Ter/Qui — 18h', endereco: 'Av. Tamandaré, Jardim Tiradentes, Campo Grande - MS' },
        { id: 'lo3', nome: 'Centro', prof: 'Mestre Coruja', dias: 'Sex — 19h30', endereco: 'Rua 14 de Julho, Centro, Campo Grande - MS' }
    ],
    loja: [
        { id: 'pr1', nome: 'Berimbau Viola', preco: 'R$ 180,00', img: 'https://images.unsplash.com/photo-1621786830438-8fdc1a2e0c69?w=400' },
        { id: 'pr2', nome: 'Abadá Oficial', preco: 'R$ 90,00', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400' },
        { id: 'pr3', nome: 'Pandeiro Profissional', preco: 'R$ 140,00', img: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400' },
        { id: 'pr4', nome: 'Corda de Graduação', preco: 'R$ 35,00', img: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab0?w=400' }
    ],
    kids: [
        { img: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=500', caption: 'Turma Kids — coordenação e disciplina' },
        { img: 'https://images.unsplash.com/photo-1518614368389-fdc7d3e0e3e5?w=500', caption: 'Brincando de aprender capoeira' },
        { img: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=500', caption: 'Amizade e cultura desde pequenos' }
    ]
};

const prefersReducedMotion = window.matchMedia('(prefers-reduce-motion: reduce), (prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

document.addEventListener('DOMContentLoaded', () => {
    initLenisScroll();
    initGsapReveals();
    if (!prefersReducedMotion && !isTouch) initAxeCursor();
    if (!prefersReducedMotion) initHeroParticles();
    initHeaderNav();
    renderEquipe();
    renderAgenda();
    renderLocais();
    renderKidsStack();
    renderLoja();
    initSoundToggle();
});

/* ==================== 1. LENIS — SCROLL SUAVE ==================== */
function initLenisScroll() {
    if (typeof Lenis === 'undefined' || prefersReducedMotion) return;
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, easing: (t) => 1 - Math.pow(1 - t, 3) });
    function raf(time) {
        lenis.raf(time);
        if (window.ScrollTrigger) ScrollTrigger.update();
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    if (window.gsap) lenis.on('scroll', () => ScrollTrigger.update());

    // Parallax da tipografia gigante do hero
    const bgWord = document.querySelector('.hero-bg-word');
    lenis.on('scroll', ({ scroll }) => {
        if (bgWord) bgWord.style.transform = `translateX(${scroll * 0.15}px)`;
    });
}

/* ==================== 2. GSAP — REVEALS ESTILO "ESQUIVA" ==================== */
function initGsapReveals() {
    if (typeof gsap === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    gsap.timeline()
        .to('.eyebrow-line', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
        .to('.rb-hero-content h1 .reveal-up', { opacity: 1, y: 0, stagger: 0.12, duration: 0.9, ease: 'power4.out' }, '-=0.3')
        .to('.rb-hero-content p.reveal-up', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
        .to('.hero-cta-row.reveal-up', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5');

    gsap.utils.toArray('.reveal-esquiva').forEach((el) => {
        gsap.to(el, {
            opacity: 1, x: 0, skewX: 0, duration: 1,
            ease: 'power4.out',
            scrollTrigger: { trigger: el, start: 'top 85%' }
        });
    });
    gsap.utils.toArray('.section-title.reveal-up').forEach((el) => {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } });
    });
}

/* ==================== 3. CURSOR DE ENERGIA (AXÉ) + RASTRO DE PARTÍCULAS ==================== */
function initAxeCursor() {
    const cursor = document.getElementById('axe-cursor');
    const canvas = document.getElementById('axe-trail-canvas');
    const ctx = canvas.getContext('2d');
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    window.addEventListener('resize', () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; });

    let mouse = { x: w / 2, y: h / 2 };
    let particles = [];

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX; mouse.y = e.clientY;
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        for (let i = 0; i < 2; i++) {
            particles.push({
                x: e.clientX, y: e.clientY,
                vx: (Math.random() - 0.5) * 1.5, vy: (Math.random() - 0.5) * 1.5,
                life: 1, size: Math.random() * 3 + 2,
                hue: Math.random() > 0.5 ? '0,230,216' : '255,184,0'
            });
        }
    });
    document.querySelectorAll('a, button, .rb-card, .loja-item, .local-card, .bubble, .stack-card').forEach((el) => {
        el.addEventListener('mouseenter', () => cursor.classList.add('is-active'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('is-active'));
    });

    function loop() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach((p) => {
            p.x += p.vx; p.y += p.vy; p.life -= 0.02;
            ctx.beginPath();
            ctx.fillStyle = `rgba(${p.hue}, ${Math.max(p.life, 0)})`;
            ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
            ctx.fill();
        });
        particles = particles.filter((p) => p.life > 0);
        requestAnimationFrame(loop);
    }
    loop();
}

/* ==================== 4. HERO — PARTÍCULAS 3D (THREE.JS) COM TILT DE MOUSE ==================== */
function initHeroParticles() {
    const canvasEl = document.getElementById('three-hero-canvas');
    if (!canvasEl || typeof THREE === 'undefined') return;

    const heroSection = document.getElementById('inicio');
    const renderer = new THREE.WebGLRenderer({ canvas: canvasEl, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(heroSection.clientWidth, heroSection.clientHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, heroSection.clientWidth / heroSection.clientHeight, 0.1, 100);
    camera.position.z = 9;

    // Nuvem de partículas em formato de "au" (estrela irregular simulando o
    // capoeirista em movimento). Assets 3D reais (modelo GLTF de atleta) não
    // foram fornecidos, então a silhueta é sugerida por densidade de pontos.
    const PARTICLE_COUNT = 2600;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const colorA = new THREE.Color('#00E6D8');
    const colorB = new THREE.Color('#FFB800');

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        // Espiral toroidal — sugere o movimento circular da ginga/au
        const t = Math.random() * Math.PI * 2;
        const r = 2.4 + Math.sin(t * 3) * 0.9 + Math.random() * 0.6;
        const height = (Math.random() - 0.5) * 4.2 * Math.abs(Math.sin(t));
        positions[i * 3] = Math.cos(t) * r;
        positions[i * 3 + 1] = height + Math.sin(t * 2) * 0.8;
        positions[i * 3 + 2] = Math.sin(t) * r * 0.6;

        const mixed = colorA.clone().lerp(colorB, Math.random());
        colors[i * 3] = mixed.r; colors[i * 3 + 1] = mixed.g; colors[i * 3 + 2] = mixed.b;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({ size: 0.045, vertexColors: true, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false });
    const particleField = new THREE.Points(geometry, material);
    scene.add(particleField);

    let targetX = 0, targetY = 0;
    window.addEventListener('mousemove', (e) => {
        targetX = (e.clientX / window.innerWidth - 0.5) * 0.6;
        targetY = (e.clientY / window.innerHeight - 0.5) * 0.6;
    });

    function animate() {
        particleField.rotation.y += 0.0022;
        camera.position.x += (targetX - camera.position.x) * 0.04;
        camera.position.y += (-targetY - camera.position.y) * 0.04;
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = heroSection.clientWidth / heroSection.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(heroSection.clientWidth, heroSection.clientHeight);
    });
}

/* ==================== 5. HEADER: SCROLL SPY + HAMBÚRGUER ==================== */
function initHeaderNav() {
    document.getElementById('hamburger')?.addEventListener('click', () => {
        document.getElementById('mainNav').classList.toggle('active');
    });
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.rb-nav-item');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach((sec) => { if (window.scrollY >= sec.offsetTop - 200) current = sec.getAttribute('id'); });
        navItems.forEach((item) => item.classList.toggle('active', item.getAttribute('href') === `#${current}`));
    });
}

/* ==================== 6. EQUIPE — DUPLO CARROSSEL INFINITO ==================== */
function cardEquipeHTML(m) {
    return `
    <div class="rb-card" data-id="${m.id}" data-nome="${m.nome}" data-titulo="${m.titulo}" data-bio="${m.bio}" data-img="${m.img}" data-whats="${m.whats}">
        <div class="rb-card-media">
            <img src="${m.coverImg}" class="rb-card-cover" alt="${m.nome} em ação" loading="lazy">
        </div>
        <img src="${m.img}" class="rb-card-avatar" alt="${m.nome}">
        <div class="rb-card-body">
            <div class="rb-card-flag"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Brazil.svg/20px-Flag_of_Brazil.svg.png" alt="BR"> Brasil</div>
            <div class="rb-card-name">${m.nome}</div>
            <div class="rb-card-role">${m.titulo}</div>
        </div>
        <div class="rb-card-stats">
            <span>${m.stats?.anos || '-'} anos</span>
            <span>${m.stats?.alunos || '-'} alunos</span>
        </div>
    </div>`;
}

function renderEquipe() {
    const row1 = document.getElementById('equipe-row-1');
    const row2 = document.getElementById('equipe-row-2');
    if (!row1 || !row2) return;
    const equipe = DATA.equipe;
    if (!equipe.length) return;

    // Duplica a lista para permitir o loop infinito de cada linha
    const htmlRow1 = equipe.map(cardEquipeHTML).join('') + equipe.map(cardEquipeHTML).join('');
    const reversed = [...equipe].reverse();
    const htmlRow2 = reversed.map(cardEquipeHTML).join('') + reversed.map(cardEquipeHTML).join('');
    row1.innerHTML = htmlRow1;
    row2.innerHTML = htmlRow2;

    setupMarqueeLoop(row1, -0.45);
    setupMarqueeLoop(row2, 0.45);
    attachEquipeModalEvents();
}

function setupMarqueeLoop(track, speed) {
    if (prefersReducedMotion) return;
    let offset = 0;
    let paused = false;
    track.parentElement.addEventListener('mouseenter', () => paused = true);
    track.parentElement.addEventListener('mouseleave', () => paused = false);
    const halfWidth = () => track.scrollWidth / 2;
    function step() {
        if (!paused) {
            offset += speed;
            const hw = halfWidth();
            if (speed < 0 && Math.abs(offset) >= hw) offset = 0;
            if (speed > 0 && offset >= hw) offset = 0;
            track.style.transform = `translateX(${-offset}px)`;
        }
        requestAnimationFrame(step);
    }
    step();
}

function attachEquipeModalEvents() {
    const modalProf = document.getElementById('modalProf');
    document.querySelectorAll('.rb-card').forEach((card) => {
        card.addEventListener('click', () => {
            document.getElementById('popupProfFoto').src = card.dataset.img;
            document.getElementById('popupProfNome').textContent = card.dataset.nome;
            document.getElementById('popupProfTitulo').textContent = card.dataset.titulo;
            document.getElementById('popupProfBio').textContent = card.dataset.bio;
            document.getElementById('popupProfWhats').href = `https://wa.me/${card.dataset.whats}`;
            modalProf.classList.add('show');
        });
    });
    document.getElementById('closeProf').addEventListener('click', () => modalProf.classList.remove('show'));
    modalProf.addEventListener('click', (e) => { if (e.target === modalProf) modalProf.classList.remove('show'); });
}

/* ==================== 7. AGENDA 4D + GLOBO 3D ==================== */
let globeAnimationId = null;

function renderAgenda() {
    const container = document.getElementById('timeline-container');
    if (!container) return;
    const hoje = new Date();
    const eventos = [...DATA.agenda].sort((a, b) => {
        const dA = new Date(a.dataReal), dB = new Date(b.dataReal);
        const aP = dA < hoje, bP = dB < hoje;
        if (aP === bP) return dA - dB;
        return aP ? 1 : -1;
    });

    container.innerHTML = '';
    eventos.forEach((ev, i) => {
        const passou = new Date(ev.dataReal) < hoje;
        const txtBtn = ev.fotosLink ? '<i class="fas fa-camera"></i> Ver álbum do evento' : '<i class="fas fa-image"></i> Álbum em breve';
        const btnClass = ev.fotosLink ? 'btn-primary' : 'btn-gray';
        const item = document.createElement('div');
        item.className = `timeline-item ${i === 0 ? 'active' : ''} ${passou ? 'evento-concluido' : ''}`;
        item.dataset.title = ev.titulo; item.dataset.date = ev.dataStr; item.dataset.time = `às ${ev.hora}`; item.dataset.location = ev.local;
        item.innerHTML = `
            ${passou ? '<span class="badge-concluido"><i class="fas fa-check-circle"></i> CONCLUÍDO — Álbum virtual</span>' : ''}
            <div style="font-weight: 900; color: var(--blue-vibrant); font-size: 1.2rem;">${ev.dataStr} - ${ev.hora}</div>
            <div style="font-weight: 700; color: var(--text-dark); font-size: 1.1rem;">${ev.titulo}</div>
            <div style="font-size: 0.9rem; color: #666;"><i class="fas fa-map-marker-alt"></i> ${ev.local}</div>
            ${passou ? `<a href="${ev.fotosLink || '#'}" class="btn ${btnClass}" style="padding: 6px 12px; font-size: 0.8rem; margin-top: 8px; width: fit-content;">${txtBtn}</a>` : ''}
        `;
        item.addEventListener('click', () => updateDestaque(item));
        container.appendChild(item);
    });

    const first = container.querySelector('.timeline-item');
    if (first) updateDestaque(first);
}

function updateDestaque(item) {
    document.querySelectorAll('.timeline-item').forEach((el) => el.classList.remove('active'));
    item.classList.add('active');

    const card = document.getElementById('card-destaque');
    if (window.gsap) {
        gsap.fromTo(card, { scale: 0.94, opacity: 0.6 }, { scale: 1, opacity: 1, duration: 0.55, ease: 'power3.out' });
    }
    document.getElementById('dest-title').textContent = item.dataset.title;
    document.getElementById('dest-date').textContent = item.dataset.date;
    document.getElementById('dest-time').textContent = item.dataset.time;
    document.getElementById('dest-location').textContent = item.dataset.location;
    spinGlobeTo(item.dataset.location);
}

// Globo decorativo em Three.js: gira continuamente e crava um pino luminoso.
// Sem serviço de geocoding conectado, a posição do pino é derivada de um hash
// do endereço — cada evento aponta sempre para o mesmo lugar do globo, mas a
// coordenada real do mapa não é calculada aqui (isso pertence à automação de
// Maps do CMS, já existente em gerenciador-site.js).
function spinGlobeTo(address) {
    document.getElementById('globe-pin-label').textContent = address;
    if (typeof THREE === 'undefined') return;
    const canvas = document.getElementById('globe-canvas');
    if (!canvas.dataset.initialized) {
        canvas.dataset.initialized = 'true';
        setupGlobeScene(canvas);
    }
    const hash = [...address].reduce((acc, c) => acc + c.charCodeAt(0), 0);
    window.__globeTargetLat = ((hash % 140) - 70) * (Math.PI / 180);
    window.__globeTargetLon = ((hash * 7 % 360)) * (Math.PI / 180);
}

function setupGlobeScene(canvas) {
    const wrap = canvas.parentElement;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(wrap.clientWidth, wrap.clientHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, wrap.clientWidth / wrap.clientHeight, 0.1, 100);
    camera.position.z = 5;

    const globe = new THREE.Mesh(
        new THREE.SphereGeometry(1.6, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0x0044ff, wireframe: true, transparent: true, opacity: 0.55 })
    );
    scene.add(globe);

    const glow = new THREE.Mesh(
        new THREE.SphereGeometry(1.62, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0x00e6d8, transparent: true, opacity: 0.06 })
    );
    scene.add(glow);

    const pin = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), new THREE.MeshBasicMaterial({ color: 0xffb800 }));
    scene.add(pin);

    window.__globeTargetLat = window.__globeTargetLat || 0.35;
    window.__globeTargetLon = window.__globeTargetLon || 0.6;

    function updatePin() {
        const lat = window.__globeTargetLat, lon = window.__globeTargetLon;
        const R = 1.62;
        pin.position.set(R * Math.cos(lat) * Math.cos(lon), R * Math.sin(lat), R * Math.cos(lat) * Math.sin(lon));
    }

    function animate() {
        globe.rotation.y += 0.004;
        glow.rotation.y += 0.004;
        pin.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.004);
        updatePin.__lastCall = updatePin.__lastCall || 0;
        renderer.render(scene, camera);
        globeAnimationId = requestAnimationFrame(animate);
    }
    updatePin();
    animate();
    setInterval(updatePin, 1500); // realinha o pino periodicamente (evita drift do rotation.y manual)

    window.addEventListener('resize', () => {
        camera.aspect = wrap.clientWidth / wrap.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(wrap.clientWidth, wrap.clientHeight);
    });
}

/* ==================== 8. ACADEMIAS — ONDA DE CHOQUE + ATABAQUE ==================== */
function renderLocais() {
    const container = document.getElementById('locais-container');
    if (!container) return;
    container.innerHTML = '';
    DATA.locais.forEach((d) => {
        const card = document.createElement('div');
        card.className = 'local-card';
        card.innerHTML = `
            <h4 style="color: var(--blue-dark); font-size:1.2rem; margin-bottom:10px;"><i class="fas fa-map-marker-alt" style="color: var(--blue-vibrant);"></i> Polo ${d.nome}</h4>
            <p style="font-size: 0.9rem; color: var(--text-muted);"><i class="fas fa-calendar-alt"></i> ${d.dias}</p>
            <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 10px;"><i class="fas fa-map-pin"></i> ${d.endereco}</p>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top: 15px; border-top: 1px solid var(--border-color); padding-top: 15px;">
                <div style="font-weight: 800; color: var(--blue-dark); font-size: 0.9rem;"><i class="fas fa-user-tie"></i> ${d.prof}</div>
                <a href="https://www.google.com/maps?q=${encodeURIComponent(d.endereco)}" target="_blank" class="btn btn-green btn-atabaque" style="padding: 8px 12px; font-size: 0.8rem;"><i class="fab fa-whatsapp"></i> Agendar</a>
            </div>
        `;
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            if (!card.querySelector('.shockwave-slot')) return;
        });
        card.addEventListener('mouseenter', (e) => spawnShockwave(card, e));
        container.appendChild(card);
    });
}

function spawnShockwave(card, e) {
    const rect = card.getBoundingClientRect();
    const wave = document.createElement('div');
    wave.className = 'shockwave animate';
    wave.style.left = (e.clientX - rect.left) + 'px';
    wave.style.top = (e.clientY - rect.top) + 'px';
    card.appendChild(wave);
    wave.addEventListener('animationend', () => wave.remove());
}

/* ==================== 9. KIDS — BOLHAS, CONFETES E STACK DE CARTAS ==================== */
function renderKidsBubbles() {
    const container = document.getElementById('bubbles-container');
    if (!container) return;
    for (let i = 0; i < 16; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        const size = Math.random() * 40 + 14;
        bubble.style.width = size + 'px'; bubble.style.height = size + 'px';
        bubble.style.left = Math.random() * 100 + '%';
        bubble.style.animationDuration = (Math.random() * 5 + 5) + 's';
        bubble.style.animationDelay = Math.random() * 4 + 's';
        bubble.addEventListener('click', (e) => popBubble(bubble, e));
        container.appendChild(bubble);
    }
}
renderKidsBubbles();

function popBubble(bubble, e) {
    const rect = bubble.getBoundingClientRect();
    const colors = ['#FFD700', '#FF6A00', '#00E676', '#00E6D8', '#ffffff'];
    for (let i = 0; i < 14; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.left = (rect.left + rect.width / 2) + 'px';
        piece.style.top = (rect.top + rect.height / 2) + 'px';
        document.body.appendChild(piece);
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 90 + 40;
        if (window.gsap) {
            gsap.to(piece, { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, opacity: 0, rotation: Math.random() * 360, duration: 0.8, ease: 'power2.out', onComplete: () => piece.remove() });
        } else {
            piece.remove();
        }
    }
    bubble.remove();
}

function renderKidsStack() {
    const stack = document.getElementById('card-stack');
    if (!stack) return;
    const items = DATA.kids;
    stack.innerHTML = '';
    items.forEach((k, i) => {
        const card = document.createElement('div');
        card.className = 'stack-card';
        card.style.backgroundImage = `url(${k.img})`;
        card.style.zIndex = items.length - i;
        card.style.transform = `scale(${1 - i * 0.04}) translateY(${i * 12}px) rotate(${i % 2 === 0 ? -3 : 3}deg)`;
        card.innerHTML = `<div class="stack-caption">${k.caption}</div>`;
        makeCardDraggable(card, stack);
        stack.appendChild(card);
    });
}

function makeCardDraggable(card, stack) {
    let startX = 0, currentX = 0, dragging = false;
    const start = (x) => { dragging = true; startX = x; card.style.transition = 'none'; };
    const move = (x) => {
        if (!dragging) return;
        currentX = x - startX;
        card.style.transform = `translateX(${currentX}px) rotate(${currentX / 18}deg)`;
    };
    const end = () => {
        if (!dragging) return;
        dragging = false;
        card.style.transition = 'transform 0.4s var(--ease-esquiva), opacity 0.4s ease';
        if (Math.abs(currentX) > 100) {
            card.style.transform = `translateX(${currentX > 0 ? 900 : -900}px) rotate(${currentX > 0 ? 40 : -40}deg)`;
            card.style.opacity = '0';
            setTimeout(() => { card.remove(); if (!stack.querySelector('.stack-card')) renderKidsStack(); }, 400);
        } else {
            card.style.transform = '';
        }
        currentX = 0;
    };
    card.addEventListener('mousedown', (e) => start(e.clientX));
    window.addEventListener('mousemove', (e) => move(e.clientX));
    window.addEventListener('mouseup', end);
    card.addEventListener('touchstart', (e) => start(e.touches[0].clientX), { passive: true });
    card.addEventListener('touchmove', (e) => move(e.touches[0].clientX), { passive: true });
    card.addEventListener('touchend', end);
}

/* ==================== 10. LOJA — SHOWROOM COM TILT 3D ==================== */
function renderLoja() {
    const container = document.getElementById('loja-container');
    if (!container) return;
    container.innerHTML = '';
    DATA.loja.forEach((d) => {
        const item = document.createElement('div');
        item.className = 'loja-item';
        item.style.scrollSnapAlign = 'start';
        item.innerHTML = `
            <div class="loja-img-wrap"><img src="${d.img}" class="loja-img" alt="${d.nome}" loading="lazy"></div>
            <h4 style="color: var(--blue-dark); font-size:1.1rem;">${d.nome}</h4>
            <div style="font-size: 1.4rem; color: var(--green-dark); font-weight: 900; margin: 10px 0;">${d.preco}</div>
            <button class="btn btn-primary" style="width:100%;"><i class="fas fa-shopping-cart"></i> Adicionar</button>
            <span class="tilt-hint">Passe o mouse para girar</span>
        `;
        addTiltEffect(item);
        container.appendChild(item);
    });
    setupArrowScroll('loja-container', 'prev-loja', 'next-loja');
}

function addTiltEffect(el) {
    if (prefersReducedMotion || isTouch) return;
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = `perspective(800px) rotateY(${px * 22}deg) rotateX(${-py * 22}deg) translateY(-6px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = 'perspective(800px) rotateY(0) rotateX(0)'; });
}

function setupArrowScroll(containerId, prevId, nextId) {
    const container = document.getElementById(containerId);
    const prev = document.getElementById(prevId);
    const next = document.getElementById(nextId);
    if (!container || !prev || !next) return;
    const step = 300;
    prev.addEventListener('click', () => container.scrollBy({ left: -step, behavior: 'smooth' }));
    next.addEventListener('click', () => container.scrollBy({ left: step, behavior: 'smooth' }));
}

/* ==================== 11. SOM AMBIENTE (WEB AUDIO API) ==================== */
function initSoundToggle() {
    const btn = document.getElementById('soundToggle');
    if (!btn) return;
    let audioCtx = null;
    let enabled = false;
    let lastPluck = 0;

    function pluckBerimbau() {
        if (!enabled || !audioCtx) return;
        const now = audioCtx.currentTime;
        if (now - lastPluck < 0.9) return; // evita repetição excessiva ao rolar
        lastPluck = now;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(196, now); // aproximação do timbre grave do berimbau
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.5);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.12, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start(now); osc.stop(now + 1);
    }

    btn.addEventListener('click', () => {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        enabled = !enabled;
        btn.innerHTML = enabled ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
        if (enabled) pluckBerimbau();
    });

    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        if (!enabled) return;
        if (Math.abs(window.scrollY - lastScrollY) > 250) { pluckBerimbau(); lastScrollY = window.scrollY; }
    });
}
