<script lang="ts">
  import { getEncodedTokenV4 } from "@cashu/cashu-ts";
  import CustomNote from "./CustomNote.svelte";
  import MountainlakeNote from "./MountainlakeNote.svelte";
  import {
    preparedTokens,
    selectedNumberOfNotes,
    wallet,
  } from "./stores.svelte";
  import { getAmountForTokenSet } from "./utils";
  import ShareViaNostr from "./comp/ShareViaNostr.svelte";
  import ComicNote from "./ComicNote.svelte";
  import encodeQR from "qr";
  import JSZip from "jszip";

  let active = $state("customize");
  let design = $state(3);
  let selectedTemplate = $state("comic");

  //custom note
  let colorCode = $state("#5db075");
  let brandLogoURL = $state("");
  let cornerBrandLogoURL = $state("");
  let brandInput: HTMLInputElement | undefined = $state();
  let cornerInput: HTMLInputElement | undefined = $state();

  // Mountainlake note states
  let topLeftIcon = $state<"cashu" | "bitcoin" | "sats" | "custom">("cashu");
  let customLogoUrl = $state("");
  let logoInput: HTMLInputElement | undefined = $state();

  let headerText = $state(
    "Cashu Token\nRedeemable with Cashu\nWallet of choice",
  );
  let headerTextColor = $state("#FFFFFF");

  let gradientStart = $state("#F77F00");
  let gradientEnd = $state("#7209B7");
  let gradientAngle = $state(135);

  let qrBackgroundColor = $state("#FFFFFF");
  let qrBackgroundGradientEnd = $state("#FFFFFF");
  let useQrGradient = $state(false);
  let qrBorderColor = $state("#F77F00");
  let disableQrBackground = $state(false);
  let disableQrBorder = $state(false);
  let qrCodeColor = $state("#000000");

  let denominationColor = $state("#F77F00");

  let bottomBoxColor = $state("#FFFFFF");
  let bottomBoxGradientEnd = $state("#FFFFFF");
  let useDenomGradient = $state(false);
  let disableDenomBackground = $state(false);
  let bottomTextColor = $state("#666666");
  // Generate default bottom text based on mint URL
  const getDefaultBottomText = () => {
    const mintUrl = $wallet?.mint.mintUrl || "mint.mountainlake.io";
    try {
      const domain = new URL(mintUrl).hostname.toUpperCase();
      return `${domain}\nYOUR TRUSTED CASHU MINT`;
    } catch {
      return "MINT.MOUNTAINLAKE.IO\nYOUR TRUSTED CASHU MINT";
    }
  };

  let customBottomText = $state(getDefaultBottomText());

  // Logo upload handler
  const handleLogoUpload = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      customLogoUrl = URL.createObjectURL(target.files[0]);
      topLeftIcon = "custom";
    }
  };

  // Preset themes
  const applyTheme = (
    theme:
      | "orange"
      | "purple"
      | "swiss-10"
      | "swiss-20"
      | "swiss-50"
      | "swiss-100"
      | "swiss-200"
      | "swiss-1000",
  ) => {
    if (theme === "orange") {
      gradientStart = "#F77F00";
      gradientEnd = "#7209B7";
      denominationColor = "#F77F00";
      qrBorderColor = "#F77F00";
      headerTextColor = "#FFFFFF";
    } else if (theme === "purple") {
      gradientStart = "#7209B7";
      gradientEnd = "#3A0CA3";
      denominationColor = "#7209B7";
      qrBorderColor = "#7209B7";
      headerTextColor = "#E0AAFF";
    } else if (theme === "swiss-10") {
      // 10 CHF - Yellow/Golden
      gradientStart = "#E8C547";
      gradientEnd = "#5C4A1C";
      denominationColor = "#E8C547";
      qrBorderColor = "#E8C547";
      bottomTextColor = "#4A3D19";
      qrBackgroundColor = "#E8C547";
      qrBackgroundGradientEnd = "#AF9435";
      useQrGradient = true;
      disableQrBackground = false;
      qrCodeColor = "#2D2416";
      headerTextColor = "#FFFFFF";
    } else if (theme === "swiss-20") {
      // 20 CHF - Red/Orange
      gradientStart = "#EA6311";
      gradientEnd = "#5D2706";
      denominationColor = "#EA6311";
      qrBorderColor = "#EA6311";
      bottomTextColor = "#3A1804";
      qrBackgroundColor = "#EA6311";
      qrBackgroundGradientEnd = "#B04C0D";
      useQrGradient = true;
      disableQrBackground = false;
      qrCodeColor = "#2D1403";
      headerTextColor = "#FFFFFF";
    } else if (theme === "swiss-50") {
      // 50 CHF - Cyan/Green
      gradientStart = "#44ABC7";
      gradientEnd = "#1B444F";
      denominationColor = "#44ABC7";
      qrBorderColor = "#44ABC7";
      bottomTextColor = "#112A31";
      qrBackgroundColor = "#44ABC7";
      qrBackgroundGradientEnd = "#338095";
      useQrGradient = true;
      disableQrBackground = false;
      qrCodeColor = "#0D1F25";
      headerTextColor = "#FFFFFF";
    } else if (theme === "swiss-100") {
      // 100 CHF - Blue
      gradientStart = "#4A9AC9";
      gradientEnd = "#1C3D52";
      denominationColor = "#4A9AC9";
      qrBorderColor = "#4A9AC9";
      bottomTextColor = "#14293A";
      qrBackgroundColor = "#4A9AC9";
      qrBackgroundGradientEnd = "#3874A0";
      useQrGradient = true;
      disableQrBackground = false;
      qrCodeColor = "#0F1F2C";
      headerTextColor = "#FFFFFF";
    } else if (theme === "swiss-200") {
      // 200 CHF - Brown/Tan
      gradientStart = "#B58F5B";
      gradientEnd = "#483924";
      denominationColor = "#B58F5B";
      qrBorderColor = "#B58F5B";
      bottomTextColor = "#2D2316";
      qrBackgroundColor = "#B58F5B";
      qrBackgroundGradientEnd = "#896C45";
      useQrGradient = true;
      disableQrBackground = false;
      qrCodeColor = "#221A11";
      headerTextColor = "#FFFFFF";
    } else if (theme === "swiss-1000") {
      // 1000 CHF - Purple
      gradientStart = "#8B6BA8";
      gradientEnd = "#372A44";
      denominationColor = "#8B6BA8";
      qrBorderColor = "#8B6BA8";
      bottomTextColor = "#281F33";
      qrBackgroundColor = "#8B6BA8";
      qrBackgroundGradientEnd = "#69507E";
      useQrGradient = true;
      disableQrBackground = false;
      qrCodeColor = "#1C1624";
      headerTextColor = "#FFFFFF";
    }
  };

  const getBrandURL = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      brandLogoURL = URL.createObjectURL(target.files[0]);
    }
  };

  const getCornerURL = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      cornerBrandLogoURL = URL.createObjectURL(target.files[0]);
    }
  };

  const downloadQRs = async () => {
    const zip = new JSZip();

    $preparedTokens.forEach((token, index) => {
      let svg = encodeQR(getEncodedTokenV4(token), "svg");

      const svgStartIndex = svg.indexOf("<svg");
      if (svgStartIndex !== -1) {
        const contentStartIndex = svg.indexOf(">", svgStartIndex) + 1;
        if (contentStartIndex !== 0) {
          const viewBoxMatch = svg.match(/viewBox="([^"]+)"/);
          let width = 100;
          let height = 100;

          if (viewBoxMatch && viewBoxMatch[1]) {
            const viewBoxValues = viewBoxMatch[1].split(" ");
            if (viewBoxValues.length >= 4) {
              width = parseFloat(viewBoxValues[2]);
              height = parseFloat(viewBoxValues[3]);
            }
          }

          const whiteRect = `<rect width="${width}" height="${height}" fill="white"/>`;
          svg =
            svg.slice(0, contentStartIndex) +
            whiteRect +
            svg.slice(contentStartIndex);
        }
      }
      const amount = getAmountForTokenSet(token.proofs);
      const unit = token.unit || "sat";
      zip.file(`${amount}_${unit}_${index + 1}.svg`, svg);
    });

    const zipBlob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cashu_qr_codes.zip";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
