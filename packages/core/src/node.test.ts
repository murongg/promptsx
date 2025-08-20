import { beforeEach, describe, expect, it } from 'vitest'
import { BranchBuilder } from './branch'
import { PromptNode } from './node'

describe('promptNode', () => {
  let node: PromptNode

  beforeEach(() => {
    node = new PromptNode('system')
  })

  describe('role()', () => {
    it('should set role and return this for chaining', () => {
      const result = node.role('developer', 'A software developer')
      expect(result).toBe(node)

      const output = node.build()
      expect(output).toContain('A software developer')
    })

    it('should overwrite existing role', () => {
      node.role('developer', 'A software developer')
      node.role('designer', 'A UI designer')

      const output = node.build()
      expect(output).toContain('A UI designer')
    })
  })

  describe('content()', () => {
    it('should add single text content and return this for chaining', () => {
      const result = node.content('Hello world')
      expect(result).toBe(node)

      const output = node.build()
      expect(output).toContain('Hello world')
    })

    it('should add multiple text content and return this for chaining', () => {
      const result = node.content(['Hello', 'world'])
      expect(result).toBe(node)

      const output = node.build()
      expect(output).toContain('Hello')
      expect(output).toContain('world')
    })

    it('should append content to existing content', () => {
      node.content('First line')
      node.content('Second line')

      const output = node.build()
      expect(output).toContain('First line')
      expect(output).toContain('Second line')
    })
  })

  describe('important()', () => {
    it('should add single important text and return this for chaining', () => {
      const result = node.important('Important note')
      expect(result).toBe(node)

      const output = node.build()
      expect(output).toContain('Important note')
    })

    it('should add multiple important texts and return this for chaining', () => {
      const result = node.important(['Note 1', 'Note 2'])
      expect(result).toBe(node)

      const output = node.build()
      expect(output).toContain('Note 1')
      expect(output).toContain('Note 2')
    })
  })

  describe('critical()', () => {
    it('should add single critical text and return this for chaining', () => {
      const result = node.critical('Critical warning')
      expect(result).toBe(node)

      const output = node.build()
      expect(output).toContain('Critical warning')
    })

    it('should add multiple critical texts and return this for chaining', () => {
      const result = node.critical(['Warning 1', 'Warning 2'])
      expect(result).toBe(node)

      const output = node.build()
      expect(output).toContain('Warning 1')
      expect(output).toContain('Warning 2')
    })
  })

  describe('example()', () => {
    it('should add single example and return this for chaining', () => {
      const result = node.example('Example: Hello world')
      expect(result).toBe(node)

      const output = node.build()
      expect(output).toContain('Example: Hello world')
    })

    it('should add multiple examples and return this for chaining', () => {
      const result = node.example(['Example 1', 'Example 2'])
      expect(result).toBe(node)

      const output = node.build()
      expect(output).toContain('Example 1')
      expect(output).toContain('Example 2')
    })
  })

  describe('var()', () => {
    it('should set a single variable and return this for chaining', () => {
      const result = node.var('name', 'John')
      expect(result).toBe(node)

      node.content('Hello {{name}}')
      const output = node.build()
      expect(output).toContain('Hello John')
    })

    it('should overwrite existing variable', () => {
      node.var('name', 'John')
      node.var('name', 'Jane')

      node.content('Hello {{name}}')
      const output = node.build()
      expect(output).toContain('Hello Jane')
    })
  })

  describe('vars()', () => {
    it('should set multiple variables and return this for chaining', () => {
      const result = node.var({ name: 'John', age: 30 })
      expect(result).toBe(node)
    })

    it('should merge with existing variables', () => {
      node.var('name', 'John')
      node.var({ age: 30, city: 'NYC' })

      node.content('Name: {{name}}, Age: {{age}}, City: {{city}}')
      const result = node.build()
      expect(result).toContain('Name: John, Age: 30, City: NYC')
    })

    it('should overwrite existing variables', () => {
      node.var('name', 'John')
      node.var({ name: 'Jane', age: 30 })

      node.content('Name: {{name}}, Age: {{age}}')
      const result = node.build()
      expect(result).toContain('Name: Jane, Age: 30')
    })
  })

  describe('when()', () => {
    it('should add conditional text with only true case and return this for chaining', () => {
      const result = node.when('isLoggedIn', 'User is logged in')
      expect(result).toBe(node)

      const output = node.build()
      expect(output).toContain('IF isLoggedIn THEN:')
      expect(output).toContain('User is logged in')
      expect(output).toContain('END IF')
    })

    it('should add conditional text with both true and false cases and return this for chaining', () => {
      const result = node.when('isLoggedIn', 'User is logged in', 'User is not logged in')
      expect(result).toBe(node)

      const output = node.build()
      expect(output).toContain('IF isLoggedIn THEN:')
      expect(output).toContain('User is logged in')
      expect(output).toContain('ELSE:')
      expect(output).toContain('User is not logged in')
      expect(output).toContain('END IF')
    })
  })

  describe('branch()', () => {
    it('should create new BranchBuilder with string value and return it', () => {
      const result = node.branch('status')
      expect(result).toBeInstanceOf(BranchBuilder)
    })

    it('should accept existing BranchBuilder and return it', () => {
      const existingBranch = new BranchBuilder(node, 'status')
      const result = node.branch(existingBranch)
      expect(result).toBe(existingBranch)
    })

    it('should add multiple branches', () => {
      node.branch('status1')
      node.branch('status2')

      const output = node.build()
      expect(output).toContain('SWITCH status1')
      expect(output).toContain('SWITCH status2')
    })
  })

  describe('build()', () => {
    it('should build empty node with default structure', () => {
      const result = node.build()

      // Empty node should not have structure tags when no content
      expect(result).not.toContain('<important_requirements>')
      expect(result).not.toContain('<critical_requirements>')
      expect(result).not.toContain('<examples>')
    })

    it('should build node with role information', () => {
      node.role('developer', 'A software developer')
      const result = node.build()

      expect(result).toContain('A software developer')
    })

    it('should build node with content', () => {
      node.content('Hello world')
      const result = node.build()

      expect(result).toContain('Hello world')
    })

    it('should build node with multiple content items', () => {
      node.content(['Line 1', 'Line 2'])
      const result = node.build()

      expect(result).toContain('Line 1')
      expect(result).toContain('Line 2')
    })

    it('should build node with important requirements', () => {
      node.important(['Important 1', 'Important 2'])
      const result = node.build()

      expect(result).toContain('Important 1')
      expect(result).toContain('Important 2')
    })

    it('should build node with critical requirements', () => {
      node.critical(['Critical 1', 'Critical 2'])
      const result = node.build()

      expect(result).toContain('Critical 1')
      expect(result).toContain('Critical 2')
    })

    it('should build node with examples', () => {
      node.example(['Example 1', 'Example 2'])
      const result = node.build()

      expect(result).toContain('Example 1')
      expect(result).toContain('Example 2')
    })

    it('should substitute variables in content', () => {
      node.var('name', 'John')
      node.content('Hello {{name}}')
      const result = node.build()

      expect(result).toContain('Hello John')
    })

    it('should leave unmatched variables as-is', () => {
      node.content('Hello {{name}}')
      const result = node.build()

      expect(result).toContain('Hello {{name}}')
    })

    it('should handle conditional text', () => {
      node.when('isLoggedIn', 'User is logged in', 'User is not logged in')
      const result = node.build()

      expect(result).toContain('IF isLoggedIn THEN:')
      expect(result).toContain('User is logged in')
      expect(result).toContain('ELSE:')
      expect(result).toContain('User is not logged in')
      expect(result).toContain('END IF')
    })

    it('should build complete node with all components', () => {
      node
        .role('developer', 'A software developer')
        .content('Write clean code')
        .important('Follow best practices')
        .critical('No bugs allowed')
        .example('function example() {}')
        .var('language', 'TypeScript')
        .content('Use {{language}}')

      const result = node.build()

      expect(result).toContain('A software developer')
      expect(result).toContain('Write clean code')
      expect(result).toContain('Use TypeScript')
      expect(result).toContain('Follow best practices')
      expect(result).toContain('No bugs allowed')
      expect(result).toContain('function example() {}')
    })
  })
})
