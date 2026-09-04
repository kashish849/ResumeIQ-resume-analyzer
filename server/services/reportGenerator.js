import PDFKit from 'pdfkit';

// Streams a clean, printable PDF report for a completed analysis.
// res is an Express response object the caller has already set headers on.
export function streamAnalysisReport(res, { fileName, analysis, jobMatch }) {
  const doc = new PDFKit({ margin: 50 });
  doc.pipe(res);

  doc.fontSize(20).fillColor('#1e1b4b').text('ResumeIQ Analysis Report', { align: 'left' });
  doc.moveDown(0.3);
  doc.fontSize(10).fillColor('#6b7280').text(`Resume: ${fileName || 'Untitled resume'}`);
  doc.text(`Generated: ${new Date().toLocaleString()}`);
  doc.moveDown(1);

  doc.fontSize(16).fillColor('#111827').text(`Overall Score: ${analysis.overall} / 100`);
  doc.fontSize(11).fillColor('#4338ca').text(analysis.label);
  doc.moveDown(1);

  doc.fontSize(13).fillColor('#111827').text('Score Breakdown');
  doc.moveDown(0.3);
  doc.fontSize(10).fillColor('#374151');
  Object.entries(analysis.breakdown).forEach(([key, value]) => {
    doc.text(`${formatLabel(key)}: ${value}/100`);
  });
  doc.moveDown(1);

  if (jobMatch) {
    doc.fontSize(13).fillColor('#111827').text('Job Match');
    doc.moveDown(0.3);
    doc.fontSize(10).fillColor('#374151').text(`Match: ${jobMatch.matchPercentage}%`);
    doc.text(`Matching keywords: ${jobMatch.matchingKeywords.join(', ') || 'None detected'}`);
    doc.text(`Missing keywords: ${jobMatch.missingKeywords.join(', ') || 'None'}`);
    doc.moveDown(1);
  }

  doc.fontSize(13).fillColor('#111827').text('Strengths');
  doc.fontSize(10).fillColor('#065f46');
  analysis.strengths.forEach((s) => doc.text(`+ ${s}`));
  doc.moveDown(0.5);

  doc.fontSize(13).fillColor('#111827').text('Issues');
  doc.fontSize(10).fillColor('#92400e');
  analysis.issues.forEach((i) => doc.text(`! ${i}`));
  doc.moveDown(0.5);

  doc.fontSize(13).fillColor('#111827').text('Recommendations');
  analysis.recommendations.forEach((rec) => {
    doc.moveDown(0.3);
    doc.fontSize(10).fillColor('#1e1b4b').text(`[${rec.priority}] ${rec.category}: ${rec.problem}`);
    doc.fontSize(9).fillColor('#4b5563').text(rec.explanation);
    doc.fontSize(9).fillColor('#065f46').text(`Suggested action: ${rec.action}`);
  });

  doc.end();
}

function formatLabel(key) {
  const map = {
    atsCompatibility: 'ATS Compatibility',
    keywords: 'Keywords',
    skills: 'Skills',
    experience: 'Experience',
    formatting: 'Formatting',
    sections: 'Sections',
    readability: 'Readability',
  };
  return map[key] || key;
}
