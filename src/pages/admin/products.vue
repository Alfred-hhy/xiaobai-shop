<template>
  <view class="admin-page">
    <!-- 顶部栏 -->
    <view class="top-bar">
      <text class="top-title">商品管理</text>
      <view class="top-actions">
        <text class="btn-add" @click="goAdd">+ 新增</text>
        <text class="btn-logout" @click="handleLogout">退出</text>
      </view>
    </view>

    <!-- 商品列表 -->
    <scroll-view scroll-y class="product-list">
      <view v-if="loading" class="loading">
        <text>加载中...</text>
      </view>

      <view v-else-if="products.length === 0" class="empty">
        <text>暂无商品</text>
      </view>

      <view v-else class="product-item" v-for="item in products" :key="item.id">
        <image class="item-img" :src="item.images[0] || ''" mode="aspectFill" />
        <view class="item-info">
          <view class="item-row">
            <text class="item-name">{{ item.name }}</text>
            <view class="item-tags">
              <text :class="['status-tag', item.status === 'on' ? 'on' : 'off']">
                {{ item.status === 'on' ? '在架' : '下架' }}
              </text>
            </view>
          </view>
          <text class="item-price">¥{{ item.price }}</text>
          <view class="item-actions">
            <text class="action-btn" @click="toggleStatus(item)">
              {{ item.status === 'on' ? '下架' : '上架' }}
            </text>
            <text class="action-btn" @click="goEdit(item.id)">编辑</text>
            <text class="action-btn danger" @click="handleDelete(item)">删除</text>
          </view>
        </view>
      </view>

      <view style="height: 40rpx;"></view>
    </scroll-view>
  </view>
</template>

<script>
import { getAllProducts, updateProduct, deleteProduct, signOut, getSession } from '../../api/product.js'

export default {
  data() {
    return {
      products: [],
      loading: true
    }
  },
  async onLoad() {
    const session = await getSession()
    if (!session) {
      uni.redirectTo({ url: '/pages/admin/login' })
      return
    }
    await this.loadProducts()
  },
  async onShow() {
    if (!this.loading) {
      await this.loadProducts()
    }
  },
  methods: {
    async loadProducts() {
      this.loading = true
      try {
        this.products = await getAllProducts()
      } catch (e) {
        uni.showToast({ title: '加载失败', icon: 'none' })
      } finally {
        this.loading = false
      }
    },
    goAdd() {
      uni.navigateTo({ url: '/pages/admin/edit' })
    },
    goEdit(id) {
      uni.navigateTo({ url: `/pages/admin/edit?id=${id}` })
    },
    async toggleStatus(item) {
      const newStatus = item.status === 'on' ? 'off' : 'on'
      try {
        await updateProduct(item.id, { status: newStatus })
        item.status = newStatus
        uni.showToast({ title: newStatus === 'on' ? '已上架' : '已下架', icon: 'success' })
      } catch (e) {
        uni.showToast({ title: '操作失败', icon: 'none' })
      }
    },
    handleDelete(item) {
      uni.showModal({
        title: '确认删除',
        content: `确定删除「${item.name}」吗？此操作不可撤销。`,
        success: async (res) => {
          if (res.confirm) {
            try {
              await deleteProduct(item.id)
              this.products = this.products.filter(p => p.id !== item.id)
              uni.showToast({ title: '已删除', icon: 'success' })
            } catch (e) {
              uni.showToast({ title: '删除失败', icon: 'none' })
            }
          }
        }
      })
    },
    async handleLogout() {
      try {
        await signOut()
        uni.redirectTo({ url: '/pages/admin/login' })
      } catch (e) {
        uni.showToast({ title: '退出失败', icon: 'none' })
      }
    }
  }
}
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background: #f5f5f5;
}
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 30rpx;
  background: #fff;
  border-bottom: 1rpx solid #eee;
  position: sticky;
  top: 0;
  z-index: 10;
}
.top-title {
  font-size: 34rpx;
  font-weight: bold;
  color: #333;
}
.top-actions {
  display: flex;
  gap: 20rpx;
}
.btn-add {
  padding: 10rpx 24rpx;
  background: #d4756e;
  color: #fff;
  font-size: 26rpx;
  border-radius: 8rpx;
}
.btn-logout {
  padding: 10rpx 24rpx;
  background: #eee;
  color: #666;
  font-size: 26rpx;
  border-radius: 8rpx;
}
.product-list {
  height: calc(100vh - 100rpx);
  padding: 20rpx;
}
.loading, .empty {
  display: flex;
  justify-content: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}
.product-item {
  display: flex;
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 16rpx;
}
.item-img {
  width: 160rpx;
  height: 160rpx;
  border-radius: 8rpx;
  background: #f0f0f0;
  flex-shrink: 0;
  margin-right: 20rpx;
}
.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.item-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.item-name {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
  flex: 1;
  margin-right: 12rpx;
}
.status-tag {
  font-size: 22rpx;
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
  white-space: nowrap;
}
.status-tag.on {
  background: #e8f5e9;
  color: #4caf50;
}
.status-tag.off {
  background: #ffeee0;
  color: #ff9800;
}
.item-price {
  font-size: 30rpx;
  color: #d4756e;
  font-weight: bold;
}
.item-actions {
  display: flex;
  gap: 16rpx;
}
.action-btn {
  font-size: 24rpx;
  color: #666;
  padding: 6rpx 16rpx;
  background: #f5f5f5;
  border-radius: 6rpx;
}
.action-btn.danger {
  color: #e53935;
  background: #ffebee;
}
</style>
