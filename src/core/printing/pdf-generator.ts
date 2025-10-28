/**
 * PDF Generator
 * Generates printable PDFs with proper bleed margins and crop marks
 */

import type { NoteDesign, PrintConfig } from '@/types/design';
import type { Token } from '@cashu/cashu-ts';
import { jsPDF } from 'jspdf';

interface PageLayout {
  pageWidth: number;
  pageHeight: number;
  noteWidth: number;
  noteHeight: number;
  bleed: number;
  printableWidth: number;
  printableHeight: number;
}

export class PDFGenerator {
  private config: PrintConfig;

  constructor(config: PrintConfig) {
    this.config = config;
  }

  async generatePDF(
    tokens: Token[],
    frontDesign: NoteDesign,
    backDesign?: NoteDesign
  ): Promise<Blob> {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: this.getFormat(),
    });

    const pageLayout = this.calculateLayout();

    for (let i = 0; i < tokens.length; i++) {
      if (i > 0) pdf.addPage();

      // Add bleed area markers
      if (this.config.bleedMargin > 0) {
        this.addBleedMarks(pdf, pageLayout);
      }

      // Add crop marks
      if (this.config.cropMarks) {
        this.addCropMarks(pdf, pageLayout);
      }

      // Render front side
      await this.renderNotePage(pdf, tokens[i], frontDesign, pageLayout, 'front');

      // Add back side if enabled and provided
      if (this.config.doubleSided && backDesign) {
        pdf.addPage();
        await this.renderNotePage(pdf, tokens[i], backDesign, pageLayout, 'back');
      }
    }

    return pdf.output('blob');
  }

  private getFormat(): 'a4' | 'letter' | [number, number] {
    if (this.config.format === 'A4') return 'a4';
    if (this.config.format === 'Letter') return 'letter';
    if (this.config.customDimensions) {
      return [this.config.customDimensions.width, this.config.customDimensions.height];
    }
    return 'a4';
  }

  private calculateLayout(): PageLayout {
    let pageWidth = 210; // A4 default
    let pageHeight = 297;

    if (this.config.format === 'Letter') {
      pageWidth = 215.9;
      pageHeight = 279.4;
    } else if (this.config.format === 'Custom' && this.config.customDimensions) {
      pageWidth = this.config.customDimensions.width;
      pageHeight = this.config.customDimensions.height;
    }

    const bleed = this.config.bleedMargin;

    // Credit card size (ISO/IEC 7810 ID-1)
    const noteWidth = 85.6;
    const noteHeight = 53.98;

    return {
      pageWidth,
      pageHeight,
      noteWidth,
      noteHeight,
      bleed,
      printableWidth: pageWidth - (bleed * 2),
      printableHeight: pageHeight - (bleed * 2),
    };
  }

  private addBleedMarks(pdf: jsPDF, layout: PageLayout): void {
    // Add red bleed area indicators (not printed, just for reference)
    pdf.setDrawColor(255, 0, 0);
    pdf.setLineWidth(0.1);

    // Draw bleed box
    pdf.rect(
      layout.bleed,
      layout.bleed,
      layout.printableWidth,
      layout.printableHeight
    );
  }

  private addCropMarks(pdf: jsPDF, layout: PageLayout): void {
    const markLength = 5;
    const offset = 2;

    pdf.setLineWidth(0.1);
    pdf.setDrawColor(0, 0, 0);

    const corners = [
      // Top-left
      { x: layout.bleed, y: layout.bleed },
      // Top-right
      { x: layout.pageWidth - layout.bleed, y: layout.bleed },
      // Bottom-left
      { x: layout.bleed, y: layout.pageHeight - layout.bleed },
      // Bottom-right
      { x: layout.pageWidth - layout.bleed, y: layout.pageHeight - layout.bleed },
    ];

    corners.forEach((corner, index) => {
      // Horizontal marks
      if (index === 0 || index === 2) {
        // Left side
        pdf.line(corner.x - offset - markLength, corner.y, corner.x - offset, corner.y);
      } else {
        // Right side
        pdf.line(corner.x + offset, corner.y, corner.x + offset + markLength, corner.y);
      }

      // Vertical marks
      if (index === 0 || index === 1) {
        // Top side
        pdf.line(corner.x, corner.y - offset - markLength, corner.x, corner.y - offset);
      } else {
        // Bottom side
        pdf.line(corner.x, corner.y + offset, corner.x, corner.y + offset + markLength);
      }
    });

    // Add cut lines if enabled
    if (this.config.cutLines) {
      this.addCutLines(pdf, layout);
    }
  }

  private addCutLines(pdf: jsPDF, layout: PageLayout): void {
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.05);

    // Center the note on the page
    const noteX = (layout.pageWidth - layout.noteWidth) / 2;
    const noteY = (layout.pageHeight - layout.noteHeight) / 2;

    // Draw cut lines around the note
    pdf.rect(noteX, noteY, layout.noteWidth, layout.noteHeight);
  }

  private async renderNotePage(
    pdf: jsPDF,
    token: Token,
    design: NoteDesign,
    layout: PageLayout,
    side: 'front' | 'back'
  ): Promise<void> {
    const template = side === 'front' ? design.frontSide : design.backSide;
    if (!template) return;

    // Center the note on the page
    const noteX = (layout.pageWidth - layout.noteWidth) / 2;
    const noteY = (layout.pageHeight - layout.noteHeight) / 2;

    // Render note background
    pdf.setFillColor(255, 255, 255);
    pdf.rect(noteX, noteY, layout.noteWidth, layout.noteHeight, 'F');

    // Here we would render the actual note content
    // This would involve converting the SVG modules to PDF elements
    // For now, this is a placeholder that would need integration with
    // the actual note rendering logic

    // Add a reference to the token amount (for debugging)
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    const amount = token.proofs.reduce((sum, p) => sum + p.amount, 0);
    pdf.text(`Amount: ${amount}`, noteX + 5, noteY + layout.noteHeight - 5);
  }

  /**
   * Generate a download filename based on configuration
   */
  generateFilename(): string {
    const timestamp = new Date().toISOString().slice(0, 10);
    const sided = this.config.doubleSided ? 'double' : 'single';
    return `cashu-notes-${sided}-${timestamp}.pdf`;
  }
}
