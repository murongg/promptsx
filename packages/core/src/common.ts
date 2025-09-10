import type { ToolFunction } from './tool'

export type OutputFormat = 'json' | 'markdown'
export type OutputSchemaDescription = string | string[]

export interface OutputSchema {
  [key: string]: OutputSchemaDescription | OutputSchema
}

/**
 * @param name - The name of the block
 * @param content - The content of the block
 * @returns The formatted text with the block
 */
export function block(name: string, content: string, isSingleLine = false): string {
  // snake case the name
  return isSingleLine ? `<${name}>${content}</${name}>` : `<${name}>\n${content}\n</${name}>`
}

/**
 * @param conditionVar - The variable to check
 * @param trueText - The text to return if the condition is true
 * @param falseText - The text to return if the condition is false
 * @returns The formatted text with the condition and the true/false text
 */
export function when(conditionVar: string, trueText: string, falseText?: string): string {
  let promptText = `IF ${conditionVar} THEN:\n${trueText}`
  if (falseText)
    promptText += `\nELSE:\n${falseText}`
  promptText += `\nEND IF`
  return promptText
}

/**
 * @param text - The text to format
 * @returns The formatted text with the important requirements
 */
export function importants(text: string[]): string {
  if (!text || text.length === 0)
    return ''
  const str = ` - ${text.join('\n - ')}`
  return block('important_requirements', str)
}

/**
 * @param text - The text to format
 * @returns The formatted text with the critical requirements
 */
export function criticals(text: string[]): string {
  if (!text || text.length === 0)
    return ''
  const str = ` - ${text.join('\n - ')}`
  return block('critical_requirements', str)
}

/**
 * @param text - The text to format
 * @returns The formatted text with the examples
 */
export function examples(text: string[]): string {
  if (!text || text.length === 0)
    return ''
  const str = ` - ${text.join('\n - ')}`
  return block('examples', str)
}

/**
 * @param valueVar - The variable to branch on
 * @param cases - The cases to branch on
 * @param defaultText - The text to return if no case matches
 * @returns The formatted text with the branching logic
 */
export function branches(valueVar: string, cases: { match: string, text: string }[], defaultText?: string): string {
  let str = `You must follow the following branching logic:\n`
  str += `SWITCH ${valueVar}\n`
  cases.forEach((c) => {
    str += `CASE "${c.match}":\n${c.text}\n`
  })
  if (defaultText)
    str += `DEFAULT:\n${defaultText}\n`
  str += `END SWITCH`
  return block('branching_logic', str)
}

/**
 * @param tools - The tools to format
 * @param requirements - The requirements to format
 * @returns The formatted text with the tools and the requirements
 */
export function tools(tools: ToolFunction[], requirements?: string[]): string {
  const functionText = tools && tools.length > 0
    ? tools.map(t => `  <function>
    <name>${t.name}</name>
    <description>${t.description}</description>
    <parameters>${JSON.stringify(t.parameters)}</parameters>
  </function>`).join('\n')
    : ''

  const requirementsText = requirements && requirements.length > 0 ? `${block('tool_calling', ` - ${requirements.join('\n - ')}`)}\n` : ''

  if (!functionText && !requirementsText)
    return ''

  return `${requirementsText}${functionText ? `<functions>\n${functionText}\n</functions>` : ''}`
}
