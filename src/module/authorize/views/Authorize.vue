<template>
  <div class="login-container" :style="loginContainerStyle">
    <PointWave :color="0x097bdb"/>
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on"
             label-position="left">

      <div class="title-container">
        <h3 class="title">统一认证中心</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <em class="el-icon-user"/>
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
           <em class="el-icon-user"/>
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleSsoAuthorize"
        />
        <span class="show-pwd" @click="showPwd">
          <em class="el-icon-view"></em>
        </span>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;"
                 @click.native.prevent="handleSsoAuthorize">Login
      </el-button>
    </el-form>
  </div>
</template>

<script>

  import PointWave from '../views/PointWave'
  import backgroundImg from '../image/background.png'
  import Http from "../../../util/request";
  import {getQueryVariable} from "../../../util/usefulUtil";


  export default {
    name: 'Authorize',
    components: {
      PointWave
    },
    data() {
      const validateUsername = (rule, value, callback) => {
        if (value.length < 3) {
          callback(new Error('The userName can not be less than 3 digits'))
        } else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (value.length < 3) {
          callback(new Error('The password can not be less than 3 digits'))
        } else {
          callback()
        }
      }
      return {
        loginForm: {
          username: '',
          password: ''
        },
        loginRules: {
          username: [{required: true, trigger: 'blur', validator: validateUsername}],
          password: [{required: true, trigger: 'blur', validator: validatePassword}]
        },
        loading: false,
        passwordType: 'password',
        redirect: undefined
      }
    },
    computed: {
      loginContainerStyle() {
        return {
          backgroundImage: `url(${backgroundImg})`,
          backgroundSize: 'cover',
          backgroundPosition: '50%'
        }
      }
    },
    watch: {
      $route: {
        handler: function (route) {
          this.redirect = route.query && route.query.redirect
        },
        immediate: true
      }
    },
    methods: {
      // 密码显示/隐藏按钮
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
        this.$nextTick(() => {
          this.$refs.password.focus()
        })
      },
      /**
       * 第三方授权按钮
       */
      async handleSsoAuthorize() {
        console.log("开始登录")
        let continued = false;
        this.$refs.loginForm.validate(valid => {
          continued = valid;
        });
        if (!continued) {
          return;
        }
        this.loading = true
        // url上的appId
        const params = {
          userName: this.loginForm.username,
          password: this.loginForm.password,
          appId: getQueryVariable("appId")
        }
        const callbackUri = await Http.post(`${this.$baseUrl}/oauth/authorize`, params)
          .catch(() => {
            this.loading = false;
          });
        this.loading = false;
        console.log("后端返回的回调地址:", callbackUri)
        // window.location.href = 'http://127.0.0.1:5000/callback?code=123ed'
        window.location.href = callbackUri
      },
    },

    // 生命周期函数
    created: function () {
      console.log("进入生命周期函数")
    }
  }
</script>

<style lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg: #283443;
  $light_gray: #fff;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        background: transparent;
        border: 0;
        -webkit-appearance: none;
        border-radius: 0;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style lang="scss" scoped>
  $bg: #15255B;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .login-container {
    position: absolute;
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;

    .login-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      padding: 140px 35px 0;
      margin: 0 auto;
      overflow: hidden;
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0 auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
  }

  #particle {
    position: absolute;
    width: 100%;
    top: 0;
    bottom: 0;
    overflow: hidden;
  }
</style>
