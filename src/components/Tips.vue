<template>
  <div>
    <span @mouseenter="tipShow = !tipShow" @mouseleave="tipShow = !tipShow" class="tips-icon">?</span>

    <div v-show="tipShow" class="tips-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tipShow: false
    }
  }
}
</script>

<style lang="scss" scoped>
.tips-icon {
  // position: relative;
  cursor: pointer;
  padding: 4px 6px;
  font-size: 20px;
  &:hover {
    text-shadow: 0 0 4px #ffffff;
  }
}
.tips-content {
  z-index: 10;
  position: absolute;
  left: 24px;
  top: 0px;
  min-width: 200px;
  background: #002242;
  box-shadow: 0 0 8px #00c8ff;
  padding: 10px 14px 10px 14px;
  border-radius: 5px;
  p {
    font-size: 16px;
  }
  strong {
    // font-weight: bold;
    color: #00e6ff;
  }
}
</style>
