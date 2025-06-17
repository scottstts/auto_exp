function formatAndColorLines() {
  const doc    = DocumentApp.getActiveDocument();
  const body   = doc.getBody();

  // Colours for each symbol
  const symbolColors = {
    '<': '#FFA500',  // orange
    '#': '#00008B'   // deep blue
  };

  body.getParagraphs().forEach(par => {
    // 1) Grab the raw text
    let t   = par.editAsText();
    let raw = t.getText();
    if (!raw) return;

    // 2) Detect heading level
    const trimmed = raw.trim();
    const isH2    = trimmed.startsWith('##');
    const isH1    = !isH2 && trimmed.startsWith('#');

    if (isH1 || isH2) {
      // 2a) Strip off the leading hashes and any following space
      const content = trimmed.replace(/^#{1,2}\s*/, '');
      // 2b) Replace paragraph text, apply heading
      par.setText(content);
      par.setHeading(isH2
        ? DocumentApp.ParagraphHeading.HEADING2
        : DocumentApp.ParagraphHeading.HEADING1
      );
      // 2c) Re-fetch text & TextRange for coloring
      t   = par.editAsText();
      raw = t.getText();
    } else {
      // Not a heading → ensure normal text
      par.setHeading(DocumentApp.ParagraphHeading.NORMAL);
    }

    // 3) Clear any existing colour
    if (raw.length > 0) {
      t.setForegroundColor(0, raw.length - 1, null);
    }

    // 4) Colour entire heading deep blue, then skip per-line colouring
    if (isH1 || isH2) {
      t.setForegroundColor(0, raw.length - 1, symbolColors['#']);
      return;
    }

    // 5) For non-headings, walk each visual line and apply colours
    let start = 0;
    while (start < raw.length) {
      // find line end (\r, \n, or \r\n)
      const idxR = raw.indexOf('\r', start);
      const idxN = raw.indexOf('\n', start);
      let end;
      if (idxR === -1 && idxN === -1) {
        end = raw.length;
      } else if (idxR === -1) {
        end = idxN;
      } else if (idxN === -1) {
        end = idxR;
      } else {
        end = Math.min(idxR, idxN);
      }

      // extract the line, figure out its first character
      const line     = raw.substring(start, end);
      const lineTrim = line.trim();
      const first    = lineTrim.charAt(0);

      if (symbolColors[first]) {
        // find where the trimmed text lives in the raw string
        const us = raw.indexOf(lineTrim, start);
        const ue = us + lineTrim.length - 1;
        t.setForegroundColor(us, ue, symbolColors[first]);
      }

      // advance past the newline(s)
      if (end === raw.length) break;
      start = (raw[end] === '\r' && raw[end + 1] === '\n')
        ? end + 2
        : end + 1;
    }
  });
}
