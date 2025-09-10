# Best Practices

## Overview

This page provides best practices and guidelines for using PromptX effectively. Following these practices will help you create better, more maintainable prompts.

## 1. Variable Naming

Use descriptive variable names that clearly indicate their purpose:

```typescript
// ✅ Good
.var('userExperienceLevel', 'beginner')
.var('targetAudience', 'developers')
.var('projectComplexity', 'high')
.var('securityRequirements', 'strict')

// ❌ Avoid
.var('level', 'beginner')
.var('audience', 'devs')
.var('complexity', 'high')
.var('security', 'strict')
```

**Example with Good Naming:**
```typescript
const builder = P()
const systemNode = new PromptNode('system')

systemNode
  .setRole('code-reviewer', 'An experienced code reviewer')
  .content('Review {{programmingLanguage}} code for {{projectType}} project')
  .var('programmingLanguage', 'TypeScript')
  .var('projectType', 'production')
  .when('isProductionEnvironment', 'Focus on security and performance', 'Focus on learning')

builder.nodes.push(systemNode)
const prompt = builder.build()
```

**Output:**
```typescript
`You are code-reviewer: An experienced code reviewer
Review TypeScript code for production project

IF isProductionEnvironment THEN:
Focus on security and performance
ELSE:
Focus on learning
END IF

<important_requirements>

</important_requirements>
<critical_requirements>

</critical_requirements>
<examples>

</examples>`
```

## 2. Content Organization

Structure your content logically with clear sections:

```typescript
const systemNode = new PromptNode('system')
systemNode
  .setRole('role-name', 'Clear role description')
  .content('Main instructions and context')
  .important('Key requirements that must be followed')
  .critical('Critical constraints or safety requirements')
  .example('Concrete examples to guide behavior')
```

**Example:**
```typescript
const builder = P()
const systemNode = new PromptNode('system')

systemNode
  .setRole('data-analyst', 'A professional data analyst')
  .content('Analyze {{dataType}} data and provide insights')
  .var('dataType', 'user behavior')
  .important([
    'Always validate data before analysis',
    'Provide statistical significance when possible',
    'Include confidence intervals for predictions'
  ])
  .critical([
    'Never expose personally identifiable information',
    'Ensure data privacy compliance',
    'Validate all assumptions'
  ])
  .example('// Example: Time series analysis with seasonal decomposition')

builder.nodes.push(systemNode)
const prompt = builder.build()
```

**Output:**
```typescript
`You are data-analyst: A professional data analyst
Analyze user behavior data and provide insights

<important_requirements>
 - Always validate data before analysis
 - Provide statistical significance when possible
 - Include confidence intervals for predictions
</important_requirements>
<critical_requirements>
 - Never expose personally identifiable information
 - Ensure data privacy compliance
 - Validate all assumptions
</critical_requirements>
<examples>
// Example: Time series analysis with seasonal decomposition
</examples>`
```

## 3. Conditional Logic

Use `when()` for simple conditions and `branch()` for complex scenarios:

```typescript
// ✅ Simple condition
.when('isProduction', 'Use production config', 'Use development config')

// ✅ Complex scenarios
.branch('userType')
  .case('admin', 'Full access with audit logging')
  .case('user', 'Limited access with restrictions')
  .case('guest', 'Read-only access only')
  .default('No access - request permissions')
```

**Example:**
```typescript
const builder = P()
const systemNode = new PromptNode('system')

systemNode
  .setRole('security-advisor', 'A cybersecurity expert')
  .content('Provide security recommendations for {{systemType}}')
  .var('systemType', 'web application')
  .when('isProduction', 'Focus on production security measures', 'Focus on development security practices')
  .branch('threatLevel')
  .case('low', 'Implement basic security measures')
  .case('medium', 'Implement enhanced security with monitoring')
  .case('high', 'Implement comprehensive security with advanced threat detection')
  .default('Implement standard security baseline')
  .important('Always consider the principle of least privilege')

builder.nodes.push(systemNode)
const prompt = builder.build()
```

**Output:**
```typescript
`You are security-advisor: A cybersecurity expert
Provide security recommendations for web application

