<template>
  <view class="admin-page">
    <view class="top-bar">
      <text class="top-title">分类管理</text>
      <text class="btn-add" @click="showAddDialog">+ 新增</text>
    </view>

    <view class="category-list">
      <view v-if="loading" class="loading"><text>加载中...</text></view>

      <view v-else class="category-item" v-for="item in categories" :key="item.id">
        <view class="cat-left">
          <text class="cat-icon">{{ item.icon }}</text>
          <view class="cat-info">
            <text class="cat-name">{{ item.name }}</text>
            <text class="cat-id">ID: {{ item.id }} · 排序: {{ item.sort_order }}</text>
          </view>
        </view>
        <view class="cat-actions">
          <text class="action-btn" @click="showEditDialog(item)">编辑</text>
          <text class="action-btn danger" @click="handleDelete(item)">删除</text>
        </view>
      </view>
    </view>

    <!-- 新增/编辑弹窗 -->
    <view class="modal-mask" v-if="dialogVisible" @click="dialogVisible = false">
      <view class="modal-content" @click.stop>
        <text class="modal-title">{{ editingItem ? '编辑分类' : '新增分类' }}</text>
        <view class="modal-form">
          <view class="form-item" v-if="!editingItem">
            <text class="label">分类ID *</text>
            <input class="input" v-model="form.id" placeholder="英文标识，如 dress" />
          </view>
          <view class="form-item">
            <text class="label">分类名称 *</text>
            <input class="input" v-model="form.name" placeholder="如 连衣裙" />
          </view>
          <view class="form-item">
            <text class="label">图标（emoji）</text>
            <input class="input" v-model="form.icon" placeholder="如 👗" />
          </view>
          <view class="form-item">
            <text class="label">排序（数字越小越靠前）</text>
            <input class="input" v-model="form.sort_order" type="number" placeholder="0" />
          </view>
        </view>
        <view class="modal-actions">
          <button class="btn-cancel" @click="dialogVisible = false">取消</button>
          <button class="btn-confirm" @click="handleSave" :disabled="saving">
            {{ saving ? '保存中...' : '保存' }}
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getAllCategories, createCategory, updateCategory, deleteCategory, getSession } from '../../api/product.js'

export default {
  data() {
    return {
      categories: [],
      loading: true,
      dialogVisible: false,
      editingItem: null,
      saving: false,
      form: { id: '', name: '', icon: '', sort_order: 0 }
    }
  },
  async onLoad() {
    const session = await getSession()
    if (!session) {
      uni.redirectTo({ url: '/pages/admin/login' })
      return
    }
    await this.loadCategories()
  },
  methods: {
    async loadCategories() {
      this.loading = true
      try {
        this.categories = await getAllCategories()
      } catch (e) {
        uni.showToast({ title: '加载失败', icon: 'none' })
      } finally {
        this.loading = false
      }
    },
    showAddDialog() {
      this.editingItem = null
      this.form = { id: '', name: '', icon: '', sort_order: this.categories.length + 1 }
      this.dialogVisible = true
    },
    showEditDialog(item) {
      this.editingItem = item
      this.form = { id: item.id, name: item.name, icon: item.icon || '', sort_order: item.sort_order || 0 }
      this.dialogVisible = true
    },
    async handleSave() {
      if (!this.form.name.trim()) {
        uni.showToast({ title: '请输入分类名称', icon: 'none' })
        return
      }
      this.saving = true
      try {
        if (this.editingItem) {
          await updateCategory(this.editingItem.id, {
            name: this.form.name.trim(),
            icon: this.form.icon,
            sort_order: Number(this.form.sort_order) || 0
          })
          uni.showToast({ title: '保存成功', icon: 'success' })
        } else {
          if (!this.form.id.trim()) {
            uni.showToast({ title: '请输入分类ID', icon: 'none' })
            this.saving = false
            return
          }
          await createCategory({
            id: this.form.id.trim(),
            name: this.form.name.trim(),
            icon: this.form.icon,
            sort_order: Number(this.form.sort_order) || 0
          })
          uni.showToast({ title: '创建成功', icon: 'success' })
        }
        this.dialogVisible = false
        await this.loadCategories()
      } catch (e) {
        uni.showToast({ title: '保存失败: ' + e.message, icon: 'none', duration: 3000 })
      } finally {
        this.saving = false
      }
    },
    handleDelete(item) {
      uni.showModal({
        title: '确认删除',
        content: `删除分类「${item.name}」？该分类下的商品不会被删除，但会失去分类归属。`,
        success: async (res) => {
          if (res.confirm) {
            try {
              await deleteCategory(item.id)
              this.categories = this.categories.filter(c => c.id !== item.id)
              uni.showToast({ title: '已删除', icon: 'success' })
            } catch (e) {
              uni.showToast({ title: '删除失败（可能有商品使用此分类）', icon: 'none', duration: 3000 })
            }
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.admin-page { min-height: 100vh; background: #f5f5f5; }
.top-bar {
  display: flex; justify-content: space-between; align-items: center;
  padding: 24rpx 30rpx; background: #fff; border-bottom: 1rpx solid #eee;
  position: sticky; top: 0; z-index: 10;
}
.top-title { font-size: 34rpx; font-weight: bold; color: #333; }
.btn-add {
  padding: 10rpx 24rpx; background: #d4756e; color: #fff;
  font-size: 26rpx; border-radius: 8rpx;
}
.category-list { padding: 20rpx; }
.loading { display: flex; justify-content: center; padding: 100rpx 0; color: #999; }
.category-item {
  display: flex; justify-content: space-between; align-items: center;
  background: #fff; border-radius: 12rpx; padding: 24rpx; margin-bottom: 16rpx;
}
.cat-left { display: flex; align-items: center; gap: 16rpx; }
.cat-icon { font-size: 40rpx; }
.cat-name { font-size: 28rpx; font-weight: bold; color: #333; }
.cat-id { font-size: 22rpx; color: #999; }
.cat-actions { display: flex; gap: 16rpx; }
.action-btn {
  font-size: 24rpx; color: #666; padding: 6rpx 16rpx;
  background: #f5f5f5; border-radius: 6rpx;
}
.action-btn.danger { color: #e53935; background: #ffebee; }

.modal-mask {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5); display: flex; align-items: center;
  justify-content: center; z-index: 100;
}
.modal-content {
  width: 85%; background: #fff; border-radius: 16rpx; padding: 40rpx;
}
.modal-title { font-size: 32rpx; font-weight: bold; color: #333; margin-bottom: 30rpx; }
.modal-form .form-item { margin-bottom: 20rpx; }
.modal-form .label { font-size: 24rpx; color: #666; margin-bottom: 8rpx; display: block; }
.modal-form .input {
  width: 100%; height: 72rpx; border: 1rpx solid #e0e0e0;
  border-radius: 8rpx; padding: 0 16rpx; font-size: 28rpx; box-sizing: border-box;
}
.modal-actions { display: flex; gap: 20rpx; margin-top: 30rpx; }
.btn-cancel {
  flex: 1; height: 80rpx; background: #f5f5f5; color: #666;
  font-size: 28rpx; border-radius: 8rpx; border: none;
}
.btn-confirm {
  flex: 1; height: 80rpx; background: linear-gradient(135deg, #d4756e, #e8a0a0);
  color: #fff; font-size: 28rpx; border-radius: 8rpx; border: none;
}
.btn-confirm[disabled] { opacity: 0.6; }
</style>
