// Shared emoji encoding utilities
// - Emoji64: uses base64-emoji to map data to a 64-emoji alphabet (visible sequence)
// - Invisible TAG: maps hex digits to Emoji TAG characters and appends CANCEL TAG to hide data after a base emoji (🥜)

import emoji from "base64-emoji";

// Emoji64 encoding/decoding (NutHog-style)
export function encodeEmoji64(input: string): string {
  return emoji.encode(input);
}

export function decodeEmoji64(seq: string): string | null {
  try {
    const decoded = emoji.decode(seq);
    if (decoded?.startsWith("cashu")) return decoded;
  } catch {}
  return null;
}

// Invisible TAG-based encoding (current app default)
export function encodeInvisible(text: string): string {
  const bytes = new TextEncoder().encode(text);
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const tagSeq = hex
    .split("")
    .map((ch) => {
      if (ch >= "0" && ch <= "9") {
        return String.fromCodePoint(0xe0030 + (ch.charCodeAt(0) - 0x30));
      }
      const lc = ch.toLowerCase();
      if (lc >= "a" && lc <= "z") {
        return String.fromCodePoint(0xe0061 + (lc.charCodeAt(0) - 0x61));
      }
      return "";
    })
    .join("");
  return tagSeq + String.fromCodePoint(0xe007f);
}

export function decodeInvisible(encoded: string): string {
  const cleaned = encoded.replace("🥜", "");
  let hex = "";
  for (const ch of cleaned) {
    const cp = ch.codePointAt(0) ?? 0;
    if (cp === 0xe007f) break; // CANCEL TAG
    if (cp >= 0xe0030 && cp <= 0xe0039) {
      hex += String.fromCharCode(0x30 + (cp - 0xe0030));
      continue;
    }
    if (cp >= 0xe0061 && cp <= 0xe007a) {
      hex += String.fromCharCode(0x61 + (cp - 0xe0061));
      continue;
    }
  }
  if (!hex || hex.length % 2 !== 0) return "";
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  try {
    return new TextDecoder().decode(bytes);
  } catch {
    return "";
  }
}

export function probablyInvisibleTagPayload(input: string): boolean {
  for (const ch of input) {
    const cp = ch.codePointAt(0) ?? 0;
    if (cp === 0xe007f) return true;
    if ((cp >= 0xe0030 && cp <= 0xe0039) || (cp >= 0xe0061 && cp <= 0xe007a)) return true;
  }
  return false;
}
