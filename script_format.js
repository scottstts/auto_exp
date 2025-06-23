/**
 * -------------------------------------------------------------------
 *  Universal Google Docs formatter
 *  – Resets whole doc to Normal/Arial/11/black
 *  – Converts markdown-style # & ## to H1/H2
 *  – Colours lines: 
 *    • <script_edit> and </script_edit> tags (red)
 *    • <change_tracking> and </change_tracking> tags (green)
 *    • Other lines starting with "<" (orange)
 *    • Headings (deep blue)
 *  – Converts *text* to bold
 *  – Converts ~text~ to strikethrough
 *  – Converts lines starting with • to bulleted lists
 *
 *  MAIN ENTRY for Apps Script API:   resetAndFormat(docId)
 *  WEB-APP ENTRY (optional):        doPost(e)  /  doGet(e)
 * -------------------------------------------------------------------
 */

/**
 * === PUBLIC =======================================================
 * Called by Apps Script Execution API (scripts.run) or internally.
 *
 * @param {string=} docId
 * @return {string} status text
 */
function resetAndFormat(docId) {
  const doc = docId
    ? DocumentApp.openById(docId)
    : DocumentApp.getActiveDocument();
  formatDocument_(doc);
  return `Formatted: "${doc.getName()}" (${doc.getId()})`;
}

/**
 * === WEB-APP: POST ================================================
 * Accepts either:
 *   •  JSON   { "docId":"1AbC..." }
 *   •  URL-encoded  docId=1AbC...
 * Returns JSON  { status:"Formatted: …" }
 */
function doPost(e) {
  const docId = extractDocId_(e);
  const status = resetAndFormat(docId);
  return jsonOut_({ status });
}

/**
 * === WEB-APP: GET (optional) ======================================
 * Allows quick browser tests →  https://…/exec?docId=1AbC…
 */
function doGet(e) {
  const docId = e.parameter.docId || '';
  const status = resetAndFormat(docId);
  return jsonOut_({ status });
}

/* =================================================================
 * INTERNAL HELPERS & CORE LOGIC
 * =================================================================*/

/**
 * Robustly pull docId from the event object.
 * @param {!Object} e  Web-app event
 * @return {string}
 */
function extractDocId_(e) {
  // 1) If body JSON                           (Content-Type: application/json)
  if (e.postData && e.postData.contents) {
    try {
      const body = JSON.parse(e.postData.contents);
      if (body && body.docId) return body.docId;
    } catch (_) {
      /* not JSON – fall through */
    }
    // 2) If URL-encoded or multipart form
    const match = /(?:^|&|\?)docId=([^&]+)/i.exec(e.postData.contents);
    if (match) return decodeURIComponent(match[1]);
  }
  // 3) If passed as query string param
  if (e.parameter && e.parameter.docId) return e.parameter.docId;

  throw new Error('docId not provided');
}

/** Return JSON output */
function jsonOut_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Core formatter: full reset + heading / colour logic.
 * @param {!GoogleAppsScript.Document.Document} doc
 */
