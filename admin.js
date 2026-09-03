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

let todosAlunos = [];
let listaAcademias = [];
let alunoSelecionado = null;
let academiaEditandoID = null;
let deleteConfirm = false;

// Instâncias do Chart.js para evitar sobreposição
let chartsInstances = {}; 

const cordoesAdulto = [
    { nome: "Iniciante", cor: ['#CCC','#CCC','#CCC'] }, { nome: "Escravo", cor: ['#4F4F4F','#4F4F4F','#4F4F4F'] },
    { nome: "Fugitivo", cor: ['#4F4F4F','#F5DEB3','#4F4F4F'] }, { nome: "Quilombola", cor: ['#DAA520','#DAA520','#DAA520'] },
    { nome: "Vagante", cor: ['#DAA520','#D32F2F','#DAA520'] }, { nome: "Liberto", cor: ['#D32F2F','#D32F2F','#D32F2F'] },
    { nome: "Instrutor", cor: ['#4F4F4F','#F5DEB3','#D32F2F'] }, { nome: "Professor", cor: ['#D32F2F','#FFFFFF','#D32F2F'] },
    { nome: "Mestre", cor: ['#FFFFFF','#FFFFFF','#FFFFFF'] }
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

// Iniciar Sistema
window.onload = async () => {
    document.getElementById('mobile-menu-btn').addEventListener('click', () => {
        document.getElementById('nav-links').classList.toggle('show');
    });
    await carregarAcademias();
    await carregarAlunos();
};

// Navegação
window.mudarAba = function(abaId) {
    document.querySelectorAll('.aba-content, .nav-item').forEach(el => el.classList.remove('active'));
    document.getElementById(`aba-${abaId}`).classList.add('active');
    event.currentTarget.classList.add('active');
    document.getElementById('nav-links').classList.remove('show');
}
window.irParaRelatorios = function() {
    window.mudarAba('alunos');
    setTimeout(() => { document.getElementById('secao-graficos').scrollIntoView({ behavior: 'smooth' }); }, 300);
}

// ==========================================
// MÓDULO 1: GESTÃO DE ACADEMIAS (CRUD)
// ==========================================
async function carregarAcademias() {
    try {
        const snap = await getDocs(collection(db, "academias"));
        listaAcademias = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        const filtro = document.getElementById('filtroAcademia');
        const listaPainel = document.getElementById('listaAcademiasPainel');
        filtro.innerHTML = '<option value="">Todas as Academias</option>';
        listaPainel.innerHTML = '';

        listaAcademias.forEach(ac => {
            filtro.innerHTML += `<option value="${ac.nome}">${ac.nome}</option>`;
            listaPainel.innerHTML += `
                <div class="academia-card">
                    <h4><i class="fas fa-map-marker-alt"></i> ${ac.nome}</h4>
                    <p><strong>Prof:</strong> ${ac.professor}</p>
                    <p><strong>E-mail:</strong> ${ac.email}</p>
                    <div class="academia-actions">
                        <button class="btn-edit-ac" onclick="abrirEditarAcademia('${ac.id}')"><i class="fas fa-edit"></i> Editar</button>
                        <button class="btn-del-ac" onclick="excluirAcademia('${ac.id}', '${ac.nome}')"><i class="fas fa-trash"></i> Excluir</button>
                    </div>
                </div>`;
        });
    } catch (e) { console.error(e); }
}

document.getElementById('formNovaAcademia').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = document.getElementById('nomeAcademia').value;
    const prof = document.getElementById('nomeProfessor').value;
    const email = document.getElementById('emailProfessor').value;
    const senha = document.getElementById('senhaProfessor').value;
    try {
        await addDoc(collection(db, "academias"), { nome, professor: prof, email, senha, data: new Date().toISOString() });
        alert(`Academia ${nome} cadastrada!`);
        e.target.reset();
        carregarAcademias(); carregarAlunos();
    } catch (err) { alert("Erro ao criar academia."); }
});

window.excluirAcademia = async function(id, nome) {
    if(confirm(`Deseja REALMENTE excluir a academia "${nome}" do sistema? Esta ação não apaga os alunos, mas remove a opção do painel.`)) {
        try { await deleteDoc(doc(db, "academias", id)); alert("Excluída!"); carregarAcademias(); carregarAlunos(); } 
        catch(e) { alert("Erro ao excluir."); }
    }
}

window.abrirEditarAcademia = function(id) {
    academiaEditandoID = id;
    const ac = listaAcademias.find(a => a.id === id);
    document.getElementById('editNomeAcademia').value = ac.nome;
    document.getElementById('editNomeProfessor').value = ac.professor;
    document.getElementById('editEmailProfessor').value = ac.email;
    document.getElementById('editSenhaProfessor').value = ""; // Fica em branco por segurança
    document.getElementById('modalEditarAcademia').style.display = 'flex';
}
window.fecharModalAcademia = () => document.getElementById('modalEditarAcademia').style.display = 'none';

