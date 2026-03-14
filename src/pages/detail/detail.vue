<template>
  <view class="detail-page" v-if="product">
    <!-- 商品图片轮播 -->
    <swiper class="detail-swiper" circular indicator-dots indicator-color="rgba(255,255,255,0.4)" indicator-active-color="#d4756e">
      <swiper-item v-for="(img, idx) in product.images" :key="idx">
        <image class="detail-img" :src="img" mode="aspectFill" @click="previewImage(idx)" />
      </swiper-item>
    </swiper>

    <!-- 价格区域 -->
    <view class="price-section">
      <view class="price-row">
        <text class="detail-price"><text class="detail-price-symbol">¥</text>{{ product.price }}</text>
        <text class="detail-price-original" v-if="product.originalPrice">¥{{ product.originalPrice }}</text>
        <view class="discount-tag" v-if="product.originalPrice">
          {{ Math.round(product.price / product.originalPrice * 10) }}折
        </view>
      </view>
      <view class="tag-row">
        <text class="tag tag-new" v-if="product.isNew">新品</text>
        <text class="tag tag-hot" v-if="product.isHot">热销</text>
      </view>
    </view>

    <!-- 商品信息 -->
    <view class="info-section">
      <text class="detail-name">{{ product.name }}</text>
      <text class="detail-desc">{{ product.description }}</text>
    </view>

    <!-- 规格信息 -->
    <view class="spec-section" v-if="product.sizes && product.sizes.length">
      <view class="spec-group">
        <text class="spec-label">可选尺码</text>
        <view class="spec-options">
          <text class="spec-item" v-for="s in product.sizes" :key="s">{{ s }}</text>
        </view>
      </view>
      <view class="spec-group" v-if="product.colors && product.colors.length">
        <text class="spec-label">可选颜色</text>
        <view class="spec-options">
          <text class="spec-item" v-for="c in product.colors" :key="c">{{ c }}</text>
        </view>
      </view>
    </view>

    <!-- 店铺信息 -->
    <view class="shop-section">
      <view class="shop-info">
        <view class="shop-avatar">小白</view>
        <view class="shop-text">
          <text class="shop-name">小白衣橱</text>
          <text class="shop-desc">小个子专属穿搭 · 真人实拍</text>
        </view>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="btn-contact" @click="copyWechat">
        <text class="btn-icon">💬</text>
        <text class="btn-text">联系客服</text>
      </view>
      <view class="btn-order" @click="copyWechat">
        <text>微信下单</text>
      </view>
    </view>
  </view>
</template>

<script>
import { getProductById } from '../../api/product.js'

export default {
  data() {
    return {
      product: null,
      wechatId: 'xiaobai_shop'  // 替换为真实微信号
    }
  },
  onLoad(options) {
    if (options.id) {
      this.product = getProductById(options.id)
      if (this.product) {
        uni.setNavigationBarTitle({ title: this.product.name })
      }
    }
  },
  methods: {
    previewImage(idx) {
      uni.previewImage({
        current: idx,
        urls: this.product.images
      })
    },
    copyWechat() {
      uni.setClipboardData({
        data: this.wechatId,
        success: () => {
          uni.showToast({
            title: `微信号已复制: ${this.wechatId}`,
            icon: 'none',
            duration: 2500
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.detail-page {
  min-height: 100vh;
  background: #faf8f6;
  padding-bottom: 140rpx;
}

/* 图片轮播 */
.detail-swiper {
  width: 100%;
  height: 750rpx;
}
.detail-img {
  width: 100%;
  height: 100%;
}

/* 价格 */
.price-section {
  background: #fff;
  padding: 24rpx 30rpx;
}
.price-row {
  display: flex;
  align-items: baseline;
}
.detail-price {
  color: #d4756e;
  font-size: 48rpx;
  font-weight: bold;
}
.detail-price-symbol {
  font-size: 28rpx;
}
.detail-price-original {
  color: #999;
  font-size: 26rpx;
  text-decoration: line-through;
  margin-left: 16rpx;
}
.discount-tag {
  margin-left: 16rpx;
  background: #fdf0ee;
  color: #d4756e;
  font-size: 22rpx;
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
  font-weight: bold;
}
.tag-row {
  margin-top: 12rpx;
}

/* 商品信息 */
.info-section {
  background: #fff;
  padding: 24rpx 30rpx;
  margin-top: 16rpx;
}
.detail-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  line-height: 1.5;
  display: block;
}
.detail-desc {
  font-size: 26rpx;
  color: #666;
  margin-top: 12rpx;
  line-height: 1.6;
  display: block;
}

/* 规格 */
.spec-section {
  background: #fff;
  padding: 24rpx 30rpx;
  margin-top: 16rpx;
}
.spec-group {
  margin-bottom: 20rpx;
}
.spec-group:last-child {
  margin-bottom: 0;
}
.spec-label {
  font-size: 26rpx;
  color: #999;
  margin-bottom: 12rpx;
  display: block;
}
.spec-options {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}
.spec-item {
  padding: 10rpx 24rpx;
  border: 1rpx solid #e0e0e0;
  border-radius: 8rpx;
  font-size: 26rpx;
  color: #333;
  background: #faf8f6;
}

/* 店铺 */
.shop-section {
  background: #fff;
  padding: 24rpx 30rpx;
  margin-top: 16rpx;
}
.shop-info {
  display: flex;
  align-items: center;
}
.shop-avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #d4756e, #e8a0a0);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: bold;
  margin-right: 20rpx;
}
.shop-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  display: block;
}
.shop-desc {
  font-size: 22rpx;
  color: #999;
  margin-top: 4rpx;
  display: block;
}

/* 底部操作栏 */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 110rpx;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0 24rpx;
  padding-bottom: env(safe-area-inset-bottom);
  box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.06);
  z-index: 100;
}
.btn-contact {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 30rpx;
}
.btn-icon {
  font-size: 36rpx;
}
.btn-text {
  font-size: 20rpx;
  color: #666;
}
.btn-order {
  flex: 1;
  height: 80rpx;
  background: linear-gradient(135deg, #d4756e, #e8a0a0);
  color: #fff;
  font-size: 30rpx;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 40rpx;
  letter-spacing: 4rpx;
}
</style>
