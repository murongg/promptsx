import { describe, expect, it } from 'vitest'
import { P } from './builder'
import { ToolBuilder } from './tool'

describe('core Module Integration Tests', () => {
  describe('complete Prompt Building Workflow', () => {
    it('should build a complete developer prompt with all features', () => {
      const builder = P()

      // System role definition
      builder.system
        .role('senior-developer', 'A senior software developer with 10+ years of experience')
        .content([
          'You are an expert software developer specializing in modern web technologies.',
          'Your primary goal is to write clean, maintainable, and efficient code.',
        ])
        .important([
          'Always follow best practices and design patterns',
          'Write comprehensive tests for your code',
          'Consider performance and security implications',
        ])
        .critical([
          'Never expose sensitive information in code',
          'Always validate user inputs',
          'Handle errors gracefully',
        ])
        .example([
          '// Good: Proper error handling\nfunction divide(a: number, b: number): number {\n  if (b === 0) throw new Error("Division by zero");\n  return a / b;\n}',
          '// Good: Input validation\nfunction processUser(user: any): boolean {\n  if (!user || typeof user.name !== "string") return false;\n  return user.name.length > 0;\n}',
        ])
        .var('language', 'TypeScript')
        .var('framework', 'React')
        .content('Use {{language}} and {{framework}} for development')
        .when('isProduction', 'Use production-grade logging and monitoring', 'Use development debugging tools')
        .branch('projectType')
        .case('frontend', 'Focus on user experience and responsive design')
        .case('backend', 'Focus on API design and data security')
        .case('fullstack', 'Balance frontend and backend considerations')
        .default('Apply general software development principles')

      // User request
      builder.user
        .content('Create a reusable component for user authentication')
        .var('componentName', 'AuthForm')
        .var('authType', 'login')
        .important('The component should be accessible and follow WCAG guidelines')
        .example('// Example usage:\n<AuthForm type="login" onSubmit={handleLogin} />')

      // Assistant response template
      builder.assistant
        .role('code-assistant', 'A helpful coding assistant that provides complete solutions')
        .content('I\'ll create a comprehensive authentication component for you.')
        .important([
          'Provide complete, working code',
          'Include proper TypeScript types',
          'Add comprehensive comments',
          'Include usage examples',
        ])
        .critical('Ensure the code is production-ready and follows security best practices')

      const result = builder.build()

      // Verify system message
      expect(result[0].role).toBe('system')
      expect(result[0].content).toContain('senior software developer with 10+ years of experience')
      expect(result[0].content).toContain('modern web technologies')
      expect(result[0].content).toContain('TypeScript')
      expect(result[0].content).toContain('React')
      expect(result[0].content).toContain('IF isProduction THEN:')
      expect(result[0].content).toContain('SWITCH projectType')
      expect(result[0].content).toContain('frontend')
      expect(result[0].content).toContain('backend')
      expect(result[0].content).toContain('fullstack')

      // // Verify user message
      expect(result[1].role).toBe('user')
      expect(result[1].content).toContain('reusable component')
      expect(result[1].content).toContain('user authentication')
      expect(result[1].content).toContain('AuthForm')
      expect(result[1].content).toContain('login')
      expect(result[1].content).toContain('WCAG guidelines')

      // // Verify assistant message
      expect(result[2].role).toBe('assistant')
      expect(result[2].content).toContain('code-assistant')
      expect(result[2].content).toContain('comprehensive authentication component')
      expect(result[2].content).toContain('production-ready')
      expect(result[2].content).toContain('security best practices')
    })
  })

  describe('tool Integration with Prompts', () => {
    it('should integrate tool requirements with prompt building', () => {
      const toolBuilder = new ToolBuilder()
      toolBuilder
        .function('search_code', 'Search for code examples', {
          query: 'string',
          language: 'string',
          limit: 'number',
        })
        .function('analyze_code', 'Analyze code quality', {
          code: 'string',
          language: 'string',
        })
        .requirement('ALWAYS follow the tool call schema exactly as specified and make sure to provide all necessary parameters.')
        .requirement('The conversation may reference tools that are no longer available. NEVER call tools that are not explicitly provided.')

      const promptBuilder = P()
      promptBuilder.system
        .role('code-analyzer', 'A code analysis assistant')
        .content('You can use the following tools to help analyze code:')
        .content(toolBuilder.build())
        .important('Always use the provided tools when appropriate')

      const result = promptBuilder.build()

      expect(result[0].content).toContain('<functions>')
      expect(result[0].content).toContain('<name>search_code</name>')
      expect(result[0].content).toContain('<name>analyze_code</name>')
      expect(result[0].content).toContain('<tool_calling>')
      expect(result[0].content).toContain('ALWAYS follow the tool call schema exactly as specified and make sure to provide all necessary parameters.')
      expect(result[0].content).toContain('The conversation may reference tools that are no longer available. NEVER call tools that are not explicitly provided.')
    })
  })

  describe('complex Branching Scenarios', () => {
    it('should handle nested branching logic', () => {
      const builder = P()

      builder.system
        .role('multi-role-assistant', 'An assistant that adapts to different contexts')
        .branch('userRole')
        .case('developer', 'Provide technical solutions with code examples')
        .case('designer', 'Focus on user experience and visual design')
        .case('manager', 'Provide high-level overviews and business context')
        .default('Provide general assistance')
        .branch('projectPhase')
        .case('planning', 'Focus on requirements and architecture')
        .case('development', 'Focus on implementation details')
        .case('testing', 'Focus on quality assurance and testing strategies')
        .case('deployment', 'Focus on deployment and maintenance')
        .default('Provide phase-appropriate guidance')

      const result = builder.build()

      expect(result[0].content).toContain('SWITCH userRole')
      expect(result[0].content).toContain('SWITCH projectPhase')
      expect(result[0].content).toContain('developer')
      expect(result[0].content).toContain('designer')
      expect(result[0].content).toContain('manager')
      expect(result[0].content).toContain('planning')
      expect(result[0].content).toContain('development')
      expect(result[0].content).toContain('testing')
      expect(result[0].content).toContain('deployment')
    })
  })

  describe('variable Substitution in Complex Scenarios', () => {
    it('should handle complex variable substitution patterns', () => {
      const builder = P()

      builder.system
        .var('company', 'TechCorp')
        .var('project', 'E-commerce Platform')
        .var('techStack', 'React,Node.js,PostgreSQL')
        .var('environment', 'production')
        .content([
          'You are working on {{project}} for {{company}}.',
          'The technology stack includes: {{techStack}}.',
          'Current environment: {{environment}}.',
        ])
        .when('environment === "production"', 'Use production-grade security measures', 'Use development debugging features')

      const result = builder.build()

      expect(result[0].content).toContain('E-commerce Platform')
      expect(result[0].content).toContain('TechCorp')
      expect(result[0].content).toContain('React,Node.js,PostgreSQL')
      expect(result[0].content).toContain('production')
      expect(result[0].content).toContain('IF environment === "production" THEN:')
      expect(result[0].content).toContain('production-grade security measures')
    })
  })

  describe('content Organization and Structure', () => {
    it('should maintain proper content organization', () => {
      const builder = P()

      builder.system
        .role('content-organizer', 'An assistant that organizes information clearly')
        .content('Main content section')
        .important('Important information')
        .critical('Critical warnings')
        .example('Example content')

      const result = builder.build()

      // Check that sections are properly ordered
      const content = result[0].content
      const contentIndex = content.indexOf('Main content section')
      const importantIndex = content.indexOf('<important_requirements>')
      const criticalIndex = content.indexOf('<critical_requirements>')
      const examplesIndex = content.indexOf('<examples>')

      expect(contentIndex).toBeLessThan(importantIndex)
      expect(importantIndex).toBeLessThan(criticalIndex)
      expect(criticalIndex).toBeLessThan(examplesIndex)
    })
  })

  describe('error Handling and Edge Cases', () => {
    it('should handle empty content gracefully', () => {
      const builder = P()

      // Don't add any content
      const result = builder.build()

      expect(result).toHaveLength(3)
      expect(result[0].content).not.toContain('<important_requirements>')
      expect(result[1].content).not.toContain('<important_requirements>')
      expect(result[2].content).not.toContain('<important_requirements>')
    })

    it('should handle special characters in content', () => {
      const builder = P()

      builder.system
        .content('Content with special chars: <>&"\'')
        .var('specialVar', 'Value with <>&"\'')
        .content('Variable: {{specialVar}}')

      const result = builder.build()

      expect(result[0].content).toContain('Content with special chars: <>&"\'')
      expect(result[0].content).toContain('Value with <>&"\'')
    })
  })

  describe('performance and Scalability', () => {
    it('should handle large amounts of content efficiently', () => {
      const builder = P()

      // Add many content items
      builder.system.content(`Content item {{largeArray}}`)

      builder.system.var('largeArray', 'item0,item1,item2,item3,item4,item5,item6,item7,item8,item9')

      const startTime = performance.now()
      const result = builder.build()
      const endTime = performance.now()

      expect(result[0].content).toContain('Content item item0,item1,item2,item3,item4,item5,item6,item7,item8,item9')

      // Performance should be reasonable (less than 100ms for this amount of content)
      expect(endTime - startTime).toBeLessThan(100)
    })
  })
})
