# Installation & Usage

## Installation

PromptX is available on npm and can be installed using your preferred package manager:

```bash
# Using pnpm (recommended)
pnpm add @promptsx/core

# Using npm
npm install @promptsx/core

# Using yarn
yarn add @promptsx/core
```

> **💡 Zero Dependencies**: PromptX has no external runtime dependencies, ensuring your bundle stays lean and your deployments remain fast.

## Basic Usage

### Import and Create

```typescript
import { P } from '@promptsx/core'

// Create a new prompt builder
const prompt = P()
```

**Output:**
```typescript
PromptBuilder {
  system: PromptNode { _role: 'system', ... },
  user: PromptNode { _role: 'user', ... },
  assistant: PromptNode { _role: 'assistant', ... }
}
```

### Building System Messages

```typescript
const prompt = P()

prompt.system
  .role('assistant', 'A helpful AI assistant')
  .content('You help users with their questions')
  .important('Always be polite and helpful')
  .critical('Never provide harmful information')

const systemMessage = prompt.system.build()
```

**Output:**
```typescript
`You are assistant: A helpful AI assistant
You help users with their questions

<important_requirements>
 - Always be polite and helpful
</important_requirements>
<critical_requirements>
Never provide harmful information
</critical_requirements>`
```

### Building User Messages

```typescript
prompt.user
  .content('Help me with {{topic}}')
  .var('topic', 'JavaScript programming')
  .example('// I need help with async/await')

const userMessage = prompt.user.build()
```

**Output:**
```typescript
`Help me with JavaScript programming

// I need help with async/await`
```

### Building Complete Prompts

```typescript
const completePrompt = prompt.build()
```

**Output:**
```typescript
[
  {
    role: 'system',
    content: `You are assistant: A helpful AI assistant
You help users with their questions

<important_requirements>
 - Always be polite and helpful
</important_requirements>
<critical_requirements>
Never provide harmful information
</critical_requirements>
  },
  {
    role: 'user',
    content: `Help me with JavaScript programming

// I need help with async/await`
  }
]
```

## Using with AI APIs

### OpenAI API

```typescript
import OpenAI from 'openai'
import { P } from '@promptsx/core'

const openai = new OpenAI()
const prompt = P()

prompt.system
  .role('code-reviewer', 'An experienced code reviewer')
  .content('Review the following code for best practices')
  .important(['Check for security issues', 'Verify code quality'])

prompt.user
  .content('Review this code:\n```typescript\n{{code}}\n```')
  .var('code', 'function processData(data: any) { return data.process() }')

const messages = prompt.build()

const completion = await openai.chat.completions.create({
  model: 'gpt-4',
  messages
})
```

**Output:**
```typescript
// messages array ready for OpenAI API
[
  {
    role: 'system',
    content: `You are code-reviewer: An experienced code reviewer
Review the following code for best practices

<important_requirements>
 - Check for security issues
 - Verify code quality
</important_requirements>`
  },
  {
    role: 'user',
    content: `Review this code:
\`\`\`typescript
function processData(data: any) { return data.process() }
\`\`\``
  }
]
```

### Anthropic Claude API

```typescript
import Anthropic from '@anthropic-ai/sdk'
import { P } from '@promptsx/core'

const anthropic = new Anthropic()
const prompt = P()

prompt.system
  .role('writing-assistant', 'A professional writing assistant')
  .content('Help improve the following text')
  .important(['Maintain the original tone', 'Improve clarity'])

prompt.user
  .content('Improve this text: {{text}}')
  .var('text', 'The quick brown fox jumps over the lazy dog.')

const systemPrompt = prompt.system.build()
const userPrompt = prompt.user.build()

const message = await anthropic.messages.create({
  model: 'claude-3-sonnet-20240229',
  max_tokens: 1000,
  messages: [
    { role: 'user', content: `${systemPrompt}\n\n${userPrompt}` }
  ]
})
```

**Output:**
```typescript
// systemPrompt
`You are writing-assistant: A professional writing assistant
Help improve the following text

<important_requirements>
 - Maintain the original tone
 - Improve clarity
</important_requirements>`

// userPrompt
`Improve this text: The quick brown fox jumps over the lazy dog.`
```

## Development Mode

For development, you can use the watch mode:

```bash
# Start development server
pnpm dev

# Run tests in watch mode
pnpm test:watch

# Type checking
pnpm typecheck
```

## Next Steps

- [Core Concepts](/guide/concepts) - Learn about the fundamental building blocks
- [API Reference](/guide/api) - Explore the complete API documentation
- [Examples](/guide/examples) - See more practical use cases
