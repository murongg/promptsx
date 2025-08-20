import { beforeEach, describe, expect, it } from 'vitest'
import { BranchBuilder } from './branch'
import { PromptNode } from './node'

describe('branchBuilder', () => {
  let parent: PromptNode
  let branch: BranchBuilder

  beforeEach(() => {
    parent = new PromptNode('system')
    branch = new BranchBuilder(parent, 'status')
  })

  describe('constructor', () => {
    it('should initialize with parent and valueVar', () => {
      expect(branch).toBeInstanceOf(BranchBuilder)
    })
  })

  describe('case()', () => {
    it('should add a case and return this for chaining', () => {
      const result = branch.case('active', 'User is active')
      expect(result).toBe(branch)
    })

    it('should add multiple cases', () => {
      branch
        .case('active', 'User is active')
        .case('inactive', 'User is inactive')
        .case('pending', 'User is pending')

      const branchOutput = branch.build()

      expect(branchOutput).toContain('SWITCH status')
      expect(branchOutput).toContain('CASE "active":')
      expect(branchOutput).toContain('User is active')
      expect(branchOutput).toContain('CASE "inactive":')
      expect(branchOutput).toContain('User is inactive')
      expect(branchOutput).toContain('CASE "pending":')
      expect(branchOutput).toContain('User is pending')
    })

    it('should maintain case order', () => {
      branch.case('first', 'First case')
      branch.case('second', 'Second case')

      const branchOutput = branch.build()

      expect(branchOutput).toContain('SWITCH status')
      expect(branchOutput).toContain('CASE "first":')
      expect(branchOutput).toContain('CASE "second":')
    })
  })

  describe('default()', () => {
    it('should set default text and return parent node', () => {
      const result = branch.default('Default case')
      expect(result).toBe(parent)
    })

    it('should overwrite existing default text', () => {
      branch.default('First default')
      branch.default('Second default')

      const branchOutput = branch.build()
      expect(branchOutput).toContain('Second default')
    })
  })

  describe('build()', () => {
    it('should build switch statement with cases only', () => {
      branch
        .case('active', 'User is active')
        .case('inactive', 'User is inactive')

      const branchOutput = branch.build()

      expect(branchOutput).toContain('SWITCH status')
      expect(branchOutput).toContain('CASE "active":')
      expect(branchOutput).toContain('User is active')
      expect(branchOutput).toContain('CASE "inactive":')
      expect(branchOutput).toContain('User is inactive')
      expect(branchOutput).toContain('END SWITCH')
    })

    it('should build switch statement with default case', () => {
      branch
        .case('active', 'User is active')
        .default('User status unknown')

      const branchOutput = branch.build()

      expect(branchOutput).toContain('SWITCH status')
      expect(branchOutput).toContain('CASE "active":')
      expect(branchOutput).toContain('User is active')
      expect(branchOutput).toContain('DEFAULT:')
      expect(branchOutput).toContain('User status unknown')
      expect(branchOutput).toContain('END SWITCH')
    })

    it('should build switch statement with no cases', () => {
      const branchOutput = branch.build()

      expect(branchOutput).toContain('SWITCH status')
      expect(branchOutput).toContain('END SWITCH')
    })

    it('should wrap output in branching logic tags', () => {
      branch.case('active', 'User is active')
      const branchOutput = branch.build()

      expect(branchOutput).toContain('<branching_logic>')
      expect(branchOutput).toContain('</branching_logic>')
    })

    it('should handle special characters in case text', () => {
      branch.case('special', 'Text with "quotes" and <tags>')
      const branchOutput = branch.build()

      expect(branchOutput).toContain('Text with "quotes" and <tags>')
    })

    it('should handle empty case text', () => {
      branch.case('empty', '')
      const branchOutput = branch.build()

      expect(branchOutput).toContain('CASE "empty":')
      expect(branchOutput).toContain('END SWITCH')
    })

    it('should handle multiple calls to build()', () => {
      branch.case('first', 'First case')
      const firstOutput = branch.build()

      branch.case('second', 'Second case')
      const secondOutput = branch.build()

      expect(firstOutput).toContain('CASE "first"')
      expect(secondOutput).toContain('CASE "first"')
      expect(secondOutput).toContain('CASE "second"')
    })
  })

  describe('integration with PromptNode', () => {
    it('should work correctly when called from PromptNode.branch()', () => {
      const node = new PromptNode('system')
      const branchBuilder = node.branch('status')

      branchBuilder
        .case('active', 'User is active')
        .default('User status unknown')

      branchBuilder.build()

      const result = node.build()
      expect(result).toContain('SWITCH status')
      expect(result).toContain('CASE "active":')
      expect(result).toContain('User is active')
      expect(result).toContain('DEFAULT:')
      expect(result).toContain('User status unknown')
      expect(result).toContain('END SWITCH')
    })

    it('should handle multiple branches in a single node', () => {
      const node = new PromptNode('system')

      node.branch('status')
        .case('active', 'User is active')
        .default('User status unknown')

      node.branch('role')
        .case('admin', 'User is admin')
        .case('user', 'User is regular user')
        .default('User role unknown')

      const result = node.build()

      expect(result).toContain('SWITCH status')
      expect(result).toContain('SWITCH role')
      expect(result).toContain('User is active')
      expect(result).toContain('User is admin')
      expect(result).toContain('User is regular user')
    })
  })
})
