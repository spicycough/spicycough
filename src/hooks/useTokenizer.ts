import { init, Tiktoken } from "tiktoken/lite/init"
import wasm from "tiktoken/lite/tiktoken_bg.wasm?init"
import model from "tiktoken/encoders/cl100k_base.json"

await init((imports) => WebAssembly.instantiate(wasm, imports))

export const useTokenizer = () => {
  const encoder = new Tiktoken(model.bpe_ranks, model.special_tokens, model.pat_str)

  const tokenize = async (text: string) => {
    const tokens = encoder.encode(text)
    encoder.free()
    return tokens
  }

  const detokenize = async (tokens: Uint32Array) => {
    const text = encoder.decode(tokens)
    encoder.free()
    return text
  }

  return { tokenize, detokenize }
}
