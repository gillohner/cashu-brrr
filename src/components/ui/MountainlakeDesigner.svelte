<script lang="ts">
  interface GradientStop {
    offset: number;
    color: string;
  }

  interface Props {
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
    topLeftIcon: 'cashu' | 'bitcoin' | 'none' | 'custom';
    customLogoUrl: string;
    topLeftIconColor: string;
    
    // Top Right Text
    headerText: string;
    headerTextColor: string;
    
    // QR Code
    qrGradientType: 'linear' | 'radial' | 'solid';
    qrGradientAngle: number;
    qrGradientStops: GradientStop[];
    qrBackgroundColor: string;
    qrBorderColor: string;
    qrCodeColor: string;
    disableQrBorder: boolean;
    disableQrBackground: boolean;
    
    // Bottom
    denominationColor: string;
    bottomBoxColor: string;
    bottomTextColor: string;
    customBottomText: string;
  }

  let {
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
    
    topLeftIcon = $bindable(),
    customLogoUrl = $bindable(),
    topLeftIconColor = $bindable(),
    
    headerText = $bindable(),
    headerTextColor = $bindable(),
    
    qrGradientType = $bindable(),
    qrGradientAngle = $bindable(),
    qrGradientStops = $bindable(),
    qrBackgroundColor = $bindable(),
    qrBorderColor = $bindable(),
    qrCodeColor = $bindable(),
    disableQrBorder = $bindable(),
    disableQrBackground = $bindable(),
    
    denominationColor = $bindable(),
    bottomBoxColor = $bindable(),
    bottomTextColor = $bindable(),
    customBottomText = $bindable(),
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
      <select 
        bind:value={topLeftIcon} 
        class="select select-bordered select-sm w-full"
      >
        <option value="cashu">Cashu QR Icon</option>
        <option value="none">No Icon</option>
        <option value="custom">Custom Image URL</option>
      </select>
      
      {#if topLeftIcon === 'custom'}
        <label class="form-control">
          <div class="label pb-1">
            <span class="label-text text-xs">Image URL</span>
          </div>
          <input 
            type="text" 
            bind:value={customLogoUrl} 
            class="input input-bordered input-sm"
            placeholder="https://example.com/logo.png"
          />
        </label>
      {/if}
      
      {#if topLeftIcon !== 'none' && topLeftIcon !== 'custom'}
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
    </div>
  </div>

  <!-- Top Right Text Section -->
  <div class="collapse collapse-arrow bg-base-100">
    <input type="checkbox" bind:checked={topRightSectionOpen} />
    <div class="collapse-title text-sm font-medium">Top Right Text</div>
    <div class="collapse-content space-y-3">
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
    </div>
  </div>

  <!-- QR Code Section -->
  <div class="collapse collapse-arrow bg-base-100">
    <input type="checkbox" bind:checked={qrSectionOpen} />
    <div class="collapse-title text-sm font-medium">QR Code</div>
    <div class="collapse-content space-y-3">
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
    </div>
  </div>

  <!-- Bottom Denomination Section -->
  <div class="collapse collapse-arrow bg-base-100">
    <input type="checkbox" bind:checked={bottomSectionOpen} />
    <div class="collapse-title text-sm font-medium">Bottom Denomination</div>
    <div class="collapse-content space-y-3">
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
    </div>
  </div>
</div>
