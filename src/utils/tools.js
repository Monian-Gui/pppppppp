export function millionDataDispose(array, level = 50000) {
  if (Array.isArray(array) && array.indexOf(undefined) == -1) {
    // 平均值大于level就转为万单位
    const average = eval(array.join('+')) / array.length
    let unit = ''
    if (average > level) {
      unit = '万'
      let data = []
      array.map(item => {
        item > 100 ? (item = (item / 10000).toFixed(2)) : (item = 0.01)
        data.push(parseFloat(item))
      })
      array = data
    }
    const resData = {
      unit,
      data: array
    }
    return resData
  } else {
    console.error('不是数组:', array)
    return null
  }
}

// 根据数量动态获取颜色值
export function getColorListByCount(count) {
  let list = []
  for (let i = 0; i < count; i++) {
    const num = Math.floor(360 / count - 1)
    list.push(`hsl(${num * i}deg,100%,50%)`)
  }
  return list
}

// 数字过滤器
export function numberFormat(value, count = 2) {
  // value 传入的数字或数组
  // count 保留几位小数
  let realValue,
    real = [[], []]
  let unit = ''
  let k = 10000,
    sizes = ['', '万', '亿', '万亿', '万万亿'],
    i
  if (value instanceof Array) {
    let max = Math.max(...value)
    i = Math.floor(Math.log(max) / Math.log(k))
    if (sizes.length - 1 < i) {
      realValue = 0
    } else {
      unit = sizes[i]
    }
    if (max > k) {
      value.forEach(item => {
        realValue = item / Math.pow(k, i)
        // if (realValue <= 1) {
        //   real[0].push(parseFloat((+realValue || 0).toFixed(6)))
        // } else {
        //   real[0].push(parseFloat((+realValue || 0).toFixed(2)))
        // }
        real[0].push(parseFloat((+realValue || 0).toFixed(count)))
      })
      real[1] = unit
      return real
    } else {
      return [value, '']
    }
  } else {
    if (value < k) {
      return [value, '']
    } else {
      //取传入的数以e为底的对数和对应k的对数 相除得出对应单位的位置
      i = Math.floor(Math.log(value) / Math.log(k))
      // realvalue = (value / Math.pow(k, i)).toFixed(2)
      //pow()返回幂指数 返回
      realValue = value / Math.pow(k, i)
      if (sizes.length - 1 < i) {
        realValue = 0
      } else {
        unit = sizes[i]
      }
    }
    //正则判断 返回3个数加一个,
    //变量前面添+相当于number(realvalue)
    return [parseFloat((+realValue || 0).toFixed(count)), unit]
  }
}
