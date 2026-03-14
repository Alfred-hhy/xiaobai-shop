<template>
  <view class="login-page">
    <view class="login-header">
      <view class="logo">管理</view>
      <text class="title">小白衣橱 · 后台管理</text>
    </view>

    <view class="login-form">
      <view class="form-item">
        <text class="label">邮箱</text>
        <input class="input" v-model="email" type="text" placeholder="请输入管理员邮箱" />
      </view>
      <view class="form-item">
        <text class="label">密码</text>
        <input class="input" v-model="password" type="password" placeholder="请输入密码" />
      </view>
      <button class="btn-login" @click="handleLogin" :disabled="loading">
        {{ loading ? '登录中...' : '登录' }}
      </button>
    </view>
  </view>
</template>

<script>
import { signIn } from '../../api/product.js'

export default {
  data() {
    return {
      email: '',
      password: '',
      loading: false
    }
  },
  methods: {
    async handleLogin() {
      if (!this.email || !this.password) {
        uni.showToast({ title: '请填写邮箱和密码', icon: 'none' })
        return
      }
      this.loading = true
      try {
        await signIn(this.email, this.password)
        uni.showToast({ title: '登录成功', icon: 'success' })
        setTimeout(() => {
          uni.redirectTo({ url: '/pages/admin/products' })
        }, 500)
      } catch (e) {
        uni.showToast({ title: '登录失败: ' + e.message, icon: 'none', duration: 3000 })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #faf8f6;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 200rpx;
}
.login-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 80rpx;
}
.logo {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #d4756e, #e8a0a0);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  font-weight: bold;
}
.title {
  margin-top: 24rpx;
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
}
.login-form {
  width: 80%;
  max-width: 600rpx;
}
.form-item {
  margin-bottom: 32rpx;
}
.label {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 12rpx;
  display: block;
}
.input {
  width: 100%;
  height: 88rpx;
  background: #fff;
  border: 1rpx solid #e0e0e0;
  border-radius: 12rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}
.btn-login {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(135deg, #d4756e, #e8a0a0);
  color: #fff;
  font-size: 30rpx;
  font-weight: bold;
  border-radius: 12rpx;
  border: none;
  margin-top: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-login[disabled] {
  opacity: 0.6;
}
</style>
