import { beforeEach, describe, expect, it } from 'vitest'
import { P, PromptBuilder } from './builder'
import { PromptNode } from './node'

describe('promptBuilder', () => {
  let builder: PromptBuilder

  beforeEach(() => {
    builder = new PromptBuilder()
  })

  describe('constructor', () => {
    it('should initialize with empty nodes array', () => {
      expect(builder.nodes).toEqual([])
    })
  })

  describe('node()', () => {
    it('should add a single node and return builder for chaining', () => {
      const systemNode = new PromptNode('system')
      systemNode.content('Test content')

      const result = builder.node(systemNode)

      expect(result).toBe(builder) // Should return this for chaining
      expect(builder.nodes).toHaveLength(1)
      expect(builder.nodes[0]).toBe(systemNode)
    })

    it('should add multiple nodes in sequence', () => {
      const systemNode = new PromptNode('system')
      const userNode = new PromptNode('user')

      systemNode.content('System message')
      userNode.content('User message')

      builder.node(systemNode).node(userNode)

      expect(builder.nodes).toHaveLength(2)
      expect(builder.nodes[0]).toBe(systemNode)
      expect(builder.nodes[1]).toBe(userNode)
    })

    it('should maintain insertion order when adding nodes', () => {
      const node1 = new PromptNode('assistant')
      const node2 = new PromptNode('system')
      const node3 = new PromptNode('user')

      node1.content('First')
      node2.content('Second')
      node3.content('Third')

      builder.node(node1).node(node2).node(node3)

      const result = builder.build()

      expect(result).toHaveLength(3)
      expect(result[0].role).toBe('assistant')
      expect(result[1].role).toBe('system')
      expect(result[2].role).toBe('user')
    })
  })

  describe('build()', () => {
    it('should build empty chat messages', () => {
      const result = builder.build()

      expect(result).toHaveLength(0)
    })

    it('should build chat messages with content', () => {
      const systemNode = new PromptNode('system')
      const userNode = new PromptNode('user')
      const assistantNode = new PromptNode('assistant')

      systemNode.content('System message')
      userNode.content('User message')
      assistantNode.content('Assistant message')

      builder.nodes.push(systemNode, userNode, assistantNode)

      const result = builder.build()

      expect(result).toHaveLength(3)
      expect(result[0].role).toBe('system')
      expect(result[0].content).toContain('System message')
      expect(result[1].role).toBe('user')
      expect(result[1].content).toContain('User message')
      expect(result[2].role).toBe('assistant')
      expect(result[2].content).toContain('Assistant message')
    })

    it('should maintain node order based on insertion order', () => {
      const systemNode = new PromptNode('system')
      const userNode = new PromptNode('user')
      const assistantNode = new PromptNode('assistant')

      systemNode.content('System')
      userNode.content('User')
      assistantNode.content('Assistant')

      builder.nodes.push(userNode, systemNode, assistantNode)

      const result = builder.build()

      expect(result[0].role).toBe('user')
      expect(result[1].role).toBe('system')
      expect(result[2].role).toBe('assistant')
    })

    it('should handle complex node content', () => {
      const systemNode = new PromptNode('system')
      systemNode
        .setRole('developer', 'A software developer')
        .content('Write clean code')
        .var('language', 'TypeScript')
        .content('Use {{language}}')

      builder.nodes.push(systemNode)

      const result = builder.build()

      expect(result[0].content).toContain('developer')
      expect(result[0].content).toContain('Write clean code')
      expect(result[0].content).toContain('Use TypeScript')
    })
  })

  describe('promptNode integration', () => {
    it('should allow chaining on PromptNode instances', () => {
      const systemNode = new PromptNode('system')
      systemNode
        .setRole('developer', 'A developer')
        .content('Write code')
        .important('Follow best practices')

      builder.nodes.push(systemNode)

      const result = builder.build()

      expect(result[0].content).toContain('developer')
      expect(result[0].content).toContain('Write code')
      expect(result[0].content).toContain('Follow best practices')
    })

    it('should handle conditional content in nodes', () => {
      const systemNode = new PromptNode('system')
      systemNode.when('isProduction', 'Use production settings', 'Use development settings')

      builder.nodes.push(systemNode)

      const result = builder.build()

      expect(result[0].content).toContain('IF isProduction THEN:')
      expect(result[0].content).toContain('Use production settings')
      expect(result[0].content).toContain('ELSE:')
      expect(result[0].content).toContain('Use development settings')
      expect(result[0].content).toContain('END IF')
    })

    it('should handle branching logic in nodes', () => {
      const systemNode = new PromptNode('system')
      systemNode
        .branch('framework')
        .case('react', 'Use React best practices')
        .case('vue', 'Use Vue best practices')
        .default('Use general best practices')

      builder.nodes.push(systemNode)

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

    it('should work with node() method for chaining', () => {
      const systemNode = new PromptNode('system')
      const userNode = new PromptNode('user')

      systemNode.content('System message')
      userNode.content('User message')

      const result = P()
        .node(systemNode)
        .node(userNode)
        .build()

      expect(result).toHaveLength(2)
      expect(result[0].role).toBe('system')
      expect(result[0].content).toContain('System message')
      expect(result[1].role).toBe('user')
      expect(result[1].content).toContain('User message')
    })

    it('should create independent instances', () => {
      const builder1 = P()
      const builder2 = P()

      const node1 = new PromptNode('system')
      const node2 = new PromptNode('system')

      node1.content('Builder 1')
      node2.content('Builder 2')

      builder1.nodes.push(node1)
      builder2.nodes.push(node2)

      const result1 = builder1.build()
      const result2 = builder2.build()

      expect(result1[0].content).toContain('Builder 1')
      expect(result2[0].content).toContain('Builder 2')
    })
  })

  describe('integration tests', () => {
    it('should build complete prompt with all features', () => {
      const systemNode = new PromptNode('system')
      systemNode
        .setRole('developer', 'A software developer')
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

      builder.nodes.push(systemNode)

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

      // Should only have system message, no user or assistant
      expect(result).toHaveLength(1)
    })

    it('should handle multiple nodes of the same type', () => {
      const systemNode1 = new PromptNode('system')
      const systemNode2 = new PromptNode('system')
      const userNode1 = new PromptNode('user')
      const userNode2 = new PromptNode('user')

      systemNode1.content('System message 1')
      systemNode2.content('System message 2')
      userNode1.content('User message 1')
      userNode2.content('User message 2')

      builder.nodes.push(systemNode1, systemNode2, userNode1, userNode2)

      const result = builder.build()

      expect(result).toHaveLength(4)
      expect(result[0].role).toBe('system')
      expect(result[0].content).toContain('System message 1')
      expect(result[1].role).toBe('system')
      expect(result[1].content).toContain('System message 2')
      expect(result[2].role).toBe('user')
      expect(result[2].content).toContain('User message 1')
      expect(result[3].role).toBe('user')
      expect(result[3].content).toContain('User message 2')
    })
  })
})
