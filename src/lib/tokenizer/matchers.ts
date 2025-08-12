import { MAX_SPECIAL_LENGTH, MAX_WORD_LENGTH, SPECIAL_LOOKUP_LOWER, TOKEN_TO_ID, WORD_SET } from "./vocab"

export type Match = { id: number; length: number }

export function matchSpecial(input: string, startIndex: number): Match | null {
  if (MAX_SPECIAL_LENGTH === 0) return null
  const maxLen = Math.min(MAX_SPECIAL_LENGTH, input.length - startIndex)
  for (let len = maxLen; len >= 2; len--) {
    const candidate = input.slice(startIndex, startIndex + len)
    const id = SPECIAL_LOOKUP_LOWER.get(candidate.toLowerCase())
    if (id !== undefined) return { id, length: len }
  }
  return null
}

export function matchWord(input: string, startIndex: number): Match | null {
  if (MAX_WORD_LENGTH === 0) return null
  const maxLen = Math.min(MAX_WORD_LENGTH, input.length - startIndex)
  for (let len = maxLen; len >= 2; len--) {
    const candidate = input.slice(startIndex, startIndex + len)
    if (WORD_SET.has(candidate)) {
      const id = TOKEN_TO_ID[candidate]
      if (id !== undefined) return { id, length: len }
    }
  }
  return null
}

export function matchChar(input: string, startIndex: number): Match | null {
  const ch = input[startIndex]
  const id = TOKEN_TO_ID[ch]
  if (id !== undefined) return { id, length: 1 }
  return null
} 