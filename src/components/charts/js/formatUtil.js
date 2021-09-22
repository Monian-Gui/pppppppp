/* eslint-disable */

var format = {
  gridFormat: gridString => {
    let gridList = gridString.split(',')
    gridList.map((item, index) => {
      if (item.indexOf('%' || 'px') == -1) {
        gridList[index] = item + '%'
      }
    })
    let grid = {
      top: gridList[0],
      right: gridList[1],
      bottom: gridList[2],
      left: gridList[3],
      containLabel: true
    }
    return grid
  },
  yAxisScopeFormat: scopeString => {
    let scopeList = []
    if (scopeString == null) {
      scopeList = [null, null]
    } else {
      scopeList = scopeString.split(',')
    }
    return scopeList
  },
  unitFormat: oldUnit => {
    let unit
    if (oldUnit) {
      unit = `(${oldUnit})`
    } else {
      unit = null
    }
    return unit
  },
  lightColor: (col, amt = 0) => {
    var usePound = false
    if (col[0] == '#') {
      col = col.slice(1)
      usePound = true
    }
    var num = parseInt(col, 16)
    var r = (num >> 16) + amt

    if (r > 255) r = 255
    else if (r < 0) r = 0

    var b = ((num >> 8) & 0x00ff) + amt

    if (b > 255) b = 255
    else if (b < 0) b = 0

    var g = (num & 0x0000ff) + amt

    if (g > 255) g = 255
    else if (g < 0) g = 0

    return (usePound ? '#' : '') + String('000000' + (g | (b << 8) | (r << 16)).toString(16)).slice(-6)
  }
}

export default format
