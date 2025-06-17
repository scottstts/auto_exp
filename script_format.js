/**
 * -------------------------------------------------------------------
 *  Universal Google Docs formatter
 *  – Resets whole doc to Normal/Arial/11/black
 *  – Converts markdown-style # & ## to H1/H2
 *  – Colours lines starting with "<" (orange) or headings (deep blue)
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
  return `Formatted: “${doc.getName()}” (${doc.getId()})`;
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
     .setForegroundColor(0, len - 1, '#000000');
  });

  /* ------- 2) HEADING & COLOUR LOGIC ---------------------------- */
  const colours = { '<': '#FFA500', '#': '#00008B' };

  body.getParagraphs().forEach(p => {
    let t = p.editAsText(); let raw = t.getText(); if (!raw) return;

    const trim = raw.trim();
    const isH2 = trim.startsWith('##');
    const isH1 = !isH2 && trim.startsWith('#');

    if (isH1 || isH2) {
      const content = trim.replace(/^#{1,2}\s*/, '');
      p.setText(content);
      p.setHeading(isH2
        ? DocumentApp.ParagraphHeading.HEADING2
        : DocumentApp.ParagraphHeading.HEADING1);
      t = p.editAsText(); raw = t.getText();
    } else {
      p.setHeading(DocumentApp.ParagraphHeading.NORMAL);
    }

    t.setForegroundColor(0, raw.length - 1, null);
    if (isH1 || isH2) {
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
      if (colours[first]) {
        const us = raw.indexOf(lineTrim, start);
        const ue = us + lineTrim.length - 1;
        t.setForegroundColor(us, ue, colours[first]);
      }
      start = (next === raw.length) ? raw.length
            : (raw.substr(next, 2) === '\r\n') ? next + 2 : next + 1;
    }
  });
}