<template>
  <div class="map-box" id="mapContainer" v-show="!mapHidden"></div>
</template>

<script>
import { initMap, mapOutParam } from 'mapfunc'
export default {
  computed: {
    mapHidden() {
      return this.$route.meta.mapHidden
    }
  },
  watch: {
    mapHidden(val) {
      if (!val && window.map) {
        setTimeout(() => {
          window.map.resize()
          mapOutParam.flyCenter()
        }, 0)
      }
    }
  },
  mounted() {
    initMap({ mapContainer: document.getElementById('mapContainer') })
  }
}
</script>

<style lang="scss" scoped>
.map-box {
  width: 100vw;
  height: 100vh;
}
</style>

<style lang="scss">
.mapboxgl-canvas {
  width: 100vw;
  height: 100vh;
}
</style>
