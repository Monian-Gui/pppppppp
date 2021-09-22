<template>
  <div id="app">
    <!-- map -->
    <div class="map-container">
      <Mapbox />
    </div>

    <!-- 顶部栏 -->
    <div class="top-container">
      <top></top>
    </div>

    <!-- 主容器 -->
    <div class="main-container">
      <router-view />
    </div>
  </div>
</template>

<script>
import Mapbox from '@/layout/Mapbox'
import Top from '@/layout/Top'

export default {
  name: 'App',
  components: {
    Mapbox,
    Top
  }
}
</script>

<style lang="scss" scoped>
#app {
  width: 100vw; //弹窗会有15px右内边距
  height: 100%;
  color: #eee;
  .map-container {
    height: 100vh;
    width: 100vw;
    position: absolute;
    z-index: 0;
  }

  .top-container {
    width: 100vw;
    position: absolute;
    z-index: 10;
  }
  .main-container {
    position: absolute;
    z-index: 1;
    top: 80px;
    width: 100%;
    height: calc(100% - 80px);
    box-sizing: border-box;
    pointer-events: none;
    //border: $bd;
  }
}
</style>
