# Examples

## Overview

This page provides practical examples of PromptX usage, from basic to advanced scenarios. Each example includes the complete code and expected output.

## Basic Examples

### Simple System Message

```typescript
import { P, PromptNode } from '@promptsx/core'

const systemNode = new PromptNode('system')

systemNode
  .setRole('assistant', 'A helpful AI assistant')
  .content('You help users with their questions')

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
    content: `You are assistant: A helpful AI assistant
You help users with their questions`
  }
]
```

### User Message with Variables

```typescript
const userNode = new PromptNode('user')

userNode
  .content('Help me with {{topic}}')
  .var('topic', 'JavaScript programming')
  .example('// I need help with async/await')

const prompt = P()
  .node(userNode)
  .build()

console.log(prompt)
```

**Output:**
```typescript
[
  {
    role: 'user',
    content: `Help me with JavaScript programming

// I need help with async/await`
  }
]
```

## Intermediate Examples

### Conditional Logic

```typescript
const systemNode = new PromptNode('system')

systemNode
  .setRole('code-reviewer', 'An experienced code reviewer')
  .content('Review the following code')
  .when('isProduction', 'Focus on security and performance', 'Focus on learning and best practices')
  .when('isLegacy', 'Suggest modernization approaches', 'Suggest optimization techniques')
  .important('Always provide actionable feedback')

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
    content: `You are code-reviewer: An experienced code reviewer
Review the following code

IF isProduction THEN:
Focus on security and performance
ELSE:
Focus on learning and best practices
END IF

IF isLegacy THEN:
Suggest modernization approaches
ELSE:
Suggest optimization techniques
END IF

<important_requirements>
 - Always provide actionable feedback
</important_requirements>`
  }
]
```

### Branching Logic

```typescript
const systemNode = new PromptNode('system')

systemNode
  .setRole('project-manager', 'A project management expert')
  .content('Help manage {{projectType}} project')
  .var('projectType', 'software development')
  .branch('projectPhase')
  .case('planning', 'Focus on requirements and scope')
  .case('development', 'Focus on code quality and testing')
  .case('testing', 'Focus on bug fixes and validation')
  .case('deployment', 'Focus on rollout and monitoring')
  .default('Provide general guidance')
  .important(['Track progress', 'Manage risks'])

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
    content: `You are project-manager: A project management expert
Help manage software development project

<branching_logic>
You must follow the following branching logic:
SWITCH userRole
CASE "admin":
Full system access
CASE "moderator":
Content moderation access
CASE "user":
Basic user access
DEFAULT:
No access - request permissions
END SWITCH
</branching_logic>

<important_requirements>
 - Track progress
 - Manage risks
</important_requirements>`
  }
]
```

## Advanced Examples

### Tool Integration

```typescript
import { ToolBuilder } from '@promptsx/core'

const tools = new ToolBuilder()
  .function('search_repository', 'Search code repository', {
    query: 'string',
    file_type: 'string',
    max_results: 'number'
  })
  .function('analyze_code', 'Analyze code quality', {
    code: 'string',
    language: 'string',
    metrics: 'string[]'
  })
  .requirement([
    'ALWAYS follow the tool call schema exactly as specified and make sure to provide all necessary parameters.',
    'Always validate input parameters before calling tools'
  ])

const systemNode = new PromptNode('system')

systemNode
  .setRole('code-analyzer', 'A code analysis assistant')
  .content('You have access to advanced code analysis tools')
  .tool(tools)
  .when('isComplex', 'Use detailed analysis tools', 'Use basic analysis tools')
  .important(['Use tools appropriately', 'Provide clear explanations'])
  .critical('Never expose sensitive information')

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
    content: `You are code-analyzer: A code analysis assistant
You have access to advanced code analysis tools

IF isComplex THEN:
Use detailed analysis tools
ELSE:
Use basic analysis tools
END IF

<tool_calling>
 - ALWAYS follow the tool call schema exactly as specified and make sure to provide all necessary parameters.
 - Always validate input parameters before calling tools
</tool_calling>
<functions>
  <function>
    <name>search_repository</name>
    <description>Search code repository</description>
    <parameters>{"query":"string","file_type":"string","max_results":"number"}</parameters>
  </function>
  <function>
    <name>analyze_code</name>
    <description>Analyze code quality</description>
    <parameters>{"code":"string","language":"string","metrics":"string[]"}</parameters>
  </function>
</functions>

<important_requirements>
 - Use tools appropriately
 - Provide clear explanations
</important_requirements>
<critical_requirements>
Never expose sensitive information
</critical_requirements>
  }
]
```

### Complex Multi-Node Prompt

