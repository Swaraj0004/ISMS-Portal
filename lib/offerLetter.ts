import path from "path";
import fs from "fs";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

interface PdfParams {
  collegeName: string;
  deanName: string;
  addressLine?: string;
  department: string;
  semester: string;
  refNo?: string;
  internshipStart: string;
  internshipEnd: string;
  studentName: string;
}

export async function convertToPdf({
  collegeName = "",
  deanName = "",
  addressLine = "",
  department = "",
  semester = "",
  refNo = "",
  internshipStart = "",
  internshipEnd = "",
  studentName = "",
}: PdfParams): Promise<{ pdf: Buffer; reference: string }> {
  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]);
    const { height, width } = page.getSize();
    const randomRef = Math.floor(10000000 + Math.random() * 90000000);

    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, "0")}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${today.getFullYear()}`;
    const margin = 50;
    let cursorY = height - margin;

    const headerPath = path.join(process.cwd(), "public", "images", "head.png");
    const headerBytes = fs.readFileSync(headerPath);
    const headerImage = await pdfDoc.embedPng(headerBytes);
    const headerDims = headerImage.scale(0.41);

    page.drawImage(headerImage, {
      x: (width - headerDims.width) / 2,
      y: cursorY - headerDims.height + 40,
      width: headerDims.width - 20,
      height: headerDims.height,
    });

    cursorY -= headerDims.height + 40;

    const regularFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    const fontSizeNormal = 12;
    const lineHeight = 18;

    const drawWrappedText = (
      text: string,
      x: number,
      y: number,
      maxWidth: number,
      font: any,
      fontSize: number,
      lineHeight: number,
      color = rgb(0, 0, 0)
    ) => {
      const words = text.split(" ");
      let line = "";
      let cursor = y;

      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + " ";
        const lineWidth = font.widthOfTextAtSize(testLine, fontSize);

        if (lineWidth > maxWidth && i > 0) {
          page.drawText(line.trim(), {
            x,
            y: cursor,
            size: fontSize,
            font,
            color,
          });
          line = words[i] + " ";
          cursor -= lineHeight;
        } else {
          line = testLine;
        }
      }

      if (line.trim()) {
        page.drawText(line.trim(), {
          x,
          y: cursor,
          size: fontSize,
          font,
          color,
        });
        cursor -= lineHeight;
      }

      return cursor;
    };
    cursorY += 50;

    cursorY = drawWrappedText(
      `Ref. No.: MRSAC/Student-${collegeName}/UG/${randomRef}/${new Date().getFullYear()}`,
      margin,
      cursorY,
      width - margin * 2,
      boldFont,
      10,
      lineHeight
    );
    cursorY -= 10;

    page.drawText(`Date: ${formattedDate}`, {
      x: width - 150,
      y: cursorY,
      size: 10,
      font: boldFont,
    });

    cursorY -= lineHeight * 2;

    const addressLines = [
      "To,",
      deanName,
      "Dean – Industry Relations,",
      collegeName,
      addressLine ? addressLine : "Nagpur",
    ];

    for (const line of addressLines) {
      page.drawText(line, {
        x: margin,
        y: cursorY,
        size: fontSizeNormal,
        font: regularFont,
      });
      cursorY -= lineHeight;
    }

    cursorY -= 10;

    cursorY = drawWrappedText(
      `Permission for the internship and guidance to the students from ${department} ${semester} SEM of ${collegeName} ${addressLine} for partial fulfilment of their degree.`,
      margin,
      cursorY,
      width - margin * 2,
      regularFont,
      fontSizeNormal,
      lineHeight
    );

    cursorY -= 10;

    page.drawText(`Ref: ${refNo}`, {
      x: margin,
      y: cursorY,
      size: fontSizeNormal,
      font: regularFont,
    });
    cursorY -= lineHeight * 2;

    page.drawText("Dear Sir/Madam,", {
      x: margin,
      y: cursorY,
      size: fontSizeNormal,
      font: regularFont,
    });
    cursorY -= lineHeight * 1.5;

    cursorY = drawWrappedText(
      `This is with the above reference letter, Student of ${department} branch ${semester} Sem of ${collegeName} is allowed to work at our centre as an intern from ${internshipStart} to ${internshipEnd}.`,
      margin,
      cursorY,
      width - margin * 2,
      regularFont,
      fontSizeNormal,
      lineHeight
    );

    cursorY -= 10;

    page.drawText(studentName, {
      x: margin + 20,
      y: cursorY,
      size: fontSizeNormal,
      font: boldFont,
    });
    cursorY -= lineHeight * 2;

    page.drawText("Thanking You,", {
      x: margin,
      y: cursorY,
      size: fontSizeNormal,
      font: regularFont,
    });
    cursorY -= lineHeight * 2;

    const rightBlockX = width - 180;
    page.drawText("Yours faithfully,", {
      x: rightBlockX,
      y: cursorY,
      size: fontSizeNormal,
      font: regularFont,
    });

    cursorY -= lineHeight * 2;
    page.drawText("Sanjay Balamwar", {
      x: rightBlockX,
      y: cursorY,
      size: fontSizeNormal,
      font: boldFont,
    });
    cursorY -= lineHeight;
    page.drawText("Associate Scientist", {
      x: rightBlockX,
      y: cursorY,
      size: fontSizeNormal,
      font: regularFont,
    });
    const footerPath = path.join(process.cwd(), "public", "images", "foot.png");
    const footerBytes = fs.readFileSync(footerPath);
    const footerImage = await pdfDoc.embedPng(footerBytes);
    const footerDims = footerImage.scale(0.41);
    page.drawImage(footerImage, {
      x: (width - footerDims.width) / 2,
      y: 10,
      width: footerDims.width,
      height: footerDims.height,
    });

    const pdfBytes = await pdfDoc.save();
    return {
      pdf: Buffer.from(pdfBytes),
      reference: randomRef.toString(),
    };
  } catch (err) {
    console.error("Error converting DOCX to PDF:", err);
    throw err;
  }
}
