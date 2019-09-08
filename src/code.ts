function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf))
}

figma.currentPage.selection.map(selected => {
  selected.exportAsync({ format: 'SVG' }).then(svgCode => {
    const svg = ab2str(svgCode)
    figma.showUI(__html__, { visible: false })
    figma.ui.postMessage({ type: 'networkRequest', data: svg })
    figma.ui.onmessage = async msg => {
      figma.showUI(__html__, { visible: true })
      figma.ui.postMessage({ type: 'show-ui', data: msg })
    }
  })
})
