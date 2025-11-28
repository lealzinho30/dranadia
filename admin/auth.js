// ===== SISTEMA DE AUTENTICAÇÃO =====
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Verificar se há usuário logado
        const user = localStorage.getItem('admin_user');
        if (user) {
            this.currentUser = JSON.parse(user);
        }
    }

    // Login
    login(username, password) {
        // Usuário padrão (pode ser alterado nas configurações)
        const defaultUser = {
            username: 'admin',
            password: 'admin123', // Senha padrão
            name: 'Administrador'
        };

        // Verificar credenciais
        const savedUser = localStorage.getItem('admin_credentials');
        const credentials = savedUser ? JSON.parse(savedUser) : defaultUser;

        if (username === credentials.username && password === credentials.password) {
            this.currentUser = {
                username: credentials.username,
                name: credentials.name || 'Administrador',
                loginTime: new Date().toISOString()
            };
            localStorage.setItem('admin_user', JSON.stringify(this.currentUser));
            return true;
        }
        return false;
    }

    // Logout
    logout() {
        this.currentUser = null;
        localStorage.removeItem('admin_user');
        window.location.href = 'index.html';
    }

    // Verificar se está autenticado
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Obter usuário atual
    getCurrentUser() {
        return this.currentUser;
    }

    // Atualizar credenciais
    updateCredentials(newUsername, newPassword, newName) {
        const credentials = {
            username: newUsername,
            password: newPassword,
            name: newName
        };
        localStorage.setItem('admin_credentials', JSON.stringify(credentials));
        return true;
    }
}

// Instância global
const auth = new AuthSystem();

// Proteger páginas
function protectPage() {
    if (!auth.isAuthenticated()) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Verificar autenticação ao carregar página
if (window.location.pathname.includes('/admin/') && 
    !window.location.pathname.includes('index.html') && 
    !window.location.pathname.endsWith('/admin/')) {
    if (!protectPage()) {
        // Redirecionamento já foi feito
    }
}

