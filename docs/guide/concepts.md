# Core Concepts

## Overview

PromptX is built around several core concepts that work together to create flexible and powerful prompt building capabilities. Understanding these concepts will help you build better prompts.

## 1. Prompt Builder (`P()`)

The main entry point for creating prompts with system, user, and assistant messages.

```typescript
import { P, PromptNode } from '@promptsx/core'

const builder = P()

const systemNode = new PromptNode('system')
systemNode.content('System instructions')

const userNode = new PromptNode('user')
userNode.content('User request')

const assistantNode = new PromptNode('assistant')
assistantNode.content('Assistant response')

builder.nodes.push(systemNode)
builder.nodes.push(userNode)
builder.nodes.push(assistantNode)
```

**Output:**
```typescript
PromptBuilder {
  nodes: [
    PromptNode { _role: 'system', ... },
    PromptNode { _role: 'user', ... },
    PromptNode { _role: 'assistant', ... }
  ]
}
```

## 2. Prompt Nodes

Each role (system, user, assistant) is a `PromptNode` with methods for content management.

```typescript
const systemNode = new PromptNode('system')
systemNode
  .setRole('name', 'description')
  .content('Main content')
  .important('Important requirements')
  .critical('Critical requirements')
  .example('Examples')
  .var('key', 'value')
```

**Output:**
```typescript
PromptNode {
  _role: 'system',
  _roleDefinition: { name: 'name', description: 'description' },
  _content: ['Main content'],
  _important: ['Important requirements'],
  _critical: ['Critical requirements'],
  _examples: ['Examples'],
  _vars: { key: 'value' }
}
```

## 3. Variable Substitution

Use `{{variable}}` syntax for dynamic content:

```typescript
const systemNode = new PromptNode('system')
systemNode
  .content('Hello {{name}}!')
  .var('name', 'World')
  .content('Welcome to {{platform}}')
  .var('platform', 'PromptX')

const result = systemNode.build()
```

**Output:**
```typescript
`Hello World!
Welcome to PromptX

<important_requirements>

</important_requirements>
<critical_requirements>

</critical_requirements>
<examples>

</examples>`
```

## 4. Conditional Logic

Use `when()` for IF/THEN/ELSE statements:

```typescript
const systemNode = new PromptNode('system')
systemNode
  .when('isProduction', 'Use production config', 'Use development config')
  .when('hasAuth', 'Require authentication', 'Allow anonymous access')

const result = systemNode.build()
```

**Output:**
```typescript
`IF isProduction THEN:
Use production config
ELSE:
Use development config
END IF

IF hasAuth THEN:
Require authentication
ELSE:
Allow anonymous access
END IF

<important_requirements>

</important_requirements>
<critical_requirements>

</critical_requirements>
<examples>

</examples>`
```

## 5. Branching Logic

Use `branch()` for SWITCH/CASE statements:

```typescript
const systemNode = new PromptNode('system')
systemNode
  .branch('userType')
  .case('admin', 'Full access with audit logging')
  .case('user', 'Limited access with restrictions')
  .case('guest', 'Read-only access only')
  .default('No access - request permissions')

const result = systemNode.build()
```

**Output:**
```typescript
`<branching_logic>
You must follow the following branching logic:
SWITCH userType
CASE "admin":
Full access with audit logging
CASE "user":
Limited access with restrictions
CASE "guest":
Read-only access only
DEFAULT:
No access - request permissions
END SWITCH
</branching_logic>`
```

## 6. Content Blocks

Structured content with semantic blocks:

```typescript
const systemNode = new PromptNode('system')
systemNode
  .important(['Requirement 1', 'Requirement 2', 'Requirement 3'])
  .critical(['Critical requirement 1', 'Critical requirement 2'])
  .examples(['Example 1', 'Example 2', 'Example 3'])

const result = systemNode.build()
```

**Output:**
```typescript
`<important_requirements>
 - Requirement 1
 - Requirement 2
 - Requirement 3
</important_requirements>
<critical_requirements>
 - Critical requirement 1
 - Critical requirement 2
</critical_requirements>
<examples>
 - Example 1
 - Example 2
 - Example 3
</examples>`
```

## 7. Direct Utility Functions

You can also use utility functions directly to generate specific prompt components:

```typescript
import { block, branches, criticals, examples, importants, when } from '@promptsx/core'

// Generate conditional logic
const condition = when('isProduction', 'Use production config', 'Use development config')

// Create custom blocks
const customBlock = block('instructions', 'Follow these steps carefully')

// Format requirements
const requirements = importants(['Always validate input', 'Handle errors gracefully'])
const criticalReqs = criticals(['Never expose sensitive data'])

// Create examples section
const exampleSection = examples(['Example 1: Basic usage', 'Example 2: Advanced usage'])

// Generate branching logic
const branchLogic = branches('userType', [
  { match: 'admin', text: 'Full access granted' },
  { match: 'user', text: 'Limited access granted' }
], 'Access denied')

console.log(condition)
console.log(customBlock)
console.log(requirements)
```

**Output:**
```typescript
// condition
`IF isProduction THEN:
Use production config
ELSE:
Use development config
END IF`

// customBlock
`<instructions>
Follow these steps carefully
</instructions>`

// requirements
`<important_requirements>
 - Always validate input
 - Handle errors gracefully
</important_requirements>`

// criticalReqs
`<critical_requirements>
 - Never expose sensitive data
</critical_requirements>`

// exampleSection
`<examples>
 - Example 1: Basic usage
 - Example 2: Advanced usage
</examples>`

// branchLogic
`<branching_logic>
You must follow the following branching logic:
SWITCH userType
CASE "admin":
Full access granted
CASE "user":
Limited access granted
DEFAULT:
Access denied
END SWITCH
</branching_logic>`
```
