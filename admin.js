import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc, addDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBkwCDziiV-Uh7MLzsy9OYJmA_LMnn7jbg",
  authDomain: "capoeira-liberdade.firebaseapp.com",
  projectId: "capoeira-liberdade",
  storageBucket: "capoeira-liberdade.firebasestorage.app",
  messagingSenderId: "492022804215",
  appId: "1:492022804215:web:c61aed556d9f1aa9576df2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Função inteligente para remover "Academia " da frente de qualquer texto do Banco de Dados
const normalizarAcademia = (nome) => {
    if (!nome) return 'Não informada';
    return nome.replace(/^Academia\s+/i, '').trim();
};

let todosAlunos = [];
let listaAcademias = [];
let academiasDBGlobais = [];
let alunoSelecionado = null;
let academiaEditandoID = null;
let deleteConfirm = false;
let chartsInstances = {}; 

// Array padrão já limpo (sem a palavra "Academia")
const academiasPadrao = [
    "Mestre Profeta", "Professora Taynara", "Mestre Abraão", 
    "Mestre Omar", "Mestre Carlinhos", "Professor Maick", 
    "Professor Tigoy", "Professor Rafinha", "Instrutor Leiliano", 
    "Professor Lebrinha"
];

const ordemCordoes = [
    "Iniciante", "Cinza Claro", "Cinza e Bege", "Bege",
    "Escravo", "Fugitivo", "Quilombola", "Vagante", 
    "Liberto", "Instrutor", "Professor", "Mestre"
];

const cordoesAdulto = [
    { nome: "Iniciante", cor: ['#CCC','#CCC','#CCC'] }, { nome: "Escravo", cor: ['#4F4F4F','#4F4F4F','#4F4F4F'] },
    { nome: "Fugitivo", cor: ['#4F4F4F','#F5DEB3','#4F4F4F'] }, { nome: "Quilombola", cor: ['#DAA520','#DAA520','#DAA520'] },
    { nome: "Vagante", cor: ['#D2691E','#D32F2F','#D2691E'] }, { nome: "Liberto", cor: ['#D32F2F','#D32F2F','#D32F2F'] },
    { nome: "Instrutor", cor: ['#4F4F4F','#F5DEB3','#D32F2F'] }, { nome: "Professor", cor: ['#D32F2F','#FFFFFF','#D32F2F'] },
    { nome: "Mestre", cor: ['#F5F5F5','#F5F5F5','#F5F5F5'] }
];
const cordoesKids = [
    { nome: "Iniciante", cor: ['#CCC','#CCC','#CCC'] }, { nome: "Cinza Claro", cor: ['#D3D3D3','#D3D3D3','#D3D3D3'] },
    { nome: "Cinza e Bege", cor: ['#D3D3D3','#F5DEB3','#D3D3D3'] }, { nome: "Bege", cor: ['#F5DEB3','#F5DEB3','#F5DEB3'] }
];
const criteriosRegras = [
    { id: 'c1', txt: 'Ginga e Base', reqAdulto: 0, reqKids: true }, { id: 'c2', txt: 'Acrobacias', reqAdulto: 3, reqKids: false },
    { id: 'c3', txt: 'Respeito', reqAdulto: 0, reqKids: true }, { id: 'c4', txt: 'Disciplina', reqAdulto: 0, reqKids: true },
    { id: 'c5', txt: 'Pontualidade', reqAdulto: 0, reqKids: true }, { id: 'c6', txt: 'Freq. Aulas', reqAdulto: 0, reqKids: true },
    { id: 'c7', txt: 'Freq. Rodas', reqAdulto: 0, reqKids: true }, { id: 'c8', txt: 'Eventos', reqAdulto: 0, reqKids: true },
    { id: 'c9', txt: 'Pandeiro', reqAdulto: 5, reqKids: false }, { id: 'c10', txt: 'Atabaque', reqAdulto: 5, reqKids: false },
    { id: 'c11', txt: 'Berimbau', reqAdulto: 5, reqKids: false }, { id: 'c12', txt: 'Canta/Responde', reqAdulto: 5, reqKids: false },
    { id: 'c13', txt: 'Higiene', reqAdulto: 0, reqKids: true }, { id: 'c14', txt: 'Aprendizado', reqAdulto: 0, reqKids: true },
    { id: 'c15', txt: 'Fundamentos', reqAdulto: 0, reqKids: true }
];

