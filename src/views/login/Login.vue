<template>
  <div class="all">
    <div class="ball-box">
      <div class="title">
        车位级预约共享智慧停车大数据分析平台
      </div>

      <!-- 登录 -->
      <div class="login" id="show1">
        <div class="content">
          <input class="account" type="text" placeholder="您的账号" v-model="UserName" />
          <br />
          <input id="pwd" name="passwoed" type="password" placeholder="您的密码" :oncopy="false" v-model="UserPwd" />
          <input class="account ipt-identify" type="text" placeholder="验证码" v-model="iptIdentify" />

          <div class="identify" @click="refreshCode">
            <Identify :identifyCode="identifyCode"></Identify>
          </div>

          <input type="submit" id="enter" value="登录" @click="subLogin" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Identify from '@/utils/Identify'
/* eslint-disable */
export default {
  name: 'Login',
  components: {
    Identify
  },
  data() {
    return {
      UserName: 'admin',
      UserPwd: '123',
      redirect: undefined,
      identifyCodes: '1234567890',
      identifyCode: '',
      iptIdentify: ''
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    this.identifyCode = ''
    this.makeCode(4)
    this.iptIdentify = this.identifyCode //! 自动填充验证码
    this.subLogin()
  },
  methods: {
    subLogin() {
      if (!this.UserName || !this.UserPwd) {
        this.$message({
          message: '请输入账号和密码',
          type: 'warning'
        })
        return
      }

      if (this.iptIdentify != this.identifyCode) {
        this.$message({
          message: '验证码输入错误',
          type: 'warning'
        })
        this.refreshCode()
        return
      }

      if (this.UserName == 'admin' && this.UserPwd == '123') {
        window.localStorage.setItem('tempToken', '123')
        window.localStorage.setItem('tempUserName', this.UserName)
        this.$router.push({ path: '/develop/school' })
      }
    },

    // 生成随机数
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    // 切换验证码
    refreshCode() {
      this.identifyCode = ''
      this.makeCode(4)
      this.iptIdentify = this.identifyCode //! 自动填充验证码
    },
    // 生成四位随机验证码
    makeCode(l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[this.randomNum(0, this.identifyCodes.length)]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/* 背景 */
.all {
  background: url('../../assets/img/login-bgimg.jpg') no-repeat;
  background-size: 100% 100%;
  width: 100%;
  height: 100%;
  pointer-events: auto;
}

.ball-box {
  top: 400px;
  top: 260px;
  right: 130px;
  right: 100px;
  position: absolute;
  width: 580px;
  height: 500px;
  letter-spacing: 4px;
  text-align: center;
  .title {
    font-size: 44px;
    font-family: 'HanYiZongYiTiJian';
    color: #fff;
  }

  /* 登录界面star */
  .login {
    top: 140px;
    width: 300px;
    margin-left: calc(50% - 150px);
    padding-bottom: 30px;
    background-color: #ffffff;
    opacity: 0.9;
    position: fixed;
    border-radius: 5px;
    background-color: rgb(7 5 56 / 0%);
    border: 1px solid #00ffe7;
    position: absolute;
    .content {
      input {
        margin: 30px 0px -14px 0px;
        width: 250px;
        height: 42px;
        border-radius: 5px;
        border: 1px solid #12e2f9;
        background-color: rgba(255, 255, 255, 0);
        padding-left: 10px;
        /*鼠标点中input*/
        &:focus {
          /*点击input 外阴影*/
          -webkit-box-shadow: $b-shadow;
          -moz-box-shadow: $b-shadow;
          box-shadow: $b-shadow;
          border-color: #2285bf;
          /*去掉默认谷歌点击input边框显示蓝色  */
          outline: 0;
          /*input内背景为白色*/
          background: rgba(255, 255, 255, 0);
        }
      }
      .account,
      #pwd {
        background-color: #fff0 !important;
        color: #fff;
      }
      p {
        font-size: 8px;
        color: gray;
        margin: 10px 0 0 82px;
      }
      .ipt-identify {
        width: 100px;
        position: absolute;
        left: 24px;
        top: 118px;
      }
      .identify {
        position: absolute;
        right: 24px;
        top: 150px;
      }
      #enter {
        margin: 90px 0px 0px 0px;
        width: 250px;
        height: 42px;
        border-radius: 5px;
        border: 1px solid #12e2f9;
        padding-left: 10px;
        color: #fff;
        font-size: 20px;
        font-weight: 800;
        background: #1f78b1;
        box-shadow: none;
        &:focus {
          outline: 0;
        }
        &:hover {
          background: #24add6;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
