<template>
  <view class="category-page">
    <!-- 分类标签 -->
    <scroll-view scroll-x class="tab-bar">
      <view
        v-for="cat in categories"
        :key="cat.id"
        :class="['tab-item', { active: currentCategory === cat.id }]"
        @click="switchCategory(cat.id)"
      >
        <text>{{ cat.icon }} {{ cat.name }}</text>
      </view>
    </scroll-view>

    <!-- 商品列表 -->
    <scroll-view scroll-y class="product-list">
      <view class="product-grid" v-if="filteredProducts.length">
        <view class="product-card" v-for="item in filteredProducts" :key="item.id" @click="goDetail(item.id)">
          <view class="card-img-wrap">
            <image class="card-img" :src="item.images[0]" mode="aspectFill" />
            <view class="card-tags">
              <text class="tag tag-new" v-if="item.isNew">新品</text>
              <text class="tag tag-hot" v-if="item.isHot">热销</text>
            </view>
          </view>
          <view class="card-info">
            <text class="card-name">{{ item.name }}</text>
            <text class="card-desc">{{ item.description }}</text>
            <view class="card-bottom">
              <view class="card-price-row">
                <text class="price"><text class="price-symbol">¥</text>{{ item.price }}</text>
                <text class="price-original" v-if="item.originalPrice">¥{{ item.originalPrice }}</text>
              </view>
              <view class="card-sizes">
                <text class="size-tag" v-for="s in item.sizes.slice(0, 3)" :key="s">{{ s }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="empty" v-else>
        <text class="empty-text">该分类暂无商品</text>
      </view>

      <view style="height: 120rpx;"></view>
    </scroll-view>
  </view>
</template>

<script>
import { getProductsByCategory, getCategories } from '../../api/product.js'

export default {
  data() {
    return {
      currentCategory: 'all',
      categories: [],
      filteredProducts: []
    }
  },
  onLoad() {
    this.categories = getCategories()
    this.loadProducts()
  },
  methods: {
    switchCategory(id) {
      this.currentCategory = id
      this.loadProducts()
    },
    loadProducts() {
      this.filteredProducts = getProductsByCategory(this.currentCategory)
    },
    goDetail(id) {
      uni.navigateTo({ url: `/pages/detail/detail?id=${id}` })
    }
  }
}
</script>

<style scoped>
.category-page {
  min-height: 100vh;
  background: #faf8f6;
}

/* 分类标签栏 */
.tab-bar {
  white-space: nowrap;
  background: #fff;
  padding: 20rpx 24rpx;
  border-bottom: 1rpx solid #f0eded;
}
.tab-item {
  display: inline-block;
  padding: 12rpx 28rpx;
  margin-right: 16rpx;
  border-radius: 32rpx;
  font-size: 26rpx;
  color: #666;
  background: #f5f5f5;
  transition: all 0.2s;
}
.tab-item.active {
  background: #fdf0ee;
  color: #d4756e;
  font-weight: bold;
}

/* 商品列表 */
.product-list {
  padding: 20rpx 24rpx;
  height: calc(100vh - 120rpx);
}
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
  font-weight: bold;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}
.card-desc {
  font-size: 22rpx;
  color: #999;
  margin-top: 6rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.card-bottom {
  margin-top: 12rpx;
}
.card-price-row {
  display: flex;
  align-items: baseline;
}
.card-sizes {
  margin-top: 8rpx;
  display: flex;
  gap: 8rpx;
}
.size-tag {
  font-size: 20rpx;
  color: #999;
  background: #f5f5f5;
  padding: 2rpx 10rpx;
  border-radius: 4rpx;
}

.empty {
  display: flex;
  justify-content: center;
  padding: 200rpx 0;
}
.empty-text {
  color: #999;
  font-size: 28rpx;
}
</style>
