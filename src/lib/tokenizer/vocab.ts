import { CHAR_VALUES, LETTER_ID_OFFSET, SPECIAL_SENTENCE_ID_SET, SPECIAL_SENTENCES, WORD_TOKENS } from "./constants"

export const CHAR_ENTRIES = Array.from(CHAR_VALUES).map<[string, number]>((ch, idx) => [
  ch,
  LETTER_ID_OFFSET + idx,
])

const WORD_ID_START = LETTER_ID_OFFSET + CHAR_VALUES.length

// Assign word IDs while skipping any reserved special IDs
const WORD_ENTRIES_BUILDER: Array<[string, number]> = []
{
  let nextId = WORD_ID_START
  for (const w of WORD_TOKENS) {
    while (SPECIAL_SENTENCE_ID_SET.has(nextId)) nextId += 1
    WORD_ENTRIES_BUILDER.push([w, nextId])
    nextId += 1
  }
}
export const WORD_ENTRIES = WORD_ENTRIES_BUILDER as ReadonlyArray<readonly [string, number]>

export const SPECIAL_ENTRIES = SPECIAL_SENTENCES as ReadonlyArray<readonly [string, number]>

export const TOKEN_TO_ID: Readonly<Record<string, number>> = Object.freeze(
  Object.fromEntries([...SPECIAL_ENTRIES, ...CHAR_ENTRIES, ...WORD_ENTRIES]) as Record<string, number>
)

export const ID_TO_TOKEN: Readonly<Record<number, string>> = Object.freeze(
  Object.fromEntries([...SPECIAL_ENTRIES, ...CHAR_ENTRIES, ...WORD_ENTRIES].map(([tok, id]) => [id, tok])) as Record<number, string>
)

export const WORD_SET: ReadonlySet<string> = new Set(WORD_TOKENS)
export const MAX_WORD_LENGTH = WORD_TOKENS.reduce((m, w) => Math.max(m, w.length), 0)
export const SPECIAL_LOOKUP_LOWER = new Map<string, number>(SPECIAL_SENTENCES.map(([s, id]) => [s.toLowerCase(), id]))
export const MAX_SPECIAL_LENGTH = SPECIAL_SENTENCES.reduce((m, [s]) => Math.max(m, s.length), 0) 