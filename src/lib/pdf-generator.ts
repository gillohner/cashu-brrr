import { jsPDF } from 'jspdf';

export interface NoteData {
  frontSvg: string;
  backSvg?: string;
  id: string;
  rotation?: number; // 0 for landscape (no rotation), 90 for portrait (rotate 90°)
}

// A4 Portrait constants - FIXED configuration
const A4_WIDTH = 210; // mm
const A4_HEIGHT = 297; // mm
const BLEED = 5; // mm - fixed 5mm bleed on sides and between notes
const NOTES_PER_PAGE = 3; // Always 3 notes per page, stacked vertically
const DPI_SCALE = 4; // High quality rendering (4x resolution for crisp text)

/**
 * Auto-detect note dimensions from SVG viewBox
 */
export function detectNoteDimensions(svgString: string): { width: number; height: number } | null {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    const svg = doc.querySelector('svg');
    
    if (!svg) return null;
    
    const viewBox = svg.getAttribute('viewBox');
    if (viewBox) {
      const [, , widthPx, heightPx] = viewBox.split(' ').map(Number);
      // Convert pixels to mm at 96 DPI (standard web DPI)
      // 1 inch = 25.4mm, 96 DPI means 1px = 25.4/96 mm
      const MM_PER_PIXEL = 25.4 / 96;
      return {
        width: widthPx * MM_PER_PIXEL,
        height: heightPx * MM_PER_PIXEL
      };
    }
    
    // Fallback to width/height attributes
    const widthAttr = svg.getAttribute('width');
    const heightAttr = svg.getAttribute('height');
    if (widthAttr && heightAttr) {
      const MM_PER_PIXEL = 25.4 / 96;
      return {
        width: parseFloat(widthAttr) * MM_PER_PIXEL,
        height: parseFloat(heightAttr) * MM_PER_PIXEL
      };
    }
    
    return null;
  } catch (error) {
    console.error('Failed to detect note dimensions:', error);
    return null;
  }
}

/**
 * Calculate optimal note size for A4 portrait with 3 notes stacked vertically
 * The note is rotated 90° so its long side is horizontal (full A4 width)
 * 
 * Layout: 140mm (width) x 100mm (height) per note after rotation
 * This gives us: 
 * - Width: 210mm (A4 width) - 2*5mm (side bleed) = 200mm available → use 140mm
 * - Height per note: (297mm - 4*5mm bleed spaces) / 3 = (297-20)/3 = 92.3mm → use 100mm with spacing
 */
function calculateNoteSize(): { noteWidth: number; noteHeight: number } {
  // After 90° rotation: width becomes the long dimension (horizontal on A4)
  const rotatedWidth = 140; // mm - uses most of A4 width (200mm - margins)
  const rotatedHeight = 80; // mm - fits 3 stacked with bleed
  
  return {
    noteWidth: rotatedHeight,  // Original width before rotation
    noteHeight: rotatedWidth   // Original height before rotation (becomes horizontal)
  };
}

/**
 * Extract SVG string from a DOM element
 */
export function extractSvgFromElement(element: HTMLElement): string | null {
  const svg = element.querySelector('svg');
  if (!svg) return null;
  
  return new XMLSerializer().serializeToString(svg);
}

/**
 * Convert SVG to canvas and then to PNG data URL with rotation
 */
async function addSvgToPdf(
  pdf: jsPDF,
  svgString: string,
  x: number,
  y: number,
  width: number,
  height: number,
  rotation: number = 90
): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Failed to get canvas context'));
      return;
    }
    
    // High DPI rendering for crisp text
    if (rotation === 90 || rotation === 270) {
      canvas.width = height * DPI_SCALE * 3.7795; // Swap dimensions for rotation, convert mm to px
      canvas.height = width * DPI_SCALE * 3.7795;
    } else {
      canvas.width = width * DPI_SCALE * 3.7795;
      canvas.height = height * DPI_SCALE * 3.7795;
    }
    
    img.onload = () => {
      // Clear canvas
      ctx.fillStyle = 'transparent';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Apply rotation
      ctx.save();
      
      if (rotation === 90) {
        ctx.translate(canvas.width, 0);
        ctx.rotate(Math.PI / 2);
        ctx.drawImage(img, 0, 0, canvas.height, canvas.width);
      } else if (rotation === 270) {
        ctx.translate(0, canvas.height);
        ctx.rotate(-Math.PI / 2);
        ctx.drawImage(img, 0, 0, canvas.height, canvas.width);
      } else if (rotation === 180) {
        ctx.translate(canvas.width, canvas.height);
        ctx.rotate(Math.PI);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      } else {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
      
      ctx.restore();
      
      // Convert to PNG and add to PDF
      const pngData = canvas.toDataURL('image/png');
      
      if (rotation === 90 || rotation === 270) {
        pdf.addImage(pngData, 'PNG', x, y, height, width);
      } else {
        pdf.addImage(pngData, 'PNG', x, y, width, height);
      }
      
      resolve();
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load SVG image'));
    };
    
    // Convert SVG to data URL
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    img.src = URL.createObjectURL(blob);
  });
}