document.getElementById('formEditAcademia').addEventListener('submit', async (e) => {
    e.preventDefault();
    const objUpdate = {
        nome: document.getElementById('editNomeAcademia').value,
        professor: document.getElementById('editNomeProfessor').value,
        email: document.getElementById('editEmailProfessor').value
    };
    const s = document.getElementById('editSenhaProfessor').value;
    if(s.trim() !== "") objUpdate.senha = s;

    try {
        await updateDoc(doc(db, "academias", academiaEditandoID), objUpdate);
        alert("Dados atualizados!");
        fecharModalAcademia(); carregarAcademias(); carregarAlunos();
    } catch(e) { alert("Erro ao editar."); }
});

window.transferirAluno = async function(idAluno, novaAcademia) {
    if(novaAcademia === "") return;
    if(confirm(`Confirmar transferência para ${novaAcademia}?`)) {
        try {
            await updateDoc(doc(db, "alunos", idAluno), { localTreino: novaAcademia });
            alert("Transferência realizada!"); carregarAlunos();
        } catch(e) { alert("Erro."); }
    }
}

// ==========================================
// MÓDULO 2 E 3: ALUNOS, FILTROS E AVALIAÇÃO
// ==========================================
async function carregarAlunos() {
    try {
        const snap = await getDocs(collection(db, "alunos"));
        todosAlunos = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        aplicarFiltros();
        desenharGraficos(); // Atualiza os relatórios com os dados frescos
    } catch (e) { console.log(e); }
}

document.getElementById('filtroAcademia').addEventListener('change', aplicarFiltros);
document.getElementById('buscaGeral').addEventListener('input', aplicarFiltros);

function aplicarFiltros() {
    const ac = document.getElementById('filtroAcademia').value;
    const txt = document.getElementById('buscaGeral').value.toLowerCase();
    const filtrados = todosAlunos.filter(a => 
        (ac === "" || a.localTreino === ac) && (txt === "" || a.nome.toLowerCase().includes(txt))
    );
    renderizarGrid(filtrados);
}

function renderizarGrid(alunos) {
    const grid = document.getElementById('gridAlunos');
    grid.innerHTML = '';
    let optionsAcademias = '<option value="">Transferir para...</option>';
    listaAcademias.forEach(ac => optionsAcademias += `<option value="${ac.nome}">${ac.nome}</option>`);

    if(alunos.length === 0) { grid.innerHTML = '<p style="grid-column: 1/-1;">Nenhum aluno encontrado.</p>'; return; }

    alunos.forEach(a => {
        grid.innerHTML += `
            <div class="aluno-card">
                <div class="card-top">
                    <img src="${a.fotoUrl || 'https://via.placeholder.com/70'}" class="card-foto">
                    <div class="card-info">
                        <h3>${a.nome}</h3>
                        <p>Rank: <strong>${a.cordaoAtual || 'Iniciante'}</strong></p>
                        <p>Idade: <strong>${a.idade} anos</strong></p>
                        <p>Academia: <strong>${a.localTreino}</strong></p>
                        <p>Status: <strong style="color:${a.statusAtual==='Ativo'?'#389E92':'#E74C3C'}">${a.statusAtual||'Ativo'}</strong></p>
                    </div>
                </div>
                <div class="card-bottom">
                    <select class="select-encaminhar" onchange="transferirAluno('${a.id}', this.value)">${optionsAcademias}</select>
                    <button class="btn-detalhes" onclick="abrirModal('${a.id}')">Avaliar Evolução</button>
                </div>
            </div>`;
    });
}

// Modal Avaliação...
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
    document.getElementById('modAcademia').textContent = alunoSelecionado.localTreino;
    document.getElementById('modStatus').value = alunoSelecionado.statusAtual || 'Ativo';

    const selCordao = document.getElementById('modCordao');
    selCordao.innerHTML = '';
    const listaCordoes = alunoSelecionado.idade < 12 ? cordoesKids : cordoesAdulto;
    listaCordoes.forEach((c, index) => { selCordao.innerHTML += `<option value="${c.nome}" data-idx="${index}">${c.nome}</option>`; });
    selCordao.value = alunoSelecionado.cordaoAtual || "Iniciante";
    
    notasAtuais = alunoSelecionado.notas || {};
    gerarCriteriosUI(listaCordoes);
    document.getElementById('modalAvaliacao').style.display = 'flex';
}

