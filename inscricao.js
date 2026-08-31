import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, uploadString, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// SUAS CHAVES DO FIREBASE
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
const storage = getStorage(app);

// ----------------------------------------------------
// 1. CÁLCULO DE IDADE E BLOQUEIO DE RESPONSÁVEL
// ----------------------------------------------------
const inputDataNasc = document.getElementById('dataNasc');
const inputIdade = document.getElementById('campoIdade');
const secaoResponsavel = document.getElementById('secaoResponsavel');
const inputsResponsavel = secaoResponsavel.querySelectorAll('input');

inputDataNasc.addEventListener('change', (e) => {
    if (!e.target.value) return;
    
    const hoje = new Date();
    const nascimento = new Date(e.target.value);
    
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    
    // Ajusta a idade se ainda não fez aniversário no ano atual
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }
    
    inputIdade.value = idade;

    // Se maior ou igual a 18, oculta a área de responsável e remove a obrigatoriedade
    if (idade >= 18) {
        secaoResponsavel.classList.add('hidden');
        inputsResponsavel.forEach(input => {
            input.removeAttribute('required');
            input.value = ''; // Limpa caso já tivesse preenchido
        });
    } else {
        secaoResponsavel.classList.remove('hidden');
        inputsResponsavel.forEach(input => input.setAttribute('required', 'true'));
    }
});

// ----------------------------------------------------
// 2. LÓGICA DA CÂMERA
// ----------------------------------------------------
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
        console.error(err);
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

// ----------------------------------------------------
// 3. ENVIO PARA O FIREBASE
// ----------------------------------------------------
const form = document.getElementById('formInscricao');
const submitBtn = document.querySelector('.btn-submit');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if(!fotoDataUrl.value) {
        alert("Por favor, tire uma foto para a carteirinha e perfil do aluno!");
        return;
    }
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
    submitBtn.style.background = '#666';

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
        const nomeArquivo = 'fotos_alunos/' + Date.now() + '_' + data.nome.replace(/\s+/g, '_') + '.jpg';
        const fotoRef = ref(storage, nomeArquivo);
        
        await uploadString(fotoRef, fotoDataUrl.value, 'data_url');
        const fotoFinalUrl = await getDownloadURL(fotoRef);

        await addDoc(collection(db, "alunos"), {
            ...data,
            fotoUrl: fotoFinalUrl,
            dataCadastro: new Date().toISOString(),
            statusPagamento: "Pendente",
            cordaoAtual: "Iniciante"
        });
        
        alert("Inscrição realizada com sucesso! O cadastro já está no banco de dados.");
        
        form.reset();
        canvas.style.display = 'none';
        fotoDataUrl.value = '';
        startCamBtn.innerHTML = '<i class="fas fa-video"></i> Abrir Câmera';
        startCamBtn.style.background = 'var(--secondary-blue)';

    } catch (error) {
        console.error("Erro ao salvar: ", error);
        alert("Ocorreu um erro ao enviar. Verifique se o Banco de Dados (Firestore) está liberado.");
    } finally {
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Finalizar Inscrição';
        submitBtn.disabled = false;
        submitBtn.style.background = 'var(--accent-green)';
    }
});
