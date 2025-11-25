# 🔧 Solução de Problemas - Painel Admin

## ❌ Erro: "Conexão recusada" ou "ERR_CONNECTION_REFUSED"

### Solução 1: Iniciar o Servidor

O servidor precisa estar rodando para acessar o painel admin.

**Windows:**
1. Clique duas vezes em `INICIAR-ADMIN.bat`
2. OU execute no PowerShell: `.\INICIAR-ADMIN.ps1`
3. OU execute manualmente: `python admin-server.py`

**Verificar se está rodando:**
- Você deve ver a mensagem: "🚀 SERVIDOR ADMIN INICIADO"
- A porta 8001 deve estar ativa

### Solução 2: Verificar Python

Se o servidor não iniciar, verifique se o Python está instalado:

```bash
python --version
```

Se não funcionar, instale o Python em: https://www.python.org/downloads/

### Solução 3: Porta Ocupada

Se a porta 8001 estiver ocupada:

1. **Fechar outros programas** usando a porta
2. **Ou alterar a porta** no arquivo `admin-server.py` (linha 312)

### Solução 4: Firewall/Antivírus

Alguns antivírus ou firewalls podem bloquear o servidor local. Tente:
- Adicionar exceção para Python
- Desabilitar temporariamente o firewall

---

## ❌ Erro: Imagens não carregam

### Verificar:
1. ✅ Servidor está rodando na porta 8001
2. ✅ Pasta `images/` existe e tem as imagens
3. ✅ Nomes dos arquivos no `config.json` correspondem aos arquivos

### Solução:
1. Abra o painel admin: `http://localhost:8001/admin.html`
2. Clique em "Recarregar" no topo
3. Verifique se as imagens aparecem nos previews

---

## 📝 Como Usar

1. **Iniciar servidor:**
   - Execute `INICIAR-ADMIN.bat` ou `INICIAR-ADMIN.ps1`

2. **Acessar painel:**
   - Abra: `http://localhost:8001/admin.html`

3. **Fazer alterações:**
   - Edite imagens, textos, contatos, etc.
   - Clique em "Salvar Tudo"

4. **Ver site:**
   - Acesse: `http://localhost:8000` (se tiver outro servidor)
   - Ou abra `index.html` diretamente

---

## 🆘 Ainda com problemas?

1. Verifique se está na pasta correta do projeto
2. Verifique se todos os arquivos estão presentes:
   - `admin-server.py`
   - `admin.html`
   - `admin.js`
   - `admin.css`
   - `images/` (pasta)
3. Tente executar manualmente:
   ```bash
   python admin-server.py
   ```

