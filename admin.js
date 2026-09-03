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
let deleteConfirm = false;

// ESTRUTURA DE CORDÕES
const cordoesAdulto = [
    { nome: "Iniciante", cor: ['#CCC','#CCC','#CCC'] },
    { nome: "Escravo", cor: ['#4F4F4F','#4F4F4F','#4F4F4F'] },
    { nome: "Fugitivo", cor: ['#4F4F4F','#F5DEB3','#4F4F4F'] },
    { nome: "Quilombola", cor: ['#DAA520','#DAA520','#DAA520'] },
    { nome: "Vagante", cor: ['#DAA520','#D32F2F','#DAA520'] },
    { nome: "Liberto", cor: ['#D32F2F','#D32F2F','#D32F2F'] },
    { nome: "Instrutor", cor: ['#4F4F4F','#F5DEB3','#D32F2F'] },
    { nome: "Professor", cor: ['#D32F2F','#FFFFFF','#D32F2F'] },
    { nome: "Mestre", cor: ['#FFFFFF','#FFFFFF','#FFFFFF'] }
];

const cordoesKids = [
    { nome: "Iniciante", cor: ['#CCC','#CCC','#CCC'] },
    { nome: "Cinza Claro", cor: ['#D3D3D3','#D3D3D3','#D3D3D3'] },
    { nome: "Cinza e Bege", cor: ['#D3D3D3','#F5DEB3','#D3D3D3'] },
    { nome: "Bege", cor: ['#F5DEB3','#F5DEB3','#F5DEB3'] }
];

// OS 15 CRITÉRIOS DO PROMPT MASTER
const criteriosRegras = [
    { id: 'c1', txt: 'Ginga e Base', reqAdulto: 0, reqKids: true },
    { id: 'c2', txt: 'Acrobacias', reqAdulto: 3, reqKids: false }, // Quilombola+
    { id: 'c3', txt: 'Respeito', reqAdulto: 0, reqKids: true },
    { id: 'c4', txt: 'Disciplina', reqAdulto: 0, reqKids: true },
    { id: 'c5', txt: 'Pontualidade', reqAdulto: 0, reqKids: true },
    { id: 'c6', txt: 'Freq. Aulas', reqAdulto: 0, reqKids: true },
    { id: 'c7', txt: 'Freq. Rodas', reqAdulto: 0, reqKids: true },
    { id: 'c8', txt: 'Eventos', reqAdulto: 0, reqKids: true },
    { id: 'c9', txt: 'Pandeiro', reqAdulto: 5, reqKids: false }, // Liberto+
    { id: 'c10', txt: 'Atabaque', reqAdulto: 5, reqKids: false },
    { id: 'c11', txt: 'Berimbau', reqAdulto: 5, reqKids: false },
    { id: 'c12', txt: 'Canta/Responde', reqAdulto: 5, reqKids: false },
    { id: 'c13', txt: 'Higiene', reqAdulto: 0, reqKids: true },
    { id: 'c14', txt: 'Aprendizado', reqAdulto: 0, reqKids: true },
    { id: 'c15', txt: 'Fundamentos', reqAdulto: 0, reqKids: true }
];

window.onload = async () => {
    await carregarAcademias();
    await carregarAlunos();
};

window.mudarAba = function(abaId) {
    document.querySelectorAll('.aba-content, .nav-item').forEach(el => el.classList.remove('active'));
    document.getElementById(`aba-${abaId}`).classList.add('active');
    event.currentTarget.classList.add('active');
}

// 1. GESTÃO DE ACADEMIAS E TRANSFERÊNCIAS
async function carregarAcademias() {
    try {
        const snap = await getDocs(collection(db, "academias"));
        listaAcademias = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Atualiza filtros e selects
        const filtro = document.getElementById('filtroAcademia');
        const listaPainel = document.getElementById('listaAcademiasPainel');
        filtro.innerHTML = '<option value="">Todas as Academias</option>';
        listaPainel.innerHTML = '';

        listaAcademias.forEach(ac => {
            filtro.innerHTML += `<option value="${ac.nome}">${ac.nome}</option>`;
            listaPainel.innerHTML += `<p>🏫 <strong>${ac.nome}</strong> (Prof. ${ac.professor})</p>`;
        });
    } catch (e) { console.log(e); }
}

