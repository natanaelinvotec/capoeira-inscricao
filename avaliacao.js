// 1. ESTRUTURA DE CORDÕES (Com as cores exatas para injetar no CSS)
const cordoesAdulto = [
    { nivel: 0, nome: "Iniciante", proximo: "Escravo" },
    { nivel: 1, nome: "Escravo", cores: ['#4F4F4F', '#4F4F4F', '#4F4F4F'], proximo: "Fugitivo" }, // Cinza escuro
    { nivel: 2, nome: "Fugitivo", cores: ['#4F4F4F', '#F5DEB3', '#4F4F4F'], proximo: "Quilombola" }, // Cinza escuro/Bege
    { nivel: 3, nome: "Quilombola", cores: ['#DAA520', '#DAA520', '#DAA520'], proximo: "Vagante" }, // Bege dourado
    { nivel: 4, nome: "Vagante", cores: ['#DAA520', '#D32F2F', '#DAA520'], proximo: "Liberto" }, // Bege/Vermelho
    { nivel: 5, nome: "Liberto", cores: ['#D32F2F', '#D32F2F', '#D32F2F'], proximo: "Instrutor" }, // Vermelho
    { nivel: 6, nome: "Instrutor", cores: ['#4F4F4F', '#F5DEB3', '#D32F2F'], proximo: "Professor" }, // Cinza/Bege/Vermelho
    { nivel: 7, nome: "Professor", cores: ['#D32F2F', '#FFFFFF', '#D32F2F'], proximo: "Mestre" }, // Vermelho/Branco
    { nivel: 8, nome: "Mestre", cores: ['#FFFFFF', '#FFFFFF', '#FFFFFF'], proximo: "Mestre" } // Branco
];

// 2. REGRAS DE NEGÓCIO E CRITÉRIOS
// minNivel: a partir de qual nível do adulto este critério é cobrado. (99 = nunca para kids)
const todosCriterios = [
    { id: 'c1', nome: '1. Ginga e Base', minNivel: 0 },
    { id: 'c3', nome: '2. Respeito à Hierarquia', minNivel: 0 },
    { id: 'c4', nome: '3. Disciplina', minNivel: 0 },
    { id: 'c5', nome: '4. Pontualidade Financeira', minNivel: 0 },
    { id: 'c6', nome: '5. Frequência nas Aulas', minNivel: 0 },
    { id: 'c7', nome: '6. Frequência nas Rodas', minNivel: 0 },
    { id: 'c8', nome: '7. Participação em Eventos', minNivel: 0 },
    { id: 'c13', nome: '8. Higiene e Uniforme', minNivel: 0 },
    { id: 'c14', nome: '9. Facilidade de Aprendizado', minNivel: 0 },
    { id: 'c15', nome: '10. Fundamentos Históricos', minNivel: 0 },
    { id: 'c2', nome: '11. Acrobacias e Floreios', minNivel: 3 }, // Só de Quilombola para cima
    { id: 'c9', nome: '12. Toca Pandeiro', minNivel: 5 }, // Só de Liberto para cima
    { id: 'c10', nome: '13. Toca Atabaque', minNivel: 5 },
    { id: 'c11', nome: '14. Toca Berimbau', minNivel: 5 },
    { id: 'c12', nome: '15. Canta e Responde', minNivel: 5 }
];

// Dados simulados do aluno atual (Isso virá do Firestore dinamicamente)
let alunoAtual = {
    nome: "Natanael Alves",
    idade: 37,
    categoria: "Adulto",
    nivelAtual: 2, // Fugitivo
    notas: {} // Guarda as notas dadas
};

let criteriosAplicaveis = [];
let maxPontosPossiveis = 0;
let metaAprovacao = 0;

