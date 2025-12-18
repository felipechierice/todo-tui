# 📋 TODO TUI

A beautiful and intuitive terminal application (TUI) for managing tasks in Markdown files.

[![npm version](https://img.shields.io/npm/v/todo-tui.svg?style=flat)](https://www.npmjs.com/package/todo-tui)
[![GitHub](https://img.shields.io/github/license/felipechierice/todo-tui)](https://github.com/felipechierice/todo-tui/blob/master/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/felipechierice/todo-tui)](https://github.com/felipechierice/todo-tui/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/felipechierice/todo-tui)](https://github.com/felipechierice/todo-tui/issues)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)

## 🌟 Why TODO TUI?

Manage your tasks directly from your terminal with a beautiful, keyboard-driven interface. Perfect for developers who live in the terminal and want to keep their workflow uninterrupted. Your tasks are stored in a simple Markdown file that you can edit manually or with the app.

**Born from necessity:** This app was created by someone with ADHD who needed a simple, highly visual way to manage daily tasks. The interface is intentionally designed to reduce cognitive load and maintain focus, with features like the 3-task limit in the "DOING" section to prevent overwhelm.

**Key Benefits:**
- 🚀 Lightning-fast keyboard navigation (vim-like)
- 📝 Human-readable Markdown storage
- 🔄 Live sync with external file changes
- 🎨 Beautiful, distraction-free interface
- 💪 Powerful batch operations
- 🧠 ADHD-friendly design (max 3 tasks in "DOING" to prevent overwhelm)
- 🎯 "Today's focus" field to set daily priorities
- ✨ Clear visual hierarchy and color-coded sections

## 📸 Screenshots

<!-- Add screenshots here when available -->
_Coming soon: Add a GIF or screenshot of the app in action_

## 📑 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Usage](#-usage)
- [Shortcuts](#-shortcuts)
- [Markdown File Structure](#-markdown-file-structure)
- [Development](#-development)
- [Detailed Features](#-detailed-features)
- [Technologies](#-technologies)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- 🎨 Colorful and organized terminal interface
- 📝 Uses Markdown file as database (manually editable)
- 🔄 Automatically syncs with external file changes
- ⌨️ Keyboard navigation (vim-like: h/j/k/l)
- 🏷️ Support for tags, deadlines, and time estimates
- 🚀 Priority markers (⚡ important, 🚀 quick)
- 📦 Multiple task selection for batch operations
- 🔝 Task reordering with Ctrl+arrows or K/J
- 🎯 Editable "Today's Focus" field
- 🔥 Limit of 3 tasks in "DOING" section
- 📱 Responsive interface that adapts to terminal size
- 💾 Automatic save on all operations

## 🚀 Installation

### From Source (Recommended for now)

```bash
# Clone the repository
git clone https://github.com/felipechierice/todo-tui.git
cd todo-tui

# Install dependencies
pnpm install
# or: npm install

# Build
pnpm build
# or: npm run build

# Link globally
npm link
```

After that, you can use the `todo` command from anywhere:

```bash
# Use default file
todo

# Specify custom file
todo ~/my-todo.md
```

### NPM Installation (Coming Soon)

Once published to npm:

```bash
# Global installation
npm install -g todo-tui

# Or with pnpm
pnpm add -g todo-tui
```

### Development

```bash
# Navigate to directory
cd todo-tui

# Install dependencies
pnpm install

# Run in development mode
pnpm dev
```

## 📖 Usage

```bash
# Use default file (~/.config/todo-tui/TODO.md)
todo

# Specify custom file
todo ~/my-todo.md
```

**Default file:** `~/.config/todo-tui/TODO.md`

On first run, the app automatically creates:
- The `~/.config/todo-tui/` directory
- The `TODO.md` file with an initial template

## ⌨️ Shortcuts

### Navigation

| Key | Action |
|-----|--------|
| `↑` / `k` | Previous task |
| `↓` / `j` | Next task |
| `←` / `h` | Previous section |
| `→` / `l` / `Tab` | Next section |

### Basic Actions

| Key | Action |
|-----|--------|
| `Enter` | Toggle selected task(s) |
| `a` | Add new task |
| `e` | Edit current task |
| `d` (2x) | Delete task(s) (press twice) |
| `m` | Move task to another section |
| `f` | Edit today's focus |

### Multiple Selection

| Key | Action |
|-----|--------|
| `Space` | Select/Deselect current task |
| `s` | Select/Deselect all tasks in section |
| `S` | Select/Deselect all tasks |

**Tip:** Select multiple tasks and use `Enter`, `d`, `m` or numbers for batch actions!

### Reordering

| Key | Action |
|-----|--------|
| `K` / `Ctrl+↑` | Move task(s) up |
| `J` / `Ctrl+↓` | Move task(s) down |

**Note:** Moving at the beginning/end of a section moves to the previous/next section.

### Quick Move Shortcuts

| Key | Move to |
|-----|---------|
| `1` | 🔥 DOING |
| `2` | 📌 NEXT |
| `3` | ⏳ WAITING |
| `4` | 🚧 BLOCKED |
| `5` | 💡 IDEAS |
| `0` | ✅ DONE |

### General

| Key | Action |
|-----|--------|
| `r` | Reload file |
| `?` | Show full help |
| `q` | Quit |
| `Esc` | Cancel/Go back |

## 📁 Markdown File Structure

The app expects a Markdown file with specific sections:

```markdown
# 📋 TASKS

> **Today's focus:** _Your priorities for the day_

## 🔥 DOING (max. 3)
- [ ] Task in progress `#tag` `~30min` ⚡

## 📌 NEXT
- [ ] Next task `#work` `📅 20/12`
- [ ] Quick task 🚀

## ⏳ WAITING
- [ ] Waiting for approval → _John/code review_

## 🚧 BLOCKED
- [ ] Blocked task → _External dependency_

## 💡 IDEAS / SOMEDAY
- Future idea
- [ ] Another idea with checkbox

## ✅ DONE
- [x] ~~Completed task~~ ✓ 15/12
```

### Task Format

- **Tags:** `#tag` (can be multiple)
- **Deadline:** `📅 DD/MM` (due date)
- **Duration:** `~30min`, `~2h` (estimated time)
- **Markers:**
  - ⚡ = High priority/important
  - 🚀 = Quick task
- **Waiting/Blocked:** `→ _reason or person_`
- **Completion:** `✓ DD/MM` (automatically added when marked as done)

## 🛠️ Development

```bash
# Install dependencies
pnpm install

# Run in dev mode (with hot reload)
pnpm dev

# Build for production
pnpm build

# Run build
pnpm start
```

## 🎨 Detailed Features

### Add Task (key `a`)
Interactive wizard that prompts for:
1. Task text
2. Tags (separated by comma or space)
3. Deadline (format DD/MM)
4. Estimated duration (e.g., 30min, 2h)
5. Priority marker (None, ⚡ Important, 🚀 Quick)

### Edit Task (key `e`)
Allows editing all fields of an existing task using the same wizard.

### Move Tasks
- **Manual:** Key `m` opens section selection menu
- **Quick:** Keys `1-5` and `0` move directly
- **Reorder:** `K`/`J` or `Ctrl+↑`/`Ctrl+↓` to reorganize within or between sections

### Multiple Selection
1. Use `Space` to select individual tasks
2. Use `s` to select/deselect entire section
3. Use `S` to select/deselect all tasks
4. Selected tasks are marked with visual indicator
5. Actions apply to all selected tasks

### Mark as Done
When pressing `Enter` on a task (or multiple selected tasks):
- Task is automatically moved to "DONE"
- Text gets strikethrough (~~text~~)
- Completion date is automatically added
- Can be reopened by pressing `Enter` again in the done section

### Automatic Sync
- The app monitors the file with `chokidar`
- External changes are detected and automatically reloaded
- Visual notification when file is updated
- You can manually edit the file and changes appear in the interface

## 📦 Technologies

- **Node.js** - Runtime
- **TypeScript** - Language
- **Ink** - React for terminal
- **Rollup** - Bundler
- **Chokidar** - File watcher

## ❓ FAQ

### Where are my tasks stored?

By default, tasks are stored in `~/.config/todo-tui/TODO.md`. You can specify a custom file path when running the app.

### Can I edit the file manually?

Yes! The file is just a Markdown file. You can edit it with any text editor, and the app will automatically detect and reload changes.

### What happens if I have the file open in two places?

The app monitors the file for changes. If you edit it externally, the app will reload automatically. However, if you're running multiple instances of the app, the last save will win.

### Does it work on Windows/Mac/Linux?

Yes! The app is built with Node.js and works on all platforms.

### How do I backup my tasks?

Simply copy the `TODO.md` file. You can also use git to version control your tasks file.

### Can I sync tasks between computers?

Yes! Store your `TODO.md` in a synced folder (Dropbox, Google Drive, Git repository, etc.) and point the app to that file.

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### Development Setup

```bash
git clone https://github.com/felipechierice/todo-tui.git
cd todo-tui
pnpm install
pnpm dev
```

## 🐛 Bug Reports

Found a bug? Please [open an issue](https://github.com/felipechierice/todo-tui/issues) with:
- A clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Your environment (OS, Node version)

## 💡 Feature Requests

Have an idea? [Open an issue](https://github.com/felipechierice/todo-tui/issues) and describe:
- The problem you're trying to solve
- Your proposed solution
- Any alternatives you've considered

## 📄 License

MIT © [Felipe Chierice](https://github.com/felipechierice) (felipe.chierice@hotmail.com)

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/felipechierice">Felipe Chierice</a>
  <br>
  <em>Born from the need for a simple, ADHD-friendly task manager</em>
  <br><br>
  <strong>Versão em Português:</strong> <a href="README_pt.md">README_pt.md</a>
</div>
  <br>
  <sub>If you find this project useful, please consider giving it a ⭐️</sub>
</div>