function formatDocument_(doc) {
  const body = doc.getBody();

  /* ------- 1) GLOBAL RESET -------------------------------------- */
  body.getParagraphs().forEach(p => {
    const t = p.editAsText(); if (!t) return;
    p.setHeading(DocumentApp.ParagraphHeading.NORMAL);
    const len = t.getText().length; if (!len) return;
    t.setFontFamily(0, len - 1, 'Arial')
     .setFontSize  (0, len - 1, 11)
     .setBold      (0, len - 1, false)
     .setItalic    (0, len - 1, false)
     .setUnderline (0, len - 1, false)
     .setStrikethrough(0, len - 1, false)
     .setForegroundColor(0, len - 1, '#000000');
  });

  /* ------- 2) PROCESS MARKDOWN FIRST (before text changes) ------ */
  body.getParagraphs().forEach(p => {
    const t = p.editAsText();
    let text = t.getText();
    if (!text) return;

    // Process all markdown in this paragraph
    processMarkdownInParagraph_(t);
  });

  /* ------- 3) HEADING PROCESSING -------------------------------- */
  body.getParagraphs().forEach(p => {
    const t = p.editAsText();
    const text = t.getText();
    if (!text) return;

    const trim = text.trim();
    const isH2 = trim.startsWith('##');
    const isH1 = !isH2 && trim.startsWith('#');

    if (isH1 || isH2) {
      // Find where the heading marker ends
      const match = trim.match(/^#{1,2}\s*/);
      if (match) {
        // Delete only the heading markers
        const startIdx = text.indexOf(match[0]);
        if (startIdx !== -1) {
          t.deleteText(startIdx, startIdx + match[0].length - 1);
        }
      }
      
      p.setHeading(isH2
        ? DocumentApp.ParagraphHeading.HEADING2
        : DocumentApp.ParagraphHeading.HEADING1);
    }
  });

  /* ------- 4) COLOR LOGIC --------------------------------------- */
  const colours = { 
    '<': '#FFA500',  // Orange (default for < tags)
    '#': '#00008B'   // Deep blue for headings
  };
  
  const specialTags = {
    '<script_edit>': '#FF0000',      // Red
    '</script_edit>': '#FF0000',     // Red
    '<change_tracking>': '#008000',   // Green
    '</change_tracking>': '#008000'   // Green
  };

  body.getParagraphs().forEach(p => {
    const t = p.editAsText();
    const raw = t.getText();
    if (!raw) return;

    // Color headings
    if (p.getHeading() === DocumentApp.ParagraphHeading.HEADING1 ||
        p.getHeading() === DocumentApp.ParagraphHeading.HEADING2) {
      t.setForegroundColor(0, raw.length - 1, colours['#']);
      return;
    }

    /* per-visual-line colouring */
    let start = 0;
    while (start < raw.length) {
      const next = Math.min(
        ~raw.indexOf('\n', start) ? raw.indexOf('\n', start) : raw.length,
        ~raw.indexOf('\r', start) ? raw.indexOf('\r', start) : raw.length
      );
      const lineTrim = raw.substring(start, next).trim();
      const first = lineTrim.charAt(0);
      
      // Check for special tags first
      let colorToUse = null;
      if (specialTags[lineTrim]) {
        colorToUse = specialTags[lineTrim];
      } else if (colours[first]) {
        colorToUse = colours[first];
      }
      
      if (colorToUse) {
        const us = raw.indexOf(lineTrim, start);
        const ue = us + lineTrim.length - 1;
        t.setForegroundColor(us, ue, colorToUse);
      }
      start = (next === raw.length) ? raw.length
            : (raw.substr(next, 2) === '\r\n') ? next + 2 : next + 1;
    }
  });

  /* ------- 5) BULLET POINTS ------------------------------------- */
  const paragraphs = body.getParagraphs();
  for (let i = paragraphs.length - 1; i >= 0; i--) {
    const p = paragraphs[i];
    const txt = p.editAsText();
    const text = txt.getText();
    
    if (!text) continue;
    
    // Look for "• " at the start (allow optional spaces before it)
    const match = text.match(/^(\s*•\s*)/);
    if (!match) continue;
    
    // Remove just the matched bullet chars
    txt.deleteText(0, match[0].length - 1);
    
    // Convert the paragraph into a bulleted list item
    p.asParagraph().setGlyphType(DocumentApp.GlyphType.BULLET);
  }
}

/**
 * Process all markdown in a single paragraph
 * @param {GoogleAppsScript.Document.Text} textElement - The text element to process
 */
function processMarkdownInParagraph_(textElement) {
  let text = textElement.getText();
  if (!text) return;
  
  // Collect all markdown patterns with their positions
  const allPatterns = [];
  
  // Find bold patterns *text*
  let boldRegex = /\*([^*]+)\*/g;
  let match;
  while ((match = boldRegex.exec(text)) !== null) {
    allPatterns.push({
      start: match.index,
      end: match.index + match[0].length - 1,
      content: match[1],
      type: 'bold',
      fullMatch: match[0]
    });
  }
  
  // Find strikethrough patterns ~text~
  let strikeRegex = /~([^~]+)~/g;
  while ((match = strikeRegex.exec(text)) !== null) {
    allPatterns.push({
      start: match.index,
      end: match.index + match[0].length - 1,
      content: match[1],
      type: 'strikethrough',
      fullMatch: match[0]
    });
  }
  
  // Sort by position (end to start) to avoid index shifting
  allPatterns.sort((a, b) => b.start - a.start);
  
  // Apply each pattern
  allPatterns.forEach(pattern => {
    // Delete the full match (including markers)
    textElement.deleteText(pattern.start, pattern.end);
    
    // Insert the content without markers
    textElement.insertText(pattern.start, pattern.content);
    
    // Apply the appropriate formatting
    const endPos = pattern.start + pattern.content.length - 1;
    if (pattern.type === 'bold') {
      textElement.setBold(pattern.start, endPos, true);
    } else if (pattern.type === 'strikethrough') {
      textElement.setStrikethrough(pattern.start, endPos, true);
    }
  });
}