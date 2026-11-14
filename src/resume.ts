/** Resume phrasing accepted from an idle paused or blocked job. */

/**
 * Decide whether a user message asks to resume the paused job.
 * Accepts short, common phrasings in Chinese and English; longer sentences that
 * merely contain the word (for example "继续之前先解释") are not resumes.
 * @param text - the human message text.
 * @returns whether the message is a resume request.
 */
export function isResumeIntent(text: string): boolean {
  const value = text.trim()
  if (value.length === 0 || value.length > 30) return false
  return /^(请|麻烦|帮我|可以)?\s*(继续当前任务|继续任务|继续|接着|恢复任务|恢复|continue|resume)(一下|任务|工作|干|做|来|吧|吗|么)*[。.!！]?$/i.test(value)
}
