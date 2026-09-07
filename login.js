import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
    
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();
    const btn = document.getElementById('btnAcessar');
    const errorMsg = document.getElementById('errorMsg');

    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Autenticando...';
    btn.disabled = true;
    errorMsg.style.display = 'none';

    try {
        if (email === CREDENCIAIS_ADMIN.email && senha === CREDENCIAIS_ADMIN.senha) {
            const sessao = { role: 'admin', nome: 'Admin Master' };
            sessionStorage.setItem('sessaoCapoeira', JSON.stringify(sessao));
            window.location.href = 'admin.html';
            return;
        }

        const q = query(collection(db, "academias"), where("email", "==", email));
        const querySnapshot = await getDocs(q);

        let professorAutenticado = false;
        let academiaDados = null;

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.senha === senha) {
                professorAutenticado = true;
                academiaDados = data;
            }
        });

        if (professorAutenticado) {
            const nomeAcademiaLimpo = academiaDados.nome.replace(/^Academia\s+/i, '').trim();
            const sessao = { 
                role: 'professor', 
                nome: academiaDados.professor,
                academia: nomeAcademiaLimpo
            };
            sessionStorage.setItem('sessaoCapoeira', JSON.stringify(sessao));
            window.location.href = 'admin.html';
        } else {
            throw new Error("Credenciais inválidas");
        }

    } catch (error) {
        errorMsg.style.display = 'block';
        btn.innerHTML = 'Acessar Painel <i class="fas fa-arrow-right"></i>';
        btn.disabled = false;
    }
});