function gerarCriteriosUI(listaCordoes) {
    const grid = document.getElementById('gridCriterios');
    grid.innerHTML = '';
    const idxCordaoAtual = listaCordoes.findIndex(c => c.nome === document.getElementById('modCordao').value) || 0;
    const proximoCordao = listaCordoes[idxCordaoAtual + 1] || listaCordoes[idxCordaoAtual];
    
    document.getElementById('textoEvolucao').innerHTML = `Progresso para: <strong>${proximoCordao.nome}</strong>`;
    const cssCordao = document.getElementById('cordaoTrancado');
    cssCordao.style.setProperty('--c1', proximoCordao.cor[0]);
    cssCordao.style.setProperty('--c2', proximoCordao.cor[1]);
    cssCordao.style.setProperty('--c3', proximoCordao.cor[2]);

    criteriosAtivos = criteriosRegras.filter(crit => alunoSelecionado.idade < 12 ? crit.reqKids : idxCordaoAtual >= (crit.reqAdulto - 1));

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
    criteriosAtivos.forEach(c => totalPontos += notasAtuais[c.id]);
    const maxPontos = criteriosAtivos.length * 10;
    let porc = (totalPontos / (maxPontos * 0.7)) * 100;
    if(porc > 100) porc = 100;
    
    document.getElementById('porcentagemEvolucao').textContent = `${Math.floor(porc)}%`;
    document.getElementById('cordaoTrancado').style.width = `${porc}%`;
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
        alert("Prontuário salvo!"); fecharModal(); carregarAlunos();
    } catch(e) { alert("Erro ao salvar."); } finally { btn.innerHTML = '<i class="fas fa-save"></i> Atualizar'; btn.disabled = false; }
}

window.fecharModal = () => document.getElementById('modalAvaliacao').style.display = 'none';

// ==========================================
// MÓDULO 4: GRÁFICOS (CHART.JS)
// ==========================================
function desenharGraficos() {
    // Helpers para dados
    let aptos = 0, desenv = 0;
    let rankCount = {};
    let academiaCount = {};
    let ativos = 0, inativos = 0;
    let kids = 0, adultos = 0;
    let fundamentosSoma = {}, fundamentosQtd = {};

    criteriosRegras.forEach(c => { fundamentosSoma[c.txt] = 0; fundamentosQtd[c.txt] = 0; });

    todosAlunos.forEach(a => {
        // Demografia
        if(a.idade < 12) kids++; else adultos++;
        
        // Status
        if(a.statusAtual === 'Ativo') ativos++; else inativos++;

        // Academias
        const local = a.localTreino || 'Sem Academia';
        academiaCount[local] = (academiaCount[local] || 0) + 1;

        // Rank
        const rank = a.cordaoAtual || 'Iniciante';
        rankCount[rank] = (rankCount[rank] || 0) + 1;

        // Notas (Média e Termômetro)
        if(a.notas) {
            let totalNotasAluno = 0;
            let qtdNotas = 0;
            for (let critId in a.notas) {
                totalNotasAluno += a.notas[critId];
                qtdNotas++;
                let txtCriterio = criteriosRegras.find(cr => cr.id === critId)?.txt;
                if(txtCriterio) {
                    fundamentosSoma[txtCriterio] += a.notas[critId];
                    fundamentosQtd[txtCriterio] += 1;
                }
            }
            if(qtdNotas > 0 && totalNotasAluno >= (qtdNotas * 10 * 0.7)) aptos++; else desenv++;
        } else { desenv++; }
    });

    // Média de fundamentos
    let labelFundamentos = [];
    let dataFundamentos = [];
    for (let crit in fundamentosSoma) {
        if(fundamentosQtd[crit] > 0) {
            labelFundamentos.push(crit);
            dataFundamentos.push((fundamentosSoma[crit] / fundamentosQtd[crit]).toFixed(1));
        }
    }

    // Cores Padrão
    const colorTeal = '#389E92'; const colorBlue = '#002D72'; const colorGreen = '#00E676'; const colorRed = '#E74C3C'; const colorYellow = '#F5B041';

    // Cria/Atualiza Gráfico 1: Termômetro
    criarGrafico('chartTermometro', 'pie', ['Aptos (Prontos para Troca)', 'Em Desenvolvimento'], [aptos, desenv], [colorGreen, colorYellow]);
    
    // Cria/Atualiza Gráfico 2: Fundamentos (Barra)
    criarGrafico('chartFundamentos', 'bar', labelFundamentos, dataFundamentos, colorTeal);
    
    // Cria/Atualiza Gráfico 3: Pirâmide (Cordões)
    criarGrafico('chartPiramide', 'bar', Object.keys(rankCount), Object.values(rankCount), colorBlue);

    // Cria/Atualiza Gráfico 4: Academias
    criarGrafico('chartAcademias', 'doughnut', Object.keys(academiaCount), Object.values(academiaCount), [colorTeal, colorBlue, colorGreen, colorYellow, '#8E44AD']);

    // Cria/Atualiza Gráfico 5: Idades
    criarGrafico('chartIdades', 'pie', ['Kids (Sub-12)', 'Adultos'], [kids, adultos], [colorGreen, colorBlue]);

    // Cria/Atualiza Gráfico 6: Status
    criarGrafico('chartStatus', 'doughnut', ['Ativos', 'Inativos/Pausa'], [ativos, inativos], [colorTeal, colorRed]);
}

function criarGrafico(canvasId, type, labels, data, colors) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    if(chartsInstances[canvasId]) chartsInstances[canvasId].destroy(); // Limpa o antigo
    
    chartsInstances[canvasId] = new Chart(ctx, {
        type: type,
        data: {
            labels: labels,
            datasets: [{
                label: 'Quantidade',
                data: data,
                backgroundColor: colors,
                borderWidth: 1
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}