function inicializarAvaliacao() {
    const cordaoFuturo = cordoesAdulto[alunoAtual.nivelAtual + 1];
    
    document.getElementById('proximoCordaoNome').textContent = cordaoFuturo.nome;
    
    // Injeta as cores do próximo cordão no CSS para a animação do trançado
    const fill = document.getElementById('cordaoFill');
    fill.style.setProperty('--cor1', cordaoFuturo.cores[0]);
    fill.style.setProperty('--cor2', cordaoFuturo.cores[1]);
    fill.style.setProperty('--cor3', cordaoFuturo.cores[2]);

    // Filtra os critérios: Se for Kids, bloqueia os de minNivel >= 3. Se adulto, avalia pelo nivel.
    criteriosAplicaveis = todosCriterios.filter(crit => {
        if (alunoAtual.categoria === "Kids") return crit.minNivel === 0;
        return alunoAtual.nivelAtual >= (crit.minNivel - 1); // Ex: Se vai para Quilombola (3), ele já é avaliado na acrobacia
    });

    maxPontosPossiveis = criteriosAplicaveis.length * 10;
    metaAprovacao = Math.floor(maxPontosPossiveis * 0.7); // 70% para passar
    document.getElementById('pontosNecessarios').textContent = metaAprovacao;

    renderizarCriterios();
}

function renderizarCriterios() {
    const lista = document.getElementById('listaCriterios');
    lista.innerHTML = '';

    criteriosAplicaveis.forEach(crit => {
        alunoAtual.notas[crit.id] = 0; // Inicia zerado
        
        const div = document.createElement('div');
        div.className = 'criterio-item';
        div.innerHTML = `
            <div class="criterio-header">
                <span>${crit.nome}</span>
                <span class="criterio-nota" id="nota_text_${crit.id}">0/10</span>
            </div>
            <div class="estrelas-container" id="container_${crit.id}" data-id="${crit.id}">
                ${[1,2,3,4,5,6,7,8,9,10].map(n => `<i class="fas fa-star star" data-valor="${n}"></i>`).join('')}
            </div>
        `;
        lista.appendChild(div);
        
        adicionarEventosTouch(div.querySelector('.estrelas-container'), crit.id);
    });
}

// 3. MOTOR DE AVALIAÇÃO COM TOUCH/DRAG ESTILO GOOGLE MAPS
function adicionarEventosTouch(container, idCriterio) {
    const stars = container.querySelectorAll('.star');
    
    const atualizarEstrelas = (valor) => {
        alunoAtual.notas[idCriterio] = valor;
        document.getElementById(`nota_text_${idCriterio}`).textContent = `${valor}/10`;
        
        stars.forEach((s, index) => {
            if (index < valor) s.classList.add('ativa');
            else s.classList.remove('ativa');
        });
        recalcularTotal();
    };

    // Lógica para arrastar o dedo (Mobile)
    container.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        const elementoAlvo = document.elementFromPoint(touch.clientX, touch.clientY);
        if (elementoAlvo && elementoAlvo.classList.contains('star') && elementoAlvo.parentNode === container) {
            atualizarEstrelas(parseInt(elementoAlvo.getAttribute('data-valor')));
        }
    });

    // Lógica para Clique/Arraste (Desktop)
    stars.forEach(star => {
        star.addEventListener('mouseover', (e) => {
            if(e.buttons === 1) atualizarEstrelas(parseInt(star.getAttribute('data-valor'))); // Arrastar com mouse segurado
        });
        star.addEventListener('mousedown', () => atualizarEstrelas(parseInt(star.getAttribute('data-valor'))));
    });
}

// 4. CÁLCULO E ANIMAÇÃO DA BARRA DE CORDÃO
function recalcularTotal() {
    let total = 0;
    for (let key in alunoAtual.notas) { total += alunoAtual.notas[key]; }
    
    document.getElementById('pontosAtuais').textContent = total;
    
    let porcentagem = (total / metaAprovacao) * 100;
    if (porcentagem > 100) porcentagem = 100; // Trava em 100% visualmente
    
    document.getElementById('porcentagemTexto').textContent = `${Math.floor(porcentagem)}%`;
    document.getElementById('cordaoFill').style.width = `${porcentagem}%`;

    const statusEl = document.getElementById('alunoStatus');
    if (total >= metaAprovacao) {
        statusEl.textContent = "Apto para Formatura!";
        statusEl.style.background = "rgba(0, 230, 118, 0.4)";
        document.getElementById('cordaoFill').style.boxShadow = "0 0 20px rgba(0, 230, 118, 0.8)";
    } else {
        statusEl.textContent = "Em Avaliação";
        statusEl.style.background = "rgba(0, 230, 118, 0.2)";
        document.getElementById('cordaoFill').style.boxShadow = "none";
    }
}

// Inicializa a tela ao carregar
window.onload = inicializarAvaliacao;
