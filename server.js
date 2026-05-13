import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import bodyParser from "body-parser";
import PDFDocument from "pdfkit";
import { Readable } from "stream";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Configure Nodemailer with Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER || "lokeshlokesh12321@gmail.com",
    pass: process.env.GMAIL_PASS || "hwzm zbhu upcs yszd",
  },
});

// Helper function to generate PDF
function generatePDF(studentName, regNo, subjects, finals, avg) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 20 });
      let chunks = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      // Header
      doc.fontSize(24).font("Helvetica-Bold").text("EvalPro", { align: "center" });
      doc.fontSize(12).fillColor("#666").text("Internal Marks Calculator", { align: "center" });
      doc.moveTo(20, doc.y + 5).lineTo(580, doc.y + 5).stroke();
      doc.moveDown();

      // Student Info
      doc.fontSize(11).fillColor("#000");
      doc.text(`Student Name: ${studentName || "N/A"}`);
      doc.text(`Registration No: ${regNo || "N/A"}`);
      doc.text(`Report Date: ${new Date().toLocaleDateString("en-IN")}`);
      doc.moveDown();

      // Overall Average
      doc.fontSize(13).font("Helvetica-Bold").fillColor("#4f46e5");
      doc.text(`Overall Average: ${avg.toFixed(1)}/60`);
      doc.font("Helvetica").moveDown();

      // Subjects Table
      doc.fontSize(10).fillColor("#000");
      const tableTop = doc.y;
      const col1 = 30, col2 = 150, col3 = 250, col4 = 350, col5 = 450;

      // Table Header
      doc.font("Helvetica-Bold").fillColor("#fff").rect(20, tableTop, 560, 20).fill("#4f46e5");
      doc.fillColor("#fff");
      doc.text("Subject", col1, tableTop + 5);
      doc.text("M1/60", col2, tableTop + 5);
      doc.text("M2/60", col3, tableTop + 5);
      doc.text("Final/60", col4, tableTop + 5);
      doc.text("Grade", col5, tableTop + 5);

      // Table Rows
      doc.font("Helvetica").fillColor("#000");
      let y = tableTop + 25;

      subjects.forEach((subject, i) => {
        doc.text(subject.name || `Subject ${i + 1}`, col1, y);
        doc.text(subject.m1 !== null ? subject.m1.toFixed(1) : "—", col2, y);
        doc.text(subject.m2 !== null ? subject.m2.toFixed(1) : "—", col3, y);
        doc.text(subject.final !== null ? subject.final.toFixed(1) : "—", col4, y);
        doc.text(subject.grade || "—", col5, y);
        y += 20;
      });

      // Footer
      doc.fontSize(10).fillColor("#666");
      doc.text("EvalPro – Built with precision", { align: "center" });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

// Email endpoint
app.post("/api/send-email", async (req, res) => {
  try {
    const { email, studentName, regNo, subjects, finals, avg } = req.body;

    // Validate input
    if (!email || !studentName) {
      return res.status(400).json({ error: "Missing email or student name" });
    }

    // Generate PDF
    const pdfBuffer = await generatePDF(studentName, regNo, subjects, finals, avg);

    // Prepare email
    const mailOptions = {
      from: "lokeshlokesh12321@gmail.com",
      to: email,
      subject: "Your Internal Marks Report – EvalPro",
      html: `
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; background: #f4f6f8; }
              .container { max-width: 520px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; }
              .header { background: #4f46e5; color: #fff; padding: 20px; text-align: center; }
              .content { padding: 25px; color: #333; line-height: 1.6; }
              .highlight { margin: 20px 0; padding: 15px; background: #eef2ff; border-left: 5px solid #4f46e5; border-radius: 6px; }
              .footer { background: #f9fafb; text-align: center; padding: 15px; font-size: 12px; color: #777; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 24px;">EvalPro</h1>
                <p style="margin: 5px 0 0; font-size: 14px;">Internal Marks Calculator</p>
              </div>
              <div class="content">
                <p>Hi <strong>${studentName}</strong>,</p>
                <p>Your internal marks have been successfully calculated using <strong>EvalPro</strong>.</p>
                <div class="highlight">
                  📄 <strong>Your detailed marks report is attached as PDF.</strong><br>
                  Please download and review your results.
                </div>
                <p style="margin-top: 20px;">
                  If you notice any discrepancies, please contact your faculty or administration.
                </p>
                <p>
                  Regards,<br>
                  <strong>EvalPro Team</strong>
                </p>
              </div>
              <div class="footer">
                EvalPro – Built with precision
              </div>
            </div>
          </body>
        </html>
      `,
      attachments: [
        {
          filename: `Marks_Report_${studentName}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Email sent successfully with PDF attachment!" });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "Backend running" });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ EvalPro Backend running on http://localhost:${PORT}`);
});
