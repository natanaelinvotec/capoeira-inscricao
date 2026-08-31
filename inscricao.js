// Importando o Firebase (Versão 10 Modular) direto do Google
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, uploadString, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// SUAS CHAVES DO FIREBASE (Já configuradas com os dados do seu print!)
const firebaseConfig = {
  apiKey: "AIzaSyBkwCDziiV-Uh7MLzsy9OYJmA_LMnn7jbg",
  authDomain: "capoeira-liberdade.firebaseapp.com",
  projectId: "capoeira-liberdade",
  storageBucket: "capoeira-liberdade.firebasestorage.app",
  messagingSenderId: "492022804215",
  appId: "1:492022804215:web:c61aed556d9f1aa9576df2"
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Lógica da Câmera
const startCamBtn = document.getElementById('startCam');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const snapBtn = document.getElementById('snapBtn');
const fotoDataUrl = document.getElementById('fotoDataUrl');
let stream;

startCamBtn.addEventListener('click', async () => {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        video.srcObject = stream;
        video.style.display = 'block';
        snapBtn.style.display = 'inline-block';
        startCamBtn.style.display = 'none';
    } catch (err) {
        alert("Erro ao acessar a câmera. Verifique as permissões do navegador.");
        console.error("Erro na câmera:", err);
    }
});

snapBtn.addEventListener('click', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    fotoDataUrl.value = canvas.toDataURL('image/jpeg', 0.8);
    
    stream.getTracks().forEach(track => track.stop());
    video.style.display = 'none';
    snapBtn.style.display = 'none';
    canvas.style.display = 'block';
    
    startCamBtn.innerHTML = '<i class="fas fa-redo"></i> Tirar Outra Foto';
    startCamBtn.style.display = 'inline-block';
    startCamBtn.style.background = '#666';
});

// Manipulação e Envio do Formulário para o Firebase
const form = document.getElementById('formInscricao');
const submitBtn = document.querySelector('.btn-submit');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if(!fotoDataUrl.value) {
        alert("Por favor, tire uma foto para a carteirinha e perfil do aluno!");
        return;
    }
    
    // Altera o botão para mostrar que está enviando
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
    submitBtn.style.background = '#666';

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
        // 1. Fazer o Upload da Foto no Firebase Storage
        const nomeArquivo = 'fotos_alunos/' + Date.now() + '_' + data.nome.replace(/\s+/g, '_') + '.jpg';
        const fotoRef = ref(storage, nomeArquivo);
        
        await uploadString(fotoRef, fotoDataUrl.value, 'data_url');
        const fotoFinalUrl = await getDownloadURL(fotoRef);

        // 2. Salvar os dados de texto + a URL da foto no Firestore Database
        await addDoc(collection(db, "alunos"), {
            ...data,
            fotoUrl: fotoFinalUrl,
            dataCadastro: new Date().toISOString(),
            statusPagamento: "Pendente",
            cordaoAtual: "Iniciante"
        });
        
        alert("Inscrição realizada com sucesso! O cadastro já está no banco de dados.");
        
        // Limpa o formulário
        form.reset();
        canvas.style.display = 'none';
        fotoDataUrl.value = '';
        startCamBtn.innerHTML = '<i class="fas fa-video"></i> Abrir Câmera';
        startCamBtn.style.background = 'var(--secondary-blue)';

    } catch (error) {
        console.error("Erro ao salvar inscrição: ", error);
        alert("Ocorreu um erro ao enviar. Verifique se o Banco de Dados (Firestore) está ativado em 'modo de teste' no Firebase.");
    } finally {
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Finalizar Inscrição';
        submitBtn.disabled = false;
        submitBtn.style.background = 'var(--accent-green)';
    }
});
