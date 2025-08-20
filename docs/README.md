# PromptX Documentation

This directory contains the PromptX documentation built with [VitePress](https://vitepress.dev/).

## 🚀 Quick Start

```bash
# Start development server
pnpm docs:dev

# Build for production
pnpm docs:build

# Preview production build
pnpm docs:preview
```

## 📁 Structure

```
docs/
├── .vitepress/           # VitePress configuration
├── guide/                # User guides
│   ├── index.md          # Getting started
│   ├── install.md        # Installation & usage
│   ├── concepts.md       # Core concepts
│   ├── api.md            # API reference
│   ├── examples.md       # Examples
│   └── best-practices.md # Best practices
└── index.md              # Homepage
```

## 🔧 Development

The documentation is automatically built and served when you run:

```bash
pnpm docs:dev
```

This will start a local development server, typically at `http://localhost:5173`.

## 📝 Writing Documentation

- Use Markdown with VitePress extensions
- Include code examples with TypeScript syntax highlighting
- Add output examples for all code snippets
- Follow the established structure and formatting
- Test all code examples to ensure they work correctly

## 🌐 Deployment

The documentation can be deployed to any static hosting service:

```bash
pnpm docs:build
```

This creates a `dist` directory with the built documentation that can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

## 📚 Documentation Features

- **Responsive Design**: Works on all devices
- **Dark/Light Mode**: Automatic theme switching
- **Search**: Full-text search across all pages
- **Navigation**: Easy navigation between sections
- **Code Highlighting**: Syntax highlighting for TypeScript
- **TypeScript Support**: Built-in TypeScript support with VitePress