window.onload = async () => {
    document.getElementById('mobile-menu-btn').addEventListener('click', () => {
        document.getElementById('nav-links').classList.toggle('show');
    });
    await carregarAcademias();
    await carregarAlunos();
};

window.mudarAba = function(abaId) {
    document.querySelectorAll('.aba-content, .nav-item').forEach(el => el.classList.remove('active'));
    document.getElementById(`aba-${abaId}`).classList.add('active');
    event.currentTarget.classList.add('active');
    document.getElementById('nav-links').classList.remove('show');
}
window.irParaRelatorios = function() {
    window.mudarAba('alunos');
    setTimeout(() => { document.getElementById('secao-graficos').scrollIntoView({ behavior: 'smooth' }); }, 100);
}

// ==========================================
// 1. GESTÃO DE ACADEMIAS (LIMPEZA AUTOMÁTICA)
// ==========================================
async function carregarAcademias() {
    try {
        const snap = await getDocs(collection(db, "academias"));
        academiasDBGlobais = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        let nomesUnicos = new Set(academiasPadrao);
        // Adiciona as do banco já limpando o nome
        academiasDBGlobais.forEach(ac => nomesUnicos.add(normalizarAcademia(ac.nome)));
        
        listaAcademias = Array.from(nomesUnicos).map(nome => ({ nome }));
        
        let selectHtml = '<option value="">Todas as Academias</option>';
        listaAcademias.forEach(ac => selectHtml += `<option value="${ac.nome}">${ac.nome}</option>`);
        
        const listaPainel = document.getElementById('listaAcademiasPainel');
        listaPainel.innerHTML = '';

        academiasDBGlobais.forEach(ac => {
            let nomeLimpo = normalizarAcademia(ac.nome);
            listaPainel.innerHTML += `
                <div class="academia-card">
                    <h4><i class="fas fa-map-marker-alt"></i> ${nomeLimpo}</h4>
                    <p><strong>Prof:</strong> ${ac.professor || 'Não informado'}</p>
                    <p><strong>E-mail:</strong> ${ac.email || 'Não informado'}</p>
                    <div class="academia-actions">
                        <button class="btn-edit-ac" onclick="abrirEditarAcademia('${ac.id}')"><i class="fas fa-edit"></i> Editar</button>
                        <button class="btn-del-ac" onclick="excluirAcademia('${ac.id}', '${nomeLimpo}')"><i class="fas fa-trash"></i> Excluir</button>
                    </div>
                </div>`;
        });
        document.getElementById('filtroAcademia').innerHTML = selectHtml;
    } catch (e) { console.error(e); }
}

document.getElementById('formNovaAcademia').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        let nomeRaw = document.getElementById('nomeAcademia').value;
        await addDoc(collection(db, "academias"), { 
            nome: normalizarAcademia(nomeRaw), // Salva já limpo
            professor: document.getElementById('nomeProfessor').value, 
            email: document.getElementById('emailProfessor').value, 
            senha: document.getElementById('senhaProfessor').value, 
            data: new Date().toISOString() 
        });
        alert("Academia cadastrada!"); e.target.reset(); carregarAcademias(); carregarAlunos();
    } catch (err) { alert("Erro ao criar."); }
});

window.excluirAcademia = async function(id, nome) {
    if(confirm(`Deseja REALMENTE excluir a academia "${nome}"?`)) {
        try { await deleteDoc(doc(db, "academias", id)); alert("Excluída!"); carregarAcademias(); carregarAlunos(); } catch(e) {}
    }
}

