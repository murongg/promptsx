import { beforeEach, describe, expect, it } from 'vitest'
import { P, PromptBuilder } from './builder'
import { PromptNode } from './node'

describe('promptBuilder', () => {
  let builder: PromptBuilder

  beforeEach(() => {
    builder = new PromptBuilder()
  })

  describe('constructor', () => {
    it('should initialize with empty PromptNode instances', () => {
      expect(builder.system).toBeInstanceOf(PromptNode)
      expect(builder.user).toBeInstanceOf(PromptNode)
      expect(builder.assistant).toBeInstanceOf(PromptNode)
    })

    it('should create separate PromptNode instances', () => {
      expect(builder.system).not.toBe(builder.user)
      expect(builder.system).not.toBe(builder.assistant)
      expect(builder.user).not.toBe(builder.assistant)
    })
  })

  describe('build()', () => {
    it('should build empty chat messages', () => {
      const result = builder.build()

      expect(result).toHaveLength(3)
      expect(result[0].role).toBe('system')
      expect(result[1].role).toBe('user')
      expect(result[2].role).toBe('assistant')

      // Empty nodes should not have structure tags when no content
      expect(result[0].content).not.toContain('<important_requirements>')
      expect(result[1].content).not.toContain('<important_requirements>')
      expect(result[2].content).not.toContain('<important_requirements>')
    })

    it('should build chat messages with content', () => {
      builder.system.content('System message')
      builder.user.content('User message')
      builder.assistant.content('Assistant message')

      const result = builder.build()

      expect(result[0].content).toContain('System message')
      expect(result[1].content).toContain('User message')
      expect(result[2].content).toContain('Assistant message')
    })

    it('should maintain correct role order', () => {
      const result = builder.build()

      expect(result[0].role).toBe('system')
      expect(result[1].role).toBe('user')
      expect(result[2].role).toBe('assistant')
    })

    it('should handle complex node content', () => {
      builder.system
        .role('developer', 'A software developer')
        .content('Write clean code')
        .var('language', 'TypeScript')
        .content('Use {{language}}')

      const result = builder.build()

      expect(result[0].content).toContain('developer')
      expect(result[0].content).toContain('Write clean code')
      expect(result[0].content).toContain('Use TypeScript')
    })
  })

  describe('promptNode integration', () => {
    it('should allow chaining on PromptNode instances', () => {
      builder.system
        .role('developer', 'A developer')
        .content('Write code')
        .important('Follow best practices')

      const result = builder.build()

      expect(result[0].content).toContain('developer')
      expect(result[0].content).toContain('Write code')
      expect(result[0].content).toContain('Follow best practices')
    })

    it('should handle conditional content in nodes', () => {
      builder.system
        .when('isProduction', 'Use production settings', 'Use development settings')

      const result = builder.build()

      expect(result[0].content).toContain('IF isProduction THEN:')
      expect(result[0].content).toContain('Use production settings')
      expect(result[0].content).toContain('ELSE:')
      expect(result[0].content).toContain('Use development settings')
      expect(result[0].content).toContain('END IF')
    })

    it('should handle branching logic in nodes', () => {
      builder.system
        .branch('framework')
        .case('react', 'Use React best practices')
        .case('vue', 'Use Vue best practices')
        .default('Use general best practices')

      const result = builder.build()

      expect(result[0].content).toContain('SWITCH framework')
      expect(result[0].content).toContain('CASE "react":')
      expect(result[0].content).toContain('Use React best practices')
      expect(result[0].content).toContain('CASE "vue":')
      expect(result[0].content).toContain('Use Vue best practices')
      expect(result[0].content).toContain('DEFAULT:')
      expect(result[0].content).toContain('Use general best practices')
      expect(result[0].content).toContain('END SWITCH')
    })
  })

  describe('p() function', () => {
    it('should return a new PromptBuilder instance', () => {
      const builder1 = P()
      const builder2 = P()

      expect(builder1).toBeInstanceOf(PromptBuilder)
      expect(builder2).toBeInstanceOf(PromptBuilder)
    })

    it('should create independent instances', () => {
      const builder1 = P()
      const builder2 = P()

      builder1.system.content('Builder 1')
      builder2.system.content('Builder 2')

      const result1 = builder1.build()
      const result2 = builder2.build()

      expect(result1[0].content).toContain('Builder 1')
      expect(result2[0].content).toContain('Builder 2')
    })
  })

  describe('integration tests', () => {
    it('should build complete prompt with all features', () => {
      builder.system
        .role('developer', 'A software developer')
        .content('Write clean, maintainable code')
        .var('language', 'TypeScript')
        .content('Use {{language}}')
        .when('isProduction', 'Use production settings', 'Use development settings')
        .branch('framework')
        .case('react', 'Use React best practices')
        .case('vue', 'Use Vue best practices')
        .default('Use general best practices')
        .important('Follow coding standards')
        .critical('Ensure security')
        .example('function example() { return true; }')

      const result = builder.build()

      // System message checks
      expect(result[0].content).toContain('developer')
      expect(result[0].content).toContain('Write clean, maintainable code')
      expect(result[0].content).toContain('Use TypeScript')
      expect(result[0].content).toContain('IF isProduction THEN:')
      expect(result[0].content).toContain('SWITCH framework')
      expect(result[0].content).toContain('Follow coding standards')
      expect(result[0].content).toContain('Ensure security')
      expect(result[0].content).toContain('function example() { return true; }')

      // User message checks - should not have structure tags when no content
      expect(result[1].content).not.toContain('<important_requirements>')

      // Assistant message checks - should not have structure tags when no content
      expect(result[2].content).not.toContain('<important_requirements>')
    })
  })
})