</script>

<div class="flex w-full items-center justify-center">
  <div role="tablist" class="tabs tabs-boxed min-w-80">
    <button
      role="tab"
      class="tab"
      class:tab-active={active === "customize"}
      onclick={() => (active = "customize")}>Customize</button
    >
    <button
      role="tab"
      class="tab"
      class:tab-active={active === "print"}
      onclick={() => (active = "print")}>Print</button
    >
    <button
      role="tab"
      class="tab"
      class:tab-active={active === "share"}
      onclick={() => (active = "share")}>Share</button
    >
  </div>
</div>

{#if active === "customize"}
  <div class="flex flex-col gap-2 items-center w-full">
    <div class="flex gap-2">
      <button
        onclick={() => (selectedTemplate = "comic")}
        class="w-32 p-2 border-2 rounded-md {selectedTemplate === 'comic'
          ? 'border-primary'
          : 'border-base-300'}"
      >
        <ComicNote
          {design}
          denomination={getAmountForTokenSet($preparedTokens[0]?.proofs ?? [])}
          mintUrl={$wallet?.mint.mintUrl}
          token={"blabla"}
          unit={$preparedTokens[0]?.unit ?? "sat"}
        />
      </button>
      <button
        onclick={() => (selectedTemplate = "custom")}
        class="w-32 p-2 border-2 rounded-md {selectedTemplate === 'custom'
          ? 'border-primary'
          : 'border-base-300'}"
      >
        <CustomNote
          {brandLogoURL}
          {colorCode}
          {cornerBrandLogoURL}
          denomination={getAmountForTokenSet($preparedTokens[0]?.proofs ?? [])}
          mintUrl={$wallet?.mint.mintUrl}
          token={"blabla"}
          unit={$preparedTokens[0]?.unit ?? "sat"}
        />
      </button>
      <button
        onclick={() => (selectedTemplate = "mountainlake")}
        class="w-32 p-2 border-2 rounded-md {selectedTemplate === 'mountainlake'
          ? 'border-primary'
          : 'border-base-300'}"
      >
        <MountainlakeNote
          denomination={getAmountForTokenSet($preparedTokens[0]?.proofs ?? [])}
          mintUrl={$wallet?.mint.mintUrl ?? "mint.mountainlake.io"}
          token={"blabla"}
          unit={$preparedTokens[0]?.unit ?? "sat"}
          {topLeftIcon}
          {customLogoUrl}
          {headerText}
          {headerTextColor}
          {gradientStart}
          {gradientEnd}
          {gradientAngle}
          {qrBackgroundColor}
          {qrBackgroundGradientEnd}
          {useQrGradient}
          {qrBorderColor}
          {disableQrBackground}
          {disableQrBorder}
          {qrCodeColor}
          {denominationColor}
          {bottomBoxColor}
          {bottomBoxGradientEnd}
          {useDenomGradient}
          {disableDenomBackground}
          {bottomTextColor}
          {customBottomText}
        />
      </button>
    </div>

    <div class="flex flex-col gap-2">
      {#if selectedTemplate === "comic"}
        <p class="my-2">
          Comic nuts by <a
            href="https://njump.me/npub1gwa27rpgum8mr9d30msg8cv7kwj2lhav2nvmdwh3wqnsa5vnudxqlta2sz"
            class="link link-primary"
            target="_blank">@BitPopart</a
          >
        </p>
        <label for="design-range" class="label">Designs</label>
        <input
          id="design-range"
          type="range"
          min="3"
          max="25"
          bind:value={design}
          class="range range-primary"
        />
        <ComicNote
          {design}
          denomination={getAmountForTokenSet($preparedTokens[0]?.proofs ?? [])}
          mintUrl={$wallet?.mint.mintUrl}
          token={"blabla"}
          unit={$preparedTokens[0]?.unit ?? "sat"}
        />
      {:else if selectedTemplate === "custom"}
        <p class="my-2">
          Custom note by <a
            href="https://njump.me/npub1cj6ndx5akfazux7f0vjl4fyx9k0ulf682p437fe03a9ndwqjm0tqj886t6"
            class="link link-primary"
            target="_blank">@gandlaf21</a
          >
        </p>
        <div class="flex gap-2 flex-col">
          <label for="color-selector" class="label">Select Color:</label>
          <input id="color-selector" type="color" bind:value={colorCode} />
          <label for="brand-image" class="label">Brand Image:</label>
          <input
            id="brand-image"
            type="file"
            class="file-input file-input-bordered"
            accept="image/*"
            oninput={getBrandURL}
            bind:this={brandInput}
          />
          <label for="corner-image" class="label">Corner Image:</label>
          <input
            id="corner-image"
            type="file"
            class="file-input file-input-bordered"
            accept="image/*"
            oninput={getCornerURL}
            bind:this={cornerInput}
          />
        </div>
        <CustomNote
          {brandLogoURL}
          {colorCode}
          {cornerBrandLogoURL}
          denomination={getAmountForTokenSet($preparedTokens[0]?.proofs ?? [])}
          mintUrl={$wallet?.mint.mintUrl}
          token={"blabla"}
          unit={$preparedTokens[0]?.unit ?? "sat"}
        />
      {:else if selectedTemplate === "mountainlake"}
        <div class="flex flex-col gap-4 max-w-2xl mx-auto">
          <h2 class="text-xl font-bold">Mountainlake Cashu Note Designer</h2>

          <!-- Theme Presets -->
          <div>
            <label class="label font-semibold">Quick Themes</label>
            <div class="grid grid-cols-2 gap-2 mb-2">
              <button
                class="btn btn-sm btn-primary"
                onclick={() => applyTheme("orange")}
              >
                🟠 Orange Sunset
              </button>
              <button
                class="btn btn-sm btn-secondary"
                onclick={() => applyTheme("purple")}
              >
                🟣 Purple Haze
              </button>
            </div>
            <div class="divider text-xs">
              Swiss Franc Banknote Themes (9th Series)
            </div>
            <div class="grid grid-cols-3 gap-1 text-xs">
              <button
                class="btn btn-sm bg-yellow-500 hover:bg-yellow-600 text-white"
                onclick={() => applyTheme("swiss-10")}
              >
                🟡 10 CHF
              </button>
              <button
                class="btn btn-sm bg-red-600 hover:bg-red-700 text-white"
                onclick={() => applyTheme("swiss-20")}
              >
                🔴 20 CHF
              </button>
              <button
                class="btn btn-sm bg-green-500 hover:bg-green-600 text-white"
                onclick={() => applyTheme("swiss-50")}
              >
                🟢 50 CHF
              </button>
              <button
                class="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white"
                onclick={() => applyTheme("swiss-100")}
              >
                🔵 100 CHF
              </button>
              <button
                class="btn btn-sm bg-amber-700 hover:bg-amber-800 text-white"
                onclick={() => applyTheme("swiss-200")}
              >
                🟤 200 CHF
              </button>
              <button
                class="btn btn-sm bg-purple-700 hover:bg-purple-800 text-white"
                onclick={() => applyTheme("swiss-1000")}
              >
                🟣 1000 CHF
              </button>
            </div>
          </div>

          <div class="divider"></div>

          <!-- Top Left Logo -->
          <div>
            <label for="logo-upload" class="label font-semibold"
              >Top Left Logo</label
            >
            <div class="flex gap-2 mb-2">
              <button
                class="btn btn-sm"
                class:btn-active={topLeftIcon === "cashu"}
                onclick={() => (topLeftIcon = "cashu")}
              >
                Cashu
              </button>
              <button
                class="btn btn-sm"
                class:btn-active={topLeftIcon === "bitcoin"}
                onclick={() => (topLeftIcon = "bitcoin")}
              >
                Bitcoin
              </button>
              <button
                class="btn btn-sm"
                class:btn-active={topLeftIcon === "sats"}
                onclick={() => (topLeftIcon = "sats")}
              >
                Sats
              </button>
            </div>
            <input
              id="logo-upload"
              type="file"
              class="file-input file-input-bordered w-full"
              accept="image/*"
              oninput={handleLogoUpload}
              bind:this={logoInput}
            />
            <p class="text-xs text-gray-500 mt-1">
              Upload custom logo (35×35px recommended)
            </p>
          </div>

          <!-- Header Text -->
          <div>
            <label for="header-text" class="label font-semibold"
              >Header Text (Top Right, max 3 lines)</label
            >
            <textarea
              id="header-text"
              class="textarea textarea-bordered w-full"
              rows="3"
              bind:value={headerText}
              placeholder="Line 1\nLine 2\nLine 3"
            ></textarea>
            <div class="flex gap-2 mt-2 items-center">
              <label for="header-color" class="text-sm">Color:</label>
              <input
                id="header-color"
                type="color"
                bind:value={headerTextColor}
                class="w-16 h-8"
              />
            </div>
          </div>

          <!-- Background Gradient -->
          <div>
            <label class="label font-semibold">Background Gradient</label>
            <div class="flex gap-2 items-center flex-wrap">
              <input
                id="gradient-start"
                type="color"
                bind:value={gradientStart}
                class="w-16 h-10"
              />
              <span>→</span>
              <input
                id="gradient-end"
                type="color"
                bind:value={gradientEnd}
                class="w-16 h-10"
              />
              <label for="gradient-angle" class="text-sm ml-4">Angle:</label>
              <input
                id="gradient-angle"
                type="range"
                min="0"
                max="360"
                bind:value={gradientAngle}
                class="range range-sm w-32"
              />
              <span class="text-xs">{gradientAngle}°</span>
            </div>
          </div>

          <!-- QR Code Styling -->
          <div>
            <label class="label font-semibold">QR Code Area</label>

            <!-- Main Toggles -->
            <div class="flex items-center gap-3 mb-2">
              <input
                id="qr-enable-bg-check"
                type="checkbox"
                checked={!disableQrBackground}
                onchange={() => (disableQrBackground = !disableQrBackground)}
                class="checkbox"
              />
              <label for="qr-enable-bg-check" class="text-sm"
                >Enable Background</label
              >
            </div>

            <!-- Background Options (only show if background is enabled) -->
            {#if !disableQrBackground}
              <div class="ml-4 border-l-2 border-gray-300 pl-4">
                <div class="flex items-center gap-3 mb-2">
                  <input
                    id="qr-gradient-check"
                    type="checkbox"
                    bind:checked={useQrGradient}
                    class="checkbox"
                  />
                  <label for="qr-gradient-check" class="text-sm"
                    >Enable Gradient Background</label
                  >
                </div>
                <div class="flex gap-2 items-center mb-2">
                  <label for="qr-bg-color" class="text-sm"
                    >Background Color:</label
                  >
                  <input
                    id="qr-bg-color"
                    type="color"
                    bind:value={qrBackgroundColor}
                    class="w-16 h-10"
                  />
                  {#if useQrGradient}
                    <span>→</span>
                    <input
                      id="qr-bg-gradient-end"
                      type="color"
                      bind:value={qrBackgroundGradientEnd}
                      class="w-16 h-10"
                    />
                  {/if}
                </div>

                <!-- Border Options (only show if background is enabled) -->
                <div class="flex items-center gap-3 mb-2">
                  <input
                    id="qr-enable-border-check"
                    type="checkbox"
                    checked={!disableQrBorder}
                    onchange={() => (disableQrBorder = !disableQrBorder)}
                    class="checkbox"
                  />
                  <label for="qr-enable-border-check" class="text-sm"
                    >Enable Border</label
                  >
                </div>
                {#if !disableQrBorder}
                  <div class="flex gap-2 items-center mb-2">
                    <label for="qr-border-color" class="text-sm"
                      >Border Color:</label
                    >
                    <input
                      id="qr-border-color"
                      type="color"
                      bind:value={qrBorderColor}
                      class="w-16 h-10"
                    />
                  </div>
                {/if}
              </div>
            {/if}

            <!-- QR Code Color -->
            <div class="flex gap-2 items-center mt-2">
              <label for="qr-code-color" class="text-sm">QR Code Color:</label>
              <input
                id="qr-code-color"
                type="color"
                bind:value={qrCodeColor}
                class="w-16 h-10"
              />
            </div>
          </div>

          <!-- Denomination Styling -->
          <div>
            <label class="label font-semibold">Denomination Display</label>

            <!-- Denomination Color -->
            <div class="flex gap-2 items-center mb-4">
              <label for="denomination-color" class="text-sm"
                >Denomination Color:</label
              >
              <input
                id="denomination-color"
                type="color"
                bind:value={denominationColor}
                class="w-16 h-10"
              />
            </div>

            <!-- Background Options -->
            <div class="flex items-center gap-3 mb-2">
              <input
                id="denom-enable-bg-check"
                type="checkbox"
                checked={!disableDenomBackground}
                onchange={() =>
                  (disableDenomBackground = !disableDenomBackground)}
                class="checkbox"
              />
              <label for="denom-enable-bg-check" class="text-sm"
                >Enable Background</label
              >
            </div>

            {#if !disableDenomBackground}
              <div class="ml-4 border-l-2 border-gray-300 pl-4 mb-4">
                <div class="flex items-center gap-3 mb-2">
                  <input
                    id="denom-gradient-check"
                    type="checkbox"
                    bind:checked={useDenomGradient}
                    class="checkbox"
                  />
                  <label for="denom-gradient-check" class="text-sm"
                    >Enable Gradient Background</label
                  >
                </div>
                <div class="flex gap-2 items-center mb-2">
                  <label for="bottom-bg-color" class="text-sm"
                    >Background Color:</label
                  >
                  <input
                    id="bottom-bg-color"
                    type="color"
                    bind:value={bottomBoxColor}
                    class="w-16 h-10"
                  />
                  {#if useDenomGradient}
                    <span>→</span>
                    <input
                      id="bottom-bg-gradient-end"
                      type="color"
                      bind:value={bottomBoxGradientEnd}
                      class="w-16 h-10"
                    />
                  {/if}
                </div>
              </div>
            {/if}

            <!-- Text Color -->
            <div class="flex gap-2 items-center">
              <label for="bottom-text-color" class="text-sm">Text Color:</label>
              <input
                id="bottom-text-color"
                type="color"
                bind:value={bottomTextColor}
                class="w-16 h-10"
              />
            </div>
          </div>

          <!-- Bottom Text -->
          <div>
            <label for="bottom-text" class="label font-semibold"
              >Bottom Text</label
            >
            <textarea
              id="bottom-text"
              class="textarea textarea-bordered w-full"
              rows="2"
              bind:value={customBottomText}
              placeholder="Enter custom text or leave as is for default"
            ></textarea>
          </div>

          <div class="divider"></div>

          <!-- Preview -->
          <div class="bg-base-200 p-6 rounded-lg">
            <h3 class="font-bold mb-4 text-center">Live Preview</h3>
            <div class="max-w-xs mx-auto">
              <MountainlakeNote
                denomination={getAmountForTokenSet(
                  $preparedTokens[0]?.proofs ?? [],
                )}
                mintUrl={$wallet?.mint.mintUrl ?? "mint.mountainlake.io"}
                token={"blabla"}
                unit={$preparedTokens[0]?.unit ?? "sat"}
                {topLeftIcon}
                {customLogoUrl}
                {headerText}
                {headerTextColor}
                {gradientStart}
                {gradientEnd}
                {gradientAngle}
                {qrBackgroundColor}
                {qrBackgroundGradientEnd}
                {useQrGradient}
                {qrBorderColor}
                {disableQrBackground}
                {disableQrBorder}
                {qrCodeColor}
                {denominationColor}
                {bottomBoxColor}
                {bottomBoxGradientEnd}
                {useDenomGradient}
                {disableDenomBackground}
                {bottomTextColor}
                {customBottomText}
              />
            </div>
          </div>
        </div>
      {/if}
    </div>

    <h2 class="font-bold text-lg text-center">Notes are ready to be printed</h2>
    <div class="flex flex-col gap-2">
      <button class="btn btn-primary" onclick={() => (active = "print")}>
        Print now! BRRRRRRRRRR
      </button>
      <button class="btn btn-outline btn-secondary" onclick={downloadQRs}>
        Download QR codes only
      </button>
      <button class="btn btn-secondary" onclick={() => (active = "share")}>
        Share via nostr
      </button>
    </div>

    <div class="flex flex-col gap-1 items-center pt-10">
      <span class="font-bold badge badge-success gap-2">
        {$selectedNumberOfNotes}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
          />
        </svg>
      </span>
    </div>
  </div>
{:else if active === "print"}
  <div>
    <button class="btn btn-primary" onclick={() => window.print()}>
      Print
    </button>
    <p class="font-bold">Press ctrl+P to print</p>
  </div>
  <div class="bg-white z-10 w-full">
    {#each $preparedTokens as token}
      {#if selectedTemplate === "comic"}
        <ComicNote
          {design}
          denomination={getAmountForTokenSet(token.proofs)}
          mintUrl={token.mint}
          token={getEncodedTokenV4(token)}
          unit={$wallet?.unit}
        />
      {:else if selectedTemplate === "custom"}
        <CustomNote
          {brandLogoURL}
          {colorCode}
          {cornerBrandLogoURL}
          denomination={getAmountForTokenSet(token.proofs)}
          mintUrl={token.mint}
          token={getEncodedTokenV4(token)}
          unit={$wallet?.unit}
        />
      {:else if selectedTemplate === "mountainlake"}
        <MountainlakeNote
          denomination={getAmountForTokenSet(token.proofs)}
          mintUrl={token.mint}
          token={getEncodedTokenV4(token)}
          unit={$wallet?.unit}
          {topLeftIcon}
          {customLogoUrl}
          {headerText}
          {headerTextColor}
          {gradientStart}
          {gradientEnd}
          {gradientAngle}
          {qrBackgroundColor}
          {qrBackgroundGradientEnd}
          {useQrGradient}
          {qrBorderColor}
          {disableQrBackground}
          {disableQrBorder}
          {qrCodeColor}
          {denominationColor}
          {bottomBoxColor}
          {bottomBoxGradientEnd}
          {useDenomGradient}
          {disableDenomBackground}
          {bottomTextColor}
          {customBottomText}
        />
      {/if}
    {/each}
  </div>
{:else if active === "share"}
  <ShareViaNostr></ShareViaNostr>
{/if}
