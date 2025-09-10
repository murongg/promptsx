import type { PromptNode } from './node'

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export class PromptBuilder {
  public nodes: PromptNode[] = []

  build(): ChatMessage[] {
    const res: ChatMessage[] = []

    this.nodes.forEach((node) => {
      const content = node.build()
      if (content) {
        res.push({ role: node.role, content })
      }
    })

    return res
  }
}

export function P(): PromptBuilder {
  return new PromptBuilder()
}
