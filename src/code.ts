function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf))
}

var tagsToReplace = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;'
}

function replaceTag(tag) {
  return tagsToReplace[tag] || tag
}

function safe_tags_replace(str) {
  return str.replace(/[&<>]/g, replaceTag)
}

figma.currentPage.selection.map(selected => {
  selected.exportAsync({ format: 'SVG' }).then(svgCode => {
    const svg = ab2str(svgCode)
    figma.showUI(__html__, { visible: false })
    figma.ui.postMessage({ type: 'networkRequest', data: svg })
    figma.ui.onmessage = async msg => {
      figma.showUI(
        `
  <pre><code style="white-space:pre-wrap;">${safe_tags_replace(
    msg
  )}</code></pre>
`
      )
    }
  })
})
