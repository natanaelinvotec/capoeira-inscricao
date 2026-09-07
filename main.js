import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBkwCDziiV-Uh7MLzsy9OYJmA_LMnn7jbg",
    authDomain: "capoeira-liberdade.firebaseapp.com",
    projectId: "capoeira-liberdade"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', async () => {

    // FUNÇÃO GENÉRICA DE SCROLL (Setas e Automático)
    const initSlider = (containerId, prevBtnId, nextBtnId) => {
        const container = document.getElementById(containerId);
        const prev = document.getElementById(prevBtnId);
        const next = document.getElementById(nextBtnId);
        if(!container) return;

        let scrollAmt = 0;
        const step = 250; // Largura do card + gap
        
        if(prev && next) {
            prev.addEventListener('click', () => container.scrollBy({ left: -step, behavior: 'smooth' }));
            next.addEventListener('click', () => container.scrollBy({ left: step, behavior: 'smooth' }));
        }

        setInterval(() => {
            if(container.matches(':hover')) return;
            scrollAmt += 1;
            container.scrollTo(scrollAmt, 0);
            if(scrollAmt >= container.scrollWidth - container.clientWidth) scrollAmt = 0;
        }, 25);
    };

    // 1. CARREGAR EQUIPE
    const carregarEquipe = async () => {
        const c = document.getElementById('equipe-container');
        if(!c) return;
        let html = '';
        try {
            const snap = await getDocs(collection(db, "site_equipe"));
            if(snap.empty) throw new Error("Vazio");
            snap.forEach(doc => {
                const m = doc.data();
                html += `
                <div class="rb-card" data-id="${doc.id}" data-nome="${m.nome}" data-titulo="${m.titulo}" data-bio="${m.bio}" data-img="${m.img}" data-whats="${m.whats}">
                    <div style="position:relative; height: 260px;">
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
            });
        } catch(e) {
            // Fallback se firebase vazio
            const defaultImg = "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200";
            const defaultCover = "https://images.unsplash.com/photo-1599839619722-39751411ea63?w=500";
            for(let i=1; i<=6; i++) {
                html += `<div class="rb-card"><div style="position:relative; height: 260px;"><img src="${defaultCover}" class="rb-card-cover"><img src="${defaultImg}" class="rb-card-avatar"></div><div class="rb-card-body"><div class="rb-card-name">Mestre ${i}</div><div class="rb-card-role">Capoeira</div></div></div>`;
            }
        }
        c.innerHTML = html;
        initSlider('equipe-container', 'prev-equipe', 'next-equipe');

        // Modal
        const modalProf = document.getElementById('modalProf');
        document.querySelectorAll('.rb-card').forEach(card => {
            if(!card.dataset.nome) return; // Ignore fallback without data
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
    };

    // 2. CARREGAR AGENDA
    const carregarAgenda = async () => {
        const c = document.getElementById('timeline-container');
        if(!c) return;
        let eventos = [];
        try {
            const snap = await getDocs(collection(db, "site_agenda"));
            snap.forEach(doc => eventos.push(doc.data()));
        } catch(e) {}

        if(eventos.length === 0) {
            eventos = [{ dataReal: new Date().toISOString(), dataStr: "HOJE", titulo: "Roda Cadastre no CMS", hora: "19h", local: "MS", mapIframe: "", fotosLink: "" }];
        }

        const hoje = new Date();
        eventos.sort((a, b) => {
            const dA = new Date(a.dataReal); const dB = new Date(b.dataReal);
            const aP = dA < hoje; const bP = dB < hoje;
            if(aP === bP) return dA - dB;
            return aP ? 1 : -1;
        });

        c.innerHTML = '';
        eventos.forEach((ev, i) => {
            const passou = new Date(ev.dataReal) < hoje;
            const btnClass = ev.fotosLink ? 'btn-primary' : 'btn-gray';
            const txtBtn = ev.fotosLink ? '<i class="fas fa-camera"></i> Ver Fotos' : '<i class="fas fa-image"></i> Em breve';
            
            c.innerHTML += `
                <div class="timeline-item ${i===0?'active':''} ${passou?'evento-concluido':''}" 
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
            document.getElementById('dest-map-iframe').src = item.dataset.map || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3737.9547515024474!2d-54.69746358327932!3d-20.463991207173167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9486e66e8cb57db7%3A0xc39217036a144e78!2sCampo%20Grande%2C%20MS!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr";
        };
        const first = document.querySelector('.timeline-item');
        if(first) updateDestaque(first);
        document.querySelectorAll('.timeline-item').forEach(i => i.addEventListener('click', function() { updateDestaque(this); }));
    };

    // 3. CARREGAR LOCAIS E LOJA
    const carregarRestante = async () => {
        const cLocais = document.getElementById('locais-container');
        const cLoja = document.getElementById('loja-container');
        
        try {
            const sLocais = await getDocs(collection(db, "site_locais"));
            if(!sLocais.empty && cLocais) {
                cLocais.innerHTML = '';
                sLocais.forEach(l => {
                    const d = l.data();
                    cLocais.innerHTML += `
                    <div class="local-card">
                        <h4 style="color: var(--blue-dark); font-size:1.2rem; margin-bottom:10px;"><i class="fas fa-map-marker-alt" style="color: var(--blue-vibrant);"></i> Polo ${d.nome}</h4>
                        <p style="font-size: 0.9rem; color: var(--text-muted);"><i class="fas fa-calendar-alt"></i> ${d.dias}</p>
                        <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 10px;"><i class="fas fa-map-pin"></i> ${d.endereco}</p>
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-top: 15px; border-top: 1px solid var(--border-color); padding-top: 15px;">
                            <div style="font-weight: 800; color: var(--blue-dark); font-size: 0.9rem;"><i class="fas fa-user-tie"></i> ${d.prof}</div>
                            <a href="${d.mapSrc}" target="_blank" class="btn btn-green" style="padding: 8px 12px; font-size: 0.8rem;"><i class="fab fa-whatsapp"></i> Agendar</a>
                        </div>
                    </div>`;
                });
            }
            
            const sLoja = await getDocs(collection(db, "site_loja"));
            if(!sLoja.empty && cLoja) {
                cLoja.innerHTML = '';
                sLoja.forEach(p => {
                    const d = p.data();
                    cLoja.innerHTML += `
                    <div class="loja-item">
                        <img src="${d.img}" class="loja-img">
                        <h4 style="color: var(--blue-dark); font-size:1.1rem;">${d.nome}</h4>
                        <div style="font-size: 1.4rem; color: var(--green-dark); font-weight: 900; margin: 10px 0;">${d.preco}</div>
                        <button class="btn btn-primary" style="width:100%;"><i class="fas fa-shopping-cart"></i> Adicionar</button>
                    </div>`;
                });
            }
        } catch(e) {}
        initSlider('loja-container', 'prev-loja', 'next-loja');
    };

    // Inicialização
    await carregarEquipe();
    await carregarAgenda();
    await carregarRestante();

    // 4. HEADER E KIDS SLIDER (Local Logic)
    document.getElementById('hamburger').addEventListener('click', () => {
        document.querySelector('.rb-nav-center').classList.toggle('active');
    });

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
        let currentSlide = 0;
        setInterval(() => {
            slides.forEach(s => s.classList.remove('active'));
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 4000);
    }
});
