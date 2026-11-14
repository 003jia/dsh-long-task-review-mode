/** Resume phrasing accepted from an idle paused or blocked job. */
/**
 * Decide whether a user message asks to resume the paused job.
 * Accepts short, common phrasings in Chinese and English; longer sentences that
 * merely contain the word (for example "继续之前先解释") are not resumes.
 * @param text - the human message text.
 * @returns whether the message is a resume request.
 */
export declare function isResumeIntent(text: string): boolean;
