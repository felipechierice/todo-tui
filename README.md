# 📋 TODO TUI

Uma aplicação de terminal (TUI) bonita e intuitiva para gerenciar tarefas em arquivos Markdown.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)

## ✨ Características

- 🎨 Interface colorida e organizada no terminal
- 📝 Usa arquivo Markdown como banco de dados (editável manualmente)
- 🔄 Sincroniza automaticamente com alterações externas no arquivo
- ⌨️ Navegação por teclado (vim-like: h/j/k/l)
- 🏷️ Suporte a tags, prazos e estimativas de tempo
- 🎯 Otimizado para pessoas com TDAH

## 🚀 Instalação

```bash
# Navegar até o diretório
cd ~/repos/todo-tui

# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev

# Ou buildar e rodar
npm run build
npm start
```

## 📖 Uso

```bash
# Usar arquivo padrão (~/.config/todo-tui/TODO.md)
todo

# Especificando arquivo customizado
todo ~/meu-todo.md
```

**Arquivo padrão:** `~/.config/todo-tui/TODO.md`

Na primeira execução, o app cria automaticamente:
- O diretório `~/.config/todo-tui/`
- O arquivo `TODO.md` com um template inicial

## ⌨️ Atalhos

### Navegação

| Tecla | Ação |
|-------|------|
| `↑` / `k` | Tarefa anterior |
| `↓` / `j` | Próxima tarefa |
| `←` / `h` | Seção anterior |
| `→` / `l` | Próxima seção |
| `Tab` | Próxima seção |

### Ações

| Tecla | Ação |
|-------|------|
| `Enter` | Marcar/Desmarcar tarefa |
| `a` | Adicionar nova tarefa |
| `d` | Deletar tarefa |
| `m` | Mover tarefa para outra seção |

### Atalhos Rápidos de Mover

| Tecla | Mover para |
|-------|------------|
| `1` | 🔥 FAZENDO |
| `2` | 📌 PRÓXIMAS |
| `3` | ⏳ ESPERANDO |
| `4` | 🚧 BLOQUEADAS |
| `5` | 💡 IDEIAS |
| `0` | ✅ CONCLUÍDAS |

### Geral

| Tecla | Ação |
|-------|------|
| `r` | Recarregar arquivo |
| `?` | Mostrar ajuda |
| `q` | Sair |
| `Esc` | Cancelar/Voltar |

## 📁 Estrutura do Arquivo Markdown

O app espera um arquivo Markdown com seções específicas:

```markdown
# 📋 TAREFAS

> **Foco de hoje:** _Suas prioridades_

## 🔥 FAZENDO (máx. 3)
- [ ] Tarefa em andamento `#tag` `~30min`

## 📌 PRÓXIMAS
- [ ] Próxima tarefa `#trabalho` `📅 20/12`

## ⏳ ESPERANDO
- [ ] Aguardando aprovação → _pessoa/motivo_

## 🚧 BLOQUEADAS
- [ ] Tarefa bloqueada → _motivo_

## 💡 IDEIAS / ALGUM DIA
- Ideia para o futuro

## ✅ CONCLUÍDAS
- [x] ~~Tarefa feita~~ ✓ 15/12
```

## 🛠️ Desenvolvimento

```bash
# Instalar dependências
npm install

# Rodar em modo dev (com hot reload)
npm run dev

# Build para produção
npm run build

# Rodar build
npm start
```

## 📦 Tecnologias

- **Node.js** - Runtime
- **TypeScript** - Linguagem
- **Ink** - React para terminal
- **Rollup** - Bundler
- **Chokidar** - File watcher

## 📄 Licença

MIT
