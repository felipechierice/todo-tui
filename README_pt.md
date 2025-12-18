# 📋 TODO TUI

Uma aplicação de terminal (TUI) bonita e intuitiva para gerenciar tarefas em arquivos Markdown.

[![npm version](https://img.shields.io/npm/v/todo-tui.svg?style=flat)](https://www.npmjs.com/package/todo-tui)
[![GitHub](https://img.shields.io/github/license/felipechierice/todo-tui)](https://github.com/felipechierice/todo-tui/blob/master/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/felipechierice/todo-tui)](https://github.com/felipechierice/todo-tui/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/felipechierice/todo-tui)](https://github.com/felipechierice/todo-tui/issues)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)

## 🌟 Por que TODO TUI?

Gerencie suas tarefas diretamente do terminal com uma interface bonita e controlada por teclado. Perfeito para desenvolvedores que vivem no terminal e querem manter o fluxo de trabalho ininterrupto. Suas tarefas são armazenadas em um arquivo Markdown simples que você pode editar manualmente ou com o app.

**Nascido da necessidade:** Este app foi criado por uma pessoa com TDAH que precisava de uma forma simples e altamente visual de gerenciar tarefas do dia a dia. A interface foi intencionalmente projetada para reduzir a carga cognitiva e manter o foco, com funcionalidades como o limite de 3 tarefas na seção "FAZENDO" para evitar sobrecarga.

**Principais Benefícios:**
- 🚀 Navegação ultrarrápida por teclado (estilo vim)
- 📝 Armazenamento em Markdown legível por humanos
- 🔄 Sincronização ao vivo com alterações externas
- 🎨 Interface bonita e sem distrações
- 💪 Operações em lote poderosas
- 🧠 Design pensado para TDAH (máx. 3 tarefas em "FAZENDO" para evitar sobrecarga)
- 🎯 Campo "Foco de hoje" para definir prioridades diárias
- ✨ Hierarquia visual clara e seções com cores

## 📸 Screenshots

<!-- Adicione screenshots aqui quando disponível -->
_Em breve.

## 📑 Índice

- [Características](#-características)
- [Instalação](#-instalação)
- [Uso](#-uso)
- [Atalhos](#-atalhos)
- [Estrutura do Arquivo Markdown](#-estrutura-do-arquivo-markdown)
- [Desenvolvimento](#-desenvolvimento)
- [Funcionalidades Detalhadas](#-funcionalidades-detalhadas)
- [Tecnologias](#-tecnologias)
- [Perguntas Frequentes](#-perguntas-frequentes)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

## ✨ Características

- 🎨 Interface colorida e organizada no terminal
- 📝 Usa arquivo Markdown como banco de dados (editável manualmente)
- 🔄 Sincroniza automaticamente com alterações externas no arquivo
- ⌨️ Navegação por teclado (vim-like: h/j/k/l)
- 🏷️ Suporte a tags, prazos e estimativas de tempo
- 🚀 Marcadores de prioridade (⚡ importante, 🚀 rápida)
- 📦 Seleção múltipla de tarefas para ações em lote
- 🔝 Reordenação de tarefas com Ctrl+setas ou K/J
- 🎯 Campo "Foco de hoje" editável
- 🔥 Limite de 3 tarefas na seção "FAZENDO"
- 📱 Interface responsiva que se adapta ao tamanho do terminal
- 💾 Salvamento automático em todas as operações

## 🚀 Instalação

### Início Rápido com npx (Recomendado)

Sem necessidade de instalação! Apenas execute:

```bash
# Usar arquivo padrão (~/.config/todo-tui/TODO.md)
npx todo-tui

# Especificar arquivo customizado
npx todo-tui ~/meu-todo.md
```

### Instalação Global

```bash
# Com npm
npm install -g todo-tui

# Com pnpm
pnpm add -g todo-tui
```

Após instalação global, use o comando `todo` de qualquer lugar:

```bash
# Usar arquivo padrão
todo

# Especificar arquivo customizado
todo ~/meu-todo.md
```

### Instalação a partir do Código Fonte

```bash
# Clone o repositório
git clone https://github.com/felipechierice/todo-tui.git
cd todo-tui

# Instalar dependências
pnpm install

# Build
pnpm build

# Link globalmente
npm link
```

### Desenvolvimento

```bash
# Navegar até o diretório
cd todo-tui

# Instalar dependências
pnpm install

# Rodar em modo desenvolvimento
pnpm dev
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
| `→` / `l` / `Tab` | Próxima seção |

### Ações Básicas

| Tecla | Ação |
|-------|------|
| `Enter` | Marcar/Desmarcar tarefa(s) selecionada(s) |
| `a` | Adicionar nova tarefa |
| `e` | Editar tarefa atual |
| `d` (2x) | Deletar tarefa(s) (pressione duas vezes) |
| `m` | Mover tarefa para outra seção |
| `f` | Editar foco do dia |

### Seleção Múltipla

| Tecla | Ação |
|-------|------|
| `Space` | Selecionar/Desselecionar tarefa atual |
| `s` | Selecionar/Desselecionar todas as tarefas da seção |
| `S` | Selecionar/Desselecionar todas as tarefas |

**Dica:** Selecione múltiplas tarefas e use `Enter`, `d`, `m` ou números para ações em lote!

### Reordenação

| Tecla | Ação |
|-------|------|
| `K` / `Ctrl+↑` | Mover tarefa(s) para cima |
| `J` / `Ctrl+↓` | Mover tarefa(s) para baixo |

**Nota:** Mover no início/fim de uma seção move para a seção anterior/próxima.

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
| `?` | Mostrar ajuda completa |
| `q` | Sair |
| `Esc` | Cancelar/Voltar |

## 📁 Estrutura do Arquivo Markdown

O app espera um arquivo Markdown com seções específicas:

```markdown
# 📋 TAREFAS

> **Foco de hoje:** _Suas prioridades do dia_

## 🔥 FAZENDO (máx. 3)
- [ ] Tarefa em andamento `#tag` `~30min` ⚡

## 📌 PRÓXIMAS
- [ ] Próxima tarefa `#trabalho` `📅 20/12`
- [ ] Tarefa rápida 🚀

## ⏳ ESPERANDO
- [ ] Aguardando aprovação → _João/código review_

## 🚧 BLOQUEADAS
- [ ] Tarefa bloqueada → _Dependência externa_

## 💡 IDEIAS / ALGUM DIA
- Ideia para o futuro
- [ ] Outra ideia com checkbox

## ✅ CONCLUÍDAS
- [x] ~~Tarefa feita~~ ✓ 15/12
```

### Formato das Tarefas

- **Tags:** `#tag` (podem ser múltiplas)
- **Prazo:** `📅 DD/MM` (data limite)
- **Duração:** `~30min`, `~2h` (tempo estimado)
- **Marcadores:**
  - ⚡ = Prioridade alta/importante
  - 🚀 = Tarefa rápida
- **Aguardando/Bloqueada:** `→ _motivo ou pessoa_`
- **Conclusão:** `✓ DD/MM` (adicionado automaticamente ao marcar como concluída)
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
pnpm install

# Rodar em modo dev (com hot reload)
pnpm dev

# Build para produção
pnpm build

# Rodar build
pnpm start
```

## 🎨 Funcionalidades Detalhadas

### Adicionar Tarefa (tecla `a`)
Wizard interativo que solicita:
1. Texto da tarefa
2. Tags (separadas por vírgula ou espaço)
3. Prazo (formato DD/MM)
4. Duração estimada (ex: 30min, 2h)
5. Marcador de prioridade (Nenhum, ⚡ Importante, 🚀 Rápida)

### Editar Tarefa (tecla `e`)
Permite editar todos os campos de uma tarefa existente usando o mesmo wizard.

### Mover Tarefas
- **Manual:** Tecla `m` abre menu de seleção de seção
- **Rápido:** Teclas `1-5` e `0` movem diretamente
- **Reordenar:** `K`/`J` ou `Ctrl+↑`/`Ctrl+↓` para reorganizar dentro ou entre seções

### Seleção Múltipla
1. Use `Space` para selecionar tarefas individuais
2. Use `s` para selecionar/desselecionar toda a seção
3. Use `S` para selecionar/desselecionar todas as tarefas
4. Tarefas selecionadas são marcadas com indicador visual
5. Ações aplicam-se a todas as tarefas selecionadas

### Marcar como Concluída
Ao pressionar `Enter` em uma tarefa (ou múltiplas selecionadas):
- Tarefa é movida automaticamente para "CONCLUÍDAS"
- Texto recebe tachado (~~texto~~)
- Data de conclusão é adicionada automaticamente
- Pode ser reaberta pressionando `Enter` novamente na seção de concluídas

### Sincronização Automática
- O app monitora o arquivo com `chokidar`
- Alterações externas são detectadas e recarregadas automaticamente
- Notificação visual quando o arquivo é atualizado
- Você pode editar o arquivo manualmente e as mudanças aparecem na interface

## 📦 Tecnologias

- **Node.js** - Runtime
- **TypeScript** - Linguagem
- **Ink** - React para terminal
- **Rollup** - Bundler
- **Chokidar** - File watcher

## ❓ Perguntas Frequentes

### Onde são armazenadas as tarefas?

Por padrão em `~/.config/todo-tui/TODO.md`, mas você pode usar qualquer arquivo Markdown especificando o caminho: `todo ~/meu-arquivo.md`.

### Posso editar o arquivo manualmente?

Sim! O arquivo é Markdown puro. O app sincroniza automaticamente qualquer alteração externa. Você pode usar seu editor preferido.

### Posso usar múltiplas instâncias?

Sim, mas evite editar o mesmo arquivo em múltiplas instâncias simultaneamente para prevenir conflitos. Cada instância pode usar um arquivo diferente.

### Funciona em Windows/Mac/Linux?

Sim! É multiplataforma. Requer Node.js 18+.

### Como faço backup das tarefas?

É apenas um arquivo Markdown! Use git, Dropbox, ou qualquer sistema de backup. Recomendamos versionamento com git.

### Posso sincronizar tarefas entre computadores?

Sim! Armazene seu `TODO.md` em uma pasta sincronizada (Dropbox, Google Drive, repositório Git, etc.) e aponte o app para esse arquivo.

## 🤝 Contribuindo

Contribuições são bem-vindas! Veja como você pode ajudar:

1. Faça um fork do repositório
2. Crie uma branch de feature (`git checkout -b feature/funcionalidade-incrivel`)
3. Commit suas mudanças (`git commit -m 'Adiciona funcionalidade incrível'`)
4. Push para a branch (`git push origin feature/funcionalidade-incrivel`)
5. Abra um Pull Request

Por favor, leia [CONTRIBUTING.md](CONTRIBUTING.md) para detalhes sobre nosso código de conduta e processo de submissão de pull requests.

### Setup de Desenvolvimento

```bash
git clone https://github.com/felipechierice/todo-tui.git
cd todo-tui
pnpm install
pnpm dev
```

## 📄 Licença

MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

**Autor:** Felipe Chierice (felipe.chierice@hotmail.com)

**Versão em Inglês:** [README.md](README.md)
