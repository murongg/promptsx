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

    it('should default to multi-line block when isSingleLine is not provided', () => {
      const result = block('testBlock', 'test content')
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

    it('should handle empty content', () => {
      const result = block('emptyBlock', '')
      expect(result).toBe('<emptyBlock>\n\n</emptyBlock>')
    })

    it('should handle content with newlines', () => {
      const result = block('multiLine', 'line1\nline2\nline3')
      expect(result).toBe('<multiLine>\nline1\nline2\nline3\n</multiLine>')
    })

    it('should handle special characters in name', () => {
      const result = block('test-block_123', 'content')
      expect(result).toBe('<test-block_123>\ncontent\n</test-block_123>')
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

    it('should handle empty false text (falsy)', () => {
      const result = when('isActive', 'User is active', '')
      expect(result).toBe('IF isActive THEN:\nUser is active\nEND IF')
    })

    it('should handle undefined false text', () => {
      const result = when('isActive', 'User is active', undefined)
      expect(result).toBe('IF isActive THEN:\nUser is active\nEND IF')
    })

    it('should handle complex variable names', () => {
      const result = when('user.profile.isActive', 'Active user')
      expect(result).toBe('IF user.profile.isActive THEN:\nActive user\nEND IF')
    })

    it('should handle multiline text content', () => {
      const result = when('condition', 'Line 1\nLine 2', 'Alt Line 1\nAlt Line 2')
      expect(result).toBe('IF condition THEN:\nLine 1\nLine 2\nELSE:\nAlt Line 1\nAlt Line 2\nEND IF')
    })
  })

  describe('importants()', () => {
    it('should format important requirements', () => {
      const result = importants(['Requirement 1', 'Requirement 2'])
      expect(result).toBe('<important_requirements>\n - Requirement 1\n - Requirement 2\n</important_requirements>')
    })

    it('should handle single requirement', () => {
      const result = importants(['Single requirement'])
      expect(result).toBe('<important_requirements>\n - Single requirement\n</important_requirements>')
    })

    it('should handle empty array', () => {
      const result = importants([])
      expect(result).toBe('')
    })

    it('should handle null/undefined values', () => {
      // @ts-expect-error - testing runtime behavior
      expect(importants(null)).toBe('')
      // @ts-expect-error - testing runtime behavior
      expect(importants(undefined)).toBe('')
    })

    it('should handle array with empty strings', () => {
      const result = importants(['', 'Valid requirement', ''])
      expect(result).toBe('<important_requirements>\n - \n - Valid requirement\n - \n</important_requirements>')
    })
  })

  describe('criticals()', () => {
    it('should format critical requirements', () => {
      const result = criticals(['Critical 1', 'Critical 2'])
      expect(result).toBe('<critical_requirements>\n - Critical 1\n - Critical 2\n</critical_requirements>')
    })

    it('should handle single critical requirement', () => {
      const result = criticals(['Single critical'])
      expect(result).toBe('<critical_requirements>\n - Single critical\n</critical_requirements>')
    })

    it('should handle empty array', () => {
      const result = criticals([])
      expect(result).toBe('')
    })

    it('should handle null/undefined values', () => {
      // @ts-expect-error - testing runtime behavior
      expect(criticals(null)).toBe('')
      // @ts-expect-error - testing runtime behavior
      expect(criticals(undefined)).toBe('')
    })
  })

  describe('examples()', () => {
    it('should format examples', () => {
      const result = examples(['Example 1', 'Example 2'])
      expect(result).toBe('<examples>\n - Example 1\n - Example 2\n</examples>')
    })

    it('should handle single example', () => {
      const result = examples(['Single example'])
      expect(result).toBe('<examples>\n - Single example\n</examples>')
    })

    it('should handle empty array', () => {
      const result = examples([])
      expect(result).toBe('')
    })

    it('should handle null/undefined values', () => {
      // @ts-expect-error - testing runtime behavior
      expect(examples(null)).toBe('')
      // @ts-expect-error - testing runtime behavior
      expect(examples(undefined)).toBe('')
    })

    it('should handle multiple examples with special characters', () => {
      const result = examples(['Example with "quotes"', 'Example with <tags>', 'Example with \nnewlines'])
      expect(result).toBe('<examples>\n - Example with "quotes"\n - Example with <tags>\n - Example with \nnewlines\n</examples>')
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

    it('should handle empty cases array with default', () => {
      const result = branches('status', [], 'No cases matched')
      expect(result).toContain('SWITCH status')
      expect(result).toContain('DEFAULT:')
      expect(result).toContain('No cases matched')
      expect(result).toContain('END SWITCH')
    })

    it('should handle cases with special characters', () => {
      const cases = [
        { match: 'test-case_1', text: 'Handle special case' },
        { match: 'case with spaces', text: 'Handle spaces' },
        { match: 'case"with"quotes', text: 'Handle quotes' },
      ]
      const result = branches('variable', cases)

      expect(result).toContain('CASE "test-case_1":')
      expect(result).toContain('CASE "case with spaces":')
      expect(result).toContain('CASE "case"with"quotes":')
      expect(result).toContain('Handle special case')
      expect(result).toContain('Handle spaces')
      expect(result).toContain('Handle quotes')
    })

    it('should handle cases with multiline text', () => {
      const cases = [
        { match: 'multiline', text: 'Line 1\nLine 2\nLine 3' },
      ]
      const result = branches('test', cases, 'Default\nLine 2')

      expect(result).toContain('Line 1\nLine 2\nLine 3')
      expect(result).toContain('DEFAULT:\nDefault\nLine 2')
    })

    it('should handle complex variable names', () => {
      const cases = [{ match: 'value', text: 'Matched' }]
      const result = branches('user.settings.theme', cases)

      expect(result).toContain('SWITCH user.settings.theme')
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

    it('should handle empty requirements array', () => {
      const toolFunctions: ToolFunction[] = [
        {
          name: 'testTool',
          description: 'A test tool',
          parameters: {},
        },
      ]

      const result = tools(toolFunctions, [])
      expect(result).not.toContain('<tool_calling>')
    })

    it('should handle complex parameters with nested objects', () => {
      const toolFunctions: ToolFunction[] = [
        {
          name: 'complexTool',
          description: 'A complex tool',
          parameters: {
            nested: {
              prop1: 'string',
              prop2: { subProp: 'number' },
            },
            array: ['item1', 'item2'],
          },
        },
      ]

      const result = tools(toolFunctions)
      expect(result).toContain('<name>complexTool</name>')
      expect(result).toContain('"nested":{"prop1":"string","prop2":{"subProp":"number"}}')
      expect(result).toContain('"array":["item1","item2"]')
    })

    it('should handle tools with special characters in names and descriptions', () => {
      const toolFunctions: ToolFunction[] = [
        {
          name: 'tool-with_special.chars',
          description: 'A tool with "quotes" and <tags> & ampersands',
          parameters: { param: 'value' },
        },
      ]

      const result = tools(toolFunctions)
      expect(result).toContain('<name>tool-with_special.chars</name>')
      expect(result).toContain('<description>A tool with "quotes" and <tags> & ampersands</description>')
    })

    it('should handle both empty tools and empty requirements', () => {
      const result = tools([], [])
      expect(result).toBe('')
    })

    it('should handle tools with only requirements but no functions', () => {
      const requirements = ['Use tool carefully', 'Check parameters']
      const result = tools([], requirements)
      expect(result).toContain('<tool_calling>')
      expect(result).toContain(' - Use tool carefully')
      expect(result).toContain(' - Check parameters')
      expect(result).toContain('</tool_calling>')
      expect(result).not.toContain('<functions>')
    })

    it('should handle requirements with only functions but empty requirements array', () => {
      const toolFunctions: ToolFunction[] = [
        {
          name: 'testTool',
          description: 'A test tool',
          parameters: {},
        },
      ]

      const result = tools(toolFunctions, [])
      expect(result).not.toContain('<tool_calling>')
      expect(result).toContain('<function>')
    })
  })
})
