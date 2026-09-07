/* login.js */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

const CREDENCIAIS_ADMIN = {
    email: "admin@capoeira.com.br",
    senha: "adminmaster123"
};

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const identificador = document.getElementById('loginIdentificador').value.trim().toLowerCase();
    const senha = document.getElementById('senha').value.trim();
    const btn = document.getElementById('btnAcessar');
    const errorMsg = document.getElementById('errorMsg');

    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Autenticando...';
    btn.disabled = true;
    errorMsg.style.display = 'none';

    try {
        // 1. Admin Master Check
        if (identificador === CREDENCIAIS_ADMIN.email && senha === CREDENCIAIS_ADMIN.senha) {
            sessionStorage.setItem('sessaoCapoeira', JSON.stringify({ role: 'admin', nome: 'Admin Master' }));
            window.location.href = 'admin.html';
            return;
        }

        // 2. Professores Check (Coleção 'academias')
        const snapAcademias = await getDocs(collection(db, "academias"));
        let professorEncontrado = null;
        snapAcademias.forEach(docSnap => {
            const data = docSnap.data();
            const emailDb = (data.email || '').trim().toLowerCase();
            const telDb = (data.celular || '').trim().toLowerCase();
            if ((emailDb === identificador || telDb === identificador) && data.senha === senha) {
                professorEncontrado = data;
            }
        });

        if (professorEncontrado) {
            const nomeAcademiaLimpo = professorEncontrado.nome.replace(/^Academia\s+/i, '').trim();
            sessionStorage.setItem('sessaoCapoeira', JSON.stringify({ 
                role: 'professor', 
                nome: professorEncontrado.professor,
                academia: nomeAcademiaLimpo
            }));
            window.location.href = 'admin.html';
            return;
        }

        // 3. Alunos / Responsáveis Check (Coleção 'alunos')
        const snapAlunos = await getDocs(collection(db, "alunos"));
        let alunoEncontrado = null;
        snapAlunos.forEach(docSnap => {
            const data = docSnap.data();
            const emailAluno = (data.email || '').trim().toLowerCase();
            const telAluno = (data.celular || '').trim().toLowerCase();
            const emailResp = (data.emailResponsavel || '').trim().toLowerCase();
            const telResp = (data.celularResponsavel || '').trim().toLowerCase();
            const senhaDb = data.senha || '';

            if (
                ((emailAluno === identificador || telAluno === identificador || emailResp === identificador || telResp === identificador) && senhaDb === senha)
            ) {
                alunoEncontrado = { id: docSnap.id, ...data };
            }
        });

        if (alunoEncontrado) {
            sessionStorage.setItem('sessaoAluno', JSON.stringify(alunoEncontrado));
            window.location.href = 'aluno.html';
            return;
        }

        throw new Error("Usuário ou senha inválidos");

    } catch (error) {
        errorMsg.style.display = 'block';
        btn.innerHTML = 'Acessar Painel <i class="fas fa-arrow-right"></i>';
        btn.disabled = false;
    }
});
