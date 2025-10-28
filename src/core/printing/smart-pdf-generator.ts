/**
 * Smart PDF Generator
 * Enhanced PDF generation with automatic note arrangement,
 * multiple page sizes, and professional print features
 */

import jsPDF from 'jspdf';
import type { NoteTemplate, PrintConfig, Size } from '../../types/design';

// Page dimensions in mm
export const PAGE_FORMATS: Record<string, Size> = {
    A4: { width: 210, height: 297 },
    Letter: { width: 215.9, height: 279.4 },
};

export interface NotePlacement {
    x: number;
    y: number;
    template: NoteTemplate;
    rotation?: number;
}

export interface PageLayout {
    pageNumber: number;
    placements: NotePlacement[];
    isFront: boolean; // For double-sided printing
}

export interface ArrangementResult {
    layouts: PageLayout[];
    totalPages: number;
    notesPerPage: number;
    unusedSpace: number; // percentage
}

/**
 * Calculate optimal arrangement of notes on pages
 */
export function calculateOptimalArrangement(
    templates: NoteTemplate[],
    config: PrintConfig
): ArrangementResult {
    const pageSize = config.format === 'Custom' && config.customDimensions
        ? config.customDimensions
        : PAGE_FORMATS[config.format];

    // Account for bleed margins
    const usableWidth = pageSize.width - (config.bleedMargin * 2);
    const usableHeight = pageSize.height - (config.bleedMargin * 2);
    const spacing = config.spacing || 5; // Default 5mm spacing

    // If manual mode, return empty layout for user to arrange
    if (config.arrangement === 'manual') {
        return {
            layouts: [],
            totalPages: 0,
            notesPerPage: 0,
            unusedSpace: 0
        };
    }

    if (config.arrangement === 'grid') {
        return arrangeInGrid(templates, config, usableWidth, usableHeight, spacing);
    }

    // Auto mode: pack as efficiently as possible
    return arrangeAutomatically(templates, config, usableWidth, usableHeight, spacing);
}

/**
 * Arrange notes in a regular grid
 */
function arrangeInGrid(
    templates: NoteTemplate[],
    config: PrintConfig,
    usableWidth: number,
    usableHeight: number,
    spacing: number
): ArrangementResult {
    const layouts: PageLayout[] = [];

    if (templates.length === 0) {
        return { layouts, totalPages: 0, notesPerPage: 0, unusedSpace: 100 };
    }

    // Assume all templates are the same size (use first as reference)
    const noteSize = templates[0].dimensions;

    // Calculate how many fit per row/column
    const notesPerRow = Math.floor((usableWidth + spacing) / (noteSize.width + spacing));
    const notesPerCol = Math.floor((usableHeight + spacing) / (noteSize.height + spacing));
    const notesPerPage = notesPerRow * notesPerCol;

    if (notesPerPage === 0) {
        throw new Error('Note size is too large for the selected page format');
    }

    let currentPage = 0;
    let currentPlacements: NotePlacement[] = [];
    let noteIndex = 0;

    for (const template of templates) {
        const row = Math.floor((noteIndex % notesPerPage) / notesPerRow);
        const col = (noteIndex % notesPerPage) % notesPerRow;

        const x = config.bleedMargin + (col * (noteSize.width + spacing));
        const y = config.bleedMargin + (row * (noteSize.height + spacing));

        currentPlacements.push({ x, y, template });

        noteIndex++;

        // Start new page if current is full
        if (noteIndex % notesPerPage === 0 || noteIndex === templates.length) {
            layouts.push({
                pageNumber: currentPage + 1,
                placements: currentPlacements,
                isFront: !config.doubleSided || currentPage % 2 === 0
            });
            currentPage++;
            currentPlacements = [];
        }
    }

    // Calculate unused space
    const noteArea = noteSize.width * noteSize.height;
    const usableArea = usableWidth * usableHeight;
    const usedArea = Math.min(notesPerPage, templates.length % notesPerPage || notesPerPage) * noteArea;
    const unusedSpace = ((usableArea - usedArea) / usableArea) * 100;

    return {
        layouts,
        totalPages: layouts.length,
        notesPerPage,
        unusedSpace: Math.max(0, unusedSpace)
    };
}

/**
 * Arrange notes automatically for best fit
 * Uses a simple bin-packing algorithm
 */
function arrangeAutomatically(
    templates: NoteTemplate[],
    config: PrintConfig,
    usableWidth: number,
    usableHeight: number,
    spacing: number
): ArrangementResult {
    // For now, use grid arrangement as automatic
    // TODO: Implement proper 2D bin packing algorithm
    return arrangeInGrid(templates, config, usableWidth, usableHeight, spacing);
}

/**
 * Generate PDF with arranged notes
 */