window.abrirEditarAcademia = function(id) {
    academiaEditandoID = id;
    const ac = academiasDBGlobais.find(a => a.id === id);
    if(ac) {
        document.getElementById('editNomeAcademia').value = normalizarAcademia(ac.nome);
        document.getElementById('editNomeProfessor').value = ac.professor || '';
        document.getElementById('editEmailProfessor').value = ac.email || '';
        document.getElementById('editSenhaProfessor').value = ""; 
        document.getElementById('modalEditarAcademia').style.display = 'flex';
    }
}
window.fecharModalAcademia = () => document.getElementById('modalEditarAcademia').style.display = 'none';

document.getElementById('formEditAcademia').addEventListener('submit', async (e) => {
    e.preventDefault();
    let nomeRaw = document.getElementById('editNomeAcademia').value;
    const objUpdate = {
        nome: normalizarAcademia(nomeRaw),
        professor: document.getElementById('editNomeProfessor').value,
        email: document.getElementById('editEmailProfessor').value
    };
    const s = document.getElementById('editSenhaProfessor').value;
    if(s.trim() !== "") objUpdate.senha = s;

    try {
        await updateDoc(doc(db, "academias", academiaEditandoID), objUpdate);
        alert("Dados atualizados com sucesso!");
        fecharModalAcademia(); carregarAcademias(); carregarAlunos();
    } catch(e) { alert("Erro ao editar."); }
});


// ==========================================
// 2. GRID E FILTROS DE ALUNOS
// ==========================================
async function carregarAlunos() {
    try {
        const snap = await getDocs(collection(db, "alunos"));
        todosAlunos = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        aplicarFiltros(); 
    } catch (e) { console.log(e); }
}

document.getElementById('filtroAcademia').addEventListener('change', aplicarFiltros);
document.getElementById('buscaGeral').addEventListener('input', aplicarFiltros);

function aplicarFiltros() {
    const ac = document.getElementById('filtroAcademia').value;
    const txt = document.getElementById('buscaGeral').value.toLowerCase();
    
    const filtrados = todosAlunos.filter(a => {
        const localLimpo = normalizarAcademia(a.localTreino);
        return (ac === "" || localLimpo === ac) && (txt === "" || a.nome.toLowerCase().includes(txt));
    });
    
    renderizarGrid(filtrados);
    desenharGraficos(filtrados);
}

function renderizarGrid(alunos) {
    const grid = document.getElementById('gridAlunos');
    grid.innerHTML = '';
    let optAc = '<option value="">Transferir para...</option>';
    listaAcademias.forEach(ac => { optAc += `<option value="${ac.nome}">${ac.nome}</option>`; });

    if(alunos.length === 0) { grid.innerHTML = '<p style="grid-column: 1/-1;">Nenhum aluno encontrado.</p>'; return; }
    alunos.forEach(a => {
        let localLimpo = normalizarAcademia(a.localTreino);
        grid.innerHTML += `
            <div class="aluno-card">
                <div class="card-top">
                    <img src="${a.fotoUrl || 'https://via.placeholder.com/70'}" class="card-foto">
                    <div class="card-info">
                        <h3>${a.nome}</h3>
                        <p>Rank: <strong>${a.cordaoAtual || 'Iniciante'}</strong></p>
                        <p>Idade: <strong>${a.idade} anos</strong></p>
                        <p>Academia: <strong>${localLimpo}</strong></p>
                        <p>Status: <strong style="color:${a.statusAtual==='Ativo'?'#389E92':'#E74C3C'}">${a.statusAtual||'Ativo'}</strong></p>
                    </div>
                </div>
                <div class="card-bottom">
                    <select class="select-encaminhar" onchange="transferirAluno('${a.id}', this.value)">${optAc}</select>
                    <button class="btn-detalhes" onclick="abrirModal('${a.id}')">Avaliar Evolução</button>
                </div>
            </div>`;
    });
}
window.transferirAluno = async function(idAluno, novaAcademia) {
    if(novaAcademia === "") return;
    if(confirm(`Confirmar transferência para ${novaAcademia}?`)) {
        try { await updateDoc(doc(db, "alunos", idAluno), { localTreino: normalizarAcademia(novaAcademia) }); alert("Transferido!"); carregarAlunos(); } catch(e) {}
    }
}

