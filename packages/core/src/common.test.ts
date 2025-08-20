import type { ToolFunction } from './tool'
import { describe, expect, it } from 'vitest'
import { block, branches, criticals, examples, importants, tools, when } from './common'

describe('common Utility Functions', () => {
  describe('block()', () => {
    it('should create single-line block', () => {
      const result = block('testBlock', 'test content', true)
      expect(result).toBe('<testBlock>test content</testBlock>')
    })

    it('should create multi-line block', () => {
      const result = block('testBlock', 'test content', false)
      expect(result).toBe('<testBlock>\ntest content\n</testBlock>')
    })

    it('should convert camelCase to snake_case', () => {
      const result = block('testBlockName', 'content')
      expect(result).toBe('<testBlockName>\ncontent\n</testBlockName>')
    })

    it('should handle multiple uppercase letters', () => {
      const result = block('HTMLContent', 'content')
      expect(result).toBe('<HTMLContent>\ncontent\n</HTMLContent>')
    })
  })

  describe('when()', () => {
    it('should create conditional with only true case', () => {
      const result = when('isActive', 'User is active')
      expect(result).toBe('IF isActive THEN:\nUser is active\nEND IF')
    })

    it('should create conditional with both true and false cases', () => {
      const result = when('isActive', 'User is active', 'User is inactive')
      expect(result).toBe('IF isActive THEN:\nUser is active\nELSE:\nUser is inactive\nEND IF')
    })
  })

  describe('importants()', () => {
    it('should format important requirements', () => {
      const result = importants(['Requirement 1', 'Requirement 2'])
      expect(result).toBe('<important_requirements>\nRequirement 1\n - Requirement 2\n</important_requirements>')
    })

    it('should handle single requirement', () => {
      const result = importants(['Single requirement'])
      expect(result).toBe('<important_requirements>\nSingle requirement\n</important_requirements>')
    })

    it('should handle empty array', () => {
      const result = importants([])
      expect(result).toBe('')
    })
  })

  describe('criticals()', () => {
    it('should format critical requirements', () => {
      const result = criticals(['Critical 1', 'Critical 2'])
      expect(result).toBe('<critical_requirements>\nCritical 1\n - Critical 2\n</critical_requirements>')
    })

    it('should handle single critical requirement', () => {
      const result = criticals(['Single critical'])
      expect(result).toBe('<critical_requirements>\nSingle critical\n</critical_requirements>')
    })
  })

  describe('examples()', () => {
    it('should format examples', () => {
      const result = examples(['Example 1', 'Example 2'])
      expect(result).toBe('<examples>\nExample 1\n - Example 2\n</examples>')
    })

    it('should handle single example', () => {
      const result = examples(['Single example'])
      expect(result).toBe('<examples>\nSingle example\n</examples>')
    })
  })

  describe('branches()', () => {
    it('should create switch statement with cases', () => {
      const cases = [
        { match: 'active', text: 'User is active' },
        { match: 'inactive', text: 'User is inactive' },
      ]
      const result = branches('status', cases)

      expect(result).toContain('<branching_logic>')
      expect(result).toContain('SWITCH status')
      expect(result).toContain('CASE "active":')
      expect(result).toContain('User is active')
      expect(result).toContain('CASE "inactive":')
      expect(result).toContain('User is inactive')
      expect(result).toContain('END SWITCH')
      expect(result).toContain('</branching_logic>')
    })

    it('should create switch statement with default case', () => {
      const cases = [
        { match: 'active', text: 'User is active' },
      ]
      const result = branches('status', cases, 'User status unknown')

      expect(result).toContain('CASE "active":')
      expect(result).toContain('User is active')
      expect(result).toContain('DEFAULT:')
      expect(result).toContain('User status unknown')
    })

    it('should handle empty cases array', () => {
      const result = branches('status', [])
      expect(result).toContain('SWITCH status')
      expect(result).toContain('END SWITCH')
    })
  })

  describe('tools()', () => {
    it('should format tools without requirements', () => {
      const toolFunctions: ToolFunction[] = [
        {
          name: 'testTool',
          description: 'A test tool',
          parameters: { param1: 'string' },
        },
      ]

      const result = tools(toolFunctions)

      expect(result).toContain('<function>')
      expect(result).toContain('<name>testTool</name>')
      expect(result).toContain('<description>A test tool</description>')
      expect(result).toContain('<parameters>{"param1":"string"}</parameters>')
      expect(result).toContain('</function>')
      expect(result).not.toContain('<tool_calling>')
    })

    it('should format tools with requirements', () => {
      const toolFunctions: ToolFunction[] = [
        {
          name: 'testTool',
          description: 'A test tool',
          parameters: { param1: 'string' },
        },
      ]

      const requirements = ['Requirement 1', 'Requirement 2']
      const result = tools(toolFunctions, requirements)

      expect(result).toContain('<tool_calling>')
      expect(result).toContain('Requirement 1')
      expect(result).toContain('Requirement 2')
      expect(result).toContain('</tool_calling>')
      expect(result).toContain('<function>')
      expect(result).toContain('<name>testTool</name>')
    })

    it('should handle multiple tools', () => {
      const toolFunctions: ToolFunction[] = [
        {
          name: 'tool1',
          description: 'First tool',
          parameters: { param1: 'string' },
        },
        {
          name: 'tool2',
          description: 'Second tool',
          parameters: { param2: 'number' },
        },
      ]

      const result = tools(toolFunctions)

      expect(result).toContain('<name>tool1</name>')
      expect(result).toContain('<name>tool2</name>')
      expect(result).toContain('<description>First tool</description>')
      expect(result).toContain('<description>Second tool</description>')
    })

    it('should handle empty tools array', () => {
      const result = tools([])
      expect(result).toBe('')
    })

    it('should handle undefined requirements', () => {
      const toolFunctions: ToolFunction[] = [
        {
          name: 'testTool',
          description: 'A test tool',
          parameters: {},
        },
      ]

      const result = tools(toolFunctions, undefined)
      expect(result).not.toContain('<tool_calling>')
    })
  })
})
