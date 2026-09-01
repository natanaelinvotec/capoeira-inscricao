import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

const loginBox = document.getElementById('loginBox');
const painelContent = document.getElementById('painelContent');
const btnLogin = document.getElementById('btnLogin');
const senhaInput = document.getElementById('senhaAcesso');
const btnLogout = document.getElementById('btnLogout');
const listaAlunosDiv = document.getElementById('listaAlunos');
const searchInput = document.getElementById('searchAluno');

let todosAlunos = [];
const SENHA_MESTRE = "liberdade2026";

btnLogin.addEventListener('click', () => {
    if (senhaInput.value === SENHA_MESTRE) {
        loginBox.style.display = 'none';
        painelContent.style.display = 'block';
        carregarAlunos();
    } else {
        alert("Senha incorreta!");
    }
});

btnLogout.addEventListener('click', () => {
    location.reload();
});

async function carregarAlunos() {
    listaAlunosDiv.innerHTML = '<p style="text-align: center; color: #666;">Buscando dados...</p>';
    try {
        const querySnapshot = await getDocs(collection(db, "alunos"));
        todosAlunos = [];
        querySnapshot.forEach((docSnap) => {
            todosAlunos.unshift({ id: docSnap.id, ...docSnap.data() });
        });
        
        exibirAlunos(todosAlunos);
    } catch (error) {
        listaAlunosDiv.innerHTML = '<p style="color: red; text-align: center;">Erro ao carregar os dados do banco.</p>';
        console.error(error);
    }
}

function exibirAlunos(alunos) {
    if (alunos.length === 0) {
        listaAlunosDiv.innerHTML = '<p style="text-align: center; color: #666;">Nenhum aluno cadastrado até o momento.</p>';
        return;
    }

    listaAlunosDiv.innerHTML = '';
    alunos.forEach(aluno => {
        const card = document.createElement('div');
        card.className = 'aluno-card';
        card.innerHTML = `
            <div class="aluno-info">
                <img src="${aluno.fotoUrl || 'https://via.placeholder.com/50'}" class="aluno-avatar" alt="Foto">
                <div>
                    <strong>${aluno.nome}</strong><br>
                    <small style="color: #666;">📍 ${aluno.localTreino || 'Não informado'} | 📱 ${aluno.telefone}</small>
                </div>
            </div>
            <div class="acoes-btn">
                <button class="btn-acao btn-imprimir" onclick="reimprimirFicha('${aluno.id}')"><i class="fas fa-print"></i> PDF</button>
                <button class="btn-acao btn-excluir" onclick="excluirAluno('${aluno.id}', '${aluno.nome}')"><i class="fas fa-trash"></i></button>
            </div>
        `;
        listaAlunosDiv.appendChild(card);
    });
}

searchInput.addEventListener('input', (e) => {
    const termo = e.target.value.toLowerCase();
    const filtrados = todosAlunos.filter(a => a.nome.toLowerCase().includes(termo));
    exibirAlunos(filtrados);
});

window.excluirAluno = async function(id, nome) {
    if (confirm(`Tem certeza que deseja excluir o cadastro de ${nome}?`)) {
        try {
            await deleteDoc(doc(db, "alunos", id));
            alert("Cadastro excluído com sucesso!");
            carregarAlunos();
        } catch (error) {
            alert("Erro ao excluir: " + error.message);
        }
    }
};

window.reimprimirFicha = function(id) {
    const aluno = todosAlunos.find(a => a.id === id);
    if (!aluno) return;

    const janelaPrint = window.open('', '_blank');
    janelaPrint.document.write(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <title>Ficha - ${aluno.nome}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
                h2 { color: #002D72; border-bottom: 2px solid #00E676; padding-bottom: 5px; margin-top: 20px; }
                .topo { display: flex; align-items: center; gap: 20px; border-bottom: 2px solid #002D72; padding-bottom: 15px; }
                .foto { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 3px solid #002D72; }
                .info-linha { margin-bottom: 8px; font-size: 1rem; }
                .info-linha strong { color: #002D72; }
            </style>
        </head>
        <body>
            <div class="topo">
                <img src="${aluno.fotoUrl}" class="foto">
                <div>
                    <h2>Grupo de Capoeira Liberdade e Expressão</h2>
                    <p><strong>Segunda Via de Inscrição Oficial</strong></p>
                </div>
            </div>

            <h2>Dados Pessoais</h2>
            <div class="info-linha"><strong>Local de Treino:</strong> ${aluno.localTreino || '-'}</div>
            <div class="info-linha"><strong>Nome Completo:</strong> ${aluno.nome}</div>
            <div class="info-linha"><strong>Nascimento:</strong> ${aluno.dataNasc} | <strong>Idade:</strong> ${aluno.idade} anos</div>
            <div class="info-linha"><strong>Documento (CPF/RG):</strong> ${aluno.documento}</div>
            <div class="info-linha"><strong>Telefone:</strong> ${aluno.telefone}</div>
            <div class="info-linha"><strong>Endereço:</strong> ${aluno.endereco}, ${aluno.bairro} - ${aluno.cidade}</div>

            ${aluno.idade < 18 ? `
            <h2>Contato de Emergência (Responsável)</h2>
            <div class="info-linha"><strong>Responsável:</strong> ${aluno.emergenciaNome}</div>
            <div class="info-linha"><strong>Telefone:</strong> ${aluno.emergenciaTel} (${aluno.parentesco})</div>
            ` : ''}

            <h2>Informações de Saúde & Experiência</h2>
            <div class="info-linha"><strong>Apto para Atividades:</strong> ${aluno.apto}</div>
            <div class="info-linha"><strong>Doença Crônica:</strong> ${aluno.doencaCronica} ${aluno.qualDoenca ? '('+aluno.qualDoenca+')' : ''}</div>
            <div class="info-linha"><strong>Uso de Medicamentos:</strong> ${aluno.medicamentos} ${aluno.qualMedicamento ? '('+aluno.qualMedicamento+')' : ''}</div>
            <div class="info-linha"><strong>Tamanho Uniforme:</strong> Camiseta (${aluno.tamCamiseta}) / Calça (${aluno.tamCalca})</div>

            <h2>Pagamento & Termos</h2>
            <div class="info-linha"><strong>Melhor data de vencimento:</strong> ${aluno.dataPagamento}</div>
            <div class="info-linha"><strong>Forma de pagamento:</strong> ${aluno.formaPagamento}</div>
            <div class="info-linha"><strong>Uso de Imagem:</strong> ${aluno.usoImagem}</div>

            <script>
                window.onload = function() { window.print(); }
            </script>
        </body>
        </html>
    `);
    janelaPrint.document.close();
};
