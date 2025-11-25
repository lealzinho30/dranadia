# 📸 Guia Rápido - Adicionar Imagens

## 🚀 Método Mais Fácil (Recomendado)

### Opção 1: Usando o Script Python (Automático)

1. **Coloque suas imagens na pasta `images/`**
   - Pode usar qualquer nome de arquivo
   - Formatos aceitos: `.jpg`, `.jpeg`, `.png`, `.webp`

2. **Edite o arquivo `imagens-config.txt`**
   - Abra o arquivo
   - Substitua os nomes de exemplo pelos nomes reais dos seus arquivos
   - Exemplo: Se sua imagem se chama `foto-clinica.jpg`, coloque:
     ```
     hero-slide-1=foto-clinica.jpg
     ```

3. **Execute o script:**
   ```bash
   python atualizar-imagens.py
   ```

4. **Pronto!** O site será atualizado automaticamente! 🎉

---

### Opção 2: Usando a Interface Visual

1. **Abra o arquivo `atualizar-imagens.html` no navegador**
   - Clique duas vezes no arquivo ou arraste para o navegador

2. **Arraste suas imagens para a área de upload**
   - Ou clique para selecionar

3. **Clique nas imagens para atribuí-las às seções**
   - Cada seção mostra onde a imagem será usada

4. **Clique em "Atualizar Site"**
   - O arquivo de configuração será gerado

5. **Execute o script Python:**
   ```bash
   python atualizar-imagens.py
   ```

---

## 📋 Estrutura de Pastas

```
site odontopediatra/
├── images/              ← Coloque suas imagens aqui
│   ├── hero-1.jpg
│   ├── dra-nadia.jpg
│   ├── galeria-1.jpg
│   └── ...
├── imagens-config.txt   ← Configure os nomes aqui
├── atualizar-imagens.py ← Execute este script
├── atualizar-imagens.html ← Interface visual (opcional)
└── index.html           ← Será atualizado automaticamente
```

---

## 🎯 Quais Imagens Preciso?

### Obrigatórias (Recomendadas):
- ✅ **3 imagens para o Hero** (slider principal) - `hero-slide-1`, `hero-slide-2`, `hero-slide-3`
- ✅ **1 foto da Dra. Nadia** - `sobre-foto`

### Opcionais (mas recomendadas):
- 📸 **4 imagens para Diferenciais** - `diferencial-1` até `diferencial-4`
- 🖼️ **9 imagens para Galeria** - `galeria-1` até `galeria-9`
- 💡 **6 imagens para Dicas** - `dica-1` até `dica-6`

**Total: 23 imagens** (mas você pode começar com menos!)

---

## 💡 Dicas

### Nomes de Arquivos
- Use nomes descritivos: `clinica-externa.jpg`, `atendimento-crianca.jpg`
- Evite espaços: use `-` ou `_` (ex: `foto-1.jpg` não `foto 1.jpg`)
- Não precisa renomear os arquivos! Só configure no `imagens-config.txt`

### Tamanhos Recomendados
- **Hero**: 1920x1080px (formato paisagem)
- **Dra. Nadia**: 800x1000px (formato retrato)
- **Galeria**: 1200x1200px (quadrado) ou 1200x800px
- **Diferenciais/Dicas**: 400x300px ou maior

### Otimização
- Comprima as imagens antes de usar (reduz o tamanho do site)
- Use ferramentas como [TinyPNG](https://tinypng.com) ou [Squoosh](https://squoosh.app)

---

## ❓ Problemas Comuns

### "Arquivo não encontrado"
- ✅ Verifique se a imagem está na pasta `images/`
- ✅ Verifique se o nome no `imagens-config.txt` está correto (case-sensitive)
- ✅ Verifique a extensão do arquivo (.jpg, .jpeg, .png, .webp)

### "Nenhuma alteração foi feita"
- ✅ Verifique se você editou o `imagens-config.txt`
- ✅ Verifique se os nomes dos arquivos estão corretos
- ✅ Execute o script novamente

### Imagens não aparecem no site
- ✅ Verifique se o servidor está rodando (`python -m http.server 8000`)
- ✅ Limpe o cache do navegador (Ctrl+F5)
- ✅ Verifique o console do navegador para erros (F12)

---

## 🎨 Exemplo de Configuração

```txt
# Hero Slider
hero-slide-1=clinica-fachada.jpg
hero-slide-2=atendimento-crianca.jpg
hero-slide-3=sala-espera.jpg

# Sobre
sobre-foto=dra-nadia-foto-profissional.jpg

# Galeria
galeria-1=equipamentos.jpg
galeria-2=consultorio-1.jpg
galeria-3=consultorio-2.jpg
# ... etc
```

---

## ✅ Checklist

- [ ] Criei a pasta `images/` (se não existir)
- [ ] Coloquei minhas imagens na pasta `images/`
- [ ] Editei o arquivo `imagens-config.txt`
- [ ] Executei `python atualizar-imagens.py`
- [ ] Verifiquei o site no navegador
- [ ] Todas as imagens aparecem corretamente

---

**Precisa de ajuda?** Basta me avisar! 😊

