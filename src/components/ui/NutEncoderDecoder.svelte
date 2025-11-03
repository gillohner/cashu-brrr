<script lang="ts">
  import { toast } from "svelte-sonner";
  import {
    encodeInvisible,
    decodeInvisible,
    decodeEmoji64,
    probablyInvisibleTagPayload,
  } from "../../lib/emoji-encoding";

  let token = $state("");
  let encodedInput = $state("");

  const decodedFromEncoded = $derived.by(() => {
    if (!encodedInput) return "";
    // If it looks like invisible TAG payload, try that first
    if (
      encodedInput.includes("🥜") ||
      probablyInvisibleTagPayload(encodedInput)
    ) {
      const text = decodeInvisible(encodedInput);
      if (text) return text;
    }
    // Fallback to Emoji64
    const e64 = decodeEmoji64(encodedInput);
    return e64 ?? "";
  });

  const clearAll = () => {
    token = "";
    encodedInput = "";
  };

  const copy = async (text: string, label = "Copied") => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(label);
    } catch (e) {
      toast.error("Failed to copy");
      console.error(e);
    }
  };

  const copyNut = () => {
    if (!token.trim()) return;
    const nut = `🥜${encodeInvisible(token.trim())}`;
    copy(nut, "Copied 🥜 to clipboard");
  };

  const copyDecodedToken = () => {
    if (!decodedFromEncoded) return;
    copy(decodedFromEncoded, "Copied decoded token");
  };
</script>

<div class="w-full border border-base-300 rounded-lg p-4 flex flex-col gap-3">
  <div class="flex items-center justify-between">
    <h3 class="font-bold">Nut emoji encoder/decoder</h3>
    <button class="btn btn-sm" onclick={clearAll}>Clear</button>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- Encoder -->
    <div class="flex flex-col gap-2">
      <label class="text-sm opacity-70" for="nut-enc-token"
        >Paste a Cashu token</label
      >
      <textarea
        id="nut-enc-token"
        class="textarea textarea-bordered h-28"
        bind:value={token}
        placeholder="cashuA..."
      ></textarea>
      <div class="flex gap-2">
        <button
          class="btn btn-secondary"
          disabled={!token.trim()}
          onclick={copyNut}
        >
          Copy 🥜
        </button>
      </div>
    </div>

    <!-- Decoder -->
    <div class="flex flex-col gap-2">
      <label class="text-sm opacity-70" for="nut-dec-input"
        >Paste 🥜 or Emoji64 here</label
      >
      <textarea
        id="nut-dec-input"
        class="textarea textarea-bordered h-28"
        bind:value={encodedInput}
        placeholder="🥜<invisible>… or emoji sequence"
      ></textarea>
      <div class="flex items-center justify-between">
        <div class="text-xs opacity-70">
          {#if encodedInput}
            {#if encodedInput.includes("🥜") || probablyInvisibleTagPayload(encodedInput)}
              Detected: Invisible 🥜 payload
            {:else}
              Detected: Emoji64
            {/if}
          {/if}
        </div>
        <button
          class="btn btn-primary btn-sm"
          disabled={!decodedFromEncoded}
          onclick={copyDecodedToken}
        >
          Copy decoded token
        </button>
      </div>
    </div>
  </div>
</div>

<style>
</style>