/**
 * Draw cut marks at corners of a note
 */
function drawCutMarks(pdf: jsPDF, x: number, y: number, width: number, height: number): void {
  const markLength = 3; // mm
  const offset = 2; // mm from note edge
  
  pdf.setDrawColor(0, 0, 0);
  pdf.setLineWidth(0.1);
  
  // Top-left
  pdf.line(x - offset - markLength, y - offset, x - offset, y - offset); // Horizontal
  pdf.line(x - offset, y - offset - markLength, x - offset, y - offset); // Vertical
  
  // Top-right
  pdf.line(x + width + offset, y - offset, x + width + offset + markLength, y - offset); // Horizontal
  pdf.line(x + width + offset, y - offset - markLength, x + width + offset, y - offset); // Vertical
  
  // Bottom-left
  pdf.line(x - offset - markLength, y + height + offset, x - offset, y + height + offset); // Horizontal
  pdf.line(x - offset, y + height + offset, x - offset, y + height + offset + markLength); // Vertical
  
  // Bottom-right
  pdf.line(x + width + offset, y + height + offset, x + width + offset + markLength, y + height + offset); // Horizontal
  pdf.line(x + width + offset, y + height + offset, x + width + offset, y + height + offset + markLength); // Vertical
}

/**
 * Generate PDF with notes
 * Fixed layout: A4 Portrait, 3 notes per page, optional rotation, 5mm bleed
 */
