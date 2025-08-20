# Getting Started

## Introduction

PromptX is a flexible and extensible Prompt DSL for building AI prompts with templates, variables, chaining, and intelligent expansion. It provides a clean, chain-based API that makes prompt building straightforward and maintainable.

## Key Features

- **🔧 Prompt Builder**: Chain-based API for building complex prompts
- **📝 Template System**: Structured templates with semantic blocks
- **🔄 Variable Substitution**: Dynamic content with `{{variable}}` syntax
- **🌳 Branching Logic**: Conditional content with `SWITCH` statements
- **⚡ Conditional Logic**: `IF/THEN/ELSE` statements for dynamic prompts
- **🛠️ Tool Integration**: Built-in support for function calling and tool requirements
- **🚀 Zero Dependencies**: Pure TypeScript with no external runtime dependencies

## Quick Start

### Basic Usage

```typescript
import { P } from '@promptsx/core'

const prompt = P()
  .system
  .role('code-assistant', 'A helpful coding assistant')
  .content('You are an expert developer')
  .important('Always provide working code examples')
  .build()

console.log(prompt)
```

**Output:**
```typescript
[
  {
    role: 'system',
    content: `You are code-assistant: A helpful coding assistant
You are an expert developer

<important_requirements>
 - Always provide working code examples
</important_requirements>
  }
]
```

### Advanced Example

```typescript
import { P } from '@promptsx/core'

const prompt = P()

prompt.system
  .role('senior-developer', 'A senior software developer with 10+ years of experience')
  .content('You specialize in {{language}} and {{framework}}')
  .var('language', 'TypeScript')
  .var('framework', 'React')
  .when('isProduction', 'Use production-grade logging', 'Use development debugging')
  .branch('projectType')
  .case('frontend', 'Focus on user experience')
  .case('backend', 'Focus on API design')
  .case('fullstack', 'Balance both considerations')
  .default('Apply general principles')

prompt.user
  .content('Create a {{componentName}} component')
  .var('componentName', 'UserProfile')
  .important('Follow accessibility guidelines')
  .example('// Example usage:\n<UserProfile />')

const result = prompt.build()
```

**Output:**
```typescript
[
  {
    role: 'system',
    content: `You are senior-developer: A senior software developer with 10+ years of experience
You specialize in TypeScript and React

IF isProduction THEN:
Use production-grade logging
ELSE:
Use development debugging
END IF

<branching_logic>
You must follow the following branching logic:
SWITCH userType
CASE "admin":
Full access granted
CASE "user":
Limited access granted
DEFAULT:
Access denied
END SWITCH
</branching_logic>
  },
  {
    role: 'user',
    content: `Create a UserProfile component

<important_requirements>
 - Follow accessibility guidelines
</important_requirements>
<examples>
// Example usage:
<UserProfile />
</examples>
  }
]
```

## Next Steps

- [Installation & Usage](/guide/install) - Learn how to install and use PromptX
- [Core Concepts](/guide/concepts) - Understand the fundamental concepts
- [API Reference](/guide/api) - Explore the complete API
- [Examples](/guide/examples) - See more practical examples
- [Best Practices](/guide/best-practices) - Learn best practices for building prompts
