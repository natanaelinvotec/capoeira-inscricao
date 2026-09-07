import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBkwCDziiV-Uh7MLzsy9OYJmA_LMnn7jbg",
  authDomain: "capoeira-liberdade.firebaseapp.com",
  projectId: "capoeira-liberdade"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function salvarNoFirebase(e, formId, collectionName, dataObject, renderFunction) {
    e.preventDefault();
    const btn = document.getElementById(formId).querySelector('button');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...'; btn.disabled = true;
    try {
        await addDoc(collection(db, collectionName), dataObject);
        alert("Salvo com sucesso! Atualize o site público para ver.");
        document.getElementById(formId).reset();
        renderFunction();
    } catch(err) { alert("Erro ao salvar."); }
    finally { btn.innerHTML = '<i class="fas fa-save"></i> Salvar'; btn.disabled = false; }
}

window.removerFirebase = async function(colecao, id, renderFunctionStr) {
    if(confirm("Excluir definitivamente do site?")) {
        await deleteDoc(doc(db, colecao, id));
        if(renderFunctionStr === 'carregarEquipe') carregarEquipe();
        if(renderFunctionStr === 'carregarAgenda') carregarAgenda();
        if(renderFunctionStr === 'carregarLocais') carregarLocais();
        if(renderFunctionStr === 'carregarLoja') carregarLoja();
    }
}

// EQUIPE
document.getElementById('formEquipe').addEventListener('submit', (e) => {
    const dados = {
        nome: document.getElementById('eqNome').value,
        titulo: document.getElementById('eqTitulo').value,
        coverImg: document.getElementById('eqCover').value,
        img: document.getElementById('eqImg').value,
        bio: document.getElementById('eqBio').value,
        whats: document.getElementById('eqWhats').value
    };
    salvarNoFirebase(e, 'formEquipe', 'site_equipe', dados, carregarEquipe);
});
async function carregarEquipe() {
    const lista = document.getElementById('listaEquipe');
    lista.innerHTML = 'Carregando...';
    const snap = await getDocs(collection(db, "site_equipe"));
    lista.innerHTML = '';
    snap.forEach(doc => {
        lista.innerHTML += `<div class="item-card">
            <div style="display:flex; gap:10px; align-items:center;">
                <img src="${doc.data().img}" style="width:40px; height:40px; border-radius:50%; object-fit:cover;">
                <strong>${doc.data().nome}</strong> (${doc.data().titulo})
            </div>
            <button class="btn-excluir-aluno" style="padding: 5px 10px; margin:0;" onclick="removerFirebase('site_equipe', '${doc.id}', 'carregarEquipe')"><i class="fas fa-trash"></i></button>
        </div>`;
    });
}

// AGENDA
document.getElementById('formAgenda').addEventListener('submit', (e) => {
    const dataObj = new Date(document.getElementById('dataEvento').value);
    const dados = {
        dataReal: dataObj.toISOString(),
        dataStr: `${dataObj.getDate()} DE ${dataObj.toLocaleString('pt-BR', { month: 'short' }).toUpperCase()}`,
        hora: `${dataObj.getHours()}h${dataObj.getMinutes() === 0 ? '00' : dataObj.getMinutes()}`,
        titulo: document.getElementById('tituloEvento').value,
        local: document.getElementById('localEvento').value,
        mapIframe: document.getElementById('iframeMapaEvento').value,
        fotosLink: document.getElementById('linkMidiaEvento').value
    };
    salvarNoFirebase(e, 'formAgenda', 'site_agenda', dados, carregarAgenda);
});
async function carregarAgenda() {
    const lista = document.getElementById('listaAgenda');
    const snap = await getDocs(collection(db, "site_agenda"));
    lista.innerHTML = '';
    snap.forEach(doc => {
        const d = doc.data();
        lista.innerHTML += `<div class="item-card">
            <div><strong>${d.dataStr} - ${d.titulo}</strong></div>
            <button class="btn-excluir-aluno" style="padding: 5px 10px; margin:0;" onclick="removerFirebase('site_agenda', '${doc.id}', 'carregarAgenda')"><i class="fas fa-trash"></i></button>
        </div>`;
    });
}

// LOCAIS
document.getElementById('formLocais').addEventListener('submit', (e) => {
    const dados = {
        nome: document.getElementById('nomePolo').value, prof: document.getElementById('profPolo').value,
        dias: document.getElementById('diasPolo').value, endereco: document.getElementById('endPolo').value, mapSrc: document.getElementById('linkMapsPolo').value
    };
    salvarNoFirebase(e, 'formLocais', 'site_locais', dados, carregarLocais);
});
async function carregarLocais() {
    const lista = document.getElementById('listaLocais');
    const snap = await getDocs(collection(db, "site_locais"));
    lista.innerHTML = '';
    snap.forEach(doc => {
        lista.innerHTML += `<div class="item-card">
            <div><strong>${doc.data().nome}</strong></div>
            <button class="btn-excluir-aluno" style="padding: 5px 10px; margin:0;" onclick="removerFirebase('site_locais', '${doc.id}', 'carregarLocais')"><i class="fas fa-trash"></i></button>
        </div>`;
    });
}

// LOJA
document.getElementById('formLoja').addEventListener('submit', (e) => {
    const dados = { nome: document.getElementById('nomeProduto').value, preco: document.getElementById('precoProduto').value, img: document.getElementById('imgProduto').value };
    salvarNoFirebase(e, 'formLoja', 'site_loja', dados, carregarLoja);
});
async function carregarLoja() {
    const lista = document.getElementById('listaLoja');
    const snap = await getDocs(collection(db, "site_loja"));
    lista.innerHTML = '';
    snap.forEach(doc => {
        lista.innerHTML += `<div class="item-card">
            <div style="display:flex; gap:10px; align-items:center;">
                <img src="${doc.data().img}" style="width:40px; height:40px; object-fit:cover;"><strong>${doc.data().nome}</strong>
            </div>
            <button class="btn-excluir-aluno" style="padding: 5px 10px; margin:0;" onclick="removerFirebase('site_loja', '${doc.id}', 'carregarLoja')"><i class="fas fa-trash"></i></button>
        </div>`;
    });
}

// Inicia as listagens do CMS
carregarEquipe(); carregarAgenda(); carregarLocais(); carregarLoja();
