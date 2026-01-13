const CRAZY_COLORS = [
  "#FF6B6B",
  "#FFE66D",
  "#6BCB77",
  "#4D96FF",
  "#835AF1",
  "#FF924C",
  "#FF3EA5",
  "#25CED1",
  "#FFD93D",
  "#9B5DE5"
];

function onOpen() {
  DocumentApp.getUi()
    .createAddonMenu()
    .addItem("Highlight Selection", "CrazyText.highlightSelection")
    .addItem("Highlight Document", "CrazyText.highlightDocument")
    .addToUi();
}

function onInstall(e) {
  onOpen(e);
}

const CrazyText = (function () {
  function highlightSelection() {
    const doc = DocumentApp.getActiveDocument();
    const selection = doc.getSelection();

    if (!selection) {
      DocumentApp.getUi().alert("Select some text or run 'Highlight Document'.");
      return;
    }

    const rangeElements = selection.getRangeElements();
    for (let i = 0; i < rangeElements.length; i++) {
      applyCrazyColorsToRange(rangeElements[i]);
    }
  }

  function highlightDocument() {
    const doc = DocumentApp.getActiveDocument();
    const body = doc.getBody();
    applyCrazyColors(body);
  }

  // Recursively walks the document tree so nested elements (tables, lists) get covered.
  function applyCrazyColors(element) {
    if (element.getType && element.getType() === DocumentApp.ElementType.TEXT) {
      paintText(element.asText());
      return;
    }

    if (!element.getNumChildren) {
      return;
    }

    const childCount = element.getNumChildren();
    for (let i = 0; i < childCount; i++) {
      applyCrazyColors(element.getChild(i));
    }
  }

  function applyCrazyColorsToRange(rangeElement) {
    const element = rangeElement.getElement();
    if (!element.editAsText) {
      return;
    }

    const text = element.editAsText();
    let start = rangeElement.getStartOffset();
    let end = rangeElement.getEndOffsetInclusive();

    if (start === -1 && end === -1) {
      start = 0;
      end = text.getText().length - 1;
    }

    for (let idx = start; idx <= end; idx++) {
      if (!isLetter(text.getText().charAt(idx))) {
        continue;
      }
      text.setBackgroundColor(idx, idx, randomCrazyColor());
    }
  }

  function paintText(text) {
    const content = text.getText();
    for (let idx = 0; idx < content.length; idx++) {
      if (!isLetter(content.charAt(idx))) {
        continue;
      }
      text.setBackgroundColor(idx, idx, randomCrazyColor());
    }
  }

  function randomCrazyColor() {
    const index = Math.floor(Math.random() * CRAZY_COLORS.length);
    return CRAZY_COLORS[index];
  }

  function isLetter(char) {
    return /[A-Z]/i.test(char);
  }

  return {
    highlightSelection,
    highlightDocument,
  };
})();
