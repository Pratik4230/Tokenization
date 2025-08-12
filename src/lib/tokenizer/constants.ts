// Character ID offset for single characters
export const LETTER_ID_OFFSET = 101

// Fixed ordered set of characters used for single-character tokens
export const CHAR_VALUES =
  "abcdefghijklmnopqrstuvwxyz" +
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
  "0123456789" +
  " " + // space
  "`~!@#$%^&*()-_=+[]{}\\|;:'\",.<>/?"

// Special full-sentence tokens with reserved IDs (must be unique)
export const SPECIAL_SENTENCES = [
  ["Piyush is Cutie", 1],
  ["Piyush has Girlfriend", 404],
] as const

export const SPECIAL_SENTENCE_ID_SET: ReadonlySet<number> = new Set(
  SPECIAL_SENTENCES.map(([, id]) => id)
)

export const SPECIAL_IDS = Object.freeze({
  PIYUSH_IS_CUTIE: SPECIAL_SENTENCES.find(([s]) => s === "Piyush is Cutie")?.[1] ?? -1,
  PIYUSH_HAS_GIRLFRIEND: SPECIAL_SENTENCES.find(([s]) => s === "Piyush has Girlfriend")?.[1] ?? -1,
})

// Base common words (lowercase). Single-letter words intentionally excluded.
export const BASE_WORDS = [
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
  "love", "likes", "loves", "heart", "hearts", "dear", "darling", "crush", "kiss", "hugs", "romance",
] as const

// Capitalized variants (for readability). Single-letter words excluded.
export const CAPITALIZED_WORDS = (BASE_WORDS as readonly string[])
  .filter((w) => w.length >= 2)
  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))

export const WORD_TOKENS = Array.from(new Set<string>([...BASE_WORDS, ...CAPITALIZED_WORDS])) 