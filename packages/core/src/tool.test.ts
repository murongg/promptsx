import type { ToolFunction } from './tool'
import { beforeEach, describe, expect, it } from 'vitest'
import { ToolBuilder } from './tool'

describe('toolBuilder', () => {
  let builder: ToolBuilder

  beforeEach(() => {
    builder = new ToolBuilder()
  })

  describe('function()', () => {
    it('should add a tool function and return this for chaining', () => {
      const result = builder.function('testTool', 'A test tool', { param1: 'string' })
      expect(result).toBe(builder)
    })

    it('should add multiple tool functions', () => {
      builder
        .function('tool1', 'First tool', { param1: 'string' })
        .function('tool2', 'Second tool', { param2: 'number' })

      const output = builder.build()
      expect(output).toContain('<name>tool1</name>')
      expect(output).toContain('<name>tool2</name>')
      expect(output).toContain('<description>First tool</description>')
      expect(output).toContain('<description>Second tool</description>')
    })
  })

  describe('requirement()', () => {
    it('should add a requirement and return this for chaining', () => {
      const result = builder.requirement('Test requirement')
      expect(result).toBe(builder)
    })

    it('should add multiple requirements', () => {
      builder
        .requirement('Requirement 1')
        .requirement('Requirement 2')

      const output = builder.build()
      expect(output).toContain('Requirement 1')
      expect(output).toContain('Requirement 2')
    })
  })

  describe('build()', () => {
    it('should build empty output when no tools or requirements', () => {
      const result = builder.build()

      expect(result).toBe('')
    })

    it('should build output with tools only', () => {
      builder.function('testTool', 'A test tool', { param1: 'string' })
      const result = builder.build()

      expect(result).toContain('<functions>')
      expect(result).toContain('<name>testTool</name>')
      expect(result).toContain('<description>A test tool</description>')
      expect(result).toContain('<parameters>{"param1":"string"}</parameters>')
      expect(result).not.toContain('<tool_calling>')
    })

    it('should build output with requirements only', () => {
      builder.requirement('Test requirement')
      const result = builder.build()

      expect(result).not.toContain('<functions>')
      expect(result).toContain('<tool_calling>')
      expect(result).toContain('Test requirement')
      expect(result).toContain('</tool_calling>')
    })

    it('should build complete output with tools and requirements', () => {
      builder
        .function('tool1', 'First tool', { param1: 'string' })
        .function('tool2', 'Second tool', { param2: 'number' })
        .requirement('Requirement 1')
        .requirement('Requirement 2')

      const result = builder.build()

      // Check tools
      expect(result).toContain('<functions>')
      expect(result).toContain('<name>tool1</name>')
      expect(result).toContain('<name>tool2</name>')
      expect(result).toContain('<description>First tool</description>')
      expect(result).toContain('<description>Second tool</description>')

      // Check requirements
      expect(result).toContain('<tool_calling>')
      expect(result).toContain('Requirement 1')
      expect(result).toContain('Requirement 2')
      expect(result).toContain('</tool_calling>')
    })

    it('should format requirements with bullet points', () => {
      builder.requirement('Requirement 1').requirement('Requirement 2')
      const result = builder.build()

      expect(result).toContain('Requirement 1')
      expect(result).toContain(' - Requirement 2')
    })
  })

  describe('toolFunction interface', () => {
    it('should have correct structure', () => {
      const tool: ToolFunction = {
        name: 'test',
        description: 'test description',
        parameters: { param: 'value' },
      }

      expect(tool.name).toBe('test')
      expect(tool.description).toBe('test description')
      expect(tool.parameters).toEqual({ param: 'value' })
    })
  })
})
