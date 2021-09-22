<template>
  <div class="chart-item-box" :style="style">
    <div class="title">
      <Title :level="level" :color2="color2">
        {{ title }}
      </Title>
    </div>

    <div class="chart-item-content">
      <slot></slot>
    </div>

    <div class="left-top"></div>
    <div class="right-top"></div>
    <div class="left-bottom"></div>
    <div class="right-bottom"></div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '默认标题'
    },
    icon: {
      type: String,
      default: 'icon-sanjiaoxing'
    },
    width: {
      type: String,
      default: '350'
    },
    level: {
      type: String,
      default: 'level1'
    },
    color2: {
      type: String,
      default: '#fff;'
    }
  },
  computed: {
    style() {
      return `width:${this.width}px;`
    }
  }
}
</script>

<style lang="scss" scoped>
.chart-item-box {
  position: relative;
  color: #fff;
  padding: 10px 10px;
  background: rgba(#0e3453, 0.8);
  border-radius: 10px;
  margin-bottom: 10px;
  pointer-events: auto;
  box-sizing: border-box;
  width: 100%;
  &:hover {
    box-shadow: 4px 4px 10px #0080bb;
  }
  .title {
    padding: 0 5px;
  }
  .chart-item-content {
    padding: 5px 10px;
  }
  .left-top {
    position: absolute;
    top: 0;
    left: 0;
    width: 15px;
    height: 10px;
    border-top: 3px solid #04c0df;
    border-left: 3px solid #04c0df;
  }
  .right-top {
    position: absolute;
    top: 0;
    right: 0;
    width: 15px;
    height: 10px;
    border-top: 3px solid #04c0df;
    border-right: 3px solid #04c0df;
  }
  .left-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 15px;
    height: 10px;
    border-bottom: 3px solid #04c0df;
    border-left: 3px solid #04c0df;
  }
  .right-bottom {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 15px;
    height: 10px;
    border-bottom: 3px solid #04c0df;
    border-right: 3px solid #04c0df;
  }
}
</style>
