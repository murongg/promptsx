# API Reference

## Overview

This page provides comprehensive documentation for all PromptX APIs, including classes, methods, and utility functions.

## Classes

### PromptBuilder

The main class for building prompts with multiple nodes of different roles.

```typescript
class PromptBuilder {
  public nodes: PromptNode[]

  node(node: PromptNode): this
  build(): ChatMessage[]
}
```

**Example:**
```typescript
import { P, PromptNode } from '@promptsx/core'

const systemNode = new PromptNode('system')
const userNode = new PromptNode('user')

systemNode.content('System message')
userNode.content('User message')

const result = P()
  .node(systemNode)
  .node(userNode)
  .build()
```

**Output:**
```typescript
[
  {
    role: 'system',
    content: `System message`
  },
  {
    role: 'user',
    content: `User message`
  }
]
```

### PromptNode

Represents a single message node (system, user, or assistant) with content management capabilities.

```typescript
class PromptNode {
  role(name: string, description: string): this
  content(text: string | string[]): this
  important(text: string | string[]): this
  critical(text: string | string[]): this
  example(text: string | string[]): this
  var(name: string, value: string): this
  var(vars: Record<string, any>): this
  when(condition: string, trueText: string, falseText?: string): this
  branch(valueVar: string): BranchBuilder
  tool(tool: ToolBuilder | ToolFunction, requirements?: string[]): this
  build(): string
}
```

**Example:**
```typescript
const node = new PromptNode('system')
node
  .setRole('assistant', 'A helpful AI')
  .content('Help with {{topic}}')
  .var('topic', 'programming')
  .important('Be clear and concise')
  .critical('Never provide harmful code')

const result = node.build()
```

**Output:**
```typescript
`You are assistant: A helpful AI
Help with programming

<important_requirements>
 - Be clear and concise
</important_requirements>
<critical_requirements>
Never provide harmful code
</critical_requirements>`
```

### BranchBuilder

Handles branching logic with SWITCH/CASE statements.

```typescript
class BranchBuilder {
  case(match: string, text: string): this
  default(text: string): PromptNode
  build(): string
}
```

**Example:**
```typescript
const node = new PromptNode('system')
const branch = node
  .branch('userType')
  .case('admin', 'Full access')
  .case('user', 'Limited access')
  .default('No access')

const result = branch.build()
```

**Output:**
```typescript
`<branching_logic>
SWITCH userType
CASE "admin":
Full access
CASE "user":
Limited access
DEFAULT:
No access
END SWITCH
</branching_logic>`
```

### ToolBuilder

Builds tool definitions for function calling.

```typescript
class ToolBuilder {
  function(name: string, description: string, parameters: Record<string, any>): this
  function(tool: ToolFunction): this
  requirement(requirement: string | string[]): this
  build(): string
}
```

**Example:**
```typescript
import { ToolBuilder } from '@promptsx/core'

const tools = new ToolBuilder()
  .function('search_code', 'Search for code examples', {
    query: 'string',
    language: 'string'
  })
  .requirement('ALWAYS follow the tool call schema exactly as specified and make sure to provide all necessary parameters.')

const result = tools.build()
```

**Output:**
```xml
<tool_calling>
 - ALWAYS follow the tool call schema exactly as specified and make sure to provide all necessary parameters.
</tool_calling>
<functions>
  <function>
    <name>search_code</name>
    <description>Search for code examples</description>
    <parameters>{"query":"string","language":"string"}</parameters>
  </function>
</functions>
```

## Methods Reference

### PromptBuilder Methods

| Method | Description | Returns |
|--------|-------------|---------|
| `node(node)` | Add a PromptNode to the builder | `this` |
| `build()` | Build final prompt messages | `ChatMessage[]` |

### PromptNode Methods

| Method | Description | Returns |
|--------|-------------|---------|
| `role(name, description)` | Set role name and description | `this` |
| `content(text)` | Add content (string or array) | `this` |
| `important(text)` | Add important requirements | `this` |
| `critical(text)` | Add critical requirements | `this` |
| `example(text)` | Add examples | `this` |
| `var(name, value)` | Set variable | `this` |
| `var(object)` | Set multiple variables | `this` |
| `when(condition, trueText, falseText?)` | Add conditional logic | `this` |
| `branch(valueVar)` | Start branching logic | `BranchBuilder` |
| `tool(tool, requirements?)` | Add tool integration | `this` |
| `build()` | Build node content | `string` |

### BranchBuilder Methods

| Method | Description | Returns |
|--------|-------------|---------|
| `case(match, text)` | Add case | `this` |
| `default(text)` | Set default case | `PromptNode` |
| `build()` | Build branch content | `string` |

### ToolBuilder Methods

| Method | Description | Returns |
|--------|-------------|---------|
| `function(name, description, parameters)` | Add function definition | `this` |
| `function(toolFunction)` | Add function object | `this` |
| `requirement(requirement)` | Add requirement | `this` |
| `requirement(requirements)` | Add multiple requirements | `this` |
| `build()` | Build tools string | `string` |

## Utility Functions

Direct utility functions for custom prompt generation:

| Function | Description | Parameters | Returns |
|----------|-------------|------------|---------|
| `when(condition, trueText, falseText?)` | Generate conditional logic | `string, string, string?` | `string` |
| `block(name, content, isSingleLine?)` | Create custom block | `string, string, boolean?` | `string` |
| `importants(requirements)` | Format important requirements | `string[]` | `string` |
| `criticals(requirements)` | Format critical requirements | `string[]` | `string` |
| `examples(examples)` | Format examples section | `string[]` | `string` |
| `branches(valueVar, cases, defaultText?)` | Generate branching logic | `string, object[], string?` | `string` |
| `tools(functions, requirements?)` | Format tools section | `ToolFunction[], string[]?` | `string` |

## Types

### ChatMessage

```typescript
interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}
```

### ToolFunction

```typescript
interface ToolFunction {
  name: string
  description: string
  parameters: Record<string, any>
}
```

## Examples

### Basic Prompt Building

```typescript
import { P, PromptNode } from '@promptsx/core'

const builder = P()
const systemNode = new PromptNode('system')

systemNode
  .setRole('assistant', 'A helpful AI')
  .content('You help with {{topic}}')
  .var('topic', 'programming')
  .important('Be clear and concise')

const prompt = P()
  .node(systemNode)
  .build()

console.log(prompt)
```

**Output:**
```typescript
[
  {
    role: 'system',
    content: `You are assistant: A helpful AI
You help with programming

<important_requirements>
Be clear and concise
</important_requirements>`
  }
]
```
