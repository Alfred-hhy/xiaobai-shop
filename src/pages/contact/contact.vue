<template>
  <view class="contact-page">
    <!-- 店铺 Banner -->
    <view class="banner">
      <view class="banner-bg"></view>
      <view class="banner-content">
        <view class="avatar" @click="onLogoTap">小白</view>
        <text class="shop-name">小白衣橱</text>
        <text class="shop-slogan">小个子女生的专属衣橱</text>
      </view>
    </view>

    <!-- 我们的理念 -->
    <view class="section card">
      <text class="card-title">关于我们</text>
      <text class="card-text">
        我们专注于为145-160cm的小个子女生提供合身、显高、显瘦的穿搭方案。每一件衣服都经过真人试穿，确保小个子也能穿出好比例、好气质。
      </text>
      <text class="card-text">
        所有商品均为真人实拍，所见即所得。我们用心挑选每一件单品，只推荐自己也会穿的好衣服。
      </text>
    </view>

    <!-- 联系方式 -->
    <view class="section card">
      <text class="card-title">联系我们</text>

      <view class="contact-item" @click="copyText(wechatId)">
        <view class="contact-left">
          <text class="contact-icon">💬</text>
          <view class="contact-info">
            <text class="contact-label">微信号</text>
            <text class="contact-value">{{ wechatId }}</text>
          </view>
        </view>
        <text class="copy-btn">复制</text>
      </view>

      <view class="contact-item" @click="copyText(wechatId)">
        <view class="contact-left">
          <text class="contact-icon">👥</text>
          <view class="contact-info">
            <text class="contact-label">添加微信</text>
            <text class="contact-value">加好友备注「小白衣橱」</text>
          </view>
        </view>
        <text class="copy-btn">复制</text>
      </view>
    </view>

    <!-- 购买须知 -->
    <view class="section card">
      <text class="card-title">购买须知</text>
      <view class="notice-item" v-for="(item, idx) in notices" :key="idx">
        <text class="notice-dot">·</text>
        <text class="notice-text">{{ item }}</text>
      </view>
    </view>

    <!-- 底部 -->
    <view class="footer">
      <text class="footer-text">小白衣橱 · 让小个子也能穿出大气场</text>
    </view>

    <view style="height: 120rpx;"></view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      wechatId: 'xiaobai_shop', // 替换为真实微信号
      tapCount: 0,
      tapTimer: null,
      notices: [
        '所有商品均为真人实拍，因光线和屏幕差异可能存在轻微色差',
        '服装类商品支持7天无理由退换（需保持吊牌完好）',
        '健康食品类商品拆封后不支持退换',
        '下单后1-3天内发货，偏远地区可能稍有延迟',
        '如有任何问题请随时微信联系我们'
      ]
    }
  },
  methods: {
    copyText(text) {
      uni.setClipboardData({
        data: text,
        success: () => {
          uni.showToast({
            title: '已复制到剪贴板',
            icon: 'none'
          })
        }
      })
    },
    onLogoTap() {
      this.tapCount++
      clearTimeout(this.tapTimer)
      this.tapTimer = setTimeout(() => { this.tapCount = 0 }, 3000)
      if (this.tapCount >= 5) {
        this.tapCount = 0
        uni.navigateTo({ url: '/pages/admin/login' })
      }
    }
  }
}
</script>

<style scoped>
.contact-page {
  min-height: 100vh;
  background: #faf8f6;
}

/* Banner */
.banner {
  position: relative;
  height: 380rpx;
  overflow: hidden;
}
.banner-bg {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(135deg, #d4756e, #e8a0a0, #f5c6c0);
}
.banner-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding-top: 40rpx;
}
.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  border: 4rpx solid rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 44rpx;
  font-weight: bold;
}
.shop-name {
  color: #fff;
  font-size: 36rpx;
  font-weight: bold;
  margin-top: 16rpx;
  letter-spacing: 6rpx;
}
.shop-slogan {
  color: rgba(255, 255, 255, 0.85);
  font-size: 24rpx;
  margin-top: 8rpx;
}

/* 卡片 */
.section {
  margin: 24rpx;
}
.card {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}
.card-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
  padding-left: 16rpx;
  border-left: 6rpx solid #d4756e;
}
.card-text {
  font-size: 26rpx;
  color: #666;
  line-height: 1.8;
  margin-bottom: 16rpx;
  display: block;
}

/* 联系方式 */
.contact-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}
.contact-item:last-child {
  border-bottom: none;
}
.contact-left {
  display: flex;
  align-items: center;
}
.contact-icon {
  font-size: 40rpx;
  margin-right: 20rpx;
}
.contact-label {
  font-size: 24rpx;
  color: #999;
  display: block;
}
.contact-value {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
  display: block;
  margin-top: 4rpx;
}
.copy-btn {
  padding: 10rpx 24rpx;
  background: #fdf0ee;
  color: #d4756e;
  font-size: 24rpx;
  border-radius: 24rpx;
  font-weight: bold;
}

/* 须知 */
.notice-item {
  display: flex;
  margin-bottom: 12rpx;
}
.notice-dot {
  color: #d4756e;
  margin-right: 12rpx;
  font-weight: bold;
}
.notice-text {
  font-size: 24rpx;
  color: #666;
  line-height: 1.6;
  flex: 1;
}

/* 底部 */
.footer {
  text-align: center;
  padding: 40rpx 0 20rpx;
}
.footer-text {
  font-size: 22rpx;
  color: #ccc;
}
</style>