document.getElementById('formNovaAcademia').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = document.getElementById('nomeAcademia').value;
    const prof = document.getElementById('nomeProfessor').value;
    
    try {
        await addDoc(collection(db, "academias"), { nome, professor: prof, data: new Date().toISOString() });
        alert(`Academia ${nome} criada com sucesso!`);
        e.target.reset();
        carregarAcademias();
        carregarAlunos();
    } catch (err) { alert("Erro ao criar academia."); }
});

window.transferirAluno = async function(idAluno, novaAcademia) {
    if(novaAcademia === "") return;
    if(confirm(`Transferir aluno para ${novaAcademia}?`)) {
        try {
            await updateDoc(doc(db, "alunos", idAluno), { localTreino: novaAcademia });
            alert("Transferência realizada!");
            carregarAlunos();
        } catch(e) { alert("Erro ao transferir."); }
    }
}

// 2. GRID E FILTROS DE ALUNOS
async function carregarAlunos() {
    try {
        const snap = await getDocs(collection(db, "alunos"));
        todosAlunos = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderizarGrid(todosAlunos);
    } catch (e) { console.log(e); }
}

document.getElementById('filtroAcademia').addEventListener('change', aplicarFiltros);
document.getElementById('buscaGeral').addEventListener('input', aplicarFiltros);

function aplicarFiltros() {
    const ac = document.getElementById('filtroAcademia').value;
    const txt = document.getElementById('buscaGeral').value.toLowerCase();
    const filtrados = todosAlunos.filter(a => 
        (ac === "" || a.localTreino === ac) && 
        (txt === "" || a.nome.toLowerCase().includes(txt))
    );
    renderizarGrid(filtrados);
}

