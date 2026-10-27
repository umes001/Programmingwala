import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { jsPDF } from 'jspdf';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const notesDir = path.join(__dirname, '../uploads/notes');

const sanitize = (value) =>
  String(value || 'note')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'note';

export function generateLibraryNotePdf(note) {
  fs.mkdirSync(notesDir, { recursive: true });

  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 88, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Appletree Coaching Centre', margin, 32);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Course note library • Download-ready PDF', margin, 54);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text(note.title || 'Course Note', margin, 120);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(`Course: ${note.course || 'General'}`, margin, 146);
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin, 164);

  doc.setDrawColor(148, 163, 184);
  doc.line(margin, 182, pageWidth - margin, 182);

  const contentLines = doc.splitTextToSize(note.content || 'No content provided.', pageWidth - margin * 2);
  doc.setFontSize(12);
  doc.text(contentLines, margin, 204);

  const footerText = 'Prepared for Appletree students and learners. Download this PDF anytime from the library.';
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(10);
  doc.text(footerText, margin, pageHeight - 30);

  const fileName = `${sanitize(note.course)}-${sanitize(note.title)}-${Date.now()}.pdf`;
  const filePath = path.join(notesDir, fileName);
  fs.writeFileSync(filePath, Buffer.from(doc.output('arraybuffer')));

  return {
    fileName,
    pdfUrl: `/uploads/notes/${fileName}`
  };
}
