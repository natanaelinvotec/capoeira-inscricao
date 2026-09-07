import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// Verificação de Segurança (Apenas Admin Master pode gerenciar o site)
const sessaoString = sessionStorage.getItem('sessaoCapoeira');
if (!sessaoString) window.location.href = 'login.html';
const usuarioLogado = JSON.parse(sessaoString);
if (usuarioLogado.role !== 'admin') {
    alert("Acesso negado. Apenas o Administrador pode editar o site.");
    window.location.href = 'admin.html';
}

const firebaseConfig = { /* Suas credenciais do Firebase aqui */ };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Preview de Imagem
document.getElementById('fotoMestre').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('previewMestre').innerHTML = `<img src="${e.target.result}" style="width:100%; height:100%; object-fit:cover;">`;
        }
        reader.readAsDataURL(file);
    }
});

// Cadastro de Mestre com Upload de Imagem
document.getElementById('formMestres').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Fazendo Upload...';
    btn.disabled = true;

    const file = document.getElementById('fotoMestre').files[0];
    const storageRef = ref(storage, 'site/professores/' + Date.now() + '_' + file.name);
    
    try {
        const uploadTask = await uploadBytesResumable(storageRef, file);
        const downloadURL = await getDownloadURL(uploadTask.ref);

        await addDoc(collection(db, "site_professores"), {
            nome: document.getElementById('nomeMestre').value,
            titulo: document.getElementById('tituloMestre').value,
            bio: document.getElementById('bioMestre').value,
            whatsapp: document.getElementById('whatsMestre').value,
            maps: document.getElementById('mapsMestre').value,
            fotoUrl: downloadURL,
            ordem: Date.now()
        });

        alert("Profissional adicionado ao site com sucesso!");
        e.target.reset();
        document.getElementById('previewMestre').innerHTML = '<i class="fas fa-image"></i>';
        carregarMestres();
    } catch (error) {
        alert("Erro ao fazer upload: " + error.message);
    } finally {
        btn.innerHTML = '<i class="fas fa-save"></i> Publicar Profissional no Site';
        btn.disabled = false;
    }
});

// Carregar e listar os mestres na tela do CMS
async function carregarMestres() {
    const lista = document.getElementById('listaMestres');
    lista.innerHTML = 'Carregando...';
    const querySnapshot = await getDocs(collection(db, "site_professores"));
    lista.innerHTML = '';
    querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        lista.innerHTML += `
            <div class="item-card">
                <img src="${data.fotoUrl}">
                <div>
                    <h4 style="color: var(--primary-blue);">${data.nome}</h4>
                    <p style="font-size: 0.85rem; color: #666;">${data.titulo}</p>
                </div>
                <div class="item-actions">
                    <button class="btn-excluir-aluno" onclick="excluirItem('site_professores', '${docSnap.id}')" style="margin:0; padding: 6px 12px;"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    });
}

window.excluirItem = async function(colecao, id) {
    if(confirm("Tem certeza que deseja remover do site?")) {
        await deleteDoc(doc(db, colecao, id));
        carregarMestres();
    }
}

// Inicializa listas
carregarMestres();