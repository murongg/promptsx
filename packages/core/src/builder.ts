import { PromptNode } from './node'

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export class PromptBuilder {
  public system: PromptNode = new PromptNode('system')
  public user: PromptNode = new PromptNode('user')
  public assistant: PromptNode = new PromptNode('assistant')

  build(): ChatMessage[] {
    const system = this.system.build()
    const user = this.user.build()
    const assistant = this.assistant.build()
    const res: ChatMessage[] = []
    if (system) {
      res.push({ role: 'system', content: system })
    }
    if (user) {
      res.push({ role: 'user', content: user })
    }
    if (assistant) {
      res.push({ role: 'assistant', content: assistant })
    }
    return res
  }
}

export function P(): PromptBuilder {
  return new PromptBuilder()
}
