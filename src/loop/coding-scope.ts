/** Source-write hints from recorded tool arguments; task routing belongs to the primary model. */
import { z } from 'zod'
const sourceExtension = new RegExp('\\.(?:[cm]?[jt]sx?|py|rs|go|java|kt|kts|swift|c|cc|cpp|h|hpp|cs|rb|php|vue|svelte'
  + '|html?|css|scss|sass|less|sh|bash|zsh|sql|graphql|proto|ipynb)$', 'i')
const sourceConfig = new RegExp('(?:^|[/\\\\])(?:package\\.json|tsconfig[^/\\\\]*\\.json|Cargo\\.toml|pyproject\\.toml'
  + '|(?:vite|webpack|eslint)\\.config\\.[cm]?[jt]s)$', 'i')
function codePath(path: string): boolean { return sourceExtension.test(path) || sourceConfig.test(path) }

/**
 * Extract source paths from a recorded filesystem mutation or patch.
 * Shell commands and read operations do not establish a source write; execution success is checked by the caller.
 * @param name - recorded tool name.
 * @param argumentsJson - recorded JSON arguments.
 * @returns source paths mentioned by a supported mutation.
 */
export function writtenSourcePaths(name: string, argumentsJson: string): string[] {
  if (!/(?:^|__)(?:write|edit|write_file|edit_file|apply_patch)$/.test(name)) return []
  let raw: unknown
  try { raw = JSON.parse(argumentsJson) } catch { return [] /* Invalid arguments cannot establish source mutation. */ }
  const parsed = z.looseObject({ file_path: z.string().optional(), path: z.string().optional(),
    patch: z.string().optional(), input: z.string().optional() }).safeParse(raw)
  if (!parsed.success) return []
  const paths = [parsed.data.file_path ?? parsed.data.path ?? '', ...(parsed.data.patch ?? parsed.data.input ?? '').split('\n')
    .flatMap(line => /^\*\*\* (?:Add|Update|Delete) File: (.+)$/.exec(line)?.slice(1) ?? [])]
  return [...new Set(paths.map(path => path.trim()).filter(codePath))]
}