// ==========================================
// 3. MÓDULO DE AVALIAÇÃO
// ==========================================
let notasAtuais = {};
let criteriosAtivos = [];
window.abrirModal = function(id) {
    alunoSelecionado = todosAlunos.find(a => a.id === id);
    deleteConfirm = false;
    document.getElementById('btnExcluirModal').textContent = "Excluir Aluno";
    document.getElementById('btnExcluirModal').classList.remove('confirm-danger');

    document.getElementById('modFoto').src = alunoSelecionado.fotoUrl || 'https://via.placeholder.com/90';
    document.getElementById('modNome').textContent = alunoSelecionado.nome;
    document.getElementById('modIdade').textContent = alunoSelecionado.idade;
    document.getElementById('modAcademia').textContent = normalizarAcademia(alunoSelecionado.localTreino);
    document.getElementById('modStatus').value = alunoSelecionado.statusAtual || 'Ativo';

    const selCordao = document.getElementById('modCordao');
    selCordao.innerHTML = '';
    const idadeNumero = Number(alunoSelecionado.idade) || 0;
    const listaCordoes = idadeNumero < 12 ? cordoesKids : cordoesAdulto;
    
    listaCordoes.forEach((c, index) => { selCordao.innerHTML += `<option value="${c.nome}" data-idx="${index}">${c.nome}</option>`; });
    selCordao.value = alunoSelecionado.cordaoAtual || "Iniciante";
    
    notasAtuais = alunoSelecionado.notas || {};
    gerarCriteriosUI(listaCordoes, idadeNumero);
    document.getElementById('modalAvaliacao').style.display = 'flex';
}

function gerarCriteriosUI(listaCordoes, idadeNumero) {
    const grid = document.getElementById('gridCriterios');
    grid.innerHTML = '';
    let idxCordaoAtual = listaCordoes.findIndex(c => c.nome === document.getElementById('modCordao').value);
    if(idxCordaoAtual === -1) idxCordaoAtual = 0;
    const proximoCordao = listaCordoes[idxCordaoAtual + 1] || listaCordoes[idxCordaoAtual];
    
    document.getElementById('textoEvolucao').innerHTML = `Progresso para: <strong>${proximoCordao.nome}</strong>`;
    const cssCordao = document.getElementById('cordaoTrancado');
    cssCordao.style.setProperty('--c1', proximoCordao.cor[0]);
    cssCordao.style.setProperty('--c2', proximoCordao.cor[1]);
    cssCordao.style.setProperty('--c3', proximoCordao.cor[2]);

    criteriosAtivos = criteriosRegras.filter(crit => idadeNumero < 12 ? crit.reqKids : idxCordaoAtual >= (crit.reqAdulto - 1));

    criteriosAtivos.forEach(crit => {
        if(!notasAtuais[crit.id]) notasAtuais[crit.id] = 0;
        let htmlStars = '';
        for(let i=1; i<=10; i++) htmlStars += `<i class="fas fa-star" data-val="${i}"></i>`;
        grid.innerHTML += `<div class="crit-item"><span>${crit.txt}</span><div class="stars-row" data-id="${crit.id}">${htmlStars}</div></div>`;
    });

    document.querySelectorAll('.stars-row').forEach(row => {
        const idCrit = row.getAttribute('data-id');
        const stars = Array.from(row.querySelectorAll('i'));
        stars.forEach((s, idx) => { if(idx < notasAtuais[idCrit]) s.classList.add('ativa'); });
        stars.forEach((star, index) => {
            star.addEventListener('mousedown', () => atualizarNota(idCrit, index + 1, stars));
            star.addEventListener('touchstart', (e) => { e.preventDefault(); atualizarNota(idCrit, index + 1, stars); });
        });
    });
    calcularPorcentagem();
}

