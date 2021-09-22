<template>
  <div class="top-box">
    <!-- 标题 -->
    <div class="title" @click="flyCenter">
      <div class="logo">
        <img src="../assets/img/logo.png" alt="" />
      </div>
      <div class="label">
        <div class="main">交子公园金融产业商务区</div>
        <div class="minor">智慧化信息平台</div>
      </div>
    </div>

    <div class="right-box">
      <!-- 头部内容 导航栏-->
      <ul class="nav">
        <li
          v-for="item in routes"
          :key="item.name"
          :class="{ 'nav-active': parentPath == item.path }"
          @click="goRouter(item.path)"
        >
          <span>{{ item.meta.title }}</span>
        </li>
      </ul>

      <!-- 用户 -->
      <!-- <div class="user" @mouseenter="userSubShow = true" @mouseleave="userSubShow = false">
        <span :class="{ name: true, 'name-on': userSubShow }">
          <i class="iconfont icon-yonghu"></i>
        </span>

        <transition name="slide-fade">
          <ul class="sub-menu" v-show="userSubShow">
            <li>{{ userName }}</li>
            <li @click="logout">退出登录</li>
          </ul>
        </transition>
      </div> -->
    </div>
  </div>
</template>

<script>
import { mapOutParam } from 'mapfunc'
export default {
  data() {
    return {
      userSubShow: false
    }
  },
  computed: {
    routes() {
      const routes = this.$router.options.routes
      const res = []
      routes.forEach(item => {
        if (!item.hidden) {
          res.push(item)
        }
      })
      return res
    },
    userName() {
      return window.localStorage.getItem('tempUserName')
    },
    parentPath() {
      if (this.$route.matched[0]) {
        return this.$route.matched[0].path
      } else {
        return null
      }
    }
  },
  methods: {
    flyCenter() {
      mapOutParam.flyCenter()
    },

    goRouter(e) {
      console.log(e)
      if (e && e !== this.parentPath) {
        this.$router.push({
          path: e
        })
      }
    },

    logout() {
      this.$confirm('确认退出登录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.localStorage.removeItem('tempToken')
        window.localStorage.removeItem('tempUserName')
        this.$router.push('/login')
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.top-box {
  height: 100px;
  position: relative;
  box-sizing: border-box;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(to bottom, #1b5991, hsla(208, 69%, 34%, 0.6) 45%, #1468e500);
  .title {
    color: #fff;
    margin: top 6px;
    padding-left: 10px;
    letter-spacing: 2px;
    cursor: pointer;
    display: flex;
    align-items: center;
    .logo {
      padding: 0 10px;
      img {
        width: 50px;
      }
    }
    &:hover {
      text-shadow: 0px 0px 8px rgb(101 243 248 / 0.4);
    }
    .label {
      div {
        font-family: 'ShangShouRuiYuanTi-2';
        background-image: -webkit-linear-gradient(bottom, #12e2f9, #fff 70%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .main {
        font-size: 23px;
      }
      .minor {
        font-size: 38px;
      }
    }
  }

  .right-box {
    display: flex;
    align-items: center;
    margin-top: -10px;
    .nav {
      list-style: none;
      color: #34c3f0;
      margin-right: 20px;
      li {
        font-size: 18px;
        line-height: 45px;
        display: inline-block;
        height: 40px;
        padding: 0 25px;
        position: relative;
        margin-right: 30px;
        border: 1px solid #fff0;
        transform: skewX(-30deg);
        background-image: linear-gradient(to bottom, #130641 20%, #136fae);
        border: 1px solid #00a5ec;
        cursor: pointer;
        font-family: 'ShangShouRuiYuanTi-2';
        span {
          display: inline-block;
          transform: skewX(30deg);
        }
      }
      .nav-active,
      .nav:hover {
        color: #fff;
        background-image: linear-gradient(to bottom, #135b9a, #3caed6);
        border: 1px solid #8febf7;
        box-shadow: 0px 0px 10px #03f0ff;
      }
    }

    .user {
      cursor: pointer;
      margin-right: 20px;
      position: relative;
      .name {
        transition: transform 0.5s;
        border-radius: 5px;
        color: #fff;
        padding: 2px 10px;
        display: inline-block;
        i {
          font-size: 50px;
        }
        .i-active {
          transform: rotate(180deg);
          -ms-transform: rotate(180deg); /* IE 9 */
          -moz-transform: rotate(180deg); /* Firefox */
          -webkit-transform: rotate(180deg); /* Safari 和 Chrome */
          -o-transform: rotate(180deg);
          transition: transform 0.5s;
          -moz-transition: -moz-transform 0.5s;
          -o-transition: -o-transform 0.5s;
          -ms-transition: -ms-transform 0.5s;
        }
      }
      .name-on {
        transition: transform 0.5s;
      }

      .sub-menu {
        position: absolute;
        list-style: none;
        right: -10px;
        top: 62px;
        z-index: 10;

        text-align: left;
        color: #fff;
        background: rgba(5, 15, 26, 0.4);
        li {
          padding: 5px 10px;
          font-size: 15px;
          &:hover {
            transition: 0.3s all;
            // color: #00b2bf;
            background: linear-gradient(134deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%);
          }
        }
      }
    }
  }
}

/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all 0.2s ease;
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
