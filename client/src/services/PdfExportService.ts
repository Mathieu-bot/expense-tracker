import { Margin, Resolution } from "react-to-pdf";
import generatePDF from "react-to-pdf";

export interface PdfExportOptions {
  filename?: string;
  resolution?: Resolution;
  margin?: Margin;
  format?: string;
  orientation?: "portrait" | "landscape";
}
export { Resolution, Margin };

export class PdfExportService {
  static async generatePdf(
    targetRef: React.RefObject<HTMLDivElement | null>,
    options: PdfExportOptions = {}
  ): Promise<void> {
    if (!targetRef.current) return;

    const {
      filename = "income-receipts.pdf",
      resolution = Resolution.HIGH,
      margin = Margin.SMALL,
      format = "A4",
      orientation = "portrait",
    } = options;

    const pdfOptions = {
      filename,
      resolution,
      page: { margin, format, orientation },
      canvas: { mimeType: "image/png" as const, qualityRatio: 1 },
    };

    generatePDF(() => targetRef.current as HTMLDivElement, pdfOptions);
  }

  static generateFilename(startDate?: string, endDate?: string): string {
    if (startDate && endDate) {
      return `income-receipts-${startDate}-to-${endDate}.pdf`;
    }
    return "income-receipts-all-time.pdf";
  }
}