export async function generatePdf(
  notes: NoteData[],
  enableDoubleSided: boolean,
  onProgress?: (current: number, total: number) => void
): Promise<jsPDF> {
  // Create PDF in A4 Portrait
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  
  const { noteWidth, noteHeight } = calculateNoteSize();
  
  // After 90° rotation, dimensions swap
  const rotatedNoteWidth = noteHeight; // 140mm (horizontal)
  const rotatedNoteHeight = noteWidth; // 80mm (vertical)
  
  // Calculate positions for 3 notes stacked vertically
  // Left margin to center notes horizontally
  const leftMargin = (A4_WIDTH - rotatedNoteWidth - 2 * BLEED) / 2;
  
  // Vertical spacing
  const totalVerticalSpace = A4_HEIGHT - 2 * BLEED; // Total space minus top/bottom bleed
  const spacePerNote = totalVerticalSpace / NOTES_PER_PAGE;
  const noteSpacing = (spacePerNote - rotatedNoteHeight) / 2;
  
  let isFirstPage = true;
  const totalOperations = enableDoubleSided ? notes.length * 2 : notes.length;
  let currentOperation = 0;
  
  if (enableDoubleSided) {
    // Double-sided: fronts and backs on consecutive pages
    const totalPages = Math.ceil(notes.length / NOTES_PER_PAGE);
    
    for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
      const pageStartIdx = pageIndex * NOTES_PER_PAGE;
      const pageEndIdx = Math.min(pageStartIdx + NOTES_PER_PAGE, notes.length);
      const notesOnThisPage = notes.slice(pageStartIdx, pageEndIdx);
      
      // Add front page
      if (!isFirstPage) {
        pdf.addPage();
      }
      isFirstPage = false;
      
      // Render fronts
      for (let i = 0; i < notesOnThisPage.length; i++) {
        const note = notesOnThisPage[i];
        
        const x = leftMargin + BLEED;
        const y = BLEED + i * spacePerNote + noteSpacing;
        
        // Draw cut marks
        drawCutMarks(pdf, x, y, rotatedNoteWidth, rotatedNoteHeight);
        
        // Add front SVG with rotation (90° for portrait notes, 0° for landscape)
        const rotation = note.rotation ?? 90;
        await addSvgToPdf(pdf, note.frontSvg, x, y, noteWidth, noteHeight, rotation);
        
        currentOperation++;
        if (onProgress) {
          onProgress(currentOperation, totalOperations);
        }
      }
      
      // Add back page if any note has a backside
      const hasBacksides = notesOnThisPage.some(n => n.backSvg);
      if (hasBacksides) {
        pdf.addPage();
        
        // Render backs in same positions with 180° flip for proper alignment when physical paper is flipped
        for (let i = 0; i < notesOnThisPage.length; i++) {
          const note = notesOnThisPage[i];
          if (!note.backSvg) {
            currentOperation++;
            if (onProgress) {
              onProgress(currentOperation, totalOperations);
            }
            continue;
          }
          
          const x = leftMargin + BLEED;
          const y = BLEED + i * spacePerNote + noteSpacing;
          
          // Draw cut marks in EXACT same position as front
          drawCutMarks(pdf, x, y, rotatedNoteWidth, rotatedNoteHeight);
          
          // Add back SVG with 180° additional rotation for proper flip
          // When the physical paper is flipped on short edge, this ensures correct orientation
          const frontRotation = note.rotation ?? 90;
          const backRotation = (frontRotation + 180) % 360;
          await addSvgToPdf(pdf, note.backSvg, x, y, noteWidth, noteHeight, backRotation);
          
          currentOperation++;
          if (onProgress) {
            onProgress(currentOperation, totalOperations);
          }
        }
      }
    }
  } else {
    // Single-sided: just fronts
    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];
      const positionOnPage = i % NOTES_PER_PAGE;
      
      // Add new page if needed
      if (positionOnPage === 0 && !isFirstPage) {
        pdf.addPage();
      }
      isFirstPage = false;
      
      // Calculate position
      const x = leftMargin + BLEED;
      const y = BLEED + positionOnPage * spacePerNote + noteSpacing;
      
      // Draw cut marks
      drawCutMarks(pdf, x, y, rotatedNoteWidth, rotatedNoteHeight);
      
      // Add SVG with rotation (90° for portrait notes, 0° for landscape)
      const rotation = note.rotation ?? 90;
      await addSvgToPdf(pdf, note.frontSvg, x, y, noteWidth, noteHeight, rotation);
      
      currentOperation++;
      if (onProgress) {
        onProgress(currentOperation, totalOperations);
      }
    }
  }
  
  return pdf;
}

/**
 * Get printing instructions based on whether double-sided is enabled
 */
export function getPrintingInstructions(enableDoubleSided: boolean): string {
  if (enableDoubleSided) {
    return `DOUBLE-SIDED PRINTING INSTRUCTIONS:

1. **Print Settings:**
   - Paper: A4 (210mm × 297mm)
   - Orientation: Portrait
   - Double-sided: Flip on SHORT edge
   - Quality: Best/Highest quality
   - Scale: 100% (no scaling)
   - Margins: None (full bleed)

2. **Printing Process:**
   - Page 1: First 3 notes (front side)
   - Page 2: First 3 notes (back side) 
   - Page 3: Next 3 notes (front side)
   - Page 4: Next 3 notes (back side)
   - Continue this pattern...

3. **Important:**
   - Use "Flip on SHORT edge" for proper back alignment
   - Do NOT use "Flip on LONG edge"
   - Test with 1-2 sheets first to verify alignment

4. **Cutting:**
   - Each page has 3 notes stacked vertically
   - Use the corner cut marks as guides
   - 5mm bleed included between notes
   - Cut along the marks for perfectly sized notes`;
  } else {
    return `SINGLE-SIDED PRINTING INSTRUCTIONS:

1. **Print Settings:**
   - Paper: A4 (210mm × 297mm)
   - Orientation: Portrait
   - Quality: Best/Highest quality
   - Scale: 100% (no scaling)
   - Margins: None (full bleed)

2. **Layout:**
   - Each page contains 3 notes stacked vertically
   - Notes are rotated 90° for optimal use of page width

3. **Cutting:**
   - Use the corner cut marks as guides
   - 5mm bleed included between notes
   - Cut along the marks for perfectly sized notes`;
  }
}
