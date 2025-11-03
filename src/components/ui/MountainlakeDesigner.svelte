<script lang="ts">
  interface GradientStop {
    offset: number;
    color: string;
  }

  interface CustomImage {
    id: string;
    url: string;
    x: number;
    y: number;
    opacity: number;
    width: number;
    height: number;
  }

  interface Props {
    // Backside controls
    enableBackside: boolean;
    activeSide: 'front' | 'back';
    
    // Collapsible sections
    bgSectionOpen: boolean;
    topLeftSectionOpen: boolean;
    topRightSectionOpen: boolean;
    qrSectionOpen: boolean;
    bottomSectionOpen: boolean;
    
    // Background
    bgGradientType: 'linear' | 'radial' | 'solid';
    gradientType: 'linear' | 'radial';
    gradientAngle: number;
    gradientStops: GradientStop[];
    radialCenterX: number;
    radialCenterY: number;
    bgSolidColor: string;
    
    // Top Left Icon
    enableTopLeftIcon: boolean;
    topLeftIcon: 'cashu-logo' | 'bitcoin' | 'satoshi-v1' | 'satoshi-v2' | 'satoshi-v3' | 'none' | 'custom';
    customLogoUrl: string;
    topLeftIconColor: string;
    enableIconColorOverride: boolean;
    topLeftIconSize: number;
    topLeftIconX: number;
    topLeftIconY: number;
    topLeftIconOpacity: number;
    
    // Top Right Text
    enableHeaderText: boolean;
    headerText: string;
    headerTextColor: string;
    headerTextX: number;
    headerTextY: number;
    
    // QR Code
    enableQrCode: boolean;
    qrGradientType: 'linear' | 'radial' | 'solid';
    qrGradientAngle: number;
    qrGradientStops: GradientStop[];
    qrBackgroundColor: string;
    qrBorderColor: string;
    qrCodeColor: string;
    disableQrBorder: boolean;
    disableQrBackground: boolean;
    qrX: number;
    qrY: number;
    qrSize: number;
    
    // Bottom
    enableDenomination: boolean;
    denominationColor: string;
    bottomBoxColor: string;
    bottomTextColor: string;
    customBottomText: string;
    denominationX: number;
    denominationY: number;
    
    // Custom Images
    customImages: CustomImage[];
    
    // Guide Text Box
    enableGuideText: boolean;
    guideText: string;
    guideTextColor: string;
    guideBackgroundColor: string;
    guideBorderColor: string;
    disableGuideBorder: boolean;
    disableGuideBackground: boolean;
    guideX: number;
    guideY: number;
    guideWidth: number;
    guideHeight: number;
  }

  let {
    enableBackside = $bindable(),
    activeSide = $bindable(),
    
    bgSectionOpen = $bindable(),
    topLeftSectionOpen = $bindable(),
    topRightSectionOpen = $bindable(),
    qrSectionOpen = $bindable(),
    bottomSectionOpen = $bindable(),
    
    bgGradientType = $bindable(),
    gradientType = $bindable(),
    gradientAngle = $bindable(),
    gradientStops = $bindable(),
    radialCenterX = $bindable(),
    radialCenterY = $bindable(),
    bgSolidColor = $bindable(),
    
    enableTopLeftIcon = $bindable(),
    topLeftIcon = $bindable(),
    customLogoUrl = $bindable(),
    topLeftIconColor = $bindable(),
    enableIconColorOverride = $bindable(),
    topLeftIconSize = $bindable(),
    topLeftIconX = $bindable(),
    topLeftIconY = $bindable(),
    topLeftIconOpacity = $bindable(),
    
    enableHeaderText = $bindable(),
    headerText = $bindable(),
    headerTextColor = $bindable(),
    headerTextX = $bindable(),
    headerTextY = $bindable(),
    
    enableQrCode = $bindable(),
    qrGradientType = $bindable(),
    qrGradientAngle = $bindable(),
    qrGradientStops = $bindable(),
    qrBackgroundColor = $bindable(),
    qrBorderColor = $bindable(),
    qrCodeColor = $bindable(),
    disableQrBorder = $bindable(),
    disableQrBackground = $bindable(),
    qrX = $bindable(),
    qrY = $bindable(),
    qrSize = $bindable(),
    
    enableDenomination = $bindable(),
    denominationColor = $bindable(),
    bottomBoxColor = $bindable(),
    bottomTextColor = $bindable(),
    customBottomText = $bindable(),
    denominationX = $bindable(),
    denominationY = $bindable(),
    
    customImages = $bindable(),
    
    enableGuideText = $bindable(),
    guideText = $bindable(),
    guideTextColor = $bindable(),
    guideBackgroundColor = $bindable(),
    guideBorderColor = $bindable(),
    disableGuideBorder = $bindable(),
    disableGuideBackground = $bindable(),
    guideX = $bindable(),
    guideY = $bindable(),
    guideWidth = $bindable(),
    guideHeight = $bindable(),
  }: Props = $props();
  
  // These props are needed for two-way binding but not actively used in UI
  void gradientType;
  void radialCenterX;
  void radialCenterY;
