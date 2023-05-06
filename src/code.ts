// Utility functions start here
function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf))
}

const debounceSelection = (func, wait, immediate) => {
  let timeout
  return function () {
    let context = this,
      args = arguments
    let later = function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    let callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}

const exportSelected = (svgCode: Uint8Array) => {
  const svg = ab2str(svgCode)
  figma.showUI(__html__, { visible: true, width: 500, height: 500 })
  figma.ui.postMessage({ type: 'networkRequest', data: svg })
}

// Figma functionalities start here

figma.currentPage.selection.map((selected) => {
  selected.exportAsync({ format: 'SVG' }).then((svgCode) => {
    exportSelected(svgCode)
  })
})

//@ts-ignore (figma has updated their plugin API and the types in this project are outdated)
figma.on(
  'selectionchange',
  debounceSelection(
    () => {
      figma.currentPage.selection.map((selected) => {
        selected.exportAsync({ format: 'SVG' }).then((svgCode) => {
          figma.ui.postMessage({ type: 'networkRequest', data: ab2str(svgCode) })
        })
      })
    },
    1000,
    0
  )
)
