import { useMemo, useState } from "react"
import { idToLetter, encodeLetters, SPECIAL_SENTENCE_ID_SET, SPECIAL_IDS } from "@/lib/simpleTokenizer"

// Use the encoder from simpleTokenizer so special sentences (case-insensitive)
// are matched first, then words, then single characters.

function pastelColor(index: number, total: number): string {
  const safeTotal = Math.max(total, 1)
  const hue = Math.round((index * 360) / safeTotal) % 360
  const saturation = 70 //%
  const lightness = 85 //%
  return `hsl(${hue} ${saturation}% ${lightness}%)`
}

export default function TokenizationUI() {
  const [text, setText] = useState("")
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  // Encode using the tokenizer so special sentences take priority
  const tokenIds = useMemo(() => encodeLetters(text), [text])
  // Derive the display tokens from the ID mapping
  const tokens = useMemo(() => tokenIds.map((id) => idToLetter[id] ?? ""), [tokenIds])
  const hasSpecial = useMemo(() => tokenIds.some((id) => SPECIAL_SENTENCE_ID_SET.has(id)), [tokenIds])
  const hasCutie = useMemo(() => tokenIds.includes(SPECIAL_IDS.PIYUSH_IS_CUTIE), [tokenIds])
  const hasGirlfriend = useMemo(() => tokenIds.includes(SPECIAL_IDS.PIYUSH_HAS_GIRLFRIEND), [tokenIds])

  // Decode panel state
  const [decodeInput, setDecodeInput] = useState("")
  const [decodeHoverIndex, setDecodeHoverIndex] = useState<number | null>(null)

  const decodedIds = useMemo(() => {
    const parts = decodeInput
      .split(/[,-\s]+/)
      .map((p) => p.trim())
      .filter(Boolean)
    const nums: number[] = []
    for (const p of parts) {
      const n = Number(p)
      if (Number.isFinite(n)) nums.push(n)
    }
    return nums
  }, [decodeInput])

  const decodedTokens = useMemo(() => decodedIds.map((id) => idToLetter[id] ?? "?"), [decodedIds])
  const decodedDisplayTokens = useMemo(
    () =>
      decodedIds.map((id) =>
        id === SPECIAL_IDS.PIYUSH_IS_CUTIE
          ? "Yes"
          : id === SPECIAL_IDS.PIYUSH_HAS_GIRLFRIEND
          ? "No"
          : idToLetter[id] ?? "?"
      ),
    [decodedIds]
  )
  const decodedString = useMemo(() => decodedTokens.join("") || "", [decodedTokens])

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-4 text-2xl font-semibold"> Tokenization</h1>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Left: Input */}
        <div className="space-y-2 rounded-lg border-2 border-border bg-card p-3">
          <label className="block text-sm font-medium">Input</label>
          <textarea
            className="h-64 w-full resize-y rounded-md border border-input bg-background p-3 outline-none"
            placeholder="Type here... e.g. Piyush has Girlfriend"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {/* Right: Top and Bottom */}
        <div className="flex flex-col gap-4">
          {/* Right Top: Segmented tokens */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Tokens (words/symbols)</div>
            <div className="min-h-24 rounded-lg border-2 border-border bg-card p-3">
              {tokens.length && !hasSpecial ? (
                <div className="flex flex-wrap gap-2 text-sm">
                  {tokens.map((t, i) => {
                    const color = pastelColor(i, tokens.length)
                    const isHover = hoverIndex === i
                    return (
                      <span
                        key={i}
                        className={`rounded px-2 py-1 transition-colors border border-black/5 ${isHover ? "ring-2 ring-black/20" : ""}`}
                        style={{ backgroundColor: color, color: "#111" }}
                        onMouseEnter={() => setHoverIndex(i)}
                        onMouseLeave={() => setHoverIndex(null)}
                        title={`Index ${i}`}
                      >
                        "{t}"
                      </span>
                    )
                  })}
                </div>
              ) : hasCutie ? (
                <div className="text-sm text-muted-foreground">"Yes"</div>
              ) : hasGirlfriend ? (
                <div className="text-sm text-muted-foreground">"No"</div>
              ) : (
                <div className="text-sm text-muted-foreground">No</div>
              )}
            </div>
          </div>

          {/* Right Bottom: Numeric IDs */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Token IDs</div>
            <div className="min-h-24 rounded-lg border-2 border-border bg-card p-3">
              {tokenIds.length ? (
                <div className="flex flex-wrap gap-2 text-sm">
                  {tokenIds.map((id, i) => {
                    const color = pastelColor(i, tokenIds.length)
                    const isHover = hoverIndex === i
                    const displayId = id === SPECIAL_IDS.PIYUSH_IS_CUTIE ? 1 : id
                    return (
                      <span
                        key={i}
                        className={`rounded px-2 py-1 transition-colors border border-black/5 ${isHover ? "ring-2 ring-black/20" : ""}`}
                        style={{ backgroundColor: color, color: "#111" }}
                        onMouseEnter={() => setHoverIndex(i)}
                        onMouseLeave={() => setHoverIndex(null)}
                        title={`Index ${i}${id !== displayId ? ` (real ${id})` : ""}`}
                      >
                        {displayId}
                      </span>
                    )
                  })}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">No IDs yet</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Decode Panel */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-2 rounded-lg border-2 border-border bg-card p-3">
          <label className="block text-sm font-medium">Decode (IDs → text) <span className="text-xs text-muted-foreground"> Eg: 404</span></label>
          <input
            className="w-full rounded-md border border-input bg-background p-2 outline-none"
            placeholder="Comma or space separated IDs, e.g. 1, 123, 456"
            value={decodeInput}
            onChange={(e) => setDecodeInput(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <div className="text-sm font-medium">Decoded Tokens</div>
            <div className="min-h-24 rounded-lg border-2 border-border bg-card p-3">
              {decodedIds.length ? (
                <div className="flex flex-wrap gap-2 text-sm">
                  {decodedDisplayTokens.map((t, i) => {
                    const color = pastelColor(i, decodedDisplayTokens.length)
                    const isHover = decodeHoverIndex === i
                    return (
                      <span
                        key={i}
                        className={`rounded px-2 py-1 transition-colors border border-black/5 ${isHover ? "ring-2 ring-black/20" : ""}`}
                        style={{ backgroundColor: color, color: "#111" }}
                        onMouseEnter={() => setDecodeHoverIndex(i)}
                        onMouseLeave={() => setDecodeHoverIndex(null)}
                        title={`Index ${i}`}
                      >
                        "{t}"
                      </span>
                    )
                  })}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">No</div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Decoded String</div>
            <div className="min-h-12 rounded-lg border-2 border-border bg-card p-3 text-sm">
              {decodedString || <span className="text-muted-foreground">No</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 