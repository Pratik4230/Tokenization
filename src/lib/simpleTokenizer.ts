export const LETTER_ID_OFFSET = 101

const Values =
  "abcdefghijklmnopqrstuvwxyz" +
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
  "0123456789" +
  " " + // space
  "`~!@#$%^&*()-_=+[]{}\\|;:'\",.<>/?"

// Special full-sentence tokens with reserved IDs (must be unique)
const SpecialSentences = [
  ["Piyush is Cutie", 1],
  ["Piyush has Girlfriend", 404],
] as const satisfies ReadonlyArray<readonly [string, number]>

export const SPECIAL_SENTENCE_ID_SET: ReadonlySet<number> = new Set(
  SpecialSentences.map(([, id]) => id)
)

// Export named IDs for specific phrases for UI customization
export const SPECIAL_IDS = Object.freeze({
  PIYUSH_IS_CUTIE: SpecialSentences.find(([s]) => s === "Piyush is Cutie")?.[1] ?? -1,
  PIYUSH_HAS_GIRLFRIEND: SpecialSentences.find(([s]) => s === "Piyush has Girlfriend")?.[1] ?? -1,
})

// A curated set of commonly used words (lowercase) — exclude single-letter words like "a" or "i"
const BaseWords = [
  // wh-words
  "how", "what", "when", "where", "why", "who", "whom", "whose", "which",
  // articles, pronouns, auxiliaries, conjunctions, prepositions, misc
  "the", "be", "to", "of", "and", "in", "that", "have", "it", "for", "not", "on", "with", "as", "you", "do", "at", "this", "but", "his", "by", "from",
  "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "is", "are", "was", "were", "been", "being",
  "me", "them", "us", "about", "above", "across", "after", "against", "along", "among", "around", "before", "behind", "below", "beneath", "beside",
  "between", "beyond", "concerning", "despite", "down", "during", "except", "inside", "into", "near", "off", "onto", "out", "outside", "over", "past",
  "regarding", "since", "through", "throughout", "toward", "under", "underneath", "until", "upon", "within", "without", "and", "or", "so", "yet", "nor",
  "although", "because", "unless", "while", "whereas", "can", "could", "shall", "should", "will", "would", "may", "might", "must", "do", "does", "did",
  "am", "has", "have", "had", "if", "then", "else", "also", "very", "more", "most", "some", "any", "each", "every", "no", "only", "own", "same", "than",
  "too", "really", "just", "now", "then", "there", "here", "again", "still", "even",
  // greetings & time of day
  "hello", "hi", "hey", "namaste", "thanks", "thank", "welcome", "please", "good", "morning", "evening", "night", "afternoon", "today", "tomorrow", "yesterday", "tonight",
  // indian names (sample)
  "pratik", "hitesh", "piyush", "rahul", "rohit", "amit", "priya", "sneha", "neha", "ankit", "kiran", "aditi", "ravi", "arjun", "vijay", "anita",
  // coding/dev words
  "code", "coding", "bug", "fix", "commit", "push", "pull", "merge", "branch", "repo", "repository", "function", "variable", "constant", "class", "interface", "type",
  "array", "object", "loop", "async", "await", "promise", "error", "exception", "test", "unit", "integration", "deploy", "build", "compile", "runtime", "server", "client",
  "api", "endpoint", "request", "response", "json", "package", "module", "import", "export", "require", "return", "switch", "case", "for", "while", "map", "filter", "reduce",
  "try", "catch", "finally", "throw",
  // ai-related
  "ai", "gpt", "model", "models", "dataset", "training", "train", "inference", "token", "tokens", "tokenize", "tokenizer", "prompt", "prompts", "llm", "embedding", "embeddings",
  "vector", "vectors", "transformer", "attention",
  // javascript ecosystem
  "javascript", "js", "typescript", "ts", "node", "npm", "yarn", "pnpm", "vite", "react", "angular", "vue", "next", "express", "babel", "webpack", "eslint", "prettier",
  "tsconfig", "console", "log", "timeout", "interval", "document", "window", "fetch", "jsx", "tsx",
  // love-related
  "love", "likes", "loves", "heart", "hearts", "dear", "darling", "crush", "kiss", "hugs", "romance"
]

// Generate Capitalized variants (e.g., "How") for readability in text; skip single-letter
const CapitalizedWords = BaseWords
  .filter(w => w.length >= 2)
  .map(w => w.charAt(0).toUpperCase() + w.slice(1))

// Combine and de-duplicate
const WordTokens = Array.from(new Set([...BaseWords, ...CapitalizedWords]))

const charEntries = Array.from(Values).map((ch, idx) => [
  ch,
  LETTER_ID_OFFSET + idx,
]) as Array<[string, number]>

const WORD_ID_START = LETTER_ID_OFFSET + Values.length
const wordEntries = WordTokens.map((w, idx) => [
  w,
  WORD_ID_START + idx,
]) as Array<[string, number]>

const specialEntries = SpecialSentences.map(([phrase, id]) => [phrase, id]) as Array<[string, number]>

export const letterToId: Record<string, number> = Object.freeze(
  Object.fromEntries([...specialEntries, ...charEntries, ...wordEntries])
)

export const idToLetter: Record<number, string> = Object.freeze(
  Object.fromEntries([...specialEntries, ...charEntries, ...wordEntries].map(([tok, id]) => [id, tok]))
)

// Precompute for greedy matching
const specialLookupLower = new Map<string, number>(
  SpecialSentences.map(([s, id]) => [s.toLowerCase(), id])
)
const maxSpecialLength = SpecialSentences.reduce((m, [s]) => Math.max(m, s.length), 0)

const wordSet = new Set(WordTokens)
const maxWordLength = WordTokens.reduce((m, w) => Math.max(m, w.length), 0)

export function encodeLetters(input: string): number[] {
  const result: number[] = []
  let i = 0
  while (i < input.length) {
    let matched = false

    // 1) Try special sentences first (case-insensitive, may include spaces)
    if (maxSpecialLength > 0) {
      const maxLen = Math.min(maxSpecialLength, input.length - i)
      for (let len = maxLen; len >= 2; len--) {
        const candidate = input.slice(i, i + len)
        const id = specialLookupLower.get(candidate.toLowerCase())
        if (id !== undefined) {
          result.push(id)
          i += len
          matched = true
          break
        }
      }
      if (matched) continue
    }

    // 2) Try longest word (length >= 2)
    if (maxWordLength > 0) {
      const maxLen = Math.min(maxWordLength, input.length - i)
      for (let len = maxLen; len >= 2; len--) {
        const candidate = input.slice(i, i + len)
        if (wordSet.has(candidate)) {
          const id = letterToId[candidate]
          if (id !== undefined) {
            result.push(id)
            i += len
            matched = true
            break
          }
        }
      }
      if (matched) continue
    }

    // 3) Fallback to single-character mapping
    const ch = input[i]
    const id = letterToId[ch]
    if (id !== undefined) {
      result.push(id)
    }
    // Unknown characters are ignored
    i += 1
  }
  return result
}

export function decodeLetters(ids: number[]): string {
  let result = ""
  for (const id of ids) {
    const tok = idToLetter[id]
    if (tok !== undefined) {
      result += tok
    }
    // Unknown ids are skipped
  }
  return result
} 