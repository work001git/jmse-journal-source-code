// src/utils/sampleTemplate.js
// Professional JMES Manuscript Template Generator & Guidelines

export const SAMPLE_TEMPLATE_SECTIONS = [
  { num: 1, title: 'Paper Title', desc: 'Concise, informative and specific to mathematical and environmental quantitative analysis (Max 20 words).' },
  { num: 2, title: 'Author Names', desc: 'Full names of all contributing authors (e.g., Dr. Jane A. Doe, Prof. John Smith).' },
  { num: 3, title: 'Author Affiliations', desc: 'Department, Institution / University, City, Postal Code, Country for each author.' },
  { num: 4, title: 'Corresponding Author Email', desc: 'Institutional email address with telephone/mobile and ORCID identifier.' },
  { num: 5, title: 'Abstract', desc: 'Self-contained, structured summary of context, methodology, key quantitative findings, and policy implications (150 - 250 words).' },
  { num: 6, title: 'Keywords', desc: '4 to 6 relevant keywords separated by semicolons (e.g., Spatial Econometrics; Markov Chains; Carbon Pricing).' },
  { num: 7, title: 'Introduction', desc: 'Background context, statement of the research problem, empirical gaps, and significance.' },
  { num: 8, title: 'Literature Review', desc: 'Critical synthesis of prior theoretical frameworks and empirical literature.' },
  { num: 9, title: 'Research Objectives & Hypotheses', desc: 'Explicitly formulated mathematical research questions or econometric hypotheses.' },
  { num: 10, title: 'Research Methodology', desc: 'Mathematical formulations, stochastic equations, sampling design, estimation techniques, and datasets.' },
  { num: 11, title: 'Results and Discussion', desc: 'Empirical estimation findings, statistical hypothesis tests, validation metrics, and comparison with existing literature.' },
  { num: 12, title: 'Tables and Figures', desc: 'High-resolution graphs and numbered tables with explicit titles and descriptive statistical notes.' },
  { num: 13, title: 'Conclusion and Policy Recommendations', desc: 'Summary of findings, quantitative implications, limitations, and future research directions.' },
  { num: 14, title: 'Acknowledgements and Funding', desc: 'Grant numbers, funding agencies, institutional assistance, or declaration of no external funding.' },
  { num: 15, title: 'References', desc: 'APA 7th Edition style citations with active DOI links for all cited works.' }
];

export const FORMATTING_GUIDELINES = [
  { item: 'Font & Sizing', detail: 'Times New Roman 12 pt for body text; 14 pt Bold for Section Headings; 1.5 line spacing.' },
  { item: 'Page Margins', detail: '1 inch (2.54 cm) on all sides (Top, Bottom, Left, Right).' },
  { item: 'Equations', detail: 'Numbered consecutively in parentheses flush right: e.g., (1), (2). Use equation editor.' },
  { item: 'File Format', detail: 'Microsoft Word (.docx) or PDF (.pdf). Maximum file size: 50 MB.' },
  { item: 'Anonymity for Blind Review', detail: 'Ensure author names are removed from the main manuscript file if double-blind review is selected.' }
];