IF isProduction THEN:
Focus on production security measures
ELSE:
Focus on development security practices
END IF

<branching_logic>
You must follow the following branching logic:
SWITCH threatLevel
CASE "low":
Implement basic security measures
CASE "medium":
Implement enhanced security with monitoring
CASE "high":
Implement comprehensive security with advanced threat detection
DEFAULT:
Implement standard security baseline
END SWITCH
</branching_logic>

<important_requirements>
 - Always consider the principle of least privilege
</important_requirements>
<critical_requirements>

</critical_requirements>
<examples>

</examples>`
```

## 4. Tool Integration

Always provide clear requirements when integrating tools:

```typescript
const tools = new ToolBuilder()
  .function('function_name', 'Clear description', {
    param1: 'string',
    param2: 'number'
  })
  .requirement([
    'ALWAYS follow the tool call schema exactly as specified and make sure to provide all necessary parameters.',
    'Always validate input parameters',
    'Handle errors gracefully',
    'Log all operations for audit'
  ])
```

**Example:**
```typescript
import { ToolBuilder } from '@promptsx/core'

const analysisTools = new ToolBuilder()
  .function('analyze_performance', 'Analyze system performance metrics', {
    metrics: 'string[]',
    time_range: 'string',
    threshold: 'number'
  })
  .function('generate_report', 'Generate performance analysis report', {
    format: 'string',
    include_charts: 'boolean',
    detail_level: 'string'
  })
  .requirement([
    'ALWAYS follow the tool call schema exactly as specified and make sure to provide all necessary parameters.',
    'Validate all input parameters before processing',
    'Handle errors gracefully and provide meaningful error messages',
    'Log all analysis operations for audit purposes',
    'Ensure data privacy and security compliance'
  ])

const builder = P()
const systemNode = new PromptNode('system')

systemNode
  .setRole('performance-analyst', 'A system performance analyst')
  .content('Analyze system performance using available tools')
  .tool(analysisTools)
  .important('Use tools appropriately and provide clear explanations')
  .critical('Never expose sensitive system information')

builder.nodes.push(systemNode)
const prompt = builder.build()
```

**Output:**
```typescript
`You are performance-analyst: A system performance analyst
Analyze system performance using available tools

<tool_calling>
 - ALWAYS follow the tool call schema exactly as specified and make sure to provide all necessary parameters.
 - Validate all input parameters before processing
 - Handle errors gracefully and provide meaningful error messages
 - Log all analysis operations for audit purposes
 - Ensure data privacy and security compliance
</tool_calling>
<functions>
  <function>
    <name>analyze_performance</name>
    <description>Analyze system performance metrics</description>
    <parameters>{"metrics":"string[]","time_range":"string","threshold":"number"}</parameters>
  </function>
  <function>
    <name>generate_report</name>
    <description>Generate performance analysis report</description>
    <parameters>{"format":"string","include_charts":"boolean","detail_level":"string"}</parameters>
  </function>
</functions>

<important_requirements>
 - Use tools appropriately and provide clear explanations
</important_requirements>
<critical_requirements>
Never expose sensitive system information
</critical_requirements>
<examples>

</examples>`
```

## 5. Variable Reuse

Set variables once and reuse them throughout the prompt:

```typescript
const systemNode = new PromptNode('system')
systemNode
  .var('language', 'TypeScript')
  .var('framework', 'React')
  .content('You are a {{language}} expert')
  .important('Follow {{framework}} best practices')
  .example('// {{language}} example with {{framework}}')
  .when('is{{framework}}Project', 'Focus on {{framework}}-specific patterns', 'Use general patterns')
```

**Example:**
```typescript
const builder = P()
const systemNode = new PromptNode('system')

systemNode
  .setRole('frontend-developer', 'A frontend development expert')
  .var('programmingLanguage', 'TypeScript')
  .var('frontendFramework', 'React')
  .var('projectType', 'single-page application')
  .content('You specialize in {{programmingLanguage}} and {{frontendFramework}} development')
  .important([
    'Follow {{frontendFramework}} best practices',
    'Use {{programmingLanguage}} type safety features',
    'Implement responsive design for {{projectType}}'
  ])
  .when('is{{frontendFramework}}Project', 'Focus on {{frontendFramework}}-specific patterns', 'Use general frontend patterns')

builder.nodes.push(systemNode)
const prompt = builder.build()
```

