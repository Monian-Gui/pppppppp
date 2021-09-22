<template>
  <div :class="type + '-panel'" :style="style">
    <div class="panel-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'left'
    },
    // 内容宽度
    width: {
      type: String,
      default: '360'
    }
  },
  computed: {
    style() {
      return `width: ${parseInt(this.width) + 100}px;`
    }
  }
}
</script>

<style lang="scss" scoped>
.left-panel {
  position: absolute;
  pointer-events: none;
  top: 10px;
  left: 0;
  bottom: 20px;
  padding: 10px 80px 5px 20px;
  box-sizing: border-box;
  height: fit-content;
  background: linear-gradient(to right, rgba(#03182b, 0.9) 0%, rgba(#0f375b, 0.7) 75%, rgba(#0f4f8a, 0) 100%);
}
.right-panel {
  position: absolute;
  pointer-events: none;
  top: 10px;
  right: 0;
  bottom: 20px;
  padding: 10px 20px 5px 80px;
  box-sizing: border-box;
  height: fit-content;
  background: linear-gradient(to left, rgba(#03182b, 0.9) 0%, rgba(#0f375b, 0.7) 75%, rgba(#0f4f8a, 0) 100%);
}
.panel-content {
  pointer-events: auto;
  width: 100%;
}
</style>
