// main.js
document.addEventListener('DOMContentLoaded', () => {

    // 1. DADOS SIMULADOS (Pronto para puxar do CMS Firebase)
    const mestresData = [
        { id: 1, nome: "Mestre Profeta", titulo: "Mestre Fundador", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300", bio: "Mais de 30 anos dedicados à capoeira em Campo Grande.", whats: "5567991293269", maps: "https://maps.google.com" },
        { id: 2, nome: "Professora Taynara", titulo: "Professora", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300", bio: "Especialista em pedagogia infantil.", whats: "5567991293269", maps: "#" },
        { id: 3, nome: "Mestre Omar", titulo: "Mestre", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300", bio: "Preservação da capoeira angola.", whats: "5567991293269", maps: "#" },
        { id: 4, nome: "Mestre Abraão", titulo: "Mestre", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300", bio: "Musicalidade e tradição.", whats: "5567991293269", maps: "#" },
        { id: 5, nome: "Mestre Carlinhos", titulo: "Mestre Sênior", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300", bio: "Excelência técnica em fundamentos.", whats: "5567991293269", maps: "#" },
        { id: 6, nome: "Professor Maick", titulo: "Professor", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300", bio: "Alto rendimento físico.", whats: "5567991293269", maps: "#" },
        { id: 7, nome: "Professor Tigoy", titulo: "Professor", img: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300", bio: "Acrobacias e dinâmicas.", whats: "5567991293269", maps: "#" },
        { id: 8, nome: "Professor Rafinha", titulo: "Professor", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300", bio: "Aulas lúdicas e cidadania.", whats: "5567991293269", maps: "#" },
        { id: 9, nome: "Instrutor Leiliano", titulo: "Instrutor", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300", bio: "Apoio pedagógico diário.", whats: "5567991293269", maps: "#" },
        { id: 10, nome: "Professor Lebrinha", titulo: "Professor", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300", bio: "Respeito mútuo.", whats: "5567991293269", maps: "#" },
        { id: 11, nome: "Professor Visitante 1", titulo: "Convidado", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300", bio: "Apoio.", whats: "5567991293269", maps: "#" },
        { id: 12, nome: "Professor Visitante 2", titulo: "Convidado", img: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300", bio: "Apoio.", whats: "5567991293269", maps: "#" },
        { id: 13, nome: "Professor Visitante 3", titulo: "Convidado", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300", bio: "Apoio.", whats: "5567991293269", maps: "#" },
        { id: 14, nome: "Professor Visitante 4", titulo: "Convidado", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300", bio: "Apoio.", whats: "5567991293269", maps: "#" },
        { id: 15, nome: "Instrutor Apoio", titulo: "Apoio Técnico", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300", bio: "Apoio.", whats: "5567991293269", maps: "#" }
    ];

    let agendaData = [
        { dataReal: "2024-01-10T19:00", dataStr: "10 DE JAN", titulo: "Aulão de Verão", hora: "19h00", local: "Praça Central", fotosLink: "https://google.com/fotos" },
        { dataReal: "2026-08-22T15:00", dataStr: "22 DE AGO", titulo: "Batizado Oficial 2026", hora: "15h00", local: "Complexo Santa Emília", fotosLink: "" },
        { dataReal: "2026-08-28T09:00", dataStr: "28 DE AGO", titulo: "Roda de Rua Aberta", hora: "09h00", local: "Praça da Coophasul", fotosLink: "https://google.com/fotos2" },
        { dataReal: "2026-12-15T19:30", dataStr: "15 DE DEZ", titulo: "Encerramento Anual", hora: "19h30", local: "Polo Rochedo", fotosLink: "" }
    ];

    const lojaData = [
        { nome: "Berimbau Casado", preco: "R$ 220,00", img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400" },
        { nome: "Abadá Branca", preco: "R$ 90,00", img: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400" },
        { nome: "Camisa Treino", preco: "R$ 65,00", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400" },
        { nome: "Pandeiro Couro", preco: "R$ 180,00", img: "https://images.unsplash.com/photo-1543169174-ac58be27914f?w=400" },
        { nome: "Atabaque Rum", preco: "R$ 850,00", img: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400" },
        { nome: "Corda Oficial", preco: "R$ 35,00", img: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400" },
        { nome: "Caxixi Duplo", preco: "R$ 45,00", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400" },
        { nome: "Reco-Reco", preco: "R$ 60,00", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400" }
    ];

    // 2. RENDERIZAR MESTRES (Mosaico)
    const mestresContainer = document.getElementById('mestres-container');
    const modalProf = document.getElementById('modalProf');
    
    mestresData.forEach(m => {
        mestresContainer.innerHTML += `
            <div class="mestre-card" data-id="${m.id}">
                <img src="${m.img}" class="mestre-foto">
                <div>
                    <h3 style="color: var(--blue-dark); font-size:1.3rem;">${m.nome}</h3>
                    <h4 style="color: var(--blue-vibrant); font-size:0.9rem; margin-bottom: 10px;">${m.titulo}</h4>
                    <button class="btn btn-primary" style="padding: 8px 20px; font-size:0.8rem;"><i class="fas fa-plus"></i> Perfil</button>
                </div>
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
    document.getElementById('closeProf').addEventListener('click', () => modalProf.classList.remove('show'));

    // 3. RENDERIZAR AGENDA COM ORDENAÇÃO
    const hoje = new Date();
    // Ordena: Eventos futuros primeiro, depois os concluídos
    agendaData.sort((a, b) => {
        const dataA = new Date(a.dataReal);
        const dataB = new Date(b.dataReal);
        const aPassou = dataA < hoje;
        const bPassou = dataB < hoje;
        if (aPassou === bPassou) return dataA - dataB;
        return aPassou ? 1 : -1;
    });

    const agendaContainer = document.getElementById('timeline-container');
    agendaData.forEach((ev, index) => {
        const dataEv = new Date(ev.dataReal);
        const passou = dataEv < hoje;
        const btnClass = ev.fotosLink ? 'btn-primary' : 'btn-gray';
        
        agendaContainer.innerHTML += `
            <div class="timeline-item ${passou ? 'evento-concluido' : ''}" 
                 data-title="${ev.titulo}" data-date="${ev.dataStr}" data-location="${ev.local}">
                ${passou ? '<span style="color:#E74C3C; font-weight:bold; font-size:0.8rem;"><i class="fas fa-check-circle"></i> EVENTO CONCLUÍDO</span>' : ''}
                <div style="font-weight: 900; color: var(--blue-vibrant); font-size: 1.2rem;">${ev.dataStr} - ${ev.hora}</div>
                <div style="font-weight: 700; color: var(--text-dark); font-size: 1.1rem;">${ev.titulo}</div>
                <div style="font-size: 0.9rem; color: #666;"><i class="fas fa-map-marker-alt"></i> ${ev.local}</div>
                ${passou ? `<a href="${ev.fotosLink || '#'}" class="btn ${btnClass}" style="padding: 6px 12px; font-size: 0.8rem; margin-top: 5px; width: fit-content;"><i class="fas fa-camera"></i> Ver Fotos</a>` : ''}
            </div>
        `;
    });

    document.querySelectorAll('.timeline-item').forEach(item => {
        item.addEventListener('click', function() {
            document.getElementById('dest-title').textContent = this.getAttribute('data-title');
            document.getElementById('dest-date').textContent = this.getAttribute('data-date');
            document.getElementById('dest-location').textContent = this.getAttribute('data-location');
        });
    });

    // 4. RENDERIZAR LOCAIS (12 items gerados no JS)
    const locaisContainer = document.getElementById('locais-container');
    for(let i=1; i<=12; i++) {
        locaisContainer.innerHTML += `
            <div class="local-card">
                <h4 style="color: var(--blue-dark); font-size:1.2rem; margin-bottom:10px;"><i class="fas fa-map-marker-alt" style="color: var(--blue-vibrant);"></i> Polo Academia ${i}</h4>
                <p style="font-size: 0.9rem; color: var(--text-muted);"><i class="fas fa-calendar-alt"></i> Seg e Qua - 19h</p>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top: 15px;">
                    <a href="https://maps.google.com" target="_blank" style="color:var(--blue-vibrant); font-weight:bold; font-size:0.9rem;"><i class="fas fa-directions"></i> Ver Mapa</a>
                    <a href="https://wa.me/5567991293269" target="_blank" class="btn btn-green" style="padding: 8px 15px; font-size: 0.85rem;"><i class="fab fa-whatsapp"></i> Agendar</a>
                </div>
            </div>
        `;
    }

    // 5. LOJA AUTO-SCROLL
    const lojaContainer = document.getElementById('loja-container');
    lojaData.forEach(p => {
        lojaContainer.innerHTML += `
            <div class="loja-item">
                <img src="${p.img}" style="width:100%; height:150px; object-fit:cover; border-radius:10px; margin-bottom:15px;">
                <h4 style="color: var(--blue-dark); font-size:1.1rem;">${p.nome}</h4>
                <div style="font-size: 1.4rem; color: var(--green-dark); font-weight: 900; margin: 10px 0;">${p.preco}</div>
                <button class="btn btn-primary" style="width:100%;"><i class="fas fa-shopping-cart"></i></button>
            </div>
        `;
    });

    let scrollAmount = 0;
    setInterval(() => {
        if(lojaContainer.matches(':hover')) return;
        scrollAmount += 1;
        lojaContainer.scrollTo(scrollAmount, 0);
        if (scrollAmount >= (lojaContainer.scrollWidth - lojaContainer.clientWidth)) scrollAmount = 0;
    }, 20);

    // 6. ANIMAÇÃO DE BOLHAS E SLIDER KIDS
    const bubblesContainer = document.getElementById('bubbles-container');
    for (let i = 0; i < 15; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        const size = Math.random() * 40 + 10 + 'px';
        bubble.style.width = size;
        bubble.style.height = size;
        bubble.style.left = Math.random() * 100 + '%';
        bubble.style.animationDuration = (Math.random() * 5 + 5) + 's';
        bubble.style.animationDelay = Math.random() * 5 + 's';
        bubblesContainer.appendChild(bubble);
    }

    const imagensKids = [
        "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800",
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800",
        "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=800"
    ];
    let sliderIndex = 0;
    setInterval(() => {
        sliderIndex = (sliderIndex + 1) % imagensKids.length;
        const imgEl = document.getElementById('kids-slider');
        imgEl.style.opacity = 0;
        setTimeout(() => { imgEl.src = imagensKids[sliderIndex]; imgEl.style.opacity = 1; }, 500);
    }, 3500);
});
