import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, uploadString, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

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

// --- PAGINAÇÃO (WIZARD) ---
const steps = document.querySelectorAll('.form-step');
const indicators = document.querySelectorAll('.step-indicator');
const btnNext = document.getElementById('btnNext');
const btnPrev = document.getElementById('btnPrev');
const btnSubmit = document.getElementById('btnSubmit');
let currentStep = 0;

function updateFormSteps() {
    steps.forEach((step, index) => {
        step.classList.toggle('active', index === currentStep);
        indicators[index].classList.toggle('active', index <= currentStep);
    });
    
    btnPrev.style.display = currentStep > 0 ? 'inline-block' : 'none';
    
    if (currentStep === steps.length - 1) {
        btnNext.style.display = 'none';
        btnSubmit.style.display = 'inline-block';
    } else {
        btnNext.style.display = 'inline-block';
        btnSubmit.style.display = 'none';
    }
}

btnNext.addEventListener('click', () => {
    // Validação simples antes de avançar
    const currentInputs = steps[currentStep].querySelectorAll('input[required], select[required]');
    let allValid = true;
    currentInputs.forEach(input => { if (!input.value) allValid = false; });
    
    if (!allValid) {
        alert("Preencha todos os campos obrigatórios desta etapa.");
        return;
    }
    currentStep++;
    updateFormSteps();
});

btnPrev.addEventListener('click', () => {
    currentStep--;
    updateFormSteps();
});

// --- LÓGICA DE IDADE ---
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
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) idade--;
    
    inputIdade.value = idade;

    if (idade >= 18) {
        secaoResponsavel.classList.add('hidden');
        inputsResponsavel.forEach(input => { input.removeAttribute('required'); input.value = ''; });
    } else {
        secaoResponsavel.classList.remove('hidden');
        inputsResponsavel.forEach(input => input.setAttribute('required', 'true'));
    }
});

// --- CÂMERA FRONTAL/TRASEIRA ---
const startCamBtn = document.getElementById('startCam');
const flipCamBtn = document.getElementById('flipCam');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const snapBtn = document.getElementById('snapBtn');
const fotoDataUrl = document.getElementById('fotoDataUrl');
let stream;
let currentFacingMode = 'user'; // Padrão: Frontal

async function initCamera() {
    if (stream) { stream.getTracks().forEach(track => track.stop()); }
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: currentFacingMode } });
        video.srcObject = stream;
        video.style.display = 'block';
        snapBtn.style.display = 'inline-block';
        flipCamBtn.style.display = 'inline-block';
        startCamBtn.style.display = 'none';
        canvas.style.display = 'none';
    } catch (err) {
        alert("Erro ao acessar a câmera. Verifique permissões.");
    }
}

startCamBtn.addEventListener('click', initCamera);
flipCamBtn.addEventListener('click', () => {
    currentFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
    initCamera();
});

snapBtn.addEventListener('click', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    fotoDataUrl.value = canvas.toDataURL('image/jpeg', 0.8);
    
    stream.getTracks().forEach(track => track.stop());
    video.style.display = 'none';
    snapBtn.style.display = 'none';
    flipCamBtn.style.display = 'none';
    canvas.style.display = 'block';
    
    startCamBtn.innerHTML = '<i class="fas fa-redo"></i> Tirar Outra';
    startCamBtn.style.display = 'inline-block';
});

// --- ENVIO FIREBASE + PDF ---
const form = document.getElementById('formInscricao');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if(!fotoDataUrl.value) { alert("Tire a foto do aluno no Passo 1!"); return; }
    
    btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
    btnSubmit.disabled = true;

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
        const nomeArquivo = 'fotos_alunos/' + Date.now() + '_' + data.nome.replace(/\s+/g, '_') + '.jpg';
        const fotoRef = ref(storage, nomeArquivo);
        await uploadString(fotoRef, fotoDataUrl.value, 'data_url');
        const fotoFinalUrl = await getDownloadURL(fotoRef);

        await addDoc(collection(db, "alunos"), {
            ...data, fotoUrl: fotoFinalUrl, dataCadastro: new Date().toISOString(), statusPagamento: "Pendente", cordaoAtual: "Iniciante"
        });
        
        alert("Inscrição e PDF gerados com sucesso!");
        
        // Dispara a impressão do PDF automaticamente
        window.print();
        
        // Reseta o formulário
        setTimeout(() => { location.reload(); }, 2000);

    } catch (error) {
        alert("Erro técnico: " + error.message);
    } finally {
        btnSubmit.innerHTML = '<i class="fas fa-check-circle"></i> Enviar e Gerar PDF';
        btnSubmit.disabled = false;
    }
});