**Output:**
```typescript
`You are frontend-developer: A frontend development expert
You specialize in TypeScript and React development

IF isReactProject THEN:
Focus on React-specific patterns
ELSE:
Use general frontend patterns
END IF

<important_requirements>
 - Follow React best practices
 - Use TypeScript type safety features
 - Implement responsive design for single-page application
</important_requirements>
<critical_requirements>

</critical_requirements>
<examples>

</examples>`
```

## 6. Testing Your Prompts

Always test your prompts to ensure they generate the expected output:

```typescript
const builder = P()
const systemNode = new PromptNode('system')

systemNode
  .content('Test content')
  .var('testVar', 'test value')

builder.nodes.push(systemNode)
const result = builder.build()
console.log(result) // Verify output structure and content
```

**Example:**
```typescript
// Test a complex prompt
const builder = P()
const systemNode = new PromptNode('system')

systemNode
  .setRole('tester', 'A testing expert')
  .content('Test {{feature}} functionality')
  .var('feature', 'user authentication')
  .when('isProduction', 'Use production test data', 'Use mock data')
  .important('Ensure comprehensive coverage')

builder.nodes.push(systemNode)
const prompt = builder.build()

console.log('Prompt structure:', systemNode.build())
console.log('Full prompt:', prompt)
```

**Output:**
```typescript
// Prompt structure
`You are tester: A testing expert
Test user authentication functionality

IF isProduction THEN:
Use production test data
ELSE:
Use mock data
END IF

<important_requirements>
 - Ensure comprehensive coverage
</important_requirements>
<critical_requirements>

</critical_requirements>
<examples>

</examples>`

// Full prompt
  [
    {
      role: 'system',
      content: `You are tester: A testing expert
Test user authentication functionality

IF isProduction THEN:
Use production test data
ELSE:
Use mock data
END IF

<important_requirements>
 - Ensure comprehensive coverage
</important_requirements>
<critical_requirements>

</critical_requirements>
<examples>

</examples>`
    }
  ]
```

## 7. Direct Utility Functions

Use utility functions directly for fine-grained control or custom prompt generation:

```typescript
import { block, branches, importants, when } from '@promptsx/core'

// ✅ Good - Combine utility functions for custom logic
function createSpecializedPrompt(context: string) {
  const condition = when('hasAccess', 'Proceed with operation', 'Request authorization')
  const requirements = importants(['Validate inputs', 'Log actions'])
  const instructions = block('custom_instructions', context)

  return `${instructions}\n${condition}\n${requirements}`
}

// ✅ Good - Use for prompt templates
const templateSection = branches('templateType', [
  { match: 'email', text: 'Use professional email format' },
  { match: 'report', text: 'Use structured report format' }
], 'Use default format')
```

**Example:**
```typescript
import { P, PromptNode, block, branches, importants, when } from '@promptsx/core'

function createAnalysisPrompt(analysisType: string, dataSource: string) {
  const environmentLogic = when('isProduction', 'Use production data sources and apply strict validation', 'Use development data and allow experimental approaches')

  const analysisInstructions = branches('analysisType', [
    { match: 'statistical', text: 'Apply statistical methods and hypothesis testing' },
    { match: 'predictive', text: 'Use machine learning models for forecasting' },
    { match: 'descriptive', text: 'Focus on data summarization and visualization' }
  ], 'Use general analysis techniques')

  const requirements = importants([
    'Validate all data inputs before processing',
    'Document methodology and assumptions',
    'Provide confidence intervals for predictions'
  ])

  const instructions = block('analysis_instructions', `Perform ${analysisType} analysis on ${dataSource} data. Follow the methodology outlined below.`)

  return `${instructions}\n\n${environmentLogic}\n\n${analysisInstructions}\n\n${requirements}`
}

const customPrompt = createAnalysisPrompt('predictive', 'customer_behavior')
console.log(customPrompt)
```

