<template>
  <div
    class="gradual-btn"
    ref="btn"
    :style="mouse ? ActiveStyle : style"
    @mouseover="mouse = true"
    @mouseleave="mouse = false"
  >
    <div class="font" :style="fontStyle"><slot></slot></div>
  </div>
</template>

<script>
export default {
  props: {
    // 按钮颜色，按钮其他颜色根据该颜色值动态改变
    color: {
      type: String,
      default: '#235783'
    },
    // 圆角度
    radius: {
      type: String,
      default: '0px'
    },
    // 渐变方式
    type: {
      // radial 径向渐变
      // linear 线性渐变
      type: String,
      default: 'radial'
    },
    // 渐变方向（仅在线性渐变时有效）
    direction: {
      type: String,
      default: 'right'
    },
    // 是否有边框
    border: {
      type: Boolean,
      default: true
    },
    // 是否有阴影
    shadow: {
      type: Boolean,
      default: false
    },
    // 边框是否倾斜（平行四边形）
    incline: {
      type: Boolean,
      default: false
    },
    // 按钮大小
    size: {
      // medium  small  mini
      type: String,
      default: 'medium'
    },
    // 按钮大小
    fontSize: {
      // medium  small  mini
      type: String,
      default: '16px'
    }
  },
  data() {
    return {
      mouse: false
    }
  },
  computed: {
    'background-image'() {
      let gradient = 'background-image:'

      if (this.type == 'radial') {
        gradient += `radial-gradient(50% 180% ellipse,${this.lightColor(this.color, -80)} 40%, ${this.color} 100% );`
      } else if (this.type == 'linear') {
        gradient += `linear-gradient(to ${this.direction}, ${this.lightColor(this.color, -100)}, ${this.color} );`
      }

      return gradient
    },
    'active-background'() {
      let gradient = 'background-image:'

      if (this.type == 'radial') {
        gradient += `radial-gradient(50% 180% ellipse,${this.lightColor(this.color, -50)} 40%, ${this.lightColor(
          this.color,
          30
        )} 100% );`
      } else if (this.type == 'linear') {
        gradient += `linear-gradient(to ${this.direction}, ${this.lightColor(this.color, -80)}, ${this.lightColor(
          this.color,
          30
        )} );`
      }

      return gradient
    },
    'font-color'() {
      return `color:${this.lightColor(this.color, 100)};`
    },
    'border-radius'() {
      return `border-radius: ${this.radius};`
    },
    'border-show'() {
      return this.border ? `border: 1px solid ${this.lightColor(this.color, 30)};` : ''
    },
    'box-shadow'() {
      return this.shadow ? `box-shadow: 0px 0px 8px ${this.lightColor(this.color, 100)};` : ''
    },
    'incline-show'() {
      return this.incline ? 'transform:skew(-20deg);' : ''
    },
    padding() {
      let padding = 'padding: '
      switch (this.size) {
        case 'medium':
          padding += '10px 30px;'
          break
        case 'small':
          padding += '8px 20px;'
          break
        case 'mini':
          padding += '5px 10px;'
          break
        default:
          break
      }
      return padding
    },
    'font-size'() {
      return `font-size:${this.fontSize};`
    },
    style() {
      let style = ''
      let list = [
        'background-image',
        'font-color',
        'border-show',
        'border-radius',
        'incline-show',
        'padding',
        'font-size',
        'box-shadow'
      ]
      list.forEach(item => {
        style += this[item]
      })
      return style
    },
    ActiveStyle() {
      let style = ''
      let list = [
        'active-background',
        'font-color',
        'border-show',
        'border-radius',
        'incline-show',
        'padding',
        'font-size',
        'box-shadow'
      ]
      list.forEach(item => {
        style += this[item]
      })
      return style
    },
    fontStyle() {
      return this.incline ? 'transform:skew(20deg);' : ''
    }
  },
  methods: {
    lightColor(col, amt = 0) {
      var usePound = false
      if (col[0] == '#') {
        col = col.slice(1)
        usePound = true
      }
      let opacity = ''
      if (col.length == 8) {
        opacity += col[6]
        opacity += col[7]
        col = col.slice(0, 6)
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

      return (usePound ? '#' : '') + String('000000' + (g | (b << 8) | (r << 16)).toString(16)).slice(-6) + opacity
    }
  }
}
</script>

<style lang="scss" scoped>
.gradual-btn {
  display: inline-block;
  padding: 10px 30px;
  box-sizing: border-box;
  // background-image: linear-gradient(to right, #235783 0%, #000 50%, #235783 100%);
  font-family: 'ShangShouRuiYuanTi-2';
  cursor: pointer;
  transition: all 0.4s;
  text-align: center;
}
</style>
