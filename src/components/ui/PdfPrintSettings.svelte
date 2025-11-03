<script lang="ts">
  import type { PdfConfig } from '../../lib/utils/pdf-generator';
  
  interface Props {
    config: PdfConfig;
  }
  
  let { config = $bindable() }: Props = $props();
  
  // Calculate estimated notes per page
  const notesPerPage = $derived(() => {
    const pageSizes = {
      a4: { width: 210, height: 297 },
      letter: { width: 215.9, height: 279.4 },
      legal: { width: 215.9, height: 355.6 },
    };
    
    const pageSize = pageSizes[config.pageFormat];
    const pageWidth = config.orientation === 'portrait' ? pageSize.width : pageSize.height;
    const pageHeight = config.orientation === 'portrait' ? pageSize.height : pageSize.width;
    
    const rotatedWidth = config.noteHeight;
    const rotatedHeight = config.noteWidth;
    const totalNoteWidth = rotatedWidth + (config.bleed * 2);
    const totalNoteHeight = rotatedHeight + (config.bleed * 2);
    const cutMarkSpace = config.enableCutMarks ? (config.cutMarkOffset + config.cutMarkLength) * 2 : 0;
    
    const margin = 5;
    const cols = Math.floor((pageWidth - 2 * margin) / (totalNoteWidth + cutMarkSpace));
    const rows = Math.floor((pageHeight - 2 * margin) / (totalNoteHeight + cutMarkSpace));
    
    return cols * rows;
  });
</script>

<div class="bg-base-200 rounded-lg p-4 space-y-4">
  <div class="flex items-center justify-between">
    <h3 class="font-semibold">PDF Print Settings</h3>
  </div>
  
  <!-- Page Format -->
  <div class="form-control">
    <div class="label">
      <span class="label-text font-medium">Page Format</span>
    </div>
    <div class="flex gap-2">
      <button 
        class="btn btn-sm flex-1"
        class:btn-primary={config.pageFormat === 'a4'}
        onclick={() => config.pageFormat = 'a4'}
      >
        A4
      </button>
      <button 
        class="btn btn-sm flex-1"
        class:btn-primary={config.pageFormat === 'letter'}
        onclick={() => config.pageFormat = 'letter'}
      >
        Letter
      </button>
      <button 
        class="btn btn-sm flex-1"
        class:btn-primary={config.pageFormat === 'legal'}
        onclick={() => config.pageFormat = 'legal'}
      >
        Legal
      </button>
    </div>
  </div>
  
  <!-- Orientation -->
  <div class="form-control">
    <div class="label">
      <span class="label-text font-medium">Page Orientation</span>
    </div>
    <div class="flex gap-2">
      <button 
        class="btn btn-sm flex-1"
        class:btn-primary={config.orientation === 'portrait'}
        onclick={() => config.orientation = 'portrait'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
        Portrait
      </button>
      <button 
        class="btn btn-sm flex-1"
        class:btn-primary={config.orientation === 'landscape'}
        onclick={() => config.orientation = 'landscape'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
        Landscape
      </button>
    </div>
  </div>
  
  <!-- Note Dimensions -->
  <div class="grid grid-cols-2 gap-3">
    <label class="form-control">
      <div class="label">
        <span class="label-text text-sm">Note Width (mm)</span>
      </div>
      <input 
        type="number" 
        bind:value={config.noteWidth}
        min="50"
        max="150"
        step="0.1"
        class="input input-bordered input-sm"
      />
      <div class="label">
        <span class="label-text-alt text-xs opacity-60">Credit card: 85.6mm</span>
      </div>
    </label>
    
    <label class="form-control">
      <div class="label">
        <span class="label-text text-sm">Note Height (mm)</span>
      </div>
      <input 
        type="number" 
        bind:value={config.noteHeight}
        min="30"
        max="100"
        step="0.1"
        class="input input-bordered input-sm"
      />
      <div class="label">
        <span class="label-text-alt text-xs opacity-60">Credit card: 53.98mm</span>
      </div>
    </label>
  </div>
  
  <!-- Bleed -->
  <label class="form-control">
    <div class="label">
      <span class="label-text font-medium">Bleed Amount (mm)</span>
      <span class="label-text-alt">{config.bleed}mm</span>
    </div>
    <input 
      type="range" 
      min="0" 
      max="10" 
      step="0.5"
      bind:value={config.bleed}
      class="range range-primary range-sm"
    />
    <div class="label">
      <span class="label-text-alt text-xs opacity-60">Extra space for cutting. Standard: 3mm</span>
    </div>
  </label>
  
  <!-- Cut Marks -->
  <div class="form-control">
    <label class="label cursor-pointer justify-start gap-3">
      <input 
        type="checkbox" 
        bind:checked={config.enableCutMarks}
        class="checkbox checkbox-primary checkbox-sm"
      />
      <div class="flex flex-col">
        <span class="label-text font-medium">Enable Cut Marks</span>
        <span class="text-xs opacity-60">Corner marks for precise cutting</span>
      </div>
    </label>
  </div>
  
  {#if config.enableCutMarks}
    <div class="grid grid-cols-2 gap-3 ml-6">
      <label class="form-control">
        <div class="label">
          <span class="label-text text-sm">Mark Length (mm)</span>
        </div>
        <input 
          type="number" 
          bind:value={config.cutMarkLength}
          min="2"
          max="10"
          step="0.5"
          class="input input-bordered input-sm"
        />
      </label>
      
      <label class="form-control">
        <div class="label">
          <span class="label-text text-sm">Mark Offset (mm)</span>
        </div>
        <input 
          type="number" 
          bind:value={config.cutMarkOffset}
          min="1"
          max="5"
          step="0.5"
          class="input input-bordered input-sm"
        />
      </label>
    </div>
  {/if}
  
  <!-- Double-Sided -->
  <div class="form-control">
    <label class="label cursor-pointer justify-start gap-3">
      <input 
        type="checkbox" 
        bind:checked={config.enableDoubleSided}
        class="checkbox checkbox-primary checkbox-sm"
      />
      <div class="flex flex-col">
        <span class="label-text font-medium">Double-Sided Printing</span>
        <span class="text-xs opacity-60">Generates backs aligned for duplex printing</span>
      </div>
    </label>
  </div>
  
  <!-- Info Box -->
  <div class="alert alert-info text-xs">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-4 h-4">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
    <div>
      <div class="font-semibold">Estimated: {notesPerPage()} notes per page</div>
      <div class="opacity-70">Notes rotated 90° for optimal fit</div>
    </div>
  </div>
</div>
