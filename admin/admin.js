// ===== UTILITÁRIOS DO PAINEL ADMINISTRATIVO =====
const adminUtils = {
    // ===== MENSAGENS =====
    getMessages() {
        try {
            const messages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
            return messages.sort((a, b) => new Date(b.date) - new Date(a.date)); // Mais recentes primeiro
        } catch (e) {
            console.error('Erro ao carregar mensagens:', e);
            return [];
        }
    },

    saveMessage(message) {
        const messages = this.getMessages();
        const newMessage = {
            id: Date.now(),
            ...message,
            date: new Date().toISOString(),
            read: false
        };
        messages.push(newMessage);
        localStorage.setItem('contact_messages', JSON.stringify(messages));
        return newMessage;
    },

    markAsRead(messageId) {
        const messages = this.getMessages();
        const message = messages.find(m => m.id === messageId);
        if (message) {
            message.read = true;
            localStorage.setItem('contact_messages', JSON.stringify(messages));
            return true;
        }
        return false;
    },

    markAsUnread(messageId) {
        const messages = this.getMessages();
        const message = messages.find(m => m.id === messageId);
        if (message) {
            message.read = false;
            localStorage.setItem('contact_messages', JSON.stringify(messages));
            return true;
        }
        return false;
    },

    deleteMessage(messageId) {
        const messages = this.getMessages();
        const filtered = messages.filter(m => m.id !== messageId);
        localStorage.setItem('contact_messages', JSON.stringify(filtered));
        return true;
    },

    getUnreadCount() {
        const messages = this.getMessages();
        return messages.filter(m => !m.read).length;
    },

    // ===== FORMATAÇÃO =====
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Agora';
        if (minutes < 60) return `${minutes} min atrás`;
        if (hours < 24) return `${hours}h atrás`;
        if (days < 7) return `${days} dias atrás`;

        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    formatDateFull(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // ===== NOTIFICAÇÕES =====
    showNotification(message, type = 'success') {
        // Remover notificações existentes
        const existing = document.querySelectorAll('.admin-notification');
        existing.forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `admin-notification admin-notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },

    // ===== CONFIGURAÇÕES =====
    getConfig() {
        try {
            return JSON.parse(localStorage.getItem('admin_config') || '{}');
        } catch (e) {
            return {};
        }
    },

    saveConfig(config) {
        localStorage.setItem('admin_config', JSON.stringify(config));
        return true;
    }
};

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    // Toggle sidebar mobile
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }

    // Fechar sidebar ao clicar fora (mobile)
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && sidebar && sidebar.classList.contains('active')) {
            if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });

    // Atualizar badge de não lidas
    function updateUnreadBadge() {
        const unreadCount = adminUtils.getUnreadCount();
        const badges = document.querySelectorAll('#unreadBadge');
        badges.forEach(badge => {
            if (unreadCount > 0) {
                badge.textContent = unreadCount;
                badge.style.display = 'inline-block';
            } else {
                badge.style.display = 'none';
            }
        });
    }

    updateUnreadBadge();
    setInterval(updateUnreadBadge, 30000); // Atualizar a cada 30 segundos
});

// Exportar para uso global
window.adminUtils = adminUtils;
