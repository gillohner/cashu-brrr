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

  type ActiveTab = 'customize' | 'print' | 'share';
  type TemplateType = 'comic' | 'custom' | 'mountainlake';

  // Active tab state
  let active = $state<ActiveTab>('customize');

  // Comic note design selection (3-25)
  let design = $state(3);

  // Selected template type
  let selectedTemplate = $state<TemplateType>("comic");

  // Custom note configuration
  let colorCode = $state("#5db075");
  let brandLogoURL = $state("");
  let cornerBrandLogoURL = $state("");

  // Mountainlake note configuration
  let topLeftIcon = $state<"cashu" | "bitcoin" | "sats" | "custom">("cashu");
  let customLogoUrl = $state("");
  let headerText = $state("Cashu Token\nRedeemable with Cashu\nWallet of choice");
  let headerTextColor = $state("#FFFFFF");
  let gradientStart = $state("#F77F00");
  let gradientEnd = $state("#7209B7");
  let qrBackgroundColor = $state("#FFFFFF");
  let qrBorderColor = $state("#F77F00");
  let denominationColor = $state("#F77F00");
  let bottomBoxColor = $state("#FFFFFF");
  let bottomTextColor = $state("#666666");
  let customBottomText = $state("");

  /**
   * Handle brand logo file upload
   */
  const getBrandURL = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      brandLogoURL = URL.createObjectURL(target.files[0]);
    }
  };

  /**
   * Handle corner logo file upload
   */
  const getCornerURL = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      cornerBrandLogoURL = URL.createObjectURL(target.files[0]);
    }
  };

  /**
   * Download all QR codes as a ZIP file
   * Generates individual SVG files for each token
   */
  const downloadQRs = async () => {
    const zip = new JSZip();
    
    // Generate QR code for each token
    $preparedTokens.forEach((token, index) => {
      let svg = encodeQR(getEncodedTokenV4(token), "svg");
      
      // Add white background to QR code SVG
      const svgStartIndex = svg.indexOf("<svg");
      if (svgStartIndex !== -1) {
        const contentStartIndex = svg.indexOf(">", svgStartIndex) + 1;
        if (contentStartIndex !== 0) {
          // Extract dimensions from viewBox
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
          
          // Insert white background rectangle
          const whiteRect = `<rect width="${width}" height="${height}" fill="white"/>`;
          svg = svg.slice(0, contentStartIndex) + whiteRect + svg.slice(contentStartIndex);
        }
      }
      
      // Create descriptive filename
      const amount = getAmountForTokenSet(token.proofs);
      const unit = token.unit || 'sat';
      zip.file(`${amount}_${unit}_${index + 1}.svg`, svg);
    });
    
    // Generate and download ZIP file
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
<!-- Tab Navigation -->
<div class="flex w-full items-center justify-center">
  <div role="tablist" class="tabs tabs-boxed min-w-80">
    <button role="tab" class="tab" class:tab-active={active === 'customize'} onclick={()=> active = 'customize'}>Customize</button>
    <button role="tab" class="tab" class:tab-active={active === 'print'} onclick={()=> active = 'print'}>Print</button>
    <button role="tab" class="tab" class:tab-active={active === 'share'} onclick={()=> active = 'share'}>Share</button>
  </div>
</div>

{#if active === 'customize'}
  <div class="flex flex-col gap-4 items-center w-full max-w-4xl mx-auto">
    <!-- Template Selection -->
    <div>
      <h3 class="text-sm font-semibold mb-2 text-center">Choose Design Template</h3>
      <div class="flex gap-3 flex-wrap justify-center">
        <button 
          onclick={()=> selectedTemplate="comic"} 
          class="w-28 p-1.5 border-2 rounded-lg transition-all {selectedTemplate==="comic"?"border-primary shadow-lg":"border-base-300 hover:border-base-400"}"
          title="Comic design by @BitPopart"
        >
          <div class="text-xs font-medium mb-1">Comic</div>
          <ComicNote
            {design}
            denomination={getAmountForTokenSet($preparedTokens[0]?.proofs??[])}
            mintUrl={$wallet?.mint.mintUrl}
            token={"blabla"}
            unit={$preparedTokens[0]?.unit??'sat'}
          />
        </button>
        <button 
          onclick={()=> selectedTemplate="custom"} 
          class="w-28 p-1.5 border-2 rounded-lg transition-all {selectedTemplate==="custom"?"border-primary shadow-lg":"border-base-300 hover:border-base-400"}"
          title="Custom design by @gandlaf21"
        >
          <div class="text-xs font-medium mb-1">Custom</div>
          <CustomNote 
            {brandLogoURL}
            {colorCode}
            {cornerBrandLogoURL}
            denomination={getAmountForTokenSet($preparedTokens[0]?.proofs??[])}
            mintUrl={$wallet?.mint.mintUrl}
            token={"blabla"}
            unit={$preparedTokens[0]?.unit??'sat'}
          />
        </button>
        <button 
          onclick={()=> selectedTemplate="mountainlake"} 
          class="w-28 p-1.5 border-2 rounded-lg transition-all {selectedTemplate==="mountainlake"?"border-primary shadow-lg":"border-base-300 hover:border-base-400"}"
          title="Fully customizable Mountainlake design"
        >
          <div class="text-xs font-medium mb-1">Mountainlake</div>
          <MountainlakeNote 
            denomination={getAmountForTokenSet($preparedTokens[0]?.proofs??[])}
            mintUrl={$wallet?.mint.mintUrl}
            token={"blabla"}
            {topLeftIcon}
            {customLogoUrl}
            {headerText}
            {headerTextColor}
            {gradientStart}
            {gradientEnd}
            {qrBackgroundColor}
            {qrBorderColor}
            {denominationColor}
            {bottomBoxColor}
            {bottomTextColor}
            {customBottomText}
          />
        </button>
      </div>
    </div>
    <!-- Template Customization -->
    <div class="w-full max-w-2xl">
      {#if selectedTemplate === 'comic'}
        <div class="bg-base-200 rounded-lg p-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold">Comic Design</h3>
            <a href="https://njump.me/npub1gwa27rpgum8mr9d30msg8cv7kwj2lhav2nvmdwh3wqnsa5vnudxqlta2sz" class="link link-primary text-xs" target="_blank">by @BitPopart</a>
          </div>
          
          <label class="form-control w-full">
            <div class="label pb-1">
              <span class="label-text text-sm">Design Variation</span>
              <span class="label-text-alt badge badge-sm">{design}</span>
            </div>
            <input
              type="range"
              min="3"
              max="25"
              bind:value={design}
              class="range range-primary range-sm"
            />
          </label>
        </div>

        <div class="mt-4 flex justify-center">
          <ComicNote
            {design}
            denomination={getAmountForTokenSet($preparedTokens[0]?.proofs??[])}
            mintUrl={$wallet?.mint.mintUrl}
            token={"blabla"}
            unit={$preparedTokens[0]?.unit??'sat'}
          />
        </div>
        
      {:else if selectedTemplate === "custom"}
        <div class="bg-base-200 rounded-lg p-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold">Custom Design</h3>
            <a href="https://njump.me/npub1cj6ndx5akfazux7f0vjl4fyx9k0ulf682p437fe03a9ndwqjm0tqj886t6" class="link link-primary text-xs" target="_blank">by @gandlaf21</a>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label class="form-control">
              <div class="label pb-1">
                <span class="label-text text-sm">Brand Color</span>
              </div>
              <input type="color" bind:value={colorCode} class="w-full h-10 rounded cursor-pointer" />
            </label>
            
            <label class="form-control md:col-span-2">
              <div class="label pb-1">
                <span class="label-text text-sm">Brand Logo</span>
                <span class="label-text-alt text-xs opacity-60">Main center logo</span>
              </div>
              <input
                type="file"
                class="file-input file-input-bordered file-input-sm"
                accept="image/*"
                oninput={getBrandURL}
              />
            </label>
            
            <label class="form-control md:col-span-2">
              <div class="label pb-1">
                <span class="label-text text-sm">Corner Logo</span>
                <span class="label-text-alt text-xs opacity-60">Small corner decoration</span>
              </div>
              <input
                type="file"
                class="file-input file-input-bordered file-input-sm"
                accept="image/*"
                oninput={getCornerURL}
              />
            </label>
          </div>
        </div>

        <div class="mt-4 flex justify-center">
          <CustomNote
            {brandLogoURL}
            {colorCode}
            {cornerBrandLogoURL}
            denomination={getAmountForTokenSet($preparedTokens[0]?.proofs??[])}
            mintUrl={$wallet?.mint.mintUrl}
            token={"blabla"}
            unit={$preparedTokens[0]?.unit??'sat'}
          />
        </div>

      {:else if selectedTemplate === "mountainlake"}
        <div class="bg-base-200 rounded-lg p-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold">Mountainlake Design</h3>
            <span class="badge badge-sm badge-info">Fully Customizable</span>
          </div>
          
          <div class="space-y-4">
            <!-- Background Gradient -->
            <div>
              <h4 class="text-sm font-medium mb-2">Background Colors</h4>
              <div class="grid grid-cols-2 gap-3">
                <label class="form-control">
                  <div class="label pb-1">
                    <span class="label-text text-xs">Gradient Start</span>
                  </div>
                  <input type="color" bind:value={gradientStart} class="w-full h-10 rounded cursor-pointer" />
                </label>
                <label class="form-control">
                  <div class="label pb-1">
                    <span class="label-text text-xs">Gradient End</span>
                  </div>
                  <input type="color" bind:value={gradientEnd} class="w-full h-10 rounded cursor-pointer" />
                </label>
              </div>
            </div>

            <!-- QR Code Styling -->
            <div>
              <h4 class="text-sm font-medium mb-2">QR Code Colors</h4>
              <div class="grid grid-cols-2 gap-3">
                <label class="form-control">
                  <div class="label pb-1">
                    <span class="label-text text-xs">Background</span>
                  </div>
                  <input type="color" bind:value={qrBackgroundColor} class="w-full h-10 rounded cursor-pointer" />
                </label>
                <label class="form-control">
                  <div class="label pb-1">
                    <span class="label-text text-xs">Border</span>
                  </div>
                  <input type="color" bind:value={qrBorderColor} class="w-full h-10 rounded cursor-pointer" />
                </label>
              </div>
            </div>

            <!-- Text Content -->
            <div>
              <h4 class="text-sm font-medium mb-2">Text Content</h4>
              <div class="space-y-3">
                <label class="form-control">
                  <div class="label pb-1">
                    <span class="label-text text-xs">Header Text</span>
                    <span class="label-text-alt text-xs opacity-60">3 lines</span>
                  </div>
                  <textarea
                    bind:value={headerText}
                    class="textarea textarea-bordered textarea-sm"
                    rows="3"
                    placeholder="Line 1&#10;Line 2&#10;Line 3"
                  ></textarea>
                </label>

                <label class="form-control">
                  <div class="label pb-1">
                    <span class="label-text text-xs">Bottom Text</span>
                    <span class="label-text-alt text-xs opacity-60">Optional</span>
                  </div>
                  <textarea
                    bind:value={customBottomText}
                    class="textarea textarea-bordered textarea-sm"
                    rows="2"
                    placeholder="Custom message"
                  ></textarea>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-4 flex justify-center">
          <MountainlakeNote 
            denomination={getAmountForTokenSet($preparedTokens[0]?.proofs??[])}
            mintUrl={$wallet?.mint.mintUrl}
            token={"blabla"}
            {topLeftIcon}
            {customLogoUrl}
            {headerText}
            {headerTextColor}
            {gradientStart}
            {gradientEnd}
            {qrBackgroundColor}
            {qrBorderColor}
            {denominationColor}
            {bottomBoxColor}
            {bottomTextColor}
            {customBottomText}
          />
        </div>
      {/if}
    </div>

    <!-- Action Buttons -->
    <div class="w-full max-w-md mt-6">
      <div class="flex items-center gap-2 justify-center mb-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5 text-success"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
        <h2 class="font-semibold">Ready to Print</h2>
        <span class="badge badge-success badge-sm">{$selectedNumberOfNotes} notes</span>
      </div>
      
      <div class="flex flex-col gap-2">
        <button class="btn btn-primary btn-sm" onclick={() => (active = 'print')}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" />
          </svg>
          Print Now! BRRRRRR
        </button>
        <button class="btn btn-outline btn-secondary btn-sm" onclick={downloadQRs}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Download QR Codes ZIP
        </button>
        <button class="btn btn-outline btn-info btn-sm" onclick={() => (active ='share')}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
          </svg>
          Share via Nostr
        </button>
      </div>
    </div>
  </div>
{:else if active === 'print'}
  <div class="flex flex-col items-center gap-3 mb-4">
    <button class="btn btn-primary btn-sm" onclick={()=> window.print()}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" />
      </svg>
      Print
    </button>
    <p class="text-sm opacity-70">Press <kbd class="kbd kbd-sm">Ctrl</kbd>+<kbd class="kbd kbd-sm">P</kbd> to print</p>
  </div>
  
  <div class="bg-white overflow-x-auto max-w-full flex flex-col items-center">
    {#each $preparedTokens as token}
      {#if selectedTemplate==="comic"}
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
          {topLeftIcon}
          {customLogoUrl}
          {headerText}
          {headerTextColor}
          {gradientStart}
          {gradientEnd}
          {qrBackgroundColor}
          {qrBorderColor}
          {denominationColor}
          {bottomBoxColor}
          {bottomTextColor}
          {customBottomText}
        />
      {/if}
    {/each}
  </div>
    
  {:else if active === 'share'}
      <ShareViaNostr></ShareViaNostr>
  {/if}