```typescript
// System message with all features
const systemNode = new PromptNode('system')
systemNode
  .setRole('ai-expert', 'An AI expert with deep knowledge')
  .content('You help with {{domain}} problems')
  .var('domain', 'machine learning')
  .when('isAdvanced', 'Use advanced concepts and techniques', 'Use fundamental concepts')
  .branch('problemType')
  .case('classification', 'Focus on classification algorithms and metrics')
  .case('regression', 'Focus on regression models and evaluation')
  .case('clustering', 'Focus on clustering methods and validation')
  .case('nlp', 'Focus on natural language processing techniques')
  .default('Provide general machine learning guidance')
  .important([
    'Explain concepts clearly',
    'Provide practical examples',
    'Consider ethical implications'
  ])
  .critical('Never provide incorrect or harmful information')
  .example('// Example: Implementing a simple classifier')

// User message with context
const userNode = new PromptNode('user')
userNode
  .content('I need help with {{specificProblem}}')
  .var('specificProblem', 'implementing a neural network')
  .important('I am a beginner in this field')
  .example('// I want to build a simple neural network for image classification')

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
    content: `You are ai-expert: An AI expert with deep knowledge
You help with machine learning problems

IF isAdvanced THEN:
Use advanced concepts and techniques
ELSE:
Use fundamental concepts
END IF

<branching_logic>
SWITCH problemType
CASE "classification":
Focus on classification algorithms and metrics
CASE "regression":
Focus on regression models and evaluation
CASE "clustering":
Focus on clustering methods and validation
CASE "nlp":
Focus on natural language processing techniques
DEFAULT:
Provide general machine learning guidance
END SWITCH
</branching_logic>

<important_requirements>
 - Explain concepts clearly
 - Provide practical examples
 - Consider ethical implications
</important_requirements>
<critical_requirements>
Never provide incorrect or harmful information
</critical_requirements>
<examples>
// Example: Implementing a simple classifier
</examples>`
  },
  {
    role: 'user',
    content: `I need help with implementing a neural network

// I want to build a simple neural network for image classification`
  }
]
```

## Real-World Use Cases

### Code Review Assistant

```typescript
const systemNode = new PromptNode('system')
systemNode
  .setRole('code-reviewer', 'An experienced code reviewer')
  .content('Review the following {{language}} code for:')
  .var('language', 'TypeScript')
  .important([
    'Code quality and best practices',
    'Security vulnerabilities',
    'Performance issues',
    'Maintainability and readability'
  ])
  .critical('Always provide specific examples and suggestions')
  .when('isProduction', 'Focus on security and performance', 'Focus on learning and best practices')

const userNode = new PromptNode('user')
userNode
  .content('Review this code:\n```typescript\n{{code}}\n```')
  .var('code', 'function processData(data: any) { return data.process() }')
  .example('// I need feedback on this function')

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
    content: `You are code-reviewer: An experienced code reviewer
Review the following TypeScript code for:

IF isProduction THEN:
Focus on production security measures
ELSE:
Focus on development security practices
END IF

<important_requirements>
 - Code quality and best practices
 - Security vulnerabilities
 - Performance issues
 - Maintainability and readability
</important_requirements>
<critical_requirements>
Always provide specific examples and suggestions
</critical_requirements>`
  },
  {
    role: 'user',
    content: `Review this code:
\`\`\`typescript
function processData(data: any) { return data.process() }
\`\`\`

// I need feedback on this function`
  }
]
```

### Content Management System

```typescript
const systemNode = new PromptNode('system')
systemNode
  .setRole('content-manager', 'A content management specialist')
  .content('You help manage and organize content for {{platform}}')
  .var('platform', 'web application')
  .when('hasSEO', 'Optimize for search engines', 'Focus on user engagement')
  .branch('contentType')
  .case('blog', 'Use engaging headlines and storytelling')
  .case('documentation', 'Focus on clarity and structure')
  .case('marketing', 'Emphasize benefits and calls-to-action')
  .default('Adapt to the specific content purpose')
  .important([
    'Maintain consistent voice and tone',
    'Ensure accessibility compliance',
    'Follow platform-specific guidelines'
  ])
  .critical('Never publish content without proper review')

const userNode = new PromptNode('user')
userNode
  .content('Help me create {{contentType}} content about {{topic}}')
  .var('contentType', 'blog post')
  .var('topic', 'AI development')
  .example('// I need engaging content that explains AI concepts simply')

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
    content: `You are content-manager: A content management specialist
You help manage and organize content for web application

IF hasSEO THEN:
Optimize for search engines
ELSE:
Focus on user engagement
END IF

<branching_logic>
You must follow the following branching logic:
SWITCH contentType
CASE "blog":
Use engaging headlines and storytelling
CASE "documentation":
Focus on clarity and structure
CASE "marketing":
Emphasize benefits and calls-to-action
DEFAULT:
Adapt to the specific content purpose
END SWITCH
</branching_logic>

<important_requirements>
 - Maintain consistent voice and tone
 - Ensure accessibility compliance
 - Follow platform-specific guidelines
</important_requirements>
<critical_requirements>
Never publish content without proper review
</critical_requirements>`
  },
  {
    role: 'user',
    content: `Help me create blog post content about AI development

// I need engaging content that explains AI concepts simply`
  }
]
```

## Next Steps

- [Best Practices](/guide/best-practices) - Learn how to use these examples effectively
- [API Reference](/guide/api) - Explore the complete API documentation
- [Core Concepts](/guide/concepts) - Understand the fundamental building blocks
