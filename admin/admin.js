// ===== FUNÇÕES GERAIS DO PAINEL =====

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    initAdmin();
});

function initAdmin() {
    // Atualizar informações do usuário
    updateUserInfo();
    
    // Configurar logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Deseja realmente sair?')) {
                auth.logout();
            }
        });
    }

    // Menu mobile toggle
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // Fechar menu ao clicar em link
    const menuLinks = document.querySelectorAll('.sidebar-menu a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        });
    });
}

// Atualizar informações do usuário
function updateUserInfo() {
    const user = auth.getCurrentUser();
    if (user) {
        const userNameEl = document.getElementById('userName');
        const userInfoEl = document.getElementById('userInfo');
        
        if (userNameEl) userNameEl.textContent = user.name;
        if (userInfoEl) {
            const loginDate = new Date(user.loginTime);
            userInfoEl.textContent = `Logado desde ${loginDate.toLocaleString('pt-BR')}`;
        }
    }
}

// ===== GERENCIAMENTO DE MENSAGENS =====
function loadMessages() {
    const messages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
    return messages.reverse(); // Mais recentes primeiro
}

function saveMessage(message) {
    const messages = loadMessages();
    const newMessage = {
        id: Date.now(),
        ...message,
        date: new Date().toISOString(),
        read: false
    };
    messages.push(newMessage);
    localStorage.setItem('contact_messages', JSON.stringify(messages));
    return newMessage;
}

function markAsRead(messageId) {
    const messages = loadMessages();
    const message = messages.find(m => m.id === messageId);
    if (message) {
        message.read = true;
        localStorage.setItem('contact_messages', JSON.stringify(messages));
    }
}

function deleteMessage(messageId) {
    const messages = loadMessages();
    const filtered = messages.filter(m => m.id !== messageId);
    localStorage.setItem('contact_messages', JSON.stringify(filtered));
}

function getUnreadCount() {
    const messages = loadMessages();
    return messages.filter(m => !m.read).length;
}

// ===== ESTATÍSTICAS =====
function getStats() {
    const messages = loadMessages();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayMessages = messages.filter(m => {
        const msgDate = new Date(m.date);
        msgDate.setHours(0, 0, 0, 0);
        return msgDate.getTime() === today.getTime();
    });

    const thisWeek = messages.filter(m => {
        const msgDate = new Date(m.date);
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return msgDate >= weekAgo;
    });

    const thisMonth = messages.filter(m => {
        const msgDate = new Date(m.date);
        return msgDate.getMonth() === today.getMonth() && 
               msgDate.getFullYear() === today.getFullYear();
    });

    return {
        total: messages.length,
        unread: getUnreadCount(),
        today: todayMessages.length,
        thisWeek: thisWeek.length,
        thisMonth: thisMonth.length
    };
}

// ===== UTILITÁRIOS =====
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Exportar funções globais
window.adminFunctions = {
    loadMessages,
    saveMessage,
    markAsRead,
    deleteMessage,
    getUnreadCount,
    getStats,
    formatDate,
    showNotification
};