export function downloadSampleDocx() {
  const content = `
  <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
  <head><title>JMES Manuscript Template</title>
  <style>
    body { font-family: "Times New Roman", serif; font-size: 12pt; line-height: 1.5; margin: 1in; }
    h1 { font-size: 18pt; text-align: center; color: #0F3D75; margin-bottom: 0.2in; }
    .badge { text-align: center; font-size: 10pt; color: #15803D; font-weight: bold; text-transform: uppercase; margin-bottom: 0.3in; }
    .authors { text-align: center; font-weight: bold; font-size: 12pt; margin-bottom: 0.1in; }
    .affil { text-align: center; font-style: italic; font-size: 10pt; margin-bottom: 0.2in; }
    h2 { font-size: 13pt; color: #0F3D75; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin-top: 18pt; }
    p { margin-bottom: 10pt; text-align: justify; }
  </style>
  </head>
  <body>
    <div class="badge">[JMES OFFICIAL RESEARCH MANUSCRIPT TEMPLATE]</div>
    <h1>[1. Title] Quantitative Mathematical Modeling of Environmental Dynamics: A Predictive Econometric Framework</h1>
    <div class="authors">[2. Authors] Jane A. Researcher<sup>1*</sup>, John M. Statistician<sup>2</sup></div>
    <div class="affil">[3. Affiliations] <sup>1</sup>Department of Applied Mathematics, University of Science, Country<br/><sup>2</sup>Institute for Econometrics & Environmental Studies, University, Country</div>
    <p><strong>[4. Corresponding Author Email]:</strong> author@example.edu | ORCID: 0000-0002-1825-0097</p>
    
    <h2>[5. Abstract]</h2>
    <p>This structured template provides authors with the standardized 15-part format required for publication in the Journal of Mathematics and Environmental Statistics (JMES). The abstract must summarize the problem statement, empirical methodology, statistical findings, and broader environmental significance in 150-250 words.</p>
    
    <p><strong>[6. Keywords]:</strong> Environmental Statistics; Econometric Modeling; Bayesian Estimation; Sustainability; Stochastic Process</p>

    <h2>[7. Introduction]</h2>
    <p>Provide foundational context for the mathematical or econometric problem, highlighting the environmental dilemma addressed.</p>

    <h2>[8. Literature Review]</h2>
    <p>Synthesize relevant recent studies, highlighting methodological gaps in existing quantitative tools.</p>

    <h2>[9. Research Objectives]</h2>
    <p>Formulate testable mathematical hypotheses or specific econometric estimation objectives.</p>

    <h2>[10. Research Methodology]</h2>
    <p>Detail all equations, assumptions, estimators, and datasets:</p>
    <p style="text-align:center;"><em>Y<sub>t</sub> = &alpha; + &beta;X<sub>t</sub> + &epsilon;<sub>t</sub>, &nbsp;&nbsp;&nbsp; &epsilon;<sub>t</sub> ~ N(0, &sigma;<sup>2</sup>) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (1)</em></p>

    <h2>[11. Results and Discussion]</h2>
    <p>Elaborate on the statistical outputs, goodness-of-fit indicators, parameter tests, and theoretical alignment.</p>

    <h2>[12. Tables and Figures]</h2>
    <p>[Insert labeled Tables and High-resolution Figures here with comprehensive captions and sources]</p>

    <h2>[13. Conclusion]</h2>
    <p>State key empirical takeaways, practical policy ramifications, research constraints, and prospects for future inquiry.</p>

    <h2>[14. Acknowledgements]</h2>
    <p>Acknowledge institutional support, high-performance computing facilities, or grant funding references.</p>

    <h2>[15. References]</h2>
    <p>1. Miller, S. J., & Petrov, E. (2025). Spatial econometrics in atmospheric monitoring. <em>Journal of Mathematics and Environmental Statistics</em>, 11(2), 45-62. https://doi.org/10.5555/jmes.2025.0045</p>
  </body>
  </html>
  `;

  const blob = new Blob([content], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'JMES_Sample_Research_Paper_Template.doc';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadSamplePdf() {
  // Generates print/save as PDF window
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to download or view the PDF template.');
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>JMES Manuscript Sample Template (PDF)</title>
      <style>
        @page { size: A4; margin: 20mm; }
        body { font-family: "Georgia", serif; line-height: 1.6; color: #1e293b; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #0F3D75; padding-bottom: 15px; margin-bottom: 25px; }
        .tag { display: inline-block; background: #0F3D75; color: white; padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
        h1 { color: #0F3D75; font-size: 20px; text-align: center; margin: 15px 0 10px; }
        .meta { text-align: center; font-size: 13px; color: #64748b; margin-bottom: 20px; }
        h2 { color: #15803D; font-size: 14px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; margin-top: 20px; text-transform: uppercase; }
        p { font-size: 12px; text-align: justify; margin: 8px 0; }
        .box { background: #f8fafc; border-left: 3px solid #0F3D75; padding: 10px 15px; margin: 15px 0; font-size: 12px; font-style: italic; }
      </style>
    </head>
    <body>
      <div class="header">
        <span class="tag">Journal of Mathematics and Environmental Statistics (JMES)</span>
        <h1>Official Sample Manuscript Format</h1>
        <div class="meta">15-Section Standardized Academic Publishing Template</div>
      </div>
      <div class="box">
        <strong>Template Notice:</strong> This document demonstrates the structural format required for all submissions to JMES. You may use your browser's Print dialog (Ctrl+P / Cmd+P) to Save as PDF.
      </div>
      ${SAMPLE_TEMPLATE_SECTIONS.map(s => `
        <h2>[${s.num}. ${s.title}]</h2>
        <p>${s.desc}</p>
      `).join('')}
      <script>
        window.onload = function() { window.print(); }
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}
