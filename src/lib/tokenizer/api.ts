import { ID_TO_TOKEN } from "./vocab"
import { matchChar, matchSpecial, matchWord } from "./matchers"

export type EncodeOptions = {
  strict?: boolean
  unknownId?: number
}

export type EncodedSpan = {
  id: number
  text: string
  start: number
  end: number
  originalText: string
}

export function encodeWithSpans(input: string, options?: EncodeOptions): EncodedSpan[] {
  const spans: EncodedSpan[] = []
  let i = 0
  while (i < input.length) {
    let m = matchSpecial(input, i)
    if (!m) m = matchWord(input, i)
    if (!m) m = matchChar(input, i)

    if (m) {
      const tokenText = ID_TO_TOKEN[m.id] ?? input.slice(i, i + m.length)
      spans.push({
        id: m.id,
        text: tokenText,
        start: i,
        end: i + m.length,
        originalText: input.slice(i, i + m.length),
      })
      i += m.length
      continue
    }

    // Unknown handling
    if (options?.strict) {
      throw new Error(`Unknown token at position ${i}: ${JSON.stringify(input[i])}`)
    }
    if (typeof options?.unknownId === "number") {
      spans.push({ id: options.unknownId, text: "", start: i, end: i + 1, originalText: input[i] })
    }
    i += 1
  }
  return spans
}

export function encodeLetters(input: string, options?: EncodeOptions): number[] {
  const spans = encodeWithSpans(input, options)
  return spans.map((s) => s.id)
}

export function decodeLetters(ids: number[]): string {
  let result = ""
  for (const id of ids) {
    const tok = ID_TO_TOKEN[id]
    if (tok !== undefined) result += tok
  }
  return result
} 