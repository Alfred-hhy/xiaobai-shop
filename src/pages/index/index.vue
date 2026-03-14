<template>
  <view class="home">
    <!-- 自定义顶部导航 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <text class="nav-title">小白衣橱</text>
        <text class="nav-subtitle">小个子专属穿搭</text>
      </view>
    </view>

    <scroll-view scroll-y class="scroll-content" :style="{ paddingTop: navHeight + 'px' }">
      <!-- Banner 轮播 -->
      <view class="banner-wrap">
        <swiper class="banner" circular autoplay :interval="3500" :duration="500" indicator-dots indicator-color="rgba(255,255,255,0.4)" indicator-active-color="#d4756e">
          <swiper-item v-for="item in bannerProducts" :key="item.id" @click="goDetail(item.id)">
            <image class="banner-img" :src="item.images[0]" mode="aspectFill" />
            <view class="banner-info">
              <text class="banner-name">{{ item.name }}</text>
              <text class="banner-price">¥{{ item.price }}</text>
            </view>
          </swiper-item>
        </swiper>
      </view>

      <!-- 分类导航 -->
      <view class="section category-nav">
        <scroll-view scroll-x class="category-scroll">
          <view class="category-item" v-for="cat in categories" :key="cat.id" @click="goCategory(cat.id)">
            <view class="category-icon">{{ cat.icon }}</view>
            <text class="category-name">{{ cat.name }}</text>
          </view>
        </scroll-view>
      </view>

      <!-- 新品推荐 -->
      <view class="section" v-if="newProducts.length">
        <view class="section-header">
          <text class="section-title">新品上架</text>
          <text class="section-more" @click="goCategory('all')">查看全部 ></text>
        </view>
        <scroll-view scroll-x class="product-scroll">
          <view class="product-scroll-item" v-for="item in newProducts" :key="item.id" @click="goDetail(item.id)">
            <image class="product-scroll-img" :src="item.images[0]" mode="aspectFill" />
            <text class="product-scroll-name">{{ item.name }}</text>
            <view class="product-scroll-price">
              <text class="price"><text class="price-symbol">¥</text>{{ item.price }}</text>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 热销好物 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">热销好物</text>
        </view>
        <view class="product-grid">
          <view class="product-card" v-for="item in hotProducts" :key="item.id" @click="goDetail(item.id)">
            <view class="card-img-wrap">
              <image class="card-img" :src="item.images[0]" mode="aspectFill" />
              <view class="card-tags">
                <text class="tag tag-new" v-if="item.isNew">新品</text>
                <text class="tag tag-hot" v-if="item.isHot">热销</text>
              </view>
            </view>
            <view class="card-info">
              <text class="card-name">{{ item.name }}</text>
              <view class="card-price-row">
                <text class="price"><text class="price-symbol">¥</text>{{ item.price }}</text>
                <text class="price-original" v-if="item.originalPrice">¥{{ item.originalPrice }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 底部留白 -->
      <view style="height: 120rpx;"></view>
    </scroll-view>
  </view>
</template>

<script>
import { getNewProducts, getHotProducts, getCategories, getRecommendProducts } from '../../api/product.js'

export default {
  data() {
    return {
      statusBarHeight: 0,
      navHeight: 0,
      bannerProducts: [],
      newProducts: [],
      hotProducts: [],
      categories: []
    }
  },
  async onLoad() {
    const sysInfo = uni.getSystemInfoSync()
    this.statusBarHeight = sysInfo.statusBarHeight || 20
    this.navHeight = this.statusBarHeight + 44

    try {
      const [categories, newProducts, hotProducts] = await Promise.all([
        getCategories(),
        getNewProducts(),
        getRecommendProducts()
      ])
      this.categories = categories
      this.newProducts = newProducts
      this.hotProducts = hotProducts
      this.bannerProducts = this.hotProducts.slice(0, 4)
    } catch (e) {
      console.error('加载数据失败:', e)
    }
  },
  methods: {
    goDetail(id) {
      uni.navigateTo({ url: `/pages/detail/detail?id=${id}` })
    },
    goCategory(categoryId) {
      uni.switchTab({ url: '/pages/category/category' })
    }
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: #faf8f6;
}

/* 顶部导航 */
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: linear-gradient(135deg, #d4756e, #e8a0a0);
}
.nav-content {
  height: 88rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.nav-title {
  color: #fff;
  font-size: 36rpx;
  font-weight: bold;
  letter-spacing: 4rpx;
}
.nav-subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 20rpx;
  margin-top: 2rpx;
}

/* Banner */
.banner-wrap {
  padding: 20rpx 24rpx 0;
}
.banner {
  height: 360rpx;
  border-radius: 16rpx;
  overflow: hidden;
}
.banner-img {
  width: 100%;
  height: 100%;
}
.banner-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 24rpx;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.5));
}
.banner-name {
  color: #fff;
  font-size: 28rpx;
  font-weight: bold;
}
.banner-price {
  color: #fff;
  font-size: 32rpx;
  font-weight: bold;
  margin-left: 16rpx;
}

/* 分类导航 */
.category-nav {
  padding: 24rpx 0 !important;
}
.category-scroll {
  white-space: nowrap;
  padding: 0 24rpx;
}
.category-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  margin-right: 40rpx;
}
.category-icon {
  width: 88rpx;
  height: 88rpx;
  background: #fdf0ee;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
}
.category-name {
  font-size: 22rpx;
  color: #666;
  margin-top: 8rpx;
}

/* 通用 section */
.section {
  padding: 20rpx 24rpx;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}
.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}
.section-more {
  font-size: 24rpx;
  color: #999;
}

/* 横向滚动商品 */
.product-scroll {
  white-space: nowrap;
}
.product-scroll-item {
  display: inline-block;
  width: 240rpx;
  margin-right: 20rpx;
  vertical-align: top;
}
.product-scroll-img {
  width: 240rpx;
  height: 240rpx;
  border-radius: 12rpx;
  background: #f0f0f0;
}
.product-scroll-name {
  font-size: 24rpx;
  color: #333;
  margin-top: 12rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}
.product-scroll-price {
  margin-top: 6rpx;
}

/* 商品网格 */
.product-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}
.product-card {
  width: calc(50% - 10rpx);
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}
.card-img-wrap {
  position: relative;
  width: 100%;
  height: 340rpx;
}
.card-img {
  width: 100%;
  height: 100%;
}
.card-tags {
  position: absolute;
  top: 12rpx;
  left: 12rpx;
}
.card-info {
  padding: 16rpx;
}
.card-name {
  font-size: 26rpx;
  color: #333;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  line-height: 1.4;
}
.card-price-row {
  margin-top: 12rpx;
  display: flex;
  align-items: baseline;
}
</style>
