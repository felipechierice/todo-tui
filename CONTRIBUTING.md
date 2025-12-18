# Contributing to TODO TUI

First off, thank you for considering contributing to TODO TUI! 🎉

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** to demonstrate the steps
- **Describe the behavior you observed** and what you expected
- **Include screenshots or GIFs** if possible
- **Include your environment details** (OS, Node version, terminal)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **List any alternatives** you've considered

### Pull Requests

1. Fork the repository
2. Create a new branch from `master`:
   ```bash
   git checkout -b feature/my-new-feature
   ```
3. Make your changes
4. Test your changes thoroughly
5. Commit your changes with a clear commit message:
   ```bash
   git commit -m "Add feature: description of feature"
   ```
6. Push to your fork:
   ```bash
   git push origin feature/my-new-feature
   ```
7. Open a Pull Request

### Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

### Code Style

- Follow the existing TypeScript/React code style
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused
- Use proper TypeScript types

### Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/todo-tui.git
cd todo-tui

# Install dependencies
pnpm install

# Run in development mode
pnpm dev

# Build
pnpm build
```

### Testing Your Changes

Before submitting a pull request:

1. Build the project: `pnpm build`
2. Test the built version: `node dist/index.js`
3. Test with different file paths
4. Test all keyboard shortcuts
5. Test with edge cases (empty files, corrupted data, etc.)

## Project Structure

```
todo-tui/
├── src/
│   ├── components/     # React/Ink UI components
│   ├── utils/          # Utility functions (parser, writer, etc.)
│   ├── App.tsx         # Main application logic
│   ├── index.tsx       # Entry point
│   └── types.ts        # TypeScript type definitions
├── dist/               # Built output (generated)
├── package.json
└── README.md
```

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
