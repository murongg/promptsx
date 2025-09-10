---
layout: home

hero:
  name: "PromptX"
  text: "A flexible and extensible Prompt DSL"
  tagline: Build AI prompts with templates, variables, chaining, and intelligent expansion
  actions:
    - theme: brand
      text: Get Started
      link: /guide/
    - theme: alt
      text: View on GitHub
      link: https://github.com/murongg/promptx

features:
  - icon: 🚀
    title: Zero Dependencies
    details: Pure TypeScript with no external runtime dependencies, ensuring maximum compatibility and minimal bundle size
  - icon: 🔧
    title: Flexible Builder
    details: Chain-based API for building complex prompts with ease
  - icon: 📝
    title: Template System
    details: Structured templates with semantic blocks and conditional logic
  - icon: 🔄
    title: Variable Substitution
    details: Dynamic content with {{variable}} syntax and branching logic
  - icon: 🛠️
    title: Tool Integration
    details: Built-in support for function calling and tool requirements
  - icon: ⚡
    title: High Performance
    details: Ultra lightweight (< 5KB gzipped) with optimized operations
---

## Quick Start

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

## Why PromptX?

- **🎯 Simple & Intuitive**: Easy-to-use API that makes prompt building straightforward
- **🚀 Production Ready**: 100% test coverage with comprehensive error handling
- **🔒 Type Safe**: Full TypeScript support with comprehensive type definitions
- **📦 Lightweight**: Minimal bundle size for optimal performance
- **🔄 Flexible**: Combine builder pattern with direct functions for maximum control
