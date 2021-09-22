<template>
  <div class="data-box-bg">
    <div class="block lt"></div>
    <div class="block rt"></div>
    <div class="block lb"></div>
    <div class="block rb"></div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tipShow: false,
    };
  },
};
</script>

<style lang="scss" scoped>
.data-box-bg {
  position: relative;
  background: linear-gradient(
    270deg,
    rgba(0, 18, 38, 0.52) 0%,
    rgba(28, 57, 86, 0.56) 19%,
    rgba(26, 56, 85, 0.76) 32%,
    rgba(35, 62, 87, 0.63) 47%,
    #001529 100%
  );
}

.block {
  width: 12px;
  height: 12px;
  position: absolute;
  &.lt {
    left: 0;
    top: 0;
    border-top: 1px solid #58c1ce;
    border-left: 1px solid #58c1ce;
  }
  &.rt {
    right: 0;
    top: 0;
    border-top: 1px solid #58c1ce;
    border-right: 1px solid #58c1ce;
  }
  &.lb {
    left: 0;
    bottom: 0;
    border-bottom: 1px solid #58c1ce;
    border-left: 1px solid #58c1ce;
  }
  &.rb {
    right: 0;
    bottom: 0;
    border-right: 1px solid #58c1ce;
    border-bottom: 1px solid #58c1ce;
  }
}
</style>