export async function generateSmartPDF(
    arrangement: ArrangementResult,
    config: PrintConfig,
    onProgress?: (progress: number) => void
): Promise<Blob> {
    const pageSize = config.format === 'Custom' && config.customDimensions
        ? config.customDimensions
        : PAGE_FORMATS[config.format];

    const orientation = config.orientation || 'portrait';

    const pdf = new jsPDF({
        orientation,
        unit: 'mm',
        format: [pageSize.width, pageSize.height],
    });

    let isFirstPage = true;

    for (let i = 0; i < arrangement.layouts.length; i++) {
        const layout = arrangement.layouts[i];

        if (!isFirstPage) {
            pdf.addPage();
        }
        isFirstPage = false;

        // Draw crop marks if enabled
        if (config.cropMarks) {
            drawCropMarks(pdf, pageSize, config.bleedMargin);
        }

        // Draw each note placement
        for (const placement of layout.placements) {
            await drawNoteTemplate(pdf, placement, config);
        }

        // Draw cut lines if enabled
        if (config.cutLines && layout.placements.length > 1) {
            drawCutLines(pdf, layout.placements, config);
        }

        // Report progress
        if (onProgress) {
            onProgress((i + 1) / arrangement.layouts.length * 100);
        }
    }

    return pdf.output('blob');
}

/**
 * Draw crop marks for professional printing
 */
function drawCropMarks(pdf: jsPDF, pageSize: Size, bleed: number): void {
    const markLength = 5;
    const markOffset = bleed - 2;

    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.1);

    // Top-left
    pdf.line(markOffset, 0, markOffset, markLength);
    pdf.line(0, markOffset, markLength, markOffset);

    // Top-right
    pdf.line(pageSize.width - markOffset, 0, pageSize.width - markOffset, markLength);
    pdf.line(pageSize.width - markLength, markOffset, pageSize.width, markOffset);

    // Bottom-left
    pdf.line(markOffset, pageSize.height - markLength, markOffset, pageSize.height);
    pdf.line(0, pageSize.height - markOffset, markLength, pageSize.height - markOffset);

    // Bottom-right
    pdf.line(pageSize.width - markOffset, pageSize.height - markLength, pageSize.width - markOffset, pageSize.height);
    pdf.line(pageSize.width - markLength, pageSize.height - markOffset, pageSize.width, pageSize.height - markOffset);
}

/**
 * Draw cut lines between notes
 */
function drawCutLines(pdf: jsPDF, placements: NotePlacement[], config: PrintConfig): void {
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.1);
    // Note: jsPDF doesn't have setLineDash in all versions

    const drawnLines = new Set<string>();

    for (const placement of placements) {
        const noteWidth = placement.template.dimensions.width;
        const noteHeight = placement.template.dimensions.height;

        // Vertical cut line (right edge)
        const vLineKey = `v-${placement.x + noteWidth}`;
        if (!drawnLines.has(vLineKey)) {
            pdf.line(
                placement.x + noteWidth,
                config.bleedMargin,
                placement.x + noteWidth,
                placement.y + noteHeight
            );
            drawnLines.add(vLineKey);
        }

        // Horizontal cut line (bottom edge)
        const hLineKey = `h-${placement.y + noteHeight}`;
        if (!drawnLines.has(hLineKey)) {
            pdf.line(
                config.bleedMargin,
                placement.y + noteHeight,
                placement.x + noteWidth,
                placement.y + noteHeight
            );
            drawnLines.add(hLineKey);
        }
    }
}

/**
 * Draw a note template at the specified placement
 * TODO: Implement actual note rendering using html2canvas or similar
 */
async function drawNoteTemplate(
    pdf: jsPDF,
    placement: NotePlacement,
    _config: PrintConfig
): Promise<void> {
    const { x, y, template } = placement;

    // Placeholder: Draw a rectangle for now
    pdf.setFillColor(240, 240, 240);
    pdf.rect(
        x,
        y,
        template.dimensions.width,
        template.dimensions.height,
        'F'
    );

    // Add template name as text
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text(template.name, x + 5, y + 10);

    // TODO: Render actual note modules using html2canvas
    // This will be implemented in the visual designer phase
}

/**
 * Preview arrangement without generating PDF
 */
export function previewArrangement(
    templates: NoteTemplate[],
    config: PrintConfig
): ArrangementResult {
    return calculateOptimalArrangement(templates, config);
}

/**
 * Calculate print statistics
 */
export function calculatePrintStats(
    templates: NoteTemplate[],
    config: PrintConfig
): {
    totalNotes: number;
    pagesNeeded: number;
    sheetsNeeded: number; // For double-sided
    costEstimate?: number;
} {
    const arrangement = calculateOptimalArrangement(templates, config);

    return {
        totalNotes: templates.length,
        pagesNeeded: arrangement.totalPages,
        sheetsNeeded: config.doubleSided
            ? Math.ceil(arrangement.totalPages / 2)
            : arrangement.totalPages
    };
}
