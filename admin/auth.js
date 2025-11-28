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
            try {
                this.currentUser = JSON.parse(user);
                // Verificar se a sessão não expirou (24 horas)
                if (this.currentUser.loginTime) {
                    const loginTime = new Date(this.currentUser.loginTime);
                    const now = new Date();
                    const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
                    
                    if (hoursDiff > 24) {
                        // Sessão expirada
                        this.logout();
                    }
                }
            } catch (e) {
                this.currentUser = null;
                localStorage.removeItem('admin_user');
            }
        }
    }

    // Login
    login(username, password) {
        // Usuário padrão (pode ser alterado nas configurações)
        const defaultUser = {
            username: 'admin',
            password: 'DraNadia2024!@#', // Senha padrão mais segura
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
            name: newName || 'Administrador'
        };
        localStorage.setItem('admin_credentials', JSON.stringify(credentials));
        
        // Atualizar usuário atual se for o mesmo
        if (this.currentUser && this.currentUser.username === credentials.username) {
            this.currentUser.name = credentials.name;
            localStorage.setItem('admin_user', JSON.stringify(this.currentUser));
        }
        
        return true;
    }

    // Verificar se a senha está correta (sem fazer login)
    verifyPassword(password) {
        const savedUser = localStorage.getItem('admin_credentials');
        const defaultUser = {
            username: 'admin',
            password: 'DraNadia2024!@#'
        };
        const credentials = savedUser ? JSON.parse(savedUser) : defaultUser;
        return password === credentials.password;
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
document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname;
    const isAdminPage = currentPath.includes('/admin/');
    const isLoginPage = currentPath.includes('index.html') || currentPath.endsWith('/admin/');
    
    if (isAdminPage && !isLoginPage) {
        if (!protectPage()) {
            // Redirecionamento já foi feito
            return;
        }
    }
});