function renderizarGrid(alunos) {
    const grid = document.getElementById('gridAlunos');
    grid.innerHTML = '';
    
    // Select dinâmico de academias para transferência
    let optionsAcademias = '<option value="">Encaminhar para...</option>';
    listaAcademias.forEach(ac => optionsAcademias += `<option value="${ac.nome}">${ac.nome}</option>`);

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
                    <select class="select-encaminhar" onchange="transferirAluno('${a.id}', this.value)">
                        ${optionsAcademias}
                    </select>
                    <button class="btn-detalhes" onclick="abrirModal('${a.id}')">Mais Detalhes</button>
                </div>
            </div>`;
    });
}

// 3. MÓDULO DE AVALIAÇÃO E ANIMAÇÃO DO CORDÃO
const modal = document.getElementById('modalAvaliacao');
let criteriosAtivos = [];
let notasAtuais = {};

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

    // Gerar Dropdown de Cordões baseado na idade (Kids vs Adultos)
    const selCordao = document.getElementById('modCordao');
    selCordao.innerHTML = '';
    const listaCordoes = alunoSelecionado.idade < 12 ? cordoesKids : cordoesAdulto;
    
    listaCordoes.forEach((c, index) => {
        selCordao.innerHTML += `<option value="${c.nome}" data-idx="${index}">${c.nome}</option>`;
    });
    selCordao.value = alunoSelecionado.cordaoAtual || "Iniciante";
    
    notasAtuais = alunoSelecionado.notas || {};
    gerarCriteriosUI(listaCordoes);
    modal.style.display = 'flex';
}

function gerarCriteriosUI(listaCordoes) {
    const grid = document.getElementById('gridCriterios');
    grid.innerHTML = '';
    
    const idxCordaoAtual = listaCordoes.findIndex(c => c.nome === document.getElementById('modCordao').value) || 0;
    const proximoCordao = listaCordoes[idxCordaoAtual + 1] || listaCordoes[idxCordaoAtual];
    
    document.getElementById('textoEvolucao').innerHTML = `Progresso para: <strong>${proximoCordao.nome}</strong>`;
    
    // Aplica cores do CSS Trançado
    const cssCordao = document.getElementById('cordaoTrancado');
    cssCordao.style.setProperty('--c1', proximoCordao.cor[0]);
    cssCordao.style.setProperty('--c2', proximoCordao.cor[1]);
    cssCordao.style.setProperty('--c3', proximoCordao.cor[2]);

    criteriosAtivos = criteriosRegras.filter(crit => {
        if(alunoSelecionado.idade < 12) return crit.reqKids;
        return idxCordaoAtual >= (crit.reqAdulto - 1);
    });

    criteriosAtivos.forEach(crit => {
        if(!notasAtuais[crit.id]) notasAtuais[crit.id] = 0;
        
        // Renderiza 10 estrelinhas
        let htmlStars = '';
        for(let i=1; i<=10; i++) {
            htmlStars += `<i class="fas fa-star" data-val="${i}"></i>`;
        }

        grid.innerHTML += `
            <div class="crit-item">
                <span>${crit.txt}</span>
                <div class="stars-row" data-id="${crit.id}">
                    ${htmlStars}
                </div>
            </div>`;
    });

    // Eventos das estrelas
    document.querySelectorAll('.stars-row').forEach(row => {
        const idCrit = row.getAttribute('data-id');
        const stars = Array.from(row.querySelectorAll('i'));
        
        // Pinta as salvas previamente
        stars.forEach((s, idx) => { if(idx < notasAtuais[idCrit]) s.classList.add('ativa'); });

        stars.forEach((star, index) => {
            // Touch e Mouse
            star.addEventListener('mousedown', () => atualizarNota(idCrit, index + 1, stars));
            star.addEventListener('touchstart', (e) => { e.preventDefault(); atualizarNota(idCrit, index + 1, stars); });
        });
    });

    calcularPorcentagem();
}

function atualizarNota(idCrit, valor, starsArray) {
    notasAtuais[idCrit] = valor;
    starsArray.forEach((s, i) => {
        if(i < valor) s.classList.add('ativa');
        else s.classList.remove('ativa');
    });
    calcularPorcentagem();
}

function calcularPorcentagem() {
    let totalPontos = 0;
    criteriosAtivos.forEach(c => totalPontos += notasAtuais[c.id]);
    
    const maxPontos = criteriosAtivos.length * 10;
    const meta = maxPontos * 0.7; // 70%
    
    let porc = (totalPontos / meta) * 100;
    if(porc > 100) porc = 100;
    
    document.getElementById('porcentagemEvolucao').textContent = `${Math.floor(porc)}%`;
    document.getElementById('cordaoTrancado').style.width = `${porc}%`;
}

// 4. EXCLUIR E SALVAR
window.excluirAlunoBtn = async function() {
    const btn = document.getElementById('btnExcluirModal');
    
    // Proteção de exclusão: 1º clique avisa, 2º exclui.
    if(!deleteConfirm) {
        btn.textContent = "Tem certeza? Excluir";
        btn.classList.add('confirm-danger');
        deleteConfirm = true;
        setTimeout(() => { 
            deleteConfirm = false; 
            btn.textContent = "Excluir Aluno"; 
            btn.classList.remove('confirm-danger'); 
        }, 4000);
    } else {
        try {
            await deleteDoc(doc(db, "alunos", alunoSelecionado.id));
            alert("Cadastro excluído permanentemente da base.");
            fecharModal();
            carregarAlunos();
        } catch(e) { alert("Erro ao excluir."); }
    }
}

window.salvarEdicaoAluno = async function() {
    const btn = document.getElementById('btnSalvarModal');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Atualizando...';
    btn.disabled = true;

    try {
        await updateDoc(doc(db, "alunos", alunoSelecionado.id), {
            statusAtual: document.getElementById('modStatus').value,
            cordaoAtual: document.getElementById('modCordao').value,
            notas: notasAtuais
        });
        alert("Prontuário salvo com sucesso!");
        fecharModal();
        carregarAlunos();
    } catch(e) { alert("Erro ao salvar."); }
    finally {
        btn.innerHTML = '<i class="fas fa-save"></i> Atualizar';
        btn.disabled = false;
    }
}

window.fecharModal = () => document.getElementById('modalAvaliacao').style.display = 'none';
