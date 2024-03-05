import { debounce } from "lodash-es";

// Utility functions start here
function ab2str(buf: Uint8Array) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}

const exportSelected = (svgCode: Uint8Array) => {
  const svg = ab2str(svgCode);
  figma.showUI(__html__, { visible: true, width: 500, height: 500 });
  figma.ui.postMessage({ type: "networkRequest", data: svg });
};

// Figma functionalities start here
figma.currentPage.selection.map((selected) =>
  selected.exportAsync({ format: "SVG" }).then((svgCode) => {
    exportSelected(svgCode);
  })
);

figma.on(
  "selectionchange",
  debounce(() => {
    figma.currentPage.selection.map((selected) => {
      selected.exportAsync({ format: "SVG" }).then((svgCode) => {
        figma.ui.postMessage({
          type: "networkRequest",
          data: ab2str(svgCode),
        });
      });
    });
  }, 1000)
);
