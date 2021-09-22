<template>
  <div class="box">
    <!-- map -->
    <div class="map-container">
      <div class="map-container" id="mapContainer"></div>
    </div>

    <router-view />

    <ul class="nav">
      <li
        v-for="item in subRoutes"
        :key="item.name"
        :class="{ 'nav-active': routeName == item.name }"
        @click="goRouter(item.name)"
        :style="style.li"
      >
        <div class="icon">
          <i :class="'iconfont ' + item.meta.icon" :style="style.i"></i>
        </div>
        <div class="label" :style="style.label">
          {{ item.meta.title }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      screenWidth: ''
    }
  },
  computed: {
    routeName() {
      return this.$route.name
    },
    routes() {
      return this.$router.options.routes
    },
    subRoutes() {
      const nowPath = this.$route.matched[0].path
      let res = null
      this.routes.forEach(item => {
        if (item.path == nowPath) {
          res = item.children
        }
      })
      return res
    },
    style() {
      return {
        li: this.screenWidth >= 1280 ? 'width: 100px;height: 60px;' : 'width: 80px;height: 40px;',
        i: this.screenWidth >= 1280 ? 'font-size: 38px;' : 'font-size: 24px;',
        label: this.screenWidth >= 1280 ? ' font-size: 14px;' : ' font-size: 10px;'
      }
    }
  },
  mounted() {
    this.getWidth()
  },
  methods: {
    goRouter(e) {
      if (e && e !== this.$route.name) {
        this.$router.push({
          name: e
        })
      }
    },
    getWidth() {
      this.screenWidth = document.body.clientWidth
      window.onresize = () => {
        return (() => {
          this.screenWidth = document.body.clientWidth
        })()
      }
    }
  }
}
</script>

<style scoped lang="scss">
.box {
  .nav {
    list-style: none;
    color: #34c3f0;
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    background: #00000066;
    border: 1px solid #006699;
    padding: 0 10px;
    border-radius: 5px;
    max-width: calc(100vw - 880px);
    max-height: 160px;
    overflow: hidden;
    li {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100px;
      height: 60px;
      padding: 10px 0;
      position: relative;
      cursor: pointer;
      color: #5ad2f7;
      pointer-events: auto;
      .icon {
        i {
          font-size: 38px;
        }
      }
      .label {
        margin-top: 3px;
        font-size: 14px;
        width: 100%;
        text-align: center;
        font-family: 'ShangShouRuiYuanTi-2';
      }
    }
    .nav-active {
      color: #ff7200;
    }
  }
}
</style>
