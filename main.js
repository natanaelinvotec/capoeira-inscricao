document.addEventListener('DOMContentLoaded', () => {

    // 1. DADOS SIMULADOS (Pronto para conectar com o Firebase do CMS)
    const mestresData = [
        { id: 1, nome: "Mestre Profeta", titulo: "Mestre Fundador", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300", bio: "Mais de 30 anos dedicados à capoeira em Campo Grande.", whats: "5567991293269", maps: "#" },
        { id: 2, nome: "Professora Taynara", titulo: "Professora", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300", bio: "Especialista em pedagogia infantil na capoeira.", whats: "5567991293269", maps: "#" },
        { id: 3, nome: "Mestre Omar", titulo: "Mestre", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300", bio: "Preservação da capoeira angola e regional.", whats: "5567991293269", maps: "#" },
        { id: 4, nome: "Mestre Abraão", titulo: "Mestre", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300", bio: "Musicalidade e tradição nas rodas.", whats: "5567991293269", maps: "#" },
        { id: 5, nome: "Mestre Carlinhos", titulo: "Mestre Sênior", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300", bio: "Excelência técnica em fundamentos.", whats: "5567991293269", maps: "#" },
        { id: 6, nome: "Professor Maick", titulo: "Professor", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300", bio: "Alto rendimento físico.", whats: "5567991293269", maps: "#" },
        { id: 7, nome: "Professor Tigoy", titulo: "Professor", img: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300", bio: "Acrobacias e dinâmicas de roda.", whats: "5567991293269", maps: "#" },
        { id: 8, nome: "Professor Rafinha", titulo: "Professor", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300", bio: "Aulas lúdicas e cidadania.", whats: "5567991293269", maps: "#" },
        { id: 9, nome: "Instrutor Leiliano", titulo: "Instrutor", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300", bio: "Apoio pedagógico diário.", whats: "5567991293269", maps: "#" },
        { id: 10, nome: "Professor Lebrinha", titulo: "Professor", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300", bio: "Musicalidade e respeito mútuo.", whats: "5567991293269", maps: "#" },
        // ... (Simulando até 15 com dados repetidos para o exemplo)
        { id: 11, nome: "Prof. Visitante 1", titulo: "Convidado", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300", bio: "Apoio Técnico", whats: "5567991293269", maps: "#" },
        { id: 12, nome: "Prof. Visitante 2", titulo: "Convidado", img: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300", bio: "Apoio Técnico", whats: "5567991293269", maps: "#" }
    ];

    const locaisData = [
        { nome: "Santa Emília", prof: "Mestre Profeta", dias: "Seg/Qua/Sex - 19h", endereco: "Complexo Esportivo do Santa Emília", mapSrc: "https://www.google.com/maps/embed?..." },
        { nome: "Rochedo", prof: "Professor Maick", dias: "Ter/Qui - 20h", endereco: "O. Crootis Yfena, 443", mapSrc: "https://www.google.com/maps/embed?..." },
        { nome: "Rancho Alegre", prof: "Professor Rafinha", dias: "Seg/Qua - 18h", endereco: "R. Cajarana, 389", mapSrc: "https://www.google.com/maps/embed?..." },
        { nome: "Coophasul", prof: "Mestre Omar", dias: "Sábados - 16h", endereco: "Praça Principal", mapSrc: "https://www.google.com/maps/embed?..." },
        { nome: "Tiradentes", prof: "Professor Tigoy", dias: "Ter/Qui - 19h", endereco: "Associação de Moradores", mapSrc: "https://www.google.com/maps/embed?..." },
        { nome: "Aero Rancho", prof: "Instrutor Leiliano", dias: "Seg/Qua - 20h", endereco: "Escola Municipal", mapSrc: "https://www.google.com/maps/embed?..." },
        { nome: "Centro", prof: "Mestre Abraão", dias: "Sex/Sáb - 18h", endereco: "Praça do Rádio", mapSrc: "https://www.google.com/maps/embed?..." },
        { nome: "Nova Lima", prof: "Professora Taynara", dias: "Ter/Qui - 17h (Kids)", endereco: "Ginásio Poliesportivo", mapSrc: "https://www.google.com/maps/embed?..." },
        { nome: "Moreninhas", prof: "Professor Lebrinha", dias: "Seg/Qua - 19h", endereco: "Centro Comunitário", mapSrc: "https://www.google.com/maps/embed?..." },
        { nome: "Unidade 10", prof: "Mestre Carlinhos", dias: "Ter/Qui - 19h30", endereco: "Rua das Laranjeiras, 100", mapSrc: "https://www.google.com/maps/embed?..." },
        { nome: "Unidade 11", prof: "Prof. Convidado", dias: "Sábados - 09h", endereco: "Parque das Nações", mapSrc: "https://www.google.com/maps/embed?..." },
        { nome: "Unidade 12", prof: "Prof. Convidado", dias: "Domingos - 10h", endereco: "Orla Morena", mapSrc: "https://www.google.com/maps/embed?..." }
    ];

    const agendaData = [
        { dataReal: "2024-01-10T19:00", dataStr: "10 DE JAN", titulo: "Aulão de Verão", hora: "19h00", local: "Praça Central", concluido: true, link: "#fotos" },
        { dataReal: "2026-08-22T15:00", dataStr: "22 DE AGO", titulo: "Batizado Oficial 2026", hora: "15h00", local: "Complexo Santa Emília", concluido: false, link: "" },
        { dataReal: "2026-08-28T09:00", dataStr: "28 DE AGO", titulo: "Roda de Rua Aberta", hora: "09h00", local: "Praça da Coophasul", concluido: false, link: "" },
        { dataReal: "2026-09-15T19:30", dataStr: "15 DE SET", titulo: "Aulão Inter-Academias", hora: "19h30", local: "Polo Rochedo", concluido: false, link: "" },
        { dataReal: "2026-10-12T16:00", dataStr: "12 DE OUT", titulo: "Roda Especial Kids", hora: "16h00", local: "Rancho Alegre", concluido: false, link: "" },
        { dataReal: "2026-11-20T18:00", dataStr: "20 DE NOV", titulo: "Apresentação Consciência Negra", hora: "18h00", local: "Centro da Cidade", concluido: false, link: "" }
    ];

    const lojaData = [
        { nome: "Berimbau Casado", preco: "R$ 220,00", img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400" },
        { nome: "Abadá Branca", preco: "R$ 90,00", img: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400" },
        { nome: "Camisa Treino", preco: "R$ 65,00", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400" },
        { nome: "Pandeiro Couro", preco: "R$ 180,00", img: "https://images.unsplash.com/photo-1543169174-ac58be27914f?w=400" },
        { nome: "Atabaque Rum", preco: "R$ 850,00", img: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400" },
        { nome: "Corda/Cordão", preco: "R$ 35,00", img: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400" }
    ];

    // 2. RENDERIZAR MESTRES E MODAL
    const mestresContainer = document.getElementById('mestres-container');
    const modalProf = document.getElementById('modalProf');
    const closeProf = document.getElementById('closeProf');

    mestresData.forEach(m => {
        mestresContainer.innerHTML += `
            <div class="scroll-item mestre-card" data-id="${m.id}">
                <img src="${m.img}" alt="${m.nome}" class="mestre-foto">
                <h3 style="color: var(--blue-dark);">${m.nome}</h3>
                <h4 style="color: var(--blue-vibrant); font-size: 0.9rem;">${m.titulo}</h4>
                <button class="btn btn-primary" style="margin-top:15px; padding:8px 15px; font-size:0.85rem;"><i class="fas fa-plus"></i> Ver Perfil</button>
            </div>
        `;
    });

    document.querySelectorAll('.mestre-card').forEach(card => {
        card.addEventListener('click', () => {
            const m = mestresData.find(x => x.id == card.getAttribute('data-id'));
            document.getElementById('popupProfFoto').src = m.img;
            document.getElementById('popupProfNome').textContent = m.nome;
            document.getElementById('popupProfTitulo').textContent = m.titulo;
            document.getElementById('popupProfBio').textContent = m.bio;
            document.getElementById('popupProfWhats').href = `https://wa.me/${m.whats}`;
            document.getElementById('popupProfMaps').href = m.maps;
            modalProf.classList.add('show');
        });
    });

    closeProf.addEventListener('click', () => modalProf.classList.remove('show'));
    modalProf.addEventListener('click', (e) => { if(e.target === modalProf) modalProf.classList.remove('show'); });

    // 3. RENDERIZAR AGENDA
    const agendaContainer = document.getElementById('timeline-container');
    const hoje = new Date();

    agendaData.forEach((ev, index) => {
        const dataEv = new Date(ev.dataReal);
        const passou = dataEv < hoje;
        
        agendaContainer.innerHTML += `
            <div class="timeline-item ${index === 1 ? 'active' : ''} ${passou ? 'evento-concluido' : ''}" 
                 data-title="${ev.titulo}" data-date="${ev.dataStr}" data-time="às ${ev.hora}" data-location="${ev.local}">
                ${passou ? '<span class="badge-concluido"><i class="fas fa-check"></i> CONCLUÍDO</span><br>' : ''}
                <div style="font-weight: 900; color: var(--blue-vibrant); font-size: 1.2rem;">${ev.dataStr}</div>
                <div style="font-weight: 700; color: var(--text-dark); font-size: 1.1rem;">${ev.titulo}</div>
                ${passou && ev.link ? `<a href="${ev.link}" class="btn btn-green" style="padding: 5px 15px; font-size: 0.8rem; margin-top: 10px;"><i class="fas fa-camera"></i> Ver Fotos</a>` : ''}
            </div>
        `;
    });

    // Clique na Agenda
    document.querySelectorAll('.timeline-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.timeline-item').forEach(el => el.classList.remove('active'));
            this.classList.add('active');
            
            document.getElementById('dest-title').textContent = this.getAttribute('data-title');
            document.getElementById('dest-date').textContent = this.getAttribute('data-date');
            document.getElementById('dest-time').textContent = this.getAttribute('data-time');
            document.getElementById('dest-location').textContent = this.getAttribute('data-location');
        });
    });

    // 4. RENDERIZAR ACADEMIAS (12 LOCAIS)
    const locaisContainer = document.getElementById('locais-container');
    locaisData.forEach(l => {
        locaisContainer.innerHTML += `
            <div class="local-card">
                <h4 style="color: var(--blue-dark); font-size:1.2rem;"><i class="fas fa-map-marker-alt" style="color: var(--blue-vibrant);"></i> Polo ${l.nome}</h4>
                <p style="font-size: 0.9rem; color: var(--text-muted);"><i class="fas fa-calendar-alt"></i> ${l.dias}</p>
                <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 10px;"><i class="fas fa-map-pin"></i> ${l.endereco}</p>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div style="font-weight: 800; color: var(--blue-dark); font-size: 0.9rem;"><i class="fas fa-user-tie"></i> ${l.prof}</div>
                    <a href="https://wa.me/5567991293269" target="_blank" class="btn btn-green" style="padding: 6px 12px; font-size: 0.8rem;"><i class="fab fa-whatsapp"></i> Agendar Aula</a>
                </div>
            </div>
        `;
    });

    // 5. SLIDER KIDS
    const imagensKids = [
        "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600",
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600",
        "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600"
    ];
    let sliderIndex = 0;
    setInterval(() => {
        sliderIndex = (sliderIndex + 1) % imagensKids.length;
        const imgEl = document.getElementById('kids-slider');
        imgEl.style.opacity = 0;
        setTimeout(() => {
            imgEl.src = imagensKids[sliderIndex];
            imgEl.style.opacity = 1;
        }, 300);
    }, 4000);

    // 6. RENDERIZAR LOJA E AUTO-SCROLL
    const lojaContainer = document.getElementById('loja-container');
    lojaData.forEach(p => {
        lojaContainer.innerHTML += `
            <div class="scroll-item produto-card">
                <img src="${p.img}" class="produto-img">
                <h4 style="color: var(--blue-dark);">${p.nome}</h4>
                <div style="font-size: 1.5rem; color: var(--green-dark); font-weight: 900; margin: 15px 0;">${p.preco}</div>
                <button class="btn btn-primary" style="width:100%;"><i class="fas fa-shopping-cart"></i> Comprar</button>
            </div>
        `;
    });

    // Auto-scroll loop for Store
    let scrollAmount = 0;
    setInterval(() => {
        if(lojaContainer.matches(':hover')) return; // Pausa se o mouse estiver em cima
        scrollAmount += 2;
        lojaContainer.scrollTo(scrollAmount, 0);
        if (scrollAmount >= (lojaContainer.scrollWidth - lojaContainer.clientWidth)) {
            scrollAmount = 0; // Reseta pro inicio
        }
    }, 30);

    // 7. MENU MOBILE E LOGO 3D
    document.getElementById('hamburger').addEventListener('click', () => {
        document.getElementById('nav-menu-left').classList.toggle('active');
        document.getElementById('nav-menu-right').classList.toggle('active');
    });

    const logoContainer = document.getElementById('logo-container');
    const logoImg = document.getElementById('logo-img');

    logoContainer.addEventListener('mousemove', (e) => {
        const rect = logoContainer.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        logoImg.style.transform = `rotateX(${-(y / 3)}deg) rotateY(${(x / 3)}deg) scale(1.1)`;
    });

    logoContainer.addEventListener('mouseleave', () => {
        logoImg.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
    });

});