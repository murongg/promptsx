import type { ChatMessage } from './builder'
import type { ToolFunction } from './tool'
import { BranchBuilder } from './branch'
import { criticals, examples, importants, when } from './common'
import { ToolBuilder } from './tool'

export class PromptNode {
  protected _role: ChatMessage['role'] = 'system'
  protected _roleDefinition: { name: string, description: string } = { name: '', description: '' }
  protected _content: string[] = []
  protected _important: string[] = []
  protected _critical: string[] = []
  protected _examples: string[] = []
  protected _vars: Record<string, any> = {}
  protected _branches: BranchBuilder[] = []
  protected _tool: ToolBuilder | undefined

  constructor(role: ChatMessage['role']) {
    this._role = role
  }

  /**
   * @param name - The name of the role
   * @param description - The description of the role
   * @returns The prompt node
   */
  role(name: string, description: string): this {
    this._roleDefinition = { name, description }
    return this
  }

  /**
   * @param text - The text to add to the content
   * @returns The prompt node
   */
  content(text: string | string[]): this {
    if (Array.isArray(text))
      this._content.push(...text)
    else
      this._content.push(text)
    return this
  }

  /**
   * @param text - The text to add to the important requirements
   * @returns The prompt node
   */
  important(text: string | string[]): this {
    if (Array.isArray(text))
      this._important.push(...text)
    else
      this._important.push(text)
    return this
  }

  /**
   * @param text - The text to add to the critical requirements
   * @returns The prompt node
   */
  critical(text: string | string[]): this {
    if (Array.isArray(text))
      this._critical.push(...text)
    else
      this._critical.push(text)
    return this
  }

  /**
   * @param text - The text to add to the examples
   * @returns The prompt node
   */
  example(text: string | string[]): this {
    if (Array.isArray(text))
      this._examples.push(...text)
    else
      this._examples.push(text)
    return this
  }

  /**
   * @param name - The name of the variable
   * @param value - The value of the variable
   * @returns The prompt node
   */
  var(name: string, value: string): this
  var(vars: Record<string, any>): this
  var(name: string | Record<string, any>, value?: string): this {
    if (typeof name === 'string') {
      Reflect.set(this._vars, name, value)
    }
    else {
      this._vars = { ...this._vars, ...name }
    }
    return this
  }

  /**
   * @param conditionVar - The variable to check
   * @param trueText - The text to return if the condition is true
   * @param falseText - The text to return if the condition is false
   * @returns The prompt node
   */
  when(conditionVar: string, trueText: string, falseText?: string): this {
    this._content.push(when(conditionVar, trueText, falseText))
    return this
  }

  /**
   * @param valueVar - The variable to branch on
   * @returns The branch builder
   */
  branch(valueVar: string): BranchBuilder
  branch(builder: BranchBuilder): BranchBuilder
  branch(valueVar: string | BranchBuilder): BranchBuilder {
    const branch = typeof valueVar === 'string'
      ? new BranchBuilder(this, valueVar)
      : valueVar
    this._branches.push(branch)
    return branch
  }

  /**
   * @param tool - The tool to add
   * @param requirements - The requirements for the tool
   * @returns The prompt node
   */
  tool(tool: ToolBuilder): this
  tool(tool: ToolFunction, requirements: string[]): this
  tool(tool: ToolFunction | ToolBuilder, requirements?: string[]): this {
    if (!this._tool) {
      this._tool = new ToolBuilder()
    }
    if (tool instanceof ToolBuilder) {
      this._tool = tool
    }
    else {
      this._tool.function(tool)
      if (requirements)
        this._tool.requirement(requirements)
    }
    return this
  }

  /**
   * @returns The prompt text
   */
  build(): string {
    // eslint-disable-next-line ts/explicit-function-return-type
    const fillVars = (text: string) =>
      text.replace(/\{\{(\w+)\}\}/g, (_, key) =>
        this._vars[key] !== undefined ? String(this._vars[key]) : `{{${key}}}`)

    // handle branches - build them first to add content to parent
    const branchText = this._branches.map(b => b.build()).join('\n\n')

    // get the updated content after branches have been built
    const updatedContentText = this._content.map(fillVars).join('\n')

    // Build sections and filter out empty ones
    const toolSection = this._tool ? this._tool.build() : ''
    const importantSection = importants(this._important.map(fillVars))
    const criticalSection = criticals(this._critical.map(fillVars))
    const examplesSection = examples(this._examples.map(fillVars))

    // Combine sections, filtering out empty ones
    const sections = [toolSection, importantSection, criticalSection, examplesSection, branchText]
      .filter(section => section !== '')
      .join('\n')

    return `${this._roleDefinition.name ? `You are ${this._roleDefinition.name}: ${this._roleDefinition.description}` : this._roleDefinition.description}
${updatedContentText}${sections ? `\n\n${sections}` : ''}`
  }
}