function atualizarNota(idCrit, valor, starsArray) {
    notasAtuais[idCrit] = valor;
    starsArray.forEach((s, i) => { if(i < valor) s.classList.add('ativa'); else s.classList.remove('ativa'); });
    calcularPorcentagem();
}

function calcularPorcentagem() {
    let totalPontos = 0;
    criteriosAtivos.forEach(c => {
        if(notasAtuais[c.id]) totalPontos += Number(notasAtuais[c.id]);
    });
    
    const maxPontos = criteriosAtivos.length * 10;
    let porc = maxPontos > 0 ? (totalPontos / maxPontos) * 100 : 0;
    
    document.getElementById('porcentagemEvolucao').textContent = `${Math.floor(porc > 100 ? 100 : porc)}%`;
    const cssCordao = document.getElementById('cordaoTrancado');
    cssCordao.style.width = `${porc > 100 ? 100 : porc}%`;
    
    if (porc >= 70) { cssCordao.style.boxShadow = "0 0 15px rgba(0, 230, 118, 0.8)"; } 
    else { cssCordao.style.boxShadow = "none"; }
}

window.excluirAlunoBtn = async function() {
    const btn = document.getElementById('btnExcluirModal');
    if(!deleteConfirm) {
        btn.textContent = "Tem certeza? Excluir";
        btn.classList.add('confirm-danger');
        deleteConfirm = true;
        setTimeout(() => { deleteConfirm = false; btn.textContent = "Excluir Aluno"; btn.classList.remove('confirm-danger'); }, 4000);
    } else {
        try { await deleteDoc(doc(db, "alunos", alunoSelecionado.id)); alert("Cadastro excluído."); fecharModal(); carregarAlunos(); } catch(e) {}
    }
}

window.salvarEdicaoAluno = async function() {
    const btn = document.getElementById('btnSalvarModal');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Atualizando...'; btn.disabled = true;
    try {
        await updateDoc(doc(db, "alunos", alunoSelecionado.id), { statusAtual: document.getElementById('modStatus').value, cordaoAtual: document.getElementById('modCordao').value, notas: notasAtuais });
        alert("Salvo!"); fecharModal(); carregarAlunos();
    } catch(e) {} finally { btn.innerHTML = '<i class="fas fa-save"></i> Atualizar Prontuário'; btn.disabled = false; }
}

window.fecharModal = () => document.getElementById('modalAvaliacao').style.display = 'none';

// ==========================================
// 4. GRÁFICOS (CHART.JS)
// ==========================================
function obterCorPorCordao(nome) {
    const mapa = {
        'Iniciante': '#CCCCCC', 'Cinza Claro': '#D3D3D3', 'Cinza e Bege': '#C0C0C0', 'Bege': '#DEB887',
        'Escravo': '#555555', 'Fugitivo': '#8B7D6B', 'Quilombola': '#DAA520', 'Vagante': '#CD5C5C',
        'Liberto': '#D32F2F', 'Instrutor': '#800000', 'Professor': '#F08080', 'Mestre': '#F5F5F5'
    };
    return mapa[nome] || '#389E92';
}

