import jsPDF from 'jspdf';
import autoTable, { CellHookData } from 'jspdf-autotable';

const SK_LOGO_B64 = `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`;
const LOGO_ASPECT_RATIO = 2.5181818182;
const LOGO_SIZE = 15;
const PADDING = 7;
const FONT_SIZE = 19;
const CELL_PADDING = 10;

function fitImage(targetWidth: number, targetHeight: number, imageWidth: number, imageHeight: number) {
  // Calculate aspect ratios
  const targetRatio = targetWidth / targetHeight;
  const imageRatio = imageWidth / imageHeight;

  if (imageRatio > targetRatio) {
    // Image is wider than target area
    return { width: targetWidth, height: targetWidth / imageRatio };
  }
  // Image is taller than target area
  return { width: targetHeight * imageRatio, height: targetHeight };
}

const drawCellImage = (doc: jsPDF, data: CellHookData) => {
  if (data.cell.section !== 'body') return;

  const td = data.cell.raw as HTMLTableCellElement;
  const img = td.getElementsByTagName('img')[0];
  if (!img) return;

  const { x, y, width, height } = data.cell;
  // Set fallback size to 1 to avoid division by zero
  const imgSize = fitImage(width, height, img.naturalWidth || 1, img.naturalHeight || 1);
  const paddingY = Math.max(0, (height - imgSize.height) / 2);
  const paddingX = Math.max(0, (width - imgSize.width) / 2);

  doc.addImage({
    imageData: img.src,
    x: x + paddingX,
    y: y + paddingY,
    width: imgSize.width,
    height: imgSize.height,
    format: 'JPEG',
  });
};

/**
 * Exports the table rendered under #table-to-export as a PDF with the Sundsvall logo.
 * @param exportTitle Heading printed under the logo (school + class), or null when exporting search results.
 */
export const generatePupilPdf = (exportTitle: string | null) => {
  const doc = new jsPDF();

  doc.addImage(SK_LOGO_B64, 'JPEG', 15, 15, LOGO_SIZE * LOGO_ASPECT_RATIO, LOGO_SIZE);

  if (exportTitle) {
    doc.setFontSize(FONT_SIZE);
    doc.text(exportTitle, 15, LOGO_SIZE + FONT_SIZE + PADDING);
  }

  autoTable(doc, {
    startY: LOGO_SIZE + PADDING * 2 + (exportTitle ? FONT_SIZE : PADDING),
    html: '#table-to-export .sk-table',
    tableWidth: 'auto',
    theme: 'plain',
    tableLineColor: [0, 0, 0],
    tableLineWidth: 1,
    styles: {
      cellPadding: CELL_PADDING,
      fontSize: 12,
      lineColor: [0, 0, 0],
      lineWidth: 1,
    },
    didDrawCell: (data) => drawCellImage(doc, data),
  });

  doc.save(exportTitle ?? 'table_export.pdf');
};