</script>

<div class="bg-base-200 rounded-lg p-4 space-y-2">
  <div class="flex items-center justify-between mb-3">
    <h3 class="font-semibold">Mountainlake Design</h3>
    <span class="badge badge-sm badge-info">Fully Customizable</span>
  </div>

  <!-- Enable Backside Toggle -->
  <div class="form-control">
    <label class="label cursor-pointer justify-start gap-3">
      <input 
        type="checkbox" 
        bind:checked={enableBackside}
        class="checkbox checkbox-primary checkbox-sm"
      />
      <span class="label-text font-medium">Enable Backside Design</span>
    </label>
  </div>

  <!-- Front/Back Switcher -->
  {#if enableBackside}
    <div class="flex gap-2 mb-3">
      <button 
        class="btn btn-sm flex-1"
        class:btn-primary={activeSide === 'front'}
        class:btn-outline={activeSide === 'back'}
        onclick={() => activeSide = 'front'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
        </svg>
        Front Side
      </button>
      <button 
        class="btn btn-sm flex-1"
        class:btn-primary={activeSide === 'back'}
        class:btn-outline={activeSide === 'front'}
        onclick={() => activeSide = 'back'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
        Back Side
      </button>
    </div>
    
    <div class="alert alert-info py-2 text-xs mb-2">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      <span>Designing: <strong>{activeSide === 'front' ? 'Front' : 'Back'}</strong> side</span>
    </div>
  {/if}
  
  <!-- Background Section -->
  <div class="collapse collapse-arrow bg-base-100">
    <input type="checkbox" bind:checked={bgSectionOpen} />
    <div class="collapse-title text-sm font-medium">Background</div>
    <div class="collapse-content space-y-3">
      <!-- Type Selector -->
      <div class="flex gap-2">
        <button 
          class="btn btn-sm flex-1"
          class:btn-primary={bgGradientType === 'solid'}
          onclick={() => bgGradientType = 'solid'}
        >
          Solid
        </button>
        <button 
          class="btn btn-sm flex-1"
          class:btn-primary={bgGradientType === 'linear'}
          onclick={() => { bgGradientType = 'linear'; gradientType = 'linear'; }}
        >
          Linear
        </button>
        <button 
          class="btn btn-sm flex-1"
          class:btn-primary={bgGradientType === 'radial'}
          onclick={() => { bgGradientType = 'radial'; gradientType = 'radial'; }}
        >
          Radial
        </button>
      </div>

      {#if bgGradientType === 'solid'}
        <label class="form-control">
          <div class="label pb-1">
            <span class="label-text text-xs">Color</span>
          </div>
          <input 
            type="color" 
            bind:value={bgSolidColor} 
            class="h-10 w-20 rounded cursor-pointer"
          />
        </label>
      {:else}
        {#if bgGradientType === 'linear'}
          <label class="form-control">
            <div class="label pb-1">
              <span class="label-text text-xs">Angle: {gradientAngle}°</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="360" 
              bind:value={gradientAngle} 
              class="range range-sm range-primary"
            />
          </label>
        {/if}

        <div class="space-y-2">
          {#each gradientStops as stop, i}
            <div class="flex gap-2 items-center">
              <input 
                type="color" 
                bind:value={stop.color} 
                class="h-8 w-12 rounded cursor-pointer"
              />
              <input 
                type="range" 
                min="0" 
                max="100" 
                bind:value={stop.offset} 
                class="range range-xs flex-1"
              />
              <span class="text-xs w-10 text-right">{stop.offset}%</span>
              {#if gradientStops.length > 2}
                <button 
                  class="btn btn-xs btn-ghost"
                  onclick={() => {
                    gradientStops = gradientStops.filter((_, idx) => idx !== i);
                  }}
                >
                  ×
                </button>
              {/if}
            </div>
          {/each}
        </div>

        {#if gradientStops.length < 5}
          <button 
            class="btn btn-xs btn-outline w-full"
            onclick={() => {
              const lastStop = gradientStops[gradientStops.length - 1];
              const newOffset = Math.min(lastStop.offset + 20, 100);
              gradientStops = [...gradientStops, { offset: newOffset, color: lastStop.color }];
            }}
          >
            + Add Color
          </button>
        {/if}
      {/if}
    </div>
  </div>

  <!-- Top Left Icon Section -->
  <div class="collapse collapse-arrow bg-base-100">
    <input type="checkbox" bind:checked={topLeftSectionOpen} />
    <div class="collapse-title text-sm font-medium">Top Left Icon</div>
    <div class="collapse-content space-y-2">
      <!-- Enable Toggle -->
      <div class="form-control">
        <label class="label cursor-pointer justify-start gap-2 py-1">
          <input 
            type="checkbox" 
            bind:checked={enableTopLeftIcon}
            class="checkbox checkbox-sm"
          />
          <span class="label-text text-sm font-medium">Show Icon</span>
        </label>
      </div>

      {#if enableTopLeftIcon}
        <select 
          bind:value={topLeftIcon} 
          class="select select-bordered select-sm w-full"
        >
          <option value="cashu-logo">Cashu Logo</option>
          <option value="bitcoin">Bitcoin</option>
          <option value="satoshi-v1">Satoshi v1</option>
          <option value="satoshi-v2">Satoshi v2</option>
          <option value="satoshi-v3">Satoshi v3</option>
          <option value="none">No Icon</option>
          <option value="custom">Custom Upload</option>
        </select>
        
        {#if topLeftIcon === 'custom'}
          <label class="form-control">
            <div class="label pb-1">
              <span class="label-text text-xs">Upload Custom Icon</span>
            </div>
            <input 
              type="file" 
              class="file-input file-input-bordered file-input-sm"
              accept="image/*,.svg"
              oninput={(e) => {
                const target = e.target as HTMLInputElement;
                if (target.files && target.files[0]) {
                  customLogoUrl = URL.createObjectURL(target.files[0]);
                }
              }}
            />
            {#if customLogoUrl}
              <div class="mt-1 text-xs opacity-60">Custom icon loaded</div>
            {/if}
          </label>
        {/if}
        
        {#if topLeftIcon !== 'none'}
          <!-- Color Override -->
          <div class="flex items-center gap-2">
            <label class="label cursor-pointer gap-2 p-0">
              <input 
                type="checkbox" 
                bind:checked={enableIconColorOverride}
                class="checkbox checkbox-sm"
              />
              <span class="label-text text-xs">Override Icon Color</span>
            </label>
          </div>
          
          {#if enableIconColorOverride}
            <label class="form-control">
              <div class="label pb-1">
                <span class="label-text text-xs">Icon Color</span>
              </div>
              <input 
                type="color" 
                bind:value={topLeftIconColor} 
                class="h-10 w-20 rounded cursor-pointer"
              />
            </label>
          {/if}

          <!-- Size Control -->
          <label class="form-control">
            <div class="label pb-1">
              <span class="label-text text-xs">Icon Size: {topLeftIconSize}px</span>
            </div>
            <input 
              type="range" 
              min="20" 
              max="60" 
              bind:value={topLeftIconSize} 
              class="range range-sm range-primary"
            />
          </label>

          <!-- Position Controls -->
          <div class="grid grid-cols-2 gap-2">
            <label class="form-control">
              <div class="label pb-1">
                <span class="label-text text-xs">X Position: {topLeftIconX}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="160" 
                bind:value={topLeftIconX} 
                class="range range-xs range-primary"
              />
            </label>
            
            <label class="form-control">
              <div class="label pb-1">
                <span class="label-text text-xs">Y Position: {topLeftIconY}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="280" 
                bind:value={topLeftIconY} 
                class="range range-xs range-primary"
              />
            </label>
          </div>

          <!-- Opacity Control -->
          <label class="form-control">
            <div class="label pb-1">
              <span class="label-text text-xs">Opacity: {topLeftIconOpacity}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              bind:value={topLeftIconOpacity} 
              class="range range-xs range-primary"
            />
          </label>
        {/if}
      {/if}
    </div>
  </div>

  <!-- Top Right Text Section -->
  <div class="collapse collapse-arrow bg-base-100">
    <input type="checkbox" bind:checked={topRightSectionOpen} />
    <div class="collapse-title text-sm font-medium">Top Right Text</div>
    <div class="collapse-content space-y-3">
      <!-- Enable/Disable Toggle -->
      <label class="label cursor-pointer justify-start gap-3 py-2">
        <input type="checkbox" class="toggle toggle-sm toggle-primary" bind:checked={enableHeaderText} />
        <span class="label-text text-xs font-medium">Show Header Text</span>
      </label>

      {#if enableHeaderText}
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
            <span class="label-text text-xs">Text Color</span>
          </div>
          <input 
            type="color" 
            bind:value={headerTextColor} 
            class="h-10 w-20 rounded cursor-pointer"
          />
        </label>

        <!-- Position X -->
        <label class="form-control">
          <div class="label pb-1">
            <span class="label-text text-xs">Position X</span>
            <span class="label-text-alt text-xs">{headerTextX}px</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="160" 
            bind:value={headerTextX} 
            class="range range-xs range-primary"
          />
        </label>

        <!-- Position Y -->
        <label class="form-control">
          <div class="label pb-1">
            <span class="label-text text-xs">Position Y</span>
            <span class="label-text-alt text-xs">{headerTextY}px</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="280" 
            bind:value={headerTextY} 
            class="range range-xs range-primary"
          />
        </label>
      {/if}
    </div>
  </div>

  <!-- QR Code Section -->
  <div class="collapse collapse-arrow bg-base-100">
    <input type="checkbox" bind:checked={qrSectionOpen} />
    <div class="collapse-title text-sm font-medium">QR Code</div>
    <div class="collapse-content space-y-3">
      <!-- Enable/Disable Toggle -->
      <label class="label cursor-pointer justify-start gap-3 py-2">
        <input type="checkbox" class="toggle toggle-sm toggle-primary" bind:checked={enableQrCode} />
        <span class="label-text text-xs font-medium">Show QR Code</span>
      </label>

      {#if enableQrCode}
        <!-- Position X -->
        <label class="form-control">
          <div class="label pb-1">
            <span class="label-text text-xs">Position X</span>
            <span class="label-text-alt text-xs">{qrX}px</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="160" 
            bind:value={qrX} 
            class="range range-xs range-primary"
          />
        </label>

        <!-- Position Y -->
        <label class="form-control">
          <div class="label pb-1">
            <span class="label-text text-xs">Position Y</span>
            <span class="label-text-alt text-xs">{qrY}px</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="280" 
            bind:value={qrY} 
            class="range range-xs range-primary"
          />
        </label>

        <!-- QR Size -->
        <label class="form-control">
          <div class="label pb-1">
            <span class="label-text text-xs">QR Size</span>
            <span class="label-text-alt text-xs">{qrSize}px</span>
          </div>
          <input 
            type="range" 
            min="40" 
            max="120" 
            bind:value={qrSize} 
            class="range range-xs range-primary"
          />
        </label>

        <!-- QR Code Color -->
        <label class="form-control">
          <div class="label pb-1">
            <span class="label-text text-xs">QR Code Color</span>
          </div>
          <input 
            type="color" 
            bind:value={qrCodeColor} 
            class="h-10 w-20 rounded cursor-pointer"
          />
        </label>

        <!-- Border Toggle and Color -->
        <div class="flex gap-3 items-end">
          <label class="form-control" class:opacity-50={disableQrBorder}>
            <div class="label pb-1">
              <span class="label-text text-xs">Border Color</span>
            </div>
            <input 
              type="color" 
              bind:value={qrBorderColor} 
              disabled={disableQrBorder}
              class="h-10 w-20 rounded cursor-pointer"
            />
          </label>
          <label class="label cursor-pointer gap-2">
            <input 
              type="checkbox" 
              bind:checked={disableQrBorder}
              class="checkbox checkbox-sm"
            />
            <span class="label-text text-xs">Disable</span>
          </label>
        </div>

        <!-- Background Type -->
        <div>
          <div class="label pb-1">
            <span class="label-text text-xs">Background</span>
          </div>
          <div class="flex gap-2 mb-3">
            <button 
              class="btn btn-sm flex-1"
              class:btn-primary={qrGradientType === 'solid'}
              onclick={() => qrGradientType = 'solid'}
              disabled={disableQrBackground}
            >
              Solid
            </button>
            <button 
              class="btn btn-sm flex-1"
              class:btn-primary={qrGradientType === 'linear'}
              onclick={() => qrGradientType = 'linear'}
              disabled={disableQrBackground}
            >
              Linear
            </button>
            <button 
              class="btn btn-sm flex-1"
              class:btn-primary={qrGradientType === 'radial'}
              onclick={() => qrGradientType = 'radial'}
              disabled={disableQrBackground}
            >
              Radial
            </button>
          </div>

          <label class="label cursor-pointer gap-2 mb-2">
            <span class="label-text text-xs">Disable Background</span>
            <input 
              type="checkbox" 
              bind:checked={disableQrBackground}
              class="checkbox checkbox-sm"
            />
          </label>

          {#if !disableQrBackground}
            {#if qrGradientType === 'solid'}
              <input 
                type="color" 
                bind:value={qrBackgroundColor} 
                class="h-10 w-20 rounded cursor-pointer"
              />
            {:else}
              {#if qrGradientType === 'linear'}
                <label class="form-control mb-2">
                  <div class="label pb-1">
                    <span class="label-text text-xs">Angle: {qrGradientAngle}°</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="360" 
                    bind:value={qrGradientAngle} 
                    class="range range-sm range-primary"
                  />
                </label>
              {/if}

              <div class="space-y-2">
                {#each qrGradientStops as stop, i}
                  <div class="flex gap-2 items-center">
                    <input 
                      type="color" 
                      bind:value={stop.color} 
                      class="h-8 w-12 rounded cursor-pointer"
                    />
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      bind:value={stop.offset} 
                      class="range range-xs flex-1"
                    />
                    <span class="text-xs w-10 text-right">{stop.offset}%</span>
                    {#if qrGradientStops.length > 2}
                      <button 
                        class="btn btn-xs btn-ghost"
                        onclick={() => {
                          qrGradientStops = qrGradientStops.filter((_, idx) => idx !== i);
                        }}
                      >
                        ×
                      </button>
                    {/if}
                  </div>
                {/each}
              </div>

              {#if qrGradientStops.length < 5}
                <button 
                  class="btn btn-xs btn-outline w-full mt-2"
                  onclick={() => {
                    const lastStop = qrGradientStops[qrGradientStops.length - 1];
                    const newOffset = Math.min(lastStop.offset + 20, 100);
                    qrGradientStops = [...qrGradientStops, { offset: newOffset, color: lastStop.color }];
                  }}
                >
                  + Add Color
                </button>
              {/if}
            {/if}
          {/if}
        </div>
      {/if}
    </div>
  </div>

  <!-- Bottom Denomination Section -->
  <div class="collapse collapse-arrow bg-base-100">
    <input type="checkbox" bind:checked={bottomSectionOpen} />
    <div class="collapse-title text-sm font-medium">Bottom Denomination</div>
    <div class="collapse-content space-y-3">
      <!-- Enable/Disable Toggle -->
      <label class="label cursor-pointer justify-start gap-3 py-2">
        <input type="checkbox" class="toggle toggle-sm toggle-primary" bind:checked={enableDenomination} />
        <span class="label-text text-xs font-medium">Show Denomination</span>
      </label>

      {#if enableDenomination}
        <!-- Position Y -->
        <label class="form-control">
          <div class="label pb-1">
            <span class="label-text text-xs">Position Y</span>
            <span class="label-text-alt text-xs">{denominationY}px</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="280" 
            bind:value={denominationY} 
            class="range range-xs range-primary"
          />
        </label>

        <label class="form-control">
          <div class="label pb-1">
            <span class="label-text text-xs">Denomination Color</span>
          </div>
          <input 
            type="color" 
            bind:value={denominationColor} 
            class="h-10 w-20 rounded cursor-pointer"
          />
        </label>
        
        <label class="form-control">
          <div class="label pb-1">
            <span class="label-text text-xs">Background Color</span>
          </div>
          <input 
            type="color" 
            bind:value={bottomBoxColor} 
            class="h-10 w-20 rounded cursor-pointer"
          />
        </label>
        
        <label class="form-control">
          <div class="label pb-1">
            <span class="label-text text-xs">Text Color</span>
          </div>
          <input 
            type="color" 
            bind:value={bottomTextColor} 
            class="h-10 w-20 rounded cursor-pointer"
          />
        </label>
        
        <label class="form-control">
          <div class="label pb-1">
            <span class="label-text text-xs">Custom Text</span>
            <span class="label-text-alt text-xs opacity-60">Optional</span>
          </div>
          <textarea
            bind:value={customBottomText}
            class="textarea textarea-bordered textarea-sm"
            rows="2"
            placeholder="Custom message"
          ></textarea>
        </label>
      {/if}
    </div>
  </div>

  <!-- Guide Text Section -->
  <div class="collapse collapse-arrow bg-base-100">
    <input type="checkbox" checked />
    <div class="collapse-title text-sm font-medium">Guide Text Box</div>
    <div class="collapse-content space-y-3">
      <!-- Enable/Disable Toggle -->
      <label class="label cursor-pointer justify-start gap-3 py-2">
        <input type="checkbox" class="toggle toggle-sm toggle-primary" bind:checked={enableGuideText} />
        <span class="label-text text-xs font-medium">Show Guide Text</span>
      </label>

      {#if enableGuideText}
        <label class="form-control">
          <div class="label pb-1">
            <span class="label-text text-xs">Guide Text</span>
            <span class="label-text-alt text-xs opacity-60">Instructions for users</span>
          </div>
          <textarea
            bind:value={guideText}
            class="textarea textarea-bordered textarea-sm"
            rows="4"
            placeholder="How to redeem:&#10;1. Download a Cashu wallet&#10;2. Scan the QR code&#10;3. Tokens are in your wallet"
          ></textarea>
        </label>
        
        <!-- Position Controls -->
        <div class="grid grid-cols-2 gap-2">
          <label class="form-control">
            <div class="label pb-1">
              <span class="label-text text-xs">X: {guideX}px</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="160" 
              bind:value={guideX} 
              class="range range-xs range-primary"
            />
          </label>
          
          <label class="form-control">
            <div class="label pb-1">
              <span class="label-text text-xs">Y: {guideY}px</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="280" 
              bind:value={guideY} 
              class="range range-xs range-primary"
            />
          </label>
        </div>
        
        <!-- Size Controls -->
        <div class="grid grid-cols-2 gap-2">
          <label class="form-control">
            <div class="label pb-1">
              <span class="label-text text-xs">Width: {guideWidth}px</span>
            </div>
            <input 
              type="range" 
              min="50" 
              max="160" 
              bind:value={guideWidth} 
              class="range range-xs range-primary"
            />
          </label>
          
          <label class="form-control">
            <div class="label pb-1">
              <span class="label-text text-xs">Height: {guideHeight}px</span>
            </div>
            <input 
              type="range" 
              min="30" 
              max="280" 
              bind:value={guideHeight} 
              class="range range-xs range-primary"
            />
          </label>
        </div>

        <label class="form-control">
          <div class="label pb-1">
            <span class="label-text text-xs">Text Color</span>
          </div>
          <input 
            type="color" 
            bind:value={guideTextColor} 
            class="h-10 w-20 rounded cursor-pointer"
          />
        </label>

        <!-- Background Color -->
        <div class="flex gap-3 items-end">
          <label class="form-control flex-1" class:opacity-50={disableGuideBackground}>
            <div class="label pb-1">
              <span class="label-text text-xs">Background Color</span>
            </div>
            <input 
              type="color" 
              bind:value={guideBackgroundColor} 
              disabled={disableGuideBackground}
              class="h-10 w-20 rounded cursor-pointer"
            />
          </label>
          <label class="label cursor-pointer gap-2">
            <input 
              type="checkbox" 
              bind:checked={disableGuideBackground}
              class="checkbox checkbox-sm"
            />
            <span class="label-text text-xs">No BG</span>
          </label>
        </div>

        <!-- Border Color -->
        <div class="flex gap-3 items-end">
          <label class="form-control flex-1" class:opacity-50={disableGuideBorder}>
            <div class="label pb-1">
              <span class="label-text text-xs">Border Color</span>
            </div>
            <input 
              type="color" 
              bind:value={guideBorderColor} 
              disabled={disableGuideBorder}
              class="h-10 w-20 rounded cursor-pointer"
            />
          </label>
          <label class="label cursor-pointer gap-2">
            <input 
              type="checkbox" 
              bind:checked={disableGuideBorder}
              class="checkbox checkbox-sm"
            />
            <span class="label-text text-xs">No Border</span>
          </label>
        </div>
      {/if}
    </div>
  </div>

    <!-- Custom Images Section -->
  <div class="collapse collapse-arrow bg-base-100">
    <input type="checkbox" checked />
    <div class="collapse-title text-sm font-medium">Custom Images</div>
    <div class="collapse-content space-y-3">
      <div class="text-xs opacity-60 mb-2">Upload and position custom images on your note</div>
      
      {#each customImages as image, i (image.id)}
        <div class="border border-base-300 rounded-lg p-3 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium">Image {i + 1}</span>
            <button 
              class="btn btn-xs btn-ghost text-error"
              onclick={() => {
                customImages = customImages.filter(img => img.id !== image.id);
              }}
            >
              Remove
            </button>
          </div>
          
          <div class="grid grid-cols-2 gap-2">
            <label class="form-control">
              <div class="label pb-1">
                <span class="label-text text-xs">X: {image.x}px</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="160" 
                bind:value={image.x} 
                class="range range-xs range-primary"
              />
            </label>
            
            <label class="form-control">
              <div class="label pb-1">
                <span class="label-text text-xs">Y: {image.y}px</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="280" 
                bind:value={image.y} 
                class="range range-xs range-primary"
              />
            </label>
          </div>
          
          <div class="grid grid-cols-2 gap-2">
            <label class="form-control">
              <div class="label pb-1">
                <span class="label-text text-xs">Width: {image.width}px</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="160" 
                bind:value={image.width} 
                class="range range-xs range-primary"
              />
            </label>
            
            <label class="form-control">
              <div class="label pb-1">
                <span class="label-text text-xs">Height: {image.height}px</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="280" 
                bind:value={image.height} 
                class="range range-xs range-primary"
              />
            </label>
          </div>
          
          <label class="form-control">
            <div class="label pb-1">
              <span class="label-text text-xs">Opacity: {image.opacity}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              bind:value={image.opacity} 
              class="range range-xs range-primary"
            />
          </label>
        </div>
      {/each}
      
      <label class="btn btn-sm btn-outline w-full">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Add Image
        <input 
          type="file" 
          class="hidden"
          accept="image/*"
          oninput={(e) => {
            const target = e.target as HTMLInputElement;
            if (target.files && target.files[0]) {
              const url = URL.createObjectURL(target.files[0]);
              const id = crypto.randomUUID();
              customImages = [...customImages, {
                id,
                url,
                x: 10,
                y: 10,
                width: 50,
                height: 50,
                opacity: 100
              }];
              target.value = '';
            }
          }}
        />
      </label>
    </div>
  </div>
</div>
