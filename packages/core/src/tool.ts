import { tools } from './common'

export interface ToolFunction {
  name: string
  description: string
  parameters: Record<string, any>
}

export class ToolBuilder {
  private tools: ToolFunction[] = []
  private requirements: string[] = []

  function(name: string, description: string, parameters: Record<string, any>): this
  function(tool: ToolFunction): this
  function(name: string | ToolFunction, description?: string, parameters?: Record<string, any>): this {
    if (typeof name === 'string') {
      this.tools.push({ name, description: description!, parameters: parameters! })
    }
    else {
      this.tools.push(name as ToolFunction)
    }
    return this
  }

  requirement(requirements: string[]): this
  requirement(requirement: string): this
  requirement(requirement: string | string[]): this {
    if (Array.isArray(requirement)) {
      this.requirements.push(...requirement)
    }
    else {
      this.requirements.push(requirement)
    }
    return this
  }

  build(): string {
    return tools(this.tools, this.requirements)
  }
}
