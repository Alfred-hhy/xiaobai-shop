<template>
  <view class="search-page">
    <view class="search-header">
      <view class="search-input-wrap">
        <input class="search-input" v-model="keyword" placeholder="输入商品名称搜索" focus @confirm="doSearch" />
      </view>
      <text class="search-btn" @click="doSearch">搜索</text>
    </view>

    <view class="search-results">
      <view v-if="loading" class="status-text"><text>搜索中...</text></view>

      <view v-else-if="searched && results.length === 0" class="status-text">
        <text>没有找到相关商品</text>
      </view>

      <view v-else class="product-grid">
        <view class="product-card" v-for="item in results" :key="item.id" @click="goDetail(item.id)">
          <image class="card-img" :src="item.images[0] || ''" mode="aspectFill" />
          <view class="card-info">
            <text class="card-name">{{ item.name }}</text>
            <view class="card-price-row">
              <text class="price">¥{{ item.price }}</text>
              <text class="price-original" v-if="item.originalPrice">¥{{ item.originalPrice }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { searchProducts } from '../../api/product.js'

export default {
  data() {
    return {
      keyword: '',
      results: [],
      loading: false,
      searched: false
    }
  },
  methods: {
    async doSearch() {
      const kw = this.keyword.trim()
      if (!kw) return
      this.loading = true
      this.searched = true
      try {
        this.results = await searchProducts(kw)
      } catch (e) {
        uni.showToast({ title: '搜索失败', icon: 'none' })
      } finally {
        this.loading = false
      }
    },
    goDetail(id) {
      uni.navigateTo({ url: `/pages/detail/detail?id=${id}` })
    }
  }
}
</script>

<style scoped>
.search-page { min-height: 100vh; background: #faf8f6; }
.search-header {
  display: flex; align-items: center; padding: 16rpx 24rpx;
  background: #fff; border-bottom: 1rpx solid #eee; position: sticky; top: 0; z-index: 10;
}
.search-input-wrap {
  flex: 1; height: 72rpx; background: #f5f5f5; border-radius: 36rpx;
  padding: 0 24rpx; display: flex; align-items: center;
}
.search-input { width: 100%; font-size: 28rpx; }
.search-btn {
  margin-left: 16rpx; color: #d4756e; font-size: 28rpx; font-weight: bold;
  white-space: nowrap;
}
.search-results { padding: 20rpx 24rpx; }
.status-text { display: flex; justify-content: center; padding: 100rpx 0; color: #999; font-size: 28rpx; }
.product-grid { display: flex; flex-wrap: wrap; gap: 20rpx; }
.product-card {
  width: calc(50% - 10rpx); background: #fff; border-radius: 16rpx;
  overflow: hidden; box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.06);
}
.card-img { width: 100%; height: 340rpx; }
.card-info { padding: 16rpx; }
.card-name {
  font-size: 26rpx; color: #333;
  display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2;
  overflow: hidden; line-height: 1.4;
}
.card-price-row { margin-top: 12rpx; display: flex; align-items: baseline; }
.price { font-size: 32rpx; color: #d4756e; font-weight: bold; }
.price-original { font-size: 22rpx; color: #ccc; text-decoration: line-through; margin-left: 8rpx; }
</style>
