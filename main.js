document.addEventListener('DOMContentLoaded', () => {

    // 1. DADOS SIMULADOS (Prontos para serem substituídos pelo Firebase CMS depois)
    const corpoMestres = [
        { id: 1, nome: "Mestre Profeta", titulo: "Mestre Fundador", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300", bio: "Mais de 30 anos dedicados à capoeira em Campo Grande.", whats: "5567991293269" },
        { id: 2, nome: "Mestre Omar", titulo: "Mestre", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300", bio: "Preservação da capoeira angola.", whats: "5567991293269" },
        { id: 3, nome: "Mestre Abraão", titulo: "Mestre", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300", bio: "Musicalidade e tradição nas rodas.", whats: "5567991293269" },
        { id: 4, nome: "Mestre Carlinhos", titulo: "Mestre Sênior", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300", bio: "Excelência técnica em fundamentos.", whats: "5567991293269" },
        { id: 5, nome: "Mestre Visitante", titulo: "Convidado Especial", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300", bio: "Mestre convidado de honra.", whats: "5567991293269" }
    ];

    const corpoProfessores = [
        { id: 6, nome: "Professora Taynara", titulo: "Professora", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300", bio: "Especialista em pedagogia infantil na capoeira.", whats: "5567991293269" },
        { id: 7, nome: "Professor Maick", titulo: "Professor", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300", bio: "Focado em alto rendimento físico.", whats: "5567991293269" },
        { id: 8, nome: "Professor Tigoy", titulo: "Professor", img: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300", bio: "Acrobacias e dinâmicas de roda.", whats: "5567991293269" },
        { id: 9, nome: "Professor Rafinha", titulo: "Professor", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300", bio: "Aulas lúdicas e cidadania para jovens.", whats: "5567991293269" },
        { id: 10, nome: "Instrutor Leiliano", titulo: "Instrutor", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300", bio: "Apoio pedagógico contínuo.", whats: "5567991293269" },
        { id: 11, nome: "Professor Lebrinha", titulo: "Professor", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300", bio: "Cultura e respeito mútuo.", whats: "5567991293269" },
        { id: 12, nome: "Professor Visitante 1", titulo: "Convidado", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300", bio: "Apoio Técnico.", whats: "5567991293269" },
        { id: 13, nome: "Instrutor Visitante", titulo: "Convidado", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300", bio: "Apoio Técnico.", whats: "5567991293269" },
        { id: 14, nome: "Graduado Silva", titulo: "Monitor", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300", bio: "Apoio.", whats: "5567991293269" },
        { id: 15, nome: "Graduado Souza", titulo: "Monitor", img: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300", bio: "Apoio.", whats: "5567991293269" }
    ];

    let agendaData = [
        { dataReal: "2024-01-10T19:00", dataStr: "10 DE JAN", titulo: "Aulão de Verão", hora: "19h00", local: "Praça Central", fotosLink: "https://google.com/fotos", mapIframe: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3737.9547515024474!2d-54.61869818465134!3d-20.468249086303254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9486e66cf5367ef3%3A0xc3f58aeb1d5fbc0!2sPra%C3%A7a%20do%20R%C3%A1dio%20Clube!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr" },
        { dataReal: "2026-08-22T15:00", dataStr: "22 DE AGO", titulo: "Batizado Oficial 2026", hora: "15h00", local: "Complexo Santa Emília", fotosLink: "", mapIframe: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3737.9547515024474!2d-54.69746358327932!3d-20.463991207173167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9486e66e8cb57db7%3A0xc39217036a144e78!2sCampo%20Grande%2C%20MS!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr" },
        { dataReal: "2026-08-28T09:00", dataStr: "28 DE AGO", titulo: "Roda de Rua Aberta", hora: "09h00", local: "Praça da Coophasul", fotosLink: "", mapIframe: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3737.9547515024474!2d-54.61869818465134!3d-20.468249086303254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9486e66cf5367ef3%3A0xc3f58aeb1d5fbc0!2sPra%C3%A7a%20do%20R%C3%A1dio%20Clube!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr" },
        { dataReal: "2026-12-15T19:30", dataStr: "15 DE DEZ", titulo: "Encerramento Anual", hora: "19h30", local: "Polo Rochedo", fotosLink: "", mapIframe: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3737.9547515024474!2d-54.69746358327932!3d-20.463991207173167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9486e66e8cb57db7%3A0xc39217036a144e78!2sCampo%20Grande%2C%20MS!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr" }
    ];

    const locaisData = [
        { nome: "Santa Emília", prof: "Mestre Profeta", dias: "Seg/Qua/Sex - 19h", endereco: "Complexo Esportivo do Santa Emília", mapSrc: "https://maps.google.com" },
        { nome: "Rochedo", prof: "Professor Maick", dias: "Ter/Qui - 20h", endereco: "O. Crootis Yfena, 443", mapSrc: "https://maps.google.com" },
        { nome: "Rancho Alegre", prof: "Professor Rafinha", dias: "Seg/Qua - 18h", endereco: "R. Cajarana, 389", mapSrc: "https://maps.google.com" },
        { nome: "Coophasul", prof: "Mestre Omar", dias: "Sábados - 16h", endereco: "Praça Principal", mapSrc: "https://maps.google.com" },
        { nome: "Tiradentes", prof: "Professor Tigoy", dias: "Ter/Qui - 19h", endereco: "Associação de Moradores", mapSrc: "https://maps.google.com" },
        { nome: "Aero Rancho", prof: "Instrutor Leiliano", dias: "Seg/Qua - 20h", endereco: "Escola Municipal", mapSrc: "https://maps.google.com" },
        { nome: "Centro", prof: "Mestre Abraão", dias: "Sex/Sáb - 18h", endereco: "Praça do Rádio", mapSrc: "https://maps.google.com" },
        { nome: "Nova Lima", prof: "Professora Taynara", dias: "Ter/Qui - 17h (Kids)", endereco: "Ginásio Poliesportivo", mapSrc: "https://maps.google.com" },
        { nome: "Moreninhas", prof: "Professor Lebrinha", dias: "Seg/Qua - 19h", endereco: "Centro Comunitário", mapSrc: "https://maps.google.com" },
        { nome: "Unidade 10", prof: "Mestre Carlinhos", dias: "Ter/Qui - 19h30", endereco: "Rua das Laranjeiras, 100", mapSrc: "https://maps.google.com" },
        { nome: "Unidade 11", prof: "Prof. Convidado", dias: "Sábados - 09h", endereco: "Parque das Nações", mapSrc: "https://maps.google.com" },
        { nome: "Unidade 12", prof: "Prof. Convidado", dias: "Domingos - 10h", endereco: "Orla Morena", mapSrc: "https://maps.google.com" }
    ];

    const lojaData = [
        { nome: "Berimbau Casado", preco: "R$ 220,00", img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400" },
        { nome: "Abadá Branca", preco: "R$ 90,00", img: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400" },
        { nome: "Camisa Oficial", preco: "R$ 65,00", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400" },
        { nome: "Pandeiro Couro", preco: "R$ 180,00", img: "https://images.unsplash.com/photo-1543169174-ac58be27914f?w=400" },
        { nome: "Atabaque Rum", preco: "R$ 850,00", img: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400" },
        { nome: "Corda Graduação", preco: "R$ 35,00", img: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400" },
        { nome: "Caxixi Duplo", preco: "R$ 45,00", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400" }
    ];

    const modalProf = document.getElementById('modalProf');

    // 2. RENDERIZAR E ANIMAR EQUIPE (DUAS LINHAS)
    const renderCard = (m) => `
        <div class="scroll-item prof-card" data-id="${m.id}" data-nome="${m.nome}" data-titulo="${m.titulo}" data-bio="${m.bio}" data-img="${m.img}" data-whats="${m.whats}">
            <img src="${m.img}" class="prof-foto">
            <h3 style="color: var(--blue-dark); font-size:1.2rem;">${m.nome}</h3>
            <h4 style="color: var(--blue-vibrant); font-size:0.9rem; margin-bottom: 15px;">${m.titulo}</h4>
            <button class="btn btn-primary" style="padding: 6px 16px; font-size:0.8rem;"><i class="fas fa-plus"></i> Perfil</button>
        </div>`;

    document.getElementById('mestres-container').innerHTML = corpoMestres.map(renderCard).join('');
    document.getElementById('professores-container').innerHTML = corpoProfessores.map(renderCard).join('');

    // Clique modal do profissional
    document.querySelectorAll('.prof-card').forEach(card => {
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
    modalProf.addEventListener('click', (e) => { if(e.target === modalProf) modalProf.classList.remove('show'); });

    // Auto-scroll Duplo (Esquerda e Direita)
    let sRight = 0; let sLeft = 0;
    const cRight = document.getElementById('mestres-container');
    const cLeft = document.getElementById('professores-container');
    setInterval(() => {
        if(!cRight.matches(':hover')) { sRight += 1; cRight.scrollTo(sRight, 0); if(sRight >= cRight.scrollWidth - cRight.clientWidth) sRight = 0; }
        if(!cLeft.matches(':hover')) { sLeft += 1; cLeft.scrollTo(sLeft, 0); if(sLeft >= cLeft.scrollWidth - cLeft.clientWidth) sLeft = 0; }
    }, 25);

    // 3. AGENDA DINÂMICA
    const hoje = new Date();
    // Ordenar (Futuros primeiro, depois passados)
    agendaData.sort((a, b) => {
        const dA = new Date(a.dataReal); const dB = new Date(b.dataReal);
        const aP = dA < hoje; const bP = dB < hoje;
        if(aP === bP) return dA - dB;
        return aP ? 1 : -1;
    });

    const agendaContainer = document.getElementById('timeline-container');
    agendaData.forEach((ev, index) => {
        const passou = new Date(ev.dataReal) < hoje;
        const btnClass = ev.fotosLink ? 'btn-primary' : 'btn-gray';
        const txtBtn = ev.fotosLink ? '<i class="fas fa-camera"></i> Ver Fotos' : '<i class="fas fa-image"></i> Indisponível';
        
        agendaContainer.innerHTML += `
            <div class="timeline-item ${index===0?'active':''} ${passou?'evento-concluido':''}" 
                 data-title="${ev.titulo}" data-date="${ev.dataStr}" data-time="às ${ev.hora}" data-location="${ev.local}" data-map="${ev.mapIframe}">
                ${passou ? '<span class="badge-concluido"><i class="fas fa-check-circle"></i> CONCLUÍDO</span>' : ''}
                <div style="font-weight: 900; color: var(--blue-vibrant); font-size: 1.2rem;">${ev.dataStr} - ${ev.hora}</div>
                <div style="font-weight: 700; color: var(--text-dark); font-size: 1.1rem;">${ev.titulo}</div>
                <div style="font-size: 0.9rem; color: #666;"><i class="fas fa-map-marker-alt"></i> ${ev.local}</div>
                ${passou ? `<a href="${ev.fotosLink || '#'}" class="btn ${btnClass}" style="padding: 6px 12px; font-size: 0.8rem; margin-top: 8px; width: fit-content;">${txtBtn}</a>` : ''}
            </div>
        `;
    });

    // Função de clique na agenda para carregar MAPA
    const updateDestaque = (item) => {
        document.querySelectorAll('.timeline-item').forEach(el => el.classList.remove('active'));
        item.classList.add('active');
        document.getElementById('dest-title').textContent = item.dataset.title;
        document.getElementById('dest-date').textContent = item.dataset.date;
        document.getElementById('dest-time').textContent = item.dataset.time;
        document.getElementById('dest-location').textContent = item.dataset.location;
        document.getElementById('dest-map-iframe').src = item.dataset.map;
    };
    
    // Auto-click no primeiro item para inicializar o mapa
    const firstItem = document.querySelector('.timeline-item');
    if(firstItem) updateDestaque(firstItem);

    document.querySelectorAll('.timeline-item').forEach(item => {
        item.addEventListener('click', function() { updateDestaque(this); });
    });

    // 4. ACADEMIAS E LOCAIS
    const locaisContainer = document.getElementById('locais-container');
    locaisData.forEach((l, i) => {
        locaisContainer.innerHTML += `
            <div class="local-card">
                <h4 style="color: var(--blue-dark); font-size:1.2rem; margin-bottom:10px;"><i class="fas fa-map-marker-alt" style="color: var(--blue-vibrant);"></i> Polo ${l.nome}</h4>
                <p style="font-size: 0.9rem; color: var(--text-muted);"><i class="fas fa-calendar-alt"></i> ${l.dias}</p>
                <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 10px;"><i class="fas fa-map-pin"></i> ${l.endereco}</p>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top: 15px; border-top: 1px solid var(--border-color); padding-top: 15px;">
                    <div style="font-weight: 800; color: var(--blue-dark); font-size: 0.9rem;"><i class="fas fa-user-tie"></i> ${l.prof}</div>
                    <a href="${l.mapSrc}" target="_blank" class="btn btn-green" style="padding: 8px 12px; font-size: 0.8rem;"><i class="fas fa-location-arrow"></i> Mapa / Contato</a>
                </div>
            </div>
        `;
    });

    // 5. LOJA ONLINE (5 ITENS E AUTO SCROLL)
    const lojaContainer = document.getElementById('loja-container');
    lojaData.forEach(p => {
        lojaContainer.innerHTML += `
            <div class="loja-item">
                <img src="${p.img}" class="loja-img">
                <h4 style="color: var(--blue-dark); font-size:1.1rem;">${p.nome}</h4>
                <div style="font-size: 1.4rem; color: var(--green-dark); font-weight: 900; margin: 10px 0;">${p.preco}</div>
                <button class="btn btn-primary" style="width:100%;"><i class="fas fa-shopping-cart"></i> Adicionar</button>
            </div>
        `;
    });
    
    let scrollLoja = 0;
    setInterval(() => {
        if(lojaContainer.matches(':hover')) return;
        scrollLoja += 1;
        lojaContainer.scrollTo(scrollLoja, 0);
        if (scrollLoja >= (lojaContainer.scrollWidth - lojaContainer.clientWidth)) scrollLoja = 0;
    }, 25);

    // 6. MÓDULO KIDS (SLIDER FIGMA E BOLHAS)
    const bubblesContainer = document.getElementById('bubbles-container');
    for (let i = 0; i < 15; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        const size = Math.random() * 40 + 10 + 'px';
        bubble.style.width = size; bubble.style.height = size;
        bubble.style.left = Math.random() * 100 + '%';
        bubble.style.animationDuration = (Math.random() * 4 + 4) + 's';
        bubble.style.animationDelay = Math.random() * 3 + 's';
        bubblesContainer.appendChild(bubble);
    }

    const slides = document.querySelectorAll('.slider-images .slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    let currentSlide = 0;

    const goSlide = (idx) => {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        slides[idx].classList.add('active');
        dots[idx].classList.add('active');
        currentSlide = idx;
    };

    dots.forEach(dot => {
        dot.addEventListener('click', function() { goSlide(parseInt(this.dataset.idx)); });
    });

    setInterval(() => { goSlide((currentSlide + 1) % slides.length); }, 4000);

    // 7. HEADER E LOGO 3D
    const hamburger = document.getElementById('hamburger');
    hamburger.addEventListener('click', () => {
        document.getElementById('nav-menu-left').classList.toggle('active');
        document.getElementById('nav-menu-right').classList.toggle('active');
    });

    const logoContainer = document.getElementById('logo-container');
    const logoImg = document.getElementById('logo-img');
    logoContainer.addEventListener('mousemove', (e) => {
        const rect = logoContainer.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        logoImg.style.transform = `rotateX(${-(y / 2)}deg) rotateY(${(x / 2)}deg) scale(1.1)`;
    });
    logoContainer.addEventListener('mouseleave', () => {
        logoImg.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
    });
});
