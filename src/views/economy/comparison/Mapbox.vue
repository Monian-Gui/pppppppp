<template>
  <div class="map-box" :id="id"></div>
</template>

<script>
import { initMap } from './mapfunc'
export default {
  props: ['id'],
  mounted() {
    initMap({ mapID: this.id }).then(res => {
      this.$emit('init', res)
    })
  },
  beforeDestroy() {}
}
</script>

<style lang="scss" scoped>
.map-box {
  width: 100%;
  height: 100%;
}
</style>

<style lang="scss">
.mapboxgl-canvas {
  width: 100%;
  height: 100%;
}
</style>