function desenharGraficos(alunosAtuais) {
    let aptos = 0, desenv = 0, rankCount = {}, academiaCount = {}, ativos = 0, inativos = 0, kids = 0, adultos = 0;
    let fundamentosSoma = {}, fundamentosQtd = {};
    criteriosRegras.forEach(c => { fundamentosSoma[c.txt] = 0; fundamentosQtd[c.txt] = 0; });

    alunosAtuais.forEach(a => {
        const idadeAluno = Number(a.idade) || 0;
        if(idadeAluno < 12) kids++; else adultos++;
        
        if(a.statusAtual === 'Ativo') ativos++; else inativos++;
        const local = normalizarAcademia(a.localTreino); academiaCount[local] = (academiaCount[local] || 0) + 1;
        const rank = a.cordaoAtual || 'Iniciante'; rankCount[rank] = (rankCount[rank] || 0) + 1;

        let idxCordao = cordoesAdulto.findIndex(c => c.nome === rank);
        if(idadeAluno < 12) idxCordao = cordoesKids.findIndex(c => c.nome === rank);
        if(idxCordao === -1) idxCordao = 0;
        
        let critAtivosAluno = criteriosRegras.filter(crit => idadeAluno < 12 ? crit.reqKids : idxCordao >= (crit.reqAdulto - 1));
        let maxPontos = critAtivosAluno.length * 10;
        let totalPontosAluno = 0;

        if(a.notas) {
            critAtivosAluno.forEach(c => {
                if(a.notas[c.id] !== undefined && a.notas[c.id] !== null) {
                    let notaVal = Number(a.notas[c.id]);
                    totalPontosAluno += notaVal;
                    fundamentosSoma[c.txt] += notaVal;
                    fundamentosQtd[c.txt] += 1;
                }
            });
            let porc = maxPontos > 0 ? (totalPontosAluno / maxPontos) * 100 : 0;
            if(maxPontos > 0 && porc >= 70) aptos++; else desenv++;
        } else { desenv++; }
    });

    let labelFundamentos = [], dataFundamentos = [];
    for (let crit in fundamentosSoma) {
        if(fundamentosQtd[crit] > 0) { labelFundamentos.push(crit); dataFundamentos.push((fundamentosSoma[crit] / fundamentosQtd[crit]).toFixed(1)); }
    }

    const colorTeal = '#389E92'; const colorBlue = '#002D72'; const colorGreen = '#00E676'; const colorRed = '#E74C3C'; const colorYellow = '#F5B041';

    criarGrafico('chartTermometro', 'pie', ['Aptos (Candidatos Formatura)', 'Em Desenvolvimento'], [aptos, desenv], [colorGreen, colorYellow]);
    criarGrafico('chartStatus', 'doughnut', ['Ativos', 'Inativos/Pausa'], [ativos, inativos], [colorTeal, colorRed]);
    
    let piramideLabels = [];
    let piramideData = [];
    let piramideColors = [];
    
    ordemCordoes.forEach(nomeCordao => {
        if(rankCount[nomeCordao] !== undefined) {
            piramideLabels.push(nomeCordao);
            piramideData.push(rankCount[nomeCordao]);
            piramideColors.push(obterCorPorCordao(nomeCordao));
        }
    });

    criarGrafico('chartPiramide', 'bar', piramideLabels, piramideData, piramideColors, true);
    criarGrafico('chartFundamentos', 'bar', labelFundamentos, dataFundamentos, colorTeal, true);
    criarGrafico('chartAcademias', 'doughnut', Object.keys(academiaCount), Object.values(academiaCount), [colorTeal, colorBlue, colorGreen, colorYellow, '#8E44AD']);
    criarGrafico('chartIdades', 'pie', ['Kids (Sub-12)', 'Adultos'], [kids, adultos], [colorGreen, colorBlue]);
}

function criarGrafico(canvasId, type, labels, data, colors, hideLegend = false) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    if(chartsInstances[canvasId]) chartsInstances[canvasId].destroy();
    
    chartsInstances[canvasId] = new Chart(ctx, {
        type: type,
        data: {
            labels: labels,
            datasets: [{ data: data, backgroundColor: colors, borderWidth: 1 }]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false,
            plugins: { legend: { display: !hideLegend } }
        }
    });
}
