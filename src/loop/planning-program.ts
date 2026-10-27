/** Restricted tool-transport programs allowed while a Laya plan is being prepared. */
import { parse } from 'acorn'

function record(value: unknown): value is Record<string, unknown> { return value !== null && typeof value === 'object' && !Array.isArray(value) }
function named(value: unknown, name: string): boolean { return record(value) && value.type === 'Identifier' && value.name === name }
function data(node: unknown): boolean {
  if (!record(node)) return false
  if (node.type === 'Literal') return node.value === null || ['string', 'number', 'boolean'].includes(typeof node.value)
  if (node.type === 'TemplateLiteral') return Array.isArray(node.expressions) && node.expressions.length === 0
  if (node.type === 'UnaryExpression') return ['+', '-'].includes(String(node.operator)) && record(node.argument) && node.argument.type === 'Literal' && typeof node.argument.value === 'number'
  if (node.type === 'ArrayExpression') return Array.isArray(node.elements) && node.elements.every(data)
  return node.type === 'ObjectExpression' && Array.isArray(node.properties) && node.properties.every(prop => record(prop)
    && prop.type === 'Property' && prop.kind === 'init' && prop.computed === false && prop.method === false && data(prop.value))
}
function staticPath(node: Record<string, unknown>): string | undefined {
  if (!Array.isArray(node.properties)) return undefined
  const property = node.properties.find(prop => record(prop) && (named(prop.key, 'path') || record(prop.key) && prop.key.value === 'path'))
  if (!record(property) || !record(property.value)) return undefined
  return typeof property.value.value === 'string' ? property.value.value : undefined
}
function planningCall(node: unknown): boolean {
  if (!record(node) || node.type !== 'AwaitExpression' || !record(node.argument)) return false
  const call = node.argument, member = call.callee
  if (call.type !== 'CallExpression' || !record(member) || member.type !== 'MemberExpression'
    || member.computed !== false || !named(member.object, 'tools') || !record(member.property)
    || !Array.isArray(call.arguments) || call.arguments.length !== 1 || !data(call.arguments[0])) return false
  if (['loop_tasks', 'laya_tasks', 'read', 'read_image', 'glob', 'grep', 'ls'].includes(String(member.property.name))) return true
  if (!['write', 'edit'].includes(String(member.property.name)) || !record(call.arguments[0])) return false
  return staticPath(call.arguments[0])?.replace(/\\/g, '/').split('/').at(-1) === 'plan.md'
}

/**
 * Admit one direct planning tool call through run_code, without admitting Node API effects.
 * @param code - untrusted transport source.
 * @param maxCharacters - configured complete program limit.
 * @returns whether the program only awaits one planning call and optionally returns/logs its result.
 */
export function isPlanningProgram(code: string, maxCharacters: number): boolean {
  if (code.length > maxCharacters) return false
  try {
    const program = parse(code, { ecmaVersion: 'latest', sourceType: 'module', allowAwaitOutsideFunction: true, allowReturnOutsideFunction: true })
    let calls = 0, binding = ''
    for (const statement of program.body) {
      if (statement.type === 'EmptyStatement') continue
      if (statement.type === 'VariableDeclaration' && statement.declarations.length === 1) {
        const declaration = statement.declarations[0]!
        if (binding !== '' || declaration.id.type !== 'Identifier' || ['tools', 'console'].includes(declaration.id.name) || !planningCall(declaration.init)) return false
        binding = declaration.id.name; calls++; continue
      }
      if (statement.type === 'ReturnStatement') {
        if (planningCall(statement.argument)) { calls++; continue }
        if (binding !== '' && named(statement.argument, binding)) continue
        return false
      }
      if (statement.type !== 'ExpressionStatement') return false
      if (planningCall(statement.expression)) { calls++; continue }
      const expression = statement.expression
      if (expression.type === 'CallExpression' && expression.callee.type === 'MemberExpression'
        && named(expression.callee.object, 'console') && named(expression.callee.property, 'log') && expression.callee.computed === false
        && expression.arguments.every(arg => data(arg) || binding !== '' && named(arg, binding))) continue
      return false
    }
    return calls === 1
  } catch { return false /* Invalid or unsupported source cannot bootstrap task execution. */ }
}
