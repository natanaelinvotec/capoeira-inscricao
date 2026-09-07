import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBkwCDziiV-Uh7MLzsy9OYJmA_LMnn7jbg",
  authDomain: "capoeira-liberdade.firebaseapp.com",
  projectId: "capoeira-liberdade"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// === CADASTRO DE AGENDA ===
document.getElementById('formAgenda').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const dataObj = new Date(document.getElementById('dataEvento').value);
        await addDoc(collection(db, "site_agenda"), {
            dataReal: dataObj.toISOString(),
            dataStr: `${dataObj.getDate()} DE ${dataObj.toLocaleString('pt-BR', { month: 'short' }).toUpperCase()}`,
            hora: `${dataObj.getHours()}h${dataObj.getMinutes() === 0 ? '00' : dataObj.getMinutes()}`,
            titulo: document.getElementById('tituloEvento').value,
            local: document.getElementById('localEvento').value,
            fotosLink: document.getElementById('linkMidiaEvento').value
        });
        alert("Evento adicionado!"); e.target.reset(); carregarAgenda();
    } catch(err) { alert("Erro ao salvar."); }
});

async function carregarAgenda() {
    const lista = document.getElementById('listaAgenda');
    lista.innerHTML = '';
    const snap = await getDocs(collection(db, "site_agenda"));
    snap.forEach(doc => {
        const d = doc.data();
        lista.innerHTML += `<div class="item-card">
            <div><strong>${d.dataStr} - ${d.titulo}</strong><br><small>${d.local}</small></div>
            <button class="btn-excluir-aluno" onclick="remover('site_agenda', '${doc.id}')">Excluir</button>
        </div>`;
    });
}

// === CADASTRO DE LOCAIS ===
document.getElementById('formLocais').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        await addDoc(collection(db, "site_locais"), {
            nome: document.getElementById('nomePolo').value,
            prof: document.getElementById('profPolo').value,
            dias: document.getElementById('diasPolo').value,
            endereco: document.getElementById('endPolo').value
        });
        alert("Polo adicionado!"); e.target.reset(); carregarLocais();
    } catch(err) { alert("Erro."); }
});

async function carregarLocais() {
    const lista = document.getElementById('listaLocais');
    lista.innerHTML = '';
    const snap = await getDocs(collection(db, "site_locais"));
    snap.forEach(doc => {
        lista.innerHTML += `<div class="item-card">
            <div><strong>${doc.data().nome}</strong><br><small>${doc.data().prof}</small></div>
            <button class="btn-excluir-aluno" onclick="remover('site_locais', '${doc.id}')">Excluir</button>
        </div>`;
    });
}

window.remover = async function(colecao, id) {
    if(confirm("Excluir item?")) {
        await deleteDoc(doc(db, colecao, id));
        if(colecao === 'site_agenda') carregarAgenda();
        if(colecao === 'site_locais') carregarLocais();
    }
}

carregarAgenda();
carregarLocais();