**Output:**
```typescript
`<analysis_instructions>
Perform predictive analysis on customer_behavior data. Follow the methodology outlined below.
</analysis_instructions>

IF isProduction THEN:
Use production data sources and apply strict validation
ELSE:
Use development data and allow experimental approaches
END IF

<branching_logic>
You must follow the following branching logic:
SWITCH analysisType
CASE "statistical":
Apply statistical methods and hypothesis testing
CASE "predictive":
Use machine learning models for forecasting
CASE "descriptive":
Focus on data summarization and visualization
DEFAULT:
Use general analysis techniques
END SWITCH
</branching_logic>

<important_requirements>
 - Validate all data inputs before processing
 - Document methodology and assumptions
 - Provide confidence intervals for predictions
</important_requirements>`
```

## 8. Combining Approaches

Mix builder pattern with direct functions for maximum flexibility:

```typescript
const builder = P()
const systemNode = new PromptNode('system')

systemNode
  .setRole('assistant', 'A helpful assistant')
  .content('Base instructions')
  .content(when('isAdvanced', 'Use advanced techniques', 'Use basic techniques'))
  .content(block('special_notes', 'Important considerations'))

builder.nodes.push(systemNode)
const result = builder.build()
```

**Example:**
```typescript
import { P, PromptNode, block, importants, when } from '@promptsx/core'

const builder = P()
const systemNode = new PromptNode('system')

systemNode
  .setRole('code-assistant', 'A helpful coding assistant')
  .content('Help with {{language}} programming')
  .var('language', 'Python')
  .content(when('isBeginner', 'Use simple examples and explanations', 'Use advanced patterns and best practices'))
  .content(block('learning_objectives', 'Focus on practical application and real-world usage'))
  .important(importants(['Provide working code examples', 'Explain key concepts clearly']))

builder.nodes.push(systemNode)
const prompt = builder.build()

const result = prompt
```

**Output:**
```typescript
`You are code-assistant: A helpful coding assistant
Help with Python programming
IF isBeginner THEN:
Use simple examples and explanations
ELSE:
Use advanced patterns and best practices
END IF
<learning_objectives>
Focus on practical application and real-world usage
</learning_objectives>

<important_requirements>
 - Provide working code examples
 - Explain key concepts clearly
</important_requirements>`
```

## 9. Error Handling

Always consider error cases and edge conditions:

```typescript
const builder = P()
const systemNode = new PromptNode('system')

systemNode
  .setRole('error-handler', 'An error handling expert')
  .content('Handle {{errorType}} errors gracefully')
  .var('errorType', 'network timeout')
  .when('isCritical', 'Implement fallback mechanisms', 'Log and continue')
  .important([
    'Always provide user-friendly error messages',
    'Implement proper error logging',
    'Consider retry mechanisms for transient errors'
  ])
  .critical('Never expose sensitive information in error messages')

builder.nodes.push(systemNode)
const prompt = builder.build()
```

## 10. Performance Considerations

For large prompts, consider breaking them into smaller, reusable components:

```typescript
// Create reusable prompt components
function createRolePrompt(role: string, description: string) {
  const builder = P()
  const systemNode = new PromptNode('system')
  systemNode.setRole(role, description)
  builder.nodes.push(systemNode)
  return builder.build()
}

function createRequirementsPrompt(requirements: string[]) {
  const builder = P()
  const systemNode = new PromptNode('system')
  systemNode.important(requirements)
  builder.nodes.push(systemNode)
  return builder.build()
}

// Combine components
const builder = P()
const systemNode = new PromptNode('system')
systemNode
  .content(createRolePrompt('expert', 'An expert in the field'))
  .content(createRequirementsPrompt(['Requirement 1', 'Requirement 2']))
builder.nodes.push(systemNode)
const mainPrompt = builder.build()
```

## Next Steps

- [Examples](/guide/examples) - See these practices in action
- [API Reference](/guide/api) - Explore the complete API
- [Core Concepts](/guide/concepts) - Understand the fundamentals
