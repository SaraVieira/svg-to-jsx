function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}

figma.currentPage.selection.map((selected) => {
  selected.exportAsync({ format: "SVG" }).then((svgCode) => {
    const svg = ab2str(svgCode);
    figma.showUI(__html__, { visible: false });
    figma.ui.postMessage({ type: "networkRequest", data: svg });
    figma.showUI(__html__, { visible: true, width: 500, height: 500 });
    figma.ui.postMessage({ type: "show-ui", data: svg });
  });
});
