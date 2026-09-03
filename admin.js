import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// SUAS CREDENCIAIS DO FIREBASE
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
let alunoSelecionadoID = null;

// --- NAVEGAÇÃO SPA (Trocando Abas) ---
window.mudarAba = function(abaId) {
    document.querySelectorAll('.aba-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    
    document.getElementById(`aba-${abaId}`).classList.add('active');
    event.currentTarget.classList.add('active');
}

// --- CARREGAR ALUNOS DO FIREBASE ---
async function carregarAlunos() {
    const grid = document.getElementById('gridAlunos');
    try {
        const querySnapshot = await getDocs(collection(db, "alunos"));
        todosAlunos = [];
        querySnapshot.forEach((docSnap) => {
            todosAlunos.push({ id: docSnap.id, ...docSnap.data() });
        });
        renderizarGrid(todosAlunos);
    } catch (error) {
        console.error("Erro Firebase: ", error);
        grid.innerHTML = '<p>Erro ao carregar dados.</p>';
    }
}

// --- RENDERIZAR CARDS IDÊNTICOS À FOTO ---
function renderizarGrid(alunos) {
    const grid = document.getElementById('gridAlunos');
    grid.innerHTML = '';

    if (alunos.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1;">Nenhum aluno cadastrado.</p>';
        return;
    }

    alunos.forEach(aluno => {
        const statusReal = aluno.statusAtual || "Ativo";
        const cordaoReal = aluno.cordaoAtual || "Iniciante";
        const fotoReal = aluno.fotoUrl || 'https://via.placeholder.com/70';
        
        const card = document.createElement('div');
        card.className = 'aluno-card';
        card.innerHTML = `
            <div class="card-top">
                <img src="${fotoReal}" class="card-foto" alt="Foto">
                <div class="card-info">
                    <h3>${aluno.nome}</h3>
                    <p>Rank: <strong>${cordaoReal}</strong></p>
                    <p>Idade: <strong>${aluno.idade} anos</strong></p>
                    <p>Academia: <strong>${aluno.localTreino || 'Não informada'}</strong></p>
                    <p>Status: <strong style="color:${statusReal === 'Ativo' ? '#389E92' : '#E74C3C'}">${statusReal}</strong></p>
                </div>
            </div>
            <div class="card-bottom">
                <select class="select-encaminhar">
                    <option>Encaminhar para...</option>
                    <option>Mestre Profeta</option>
                    <option>Mestre Omar</option>
                </select>
                <button class="btn-detalhes" onclick="abrirModal('${aluno.id}')">Mais Detalhes</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// --- LÓGICA DO MODAL DELICADO E AVALIAÇÃO DE ESTRELAS ---
const modal = document.getElementById('modalAvaliacao');

window.abrirModal = function(id) {
    const aluno = todosAlunos.find(a => a.id === id);
    if (!aluno) return;
    
    alunoSelecionadoID = id;

    // Preenche Cabeçalho do Modal
    document.getElementById('modFoto').src = aluno.fotoUrl || 'https://via.placeholder.com/80';
    document.getElementById('modNome').textContent = aluno.nome;
    document.getElementById('modIdade').textContent = aluno.idade;
    document.getElementById('modAcademia').textContent = aluno.localTreino || 'Não informada';

    // Preenche Status e Cordão
    document.getElementById('modStatus').value = aluno.statusAtual || 'Ativo';
    document.getElementById('modCordao').value = aluno.cordaoAtual || 'Iniciante';

    // Reseta/Aplica estrelas salvas (Simulação visual)
    document.querySelectorAll('.stars i').forEach(star => star.classList.remove('ativa'));
    
    modal.style.display = 'flex';
}

window.fecharModal = function() {
    modal.style.display = 'none';
    alunoSelecionadoID = null;
}

// Fechar modal clicando fora
modal.addEventListener('click', (e) => {
    if(e.target === modal) fecharModal();
});

// Sistema de clique nas estrelas dentro do modal
document.querySelectorAll('.stars').forEach(container => {
    const stars = Array.from(container.querySelectorAll('i'));
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            // Preenche até a estrela clicada
            stars.forEach((s, i) => {
                if(i <= index) s.classList.add('ativa');
                else s.classList.remove('ativa');
            });
        });
    });
});

// Salvar Atualizações do Modal no Firebase
window.salvarEdicaoAluno = async function() {
    if(!alunoSelecionadoID) return;

    const novoStatus = document.getElementById('modStatus').value;
    const novoCordao = document.getElementById('modCordao').value;
    const btn = document.querySelector('.btn-salvar-modal');

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';
    btn.disabled = true;

    try {
        const alunoRef = doc(db, "alunos", alunoSelecionadoID);
        await updateDoc(alunoRef, {
            statusAtual: novoStatus,
            cordaoAtual: novoCordao
            // As notas das estrelas seriam salvas num objeto json aqui futuramente
        });
        
        alert("Prontuário atualizado com sucesso!");
        fecharModal();
        carregarAlunos(); // Recarrega a grid para mostrar o novo status/cordão
    } catch (error) {
        alert("Erro ao atualizar: " + error.message);
    } finally {
        btn.innerHTML = '<i class="fas fa-save"></i> Atualizar Prontuário';
        btn.disabled = false;
    }
}

// Iniciar a página
window.onload = carregarAlunos;