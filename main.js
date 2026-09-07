document.addEventListener('DOMContentLoaded', () => {

    // 1. DADOS DA EQUIPE (Fotos Cover de Ação e Fotos de Perfil)
    const equipeData = [
        { id: 1, nome: "L7NNON", titulo: "Skate", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200", coverImg: "https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?w=500", whats: "5567991293269" },
        { id: 2, nome: "Fernanda Maciel", titulo: "Corrida", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200", coverImg: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500", whats: "5567991293269" },
        { id: 3, nome: "João Chianca", titulo: "Surfe", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200", coverImg: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=500", whats: "5567991293269" },
        { id: 4, nome: "Leticia Bufoni", titulo: "Skate", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200", coverImg: "https://images.unsplash.com/photo-1563299796-17596c35a7ea?w=500", whats: "5567991293269" },
        { id: 5, nome: "Endrick", titulo: "Futebol", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200", coverImg: "https://images.unsplash.com/photo-1574629810360-7efbb211a53c?w=500", whats: "5567991293269" },
        { id: 6, nome: "Mestre Profeta", titulo: "Capoeira", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200", coverImg: "https://images.unsplash.com/photo-1599839619722-39751411ea63?w=500", whats: "5567991293269" }
    ];

    let agendaData = [
        { dataReal: "2024-01-10T19:00", dataStr: "10 DE JAN", titulo: "Aulão de Verão", hora: "19h00", local: "Praça Central", fotosLink: "https://google.com/fotos", mapIframe: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3737.9547515024474!2d-54.61869818465134!3d-20.468249086303254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9486e66cf5367ef3%3A0xc3f58aeb1d5fbc0!2sPra%C3%A7a%20do%20R%C3%A1dio%20Clube!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr" },
        { dataReal: "2026-08-22T15:00", dataStr: "22 DE AGO", titulo: "Batizado Oficial 2026", hora: "15h00", local: "Complexo Santa Emília", fotosLink: "", mapIframe: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3737.9547515024474!2d-54.69746358327932!3d-20.463991207173167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9486e66e8cb57db7%3A0xc39217036a144e78!2sCampo%20Grande%2C%20MS!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr" },
        { dataReal: "2026-08-28T09:00", dataStr: "28 DE AGO", titulo: "Roda de Rua Aberta", hora: "09h00", local: "Praça da Coophasul", fotosLink: "", mapIframe: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3737.9547515024474!2d-54.61869818465134!3d-20.468249086303254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9486e66cf5367ef3%3A0xc3f58aeb1d5fbc0!2sPra%C3%A7a%20do%20R%C3%A1dio%20Clube!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr" },
        { dataReal: "2026-12-15T19:30", dataStr: "15 DE DEZ", titulo: "Encerramento Anual", hora: "19h30", local: "Polo Rochedo", fotosLink: "", mapIframe: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3737.9547515024474!2d-54.69746358327932!3d-20.463991207173167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9486e66e8cb57db7%3A0xc39217036a144e78!2sCampo%20Grande%2C%20MS!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr" }
    ];

    const locaisData = Array.from({length: 12}, (_, i) => ({
        nome: `Unidade ${i+1}`, prof: "Equipe Liberdade", dias: "Seg/Qua - 19h", endereco: `Rua da Capoeira, ${i}00`
    }));

    const lojaData = [
        { nome: "Berimbau", preco: "R$ 220,00", img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400" },
        { nome: "Abadá Oficial", preco: "R$ 90,00", img: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400" },
        { nome: "Camisa Treino", preco: "R$ 65,00", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400" },
        { nome: "Pandeiro", preco: "R$ 180,00", img: "https://images.unsplash.com/photo-1543169174-ac58be27914f?w=400" },
        { nome: "Atabaque", preco: "R$ 850,00", img: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400" },
        { nome: "Corda Oficial", preco: "R$ 35,00", img: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400" }
    ];

    // 2. RENDERIZAR EQUIPE (RED BULL STYLE SLIDER)
    const renderRBCard = (m) => `
        <div class="rb-card" data-id="${m.id}">
            <div style="position:relative; height: 350px;">
                <img src="${m.coverImg}" class="rb-card-cover" alt="Ação">
                <img src="${m.img}" class="rb-card-avatar" alt="${m.nome}">
            </div>
            <div class="rb-card-body">
                <div class="rb-card-flag">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Brazil.svg/20px-Flag_of_Brazil.svg.png" alt="BR"> Brasil
                </div>
                <div class="rb-card-name">${m.nome}</div>
                <div class="rb-card-role">${m.titulo}</div>
            </div>
        </div>`;

    const equipeContainer = document.getElementById('equipe-container');
    if(equipeContainer) {
        equipeContainer.innerHTML = equipeData.map(renderRBCard).join('');

        const modalProf = document.getElementById('modalProf');
        document.querySelectorAll('.rb-card').forEach(card => {
            card.addEventListener('click', () => {
                const m = equipeData.find(x => x.id == card.getAttribute('data-id'));
                document.getElementById('popupProfFoto').src = m.img;
                document.getElementById('popupProfNome').textContent = m.nome;
                document.getElementById('popupProfTitulo').textContent = m.titulo;
                document.getElementById('popupProfBio').textContent = m.bio;
                document.getElementById('popupProfWhats').href = `https://wa.me/${m.whats}`;
                modalProf.classList.add('show');
            });
        });
        document.getElementById('closeProf').addEventListener('click', () => modalProf.classList.remove('show'));
    }

    // 3. AGENDA E MAPA INTERATIVO (Ordenação Automática)
    const hoje = new Date();
    agendaData.sort((a, b) => {
        const dA = new Date(a.dataReal); const dB = new Date(b.dataReal);
        const aP = dA < hoje; const bP = dB < hoje;
        if(aP === bP) return dA - dB;
        return aP ? 1 : -1;
    });

    const agendaContainer = document.getElementById('timeline-container');
    if(agendaContainer) {
        agendaData.forEach((ev, index) => {
            const passou = new Date(ev.dataReal) < hoje;
            const btnClass = ev.fotosLink ? 'btn-primary' : 'btn-gray';
            const txtBtn = ev.fotosLink ? '<i class="fas fa-camera"></i> Ver Fotos' : '<i class="fas fa-image"></i> Em breve';
            
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

        const updateDestaque = (item) => {
            document.querySelectorAll('.timeline-item').forEach(el => el.classList.remove('active'));
            item.classList.add('active');
            document.getElementById('dest-title').textContent = item.dataset.title;
            document.getElementById('dest-date').textContent = item.dataset.date;
            document.getElementById('dest-time').textContent = item.dataset.time;
            document.getElementById('dest-location').textContent = item.dataset.location;
            document.getElementById('dest-map-iframe').src = item.dataset.map;
        };
        
        const firstItem = document.querySelector('.timeline-item');
        if(firstItem) updateDestaque(firstItem);

        document.querySelectorAll('.timeline-item').forEach(item => {
            item.addEventListener('click', function() { updateDestaque(this); });
        });
    }

    // 4. ACADEMIAS
    const locaisContainer = document.getElementById('locais-container');
    if(locaisContainer) {
        locaisData.forEach((l) => {
            locaisContainer.innerHTML += `
                <div class="local-card">
                    <h4 style="color: var(--blue-dark); font-size:1.2rem; margin-bottom:10px;"><i class="fas fa-map-marker-alt" style="color: var(--blue-vibrant);"></i> Polo ${l.nome}</h4>
                    <p style="font-size: 0.9rem; color: var(--text-muted);"><i class="fas fa-calendar-alt"></i> ${l.dias}</p>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top: 15px; border-top: 1px solid var(--border-color); padding-top: 15px;">
                        <div style="font-weight: 800; color: var(--blue-dark); font-size: 0.9rem;"><i class="fas fa-user-tie"></i> ${l.prof}</div>
                        <a href="https://wa.me/5567991293269" target="_blank" class="btn btn-green" style="padding: 8px 12px; font-size: 0.8rem;"><i class="fab fa-whatsapp"></i> Agendar</a>
                    </div>
                </div>
            `;
        });
    }

    // 5. LOJA ONLINE
    const lojaContainer = document.getElementById('loja-container');
    if(lojaContainer) {
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
    }

    // 6. MÓDULO KIDS (SLIDER FIGMA E BOLHAS)
    const bubblesContainer = document.getElementById('bubbles-container');
    if(bubblesContainer) {
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

        dots.forEach(dot => { dot.addEventListener('click', function() { goSlide(parseInt(this.dataset.idx)); }); });
        setInterval(() => { goSlide((currentSlide + 1) % slides.length); }, 4000);
    }

    // 7. HEADER E MENU
    document.getElementById('hamburger').addEventListener('click', () => {
        document.querySelector('.rb-nav-center').classList.toggle('active');
    });

});
