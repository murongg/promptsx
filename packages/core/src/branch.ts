import type { PromptNode } from './node'
import { branches } from './common'

export class BranchBuilder {
  private _parent: PromptNode
  private _valueVar: string
  private _cases: { match: string, text: string }[] = []
  private _defaultText: string | null = null

  constructor(parent: PromptNode, valueVar: string) {
    this._parent = parent
    this._valueVar = valueVar
  }

  case(matchValue: string, text: string): this {
    this._cases.push({ match: matchValue, text })
    return this
  }

  default(text: string): PromptNode {
    this._defaultText = text
    return this._parent
  }

  build(): string {
    const text = branches(this._valueVar, this._cases, this._defaultText || undefined)
    return text
  }
}
