import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, updateDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBkwCDziiV-Uh7MLzsy9OYJmA_LMnn7jbg",
  authDomain: "capoeira-liberdade.firebaseapp.com",
  projectId: "capoeira-liberdade",
  storageBucket: "capoeira-liberdade.firebasestorage.app",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

let dadosGlobais = { equipe: [], agenda: [], locais: [], loja: [] };

// Função de Upload de Imagem Helper
async function uploadImage(fileInputId, path) {
    const file = document.getElementById(fileInputId).files[0];
    if (!file) return null; // Retorna nulo se não escolheu arquivo novo
    const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
    await uploadBytesResumable(storageRef, file);
    return await getDownloadURL(storageRef);
}

// Gerador de Iframe do Maps automático
const generateMapIframe = (address) => `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

// Função genérica de Salvar/Atualizar
async function saveOrUpdate(e, formId, collectionName, idField, dataObject, renderFunctionStr) {
    e.preventDefault();
    const btn = document.getElementById(formId).querySelector('button');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...'; btn.disabled = true;
    
    const editId = document.getElementById(idField).value;
    try {
        if(editId) {
            await updateDoc(doc(db, collectionName, editId), dataObject);
            alert("Atualizado com sucesso!");
        } else {
            await addDoc(collection(db, collectionName), dataObject);
            alert("Cadastrado com sucesso!");
        }
        document.getElementById(formId).reset();
        document.getElementById(idField).value = ''; // Limpa modo edição
        btn.innerHTML = originalText.replace('Atualizar', 'Salvar').replace('fa-edit', 'fa-save');
        
        if(renderFunctionStr === 'carregarEquipe') carregarEquipe();
        if(renderFunctionStr === 'carregarAgenda') carregarAgenda();
        if(renderFunctionStr === 'carregarLocais') carregarLocais();
        if(renderFunctionStr === 'carregarLoja') carregarLoja();
    } catch(err) { alert("Erro ao processar."); console.log(err); }
    finally { btn.disabled = false; }
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

// =================== EQUIPE ===================
document.getElementById('formEquipe').addEventListener('submit', async (e) => {
    e.preventDefault();
    const editId = document.getElementById('editIdEquipe').value;
    
    // Check if new images are uploaded, else keep existing (if editing)
    let coverUrl = await uploadImage('eqCover', 'site/equipe');
    let imgUrl = await uploadImage('eqImg', 'site/equipe');
    
    if(editId) {
        const itemAtual = dadosGlobais.equipe.find(x => x.id === editId);
        if(!coverUrl) coverUrl = itemAtual.coverImg;
        if(!imgUrl) imgUrl = itemAtual.img;
    } else {
        if(!coverUrl || !imgUrl) return alert("Fotos são obrigatórias num novo cadastro!");
    }

    const dados = {
        nome: document.getElementById('eqNome').value,
        titulo: document.getElementById('eqTitulo').value,
        coverImg: coverUrl, img: imgUrl,
        bio: document.getElementById('eqBio').value,
        whats: document.getElementById('eqWhats').value
    };
    saveOrUpdate(e, 'formEquipe', 'site_equipe', 'editIdEquipe', dados, 'carregarEquipe');
});

window.editarEquipe = function(id) {
    const item = dadosGlobais.equipe.find(x => x.id === id);
    document.getElementById('editIdEquipe').value = item.id;
    document.getElementById('eqNome').value = item.nome;
    document.getElementById('eqTitulo').value = item.titulo;
    document.getElementById('eqBio').value = item.bio;
    document.getElementById('eqWhats').value = item.whats;
    document.getElementById('btnEq').innerHTML = '<i class="fas fa-edit"></i> Atualizar Profissional';
    window.scrollTo(0,0);
}

async function carregarEquipe() {
    const lista = document.getElementById('listaEquipe');
    lista.innerHTML = 'Carregando...';
    const snap = await getDocs(collection(db, "site_equipe"));
    dadosGlobais.equipe = []; lista.innerHTML = '';
    snap.forEach(doc => {
        const d = {id: doc.id, ...doc.data()};
        dadosGlobais.equipe.push(d);
        lista.innerHTML += `<div class="item-card">
            <div style="display:flex; gap:10px; align-items:center;">
                <img src="${d.img}" style="width:40px; height:40px; border-radius:50%; object-fit:cover;">
                <strong>${d.nome}</strong> (${d.titulo})
            </div>
            <div class="action-btns">
                <button class="btn-edit" onclick="editarEquipe('${d.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn-excluir-aluno" style="padding: 5px 10px; margin:0;" onclick="removerFirebase('site_equipe', '${d.id}', 'carregarEquipe')"><i class="fas fa-trash"></i></button>
            </div>
        </div>`;
    });
}

// =================== AGENDA ===================
document.getElementById('formAgenda').addEventListener('submit', (e) => {
    const dataObj = new Date(document.getElementById('dataEvento').value);
    const endereco = document.getElementById('localEvento').value;
    const dados = {
        dataReal: dataObj.toISOString(),
        dataStr: `${dataObj.getDate()} DE ${dataObj.toLocaleString('pt-BR', { month: 'short' }).toUpperCase()}`,
        hora: `${dataObj.getHours()}h${dataObj.getMinutes() === 0 ? '00' : dataObj.getMinutes()}`,
        titulo: document.getElementById('tituloEvento').value,
        local: endereco,
        mapIframe: generateMapIframe(endereco), // Gera o link do iframe automaticamente
        fotosLink: document.getElementById('linkMidiaEvento').value
    };
    saveOrUpdate(e, 'formAgenda', 'site_agenda', 'editIdAgenda', dados, 'carregarAgenda');
});

window.editarAgenda = function(id) {
    const item = dadosGlobais.agenda.find(x => x.id === id);
    document.getElementById('editIdAgenda').value = item.id;
    // Formata a data de volta para datetime-local
    const dIso = new Date(item.dataReal).toISOString().slice(0,16);
    document.getElementById('dataEvento').value = dIso;
    document.getElementById('tituloEvento').value = item.titulo;
    document.getElementById('localEvento').value = item.local;
    document.getElementById('linkMidiaEvento').value = item.fotosLink || '';
    document.getElementById('btnAg').innerHTML = '<i class="fas fa-edit"></i> Atualizar Evento';
    window.scrollTo(0,0);
}

async function carregarAgenda() {
    const lista = document.getElementById('listaAgenda');
    const snap = await getDocs(collection(db, "site_agenda"));
    dadosGlobais.agenda = []; lista.innerHTML = '';
    snap.forEach(doc => {
        const d = {id: doc.id, ...doc.data()};
        dadosGlobais.agenda.push(d);
        lista.innerHTML += `<div class="item-card">
            <div><strong>${d.dataStr} - ${d.titulo}</strong><br><small>${d.local}</small></div>
            <div class="action-btns">
                <button class="btn-edit" onclick="editarAgenda('${d.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn-excluir-aluno" style="padding: 5px 10px; margin:0;" onclick="removerFirebase('site_agenda', '${d.id}', 'carregarAgenda')"><i class="fas fa-trash"></i></button>
            </div>
        </div>`;
    });
}

// =================== LOCAIS ===================
document.getElementById('formLocais').addEventListener('submit', (e) => {
    const endereco = document.getElementById('endPolo').value;
    const dados = {
        nome: document.getElementById('nomePolo').value, prof: document.getElementById('profPolo').value,
        dias: document.getElementById('diasPolo').value, endereco: endereco, mapSrc: generateMapIframe(endereco)
    };
    saveOrUpdate(e, 'formLocais', 'site_locais', 'editIdLocais', dados, 'carregarLocais');
});

window.editarLocal = function(id) {
    const item = dadosGlobais.locais.find(x => x.id === id);
    document.getElementById('editIdLocais').value = item.id;
    document.getElementById('nomePolo').value = item.nome;
    document.getElementById('profPolo').value = item.prof;
    document.getElementById('diasPolo').value = item.dias;
    document.getElementById('endPolo').value = item.endereco;
    document.getElementById('btnLoc').innerHTML = '<i class="fas fa-edit"></i> Atualizar Local';
    window.scrollTo(0,0);
}

async function carregarLocais() {
    const lista = document.getElementById('listaLocais');
    const snap = await getDocs(collection(db, "site_locais"));
    dadosGlobais.locais = []; lista.innerHTML = '';
    snap.forEach(doc => {
        const d = {id: doc.id, ...doc.data()};
        dadosGlobais.locais.push(d);
        lista.innerHTML += `<div class="item-card">
            <div><strong>${d.nome}</strong><br><small>${d.endereco}</small></div>
            <div class="action-btns">
                <button class="btn-edit" onclick="editarLocal('${d.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn-excluir-aluno" style="padding: 5px 10px; margin:0;" onclick="removerFirebase('site_locais', '${d.id}', 'carregarLocais')"><i class="fas fa-trash"></i></button>
            </div>
        </div>`;
    });
}

// =================== LOJA ===================
document.getElementById('formLoja').addEventListener('submit', async (e) => {
    e.preventDefault();
    const editId = document.getElementById('editIdLoja').value;
    let imgUrl = await uploadImage('imgProduto', 'site/loja');
    
    if(editId) {
        const itemAtual = dadosGlobais.loja.find(x => x.id === editId);
        if(!imgUrl) imgUrl = itemAtual.img;
    } else {
        if(!imgUrl) return alert("Foto do produto é obrigatória!");
    }

    const dados = { nome: document.getElementById('nomeProduto').value, preco: document.getElementById('precoProduto').value, img: imgUrl };
    saveOrUpdate(e, 'formLoja', 'site_loja', 'editIdLoja', dados, 'carregarLoja');
});

window.editarLoja = function(id) {
    const item = dadosGlobais.loja.find(x => x.id === id);
    document.getElementById('editIdLoja').value = item.id;
    document.getElementById('nomeProduto').value = item.nome;
    document.getElementById('precoProduto').value = item.preco;
    document.getElementById('btnLoja').innerHTML = '<i class="fas fa-edit"></i> Atualizar Produto';
    window.scrollTo(0,0);
}

async function carregarLoja() {
    const lista = document.getElementById('listaLoja');
    const snap = await getDocs(collection(db, "site_loja"));
    dadosGlobais.loja = []; lista.innerHTML = '';
    snap.forEach(doc => {
        const d = {id: doc.id, ...doc.data()};
        dadosGlobais.loja.push(d);
        lista.innerHTML += `<div class="item-card">
            <div style="display:flex; gap:10px; align-items:center;">
                <img src="${d.img}" style="width:40px; height:40px; object-fit:cover; border-radius:5px;"><strong>${d.nome}</strong>
            </div>
            <div class="action-btns">
                <button class="btn-edit" onclick="editarLoja('${d.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn-excluir-aluno" style="padding: 5px 10px; margin:0;" onclick="removerFirebase('site_loja', '${d.id}', 'carregarLoja')"><i class="fas fa-trash"></i></button>
            </div>
        </div>`;
    });
}

// Inicia as listagens do CMS
carregarEquipe(); carregarAgenda(); carregarLocais(); carregarLoja();
