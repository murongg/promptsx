# PromptX

> A flexible and extensible Prompt DSL for building AI prompts with templates, variables, chaining, and intelligent expansion.

[![Test Coverage](https://img.shields.io/badge/test%20coverage-100%25-brightgreen)](https://github.com/murongg/promptx)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Package Manager](https://img.shields.io/badge/package%20manager-pnpm-orange.svg)](https://pnpm.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

## 📚 Documentation

**📖 [Full Documentation](https://promptsx.vercel.app/)** - Complete guides, API reference, and examples

## 🚀 Features

- **🔧 Prompt Builder**: Chain-based API for building complex prompts
- **📝 Template System**: Structured templates with semantic blocks
- **🔄 Variable Substitution**: Dynamic content with `{{variable}}` syntax
- **🌳 Branching Logic**: Conditional content with `SWITCH` statements
- **⚡ Conditional Logic**: `IF/THEN/ELSE` statements for dynamic prompts
- **🛠️ Tool Integration**: Built-in support for function calling and tool requirements
- **📚 Content Organization**: Hierarchical content with important, critical, and example sections
- **🎯 Role Management**: System, user, and assistant role definitions
- **🔨 Direct Utility Functions**: Use `when()`, `block()`, `importants()` etc. directly for custom prompts
- **🔄 Flexible Architecture**: Combine builder pattern with direct functions for maximum control
- **⚙️ TypeScript Support**: Full type safety and IntelliSense
- **🧪 100% Test Coverage**: Comprehensive testing suite
- **🚀 Zero Dependencies**: Pure TypeScript with no external runtime dependencies
- **📦 Ultra Lightweight**: Minimal bundle size for optimal performance

## 📦 Installation

```bash
# Using pnpm (recommended)
pnpm add @promptsx/core

# Using npm
npm install @promptsx/core

# Using yarn
yarn add @promptsx/core
```

> **💡 Zero Dependencies**: PromptX has no external runtime dependencies, ensuring your bundle stays lean and your deployments remain fast.

## 🎯 Quick Start

```typescript
import { P, PromptNode } from '@promptsx/core'

const builder = P()
const systemNode = new PromptNode('system')

systemNode
  .setRole('code-assistant', 'A helpful coding assistant')
  .content('You are an expert developer')
  .important('Always provide working code examples')

builder.nodes.push(systemNode)
const prompt = builder.build()

console.log(prompt)
```

## 📖 Learn More

- **🚀 [Getting Started](https://promptx.dev/guide/)** - Quick start guide and core concepts
- **📚 [API Reference](https://promptx.dev/guide/api)** - Complete API documentation
- **💡 [Examples](https://promptx.dev/guide/examples)** - Practical examples and use cases
- **✅ [Best Practices](https://promptx.dev/guide/best-practices)** - Guidelines for effective usage

## 🏗️ Project Structure

```
promptx/
├── src/                      # Source code (Zero Dependencies)
│   ├── builder.ts            # Main prompt builder
│   ├── node.ts               # Prompt node implementation
│   ├── branch.ts             # Branching logic
│   ├── common.ts             # Utility functions
│   ├── tool.ts               # Tool integration
│   ├── index.ts              # Main exports
│   └── *.test.ts             # Test files
├── docs/                     # Documentation (VitePress)
├── dist/                     # Built files
├── build.config.ts           # Build configuration
├── vitest.config.ts          # Test configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # No runtime dependencies
```

> **💡 Architecture**: Pure TypeScript code with zero external runtime dependencies, ensuring maximum compatibility and minimal bundle size.

## 🔧 Development

### Prerequisites

- Node.js 18+
- pnpm 8+

### Setup

```bash
# Clone repository
git clone https://github.com/murongg/promptx.git
cd promptx

# Install dependencies
pnpm install

# Build packages
pnpm build

# Run tests
pnpm test

# Start documentation
pnpm docs:dev
```

### Scripts

| Script | Description |
|--------|-------------|
| `pnpm build` | Build all packages |
| `pnpm dev` | Development mode with watch |
| `pnpm test` | Run tests |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | TypeScript type checking |
| `pnpm docs:dev` | Start documentation server |
| `pnpm docs:build` | Build documentation |

## 🚀 Performance & Size

PromptX is designed for maximum efficiency and minimal footprint:

- **🚀 Zero Dependencies**: Pure TypeScript with no external runtime dependencies
- **📦 Ultra Lightweight**: Minimal bundle size (< 5KB gzipped)
- **⚡ High Performance**: Optimized string operations and memory management
- **🔄 Scalable**: Handles large amounts of content efficiently
- **💾 Memory Efficient**: No unnecessary object creation or memory leaks
- **🌐 Tree-shakable**: Only import what you need, reduce bundle size further

## 🔒 Type Safety

Full TypeScript support with comprehensive type definitions:

```typescript
// All methods are fully typed
const prompt: PromptBuilder = P()
const node: PromptNode = prompt.system
const branch: BranchBuilder = node.branch('type')

// Type-safe variable access
node.var('name', 'value') // ✅
node.var(123, 'value') // ❌ Type error
```

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/murongg/promptx/issues)
- **Author**: MuRong <hi@mrong.me>
- **Documentation**: [https://promptx.dev](https://promptx.dev)

## 🙏 Acknowledgments

- Built with modern TypeScript and ES modules
- **Zero external runtime dependencies** for maximum compatibility
- Comprehensive testing with Vitest
- ESLint configuration by Anthony Fu
- Built with Unbuild for optimal bundling
- Designed for minimal bundle size and maximum performance

---

Built with ❤️ by [MuRong](https://github.com/murongg)
