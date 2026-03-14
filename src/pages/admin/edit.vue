<template>
  <view class="edit-page">
    <view class="form">
      <!-- 商品名称 -->
      <view class="form-item">
        <text class="label">商品名称 *</text>
        <input class="input" v-model="form.name" placeholder="请输入商品名称" />
      </view>

      <!-- 分类 -->
      <view class="form-item">
        <text class="label">分类 *</text>
        <picker :range="categoryNames" :value="categoryIndex" @change="onCategoryChange">
          <view class="picker">{{ categoryNames[categoryIndex] || '请选择分类' }}</view>
        </picker>
      </view>

      <!-- 价格 -->
      <view class="form-row">
        <view class="form-item half">
          <text class="label">售价 *</text>
          <input class="input" v-model="form.price" type="digit" placeholder="0" />
        </view>
        <view class="form-item half">
          <text class="label">原价</text>
          <input class="input" v-model="form.originalPrice" type="digit" placeholder="0" />
        </view>
      </view>

      <!-- 描述 -->
      <view class="form-item">
        <text class="label">商品描述</text>
        <textarea class="textarea" v-model="form.description" placeholder="请输入商品描述" :maxlength="500" />
      </view>

      <!-- 尺码 -->
      <view class="form-item">
        <text class="label">可选尺码（逗号分隔）</text>
        <input class="input" v-model="sizesText" placeholder="例: XS,S,M,L" />
      </view>

      <!-- 颜色 -->
      <view class="form-item">
        <text class="label">可选颜色（逗号分隔）</text>
        <input class="input" v-model="colorsText" placeholder="例: 黑色,白色" />
      </view>

      <!-- 标签 -->
      <view class="form-item">
        <view class="tag-row">
          <view :class="['tag-toggle', { active: form.isNew }]" @click="form.isNew = !form.isNew">
            新品
          </view>
          <view :class="['tag-toggle', { active: form.isHot }]" @click="form.isHot = !form.isHot">
            热销
          </view>
        </view>
      </view>

      <!-- 图片 -->
      <view class="form-item">
        <text class="label">商品图片</text>
        <view class="image-list">
          <view class="image-item" v-for="(img, idx) in form.images" :key="idx">
            <image class="preview-img" :src="img" mode="aspectFill" />
            <text class="remove-img" @click="removeImage(idx)">x</text>
          </view>
          <view class="image-add" @click="chooseImage" v-if="form.images.length < 5">
            <text class="add-icon">+</text>
            <text class="add-text">添加图片</text>
          </view>
        </view>
      </view>

      <!-- 状态 -->
      <view class="form-item">
        <view class="switch-row">
          <text class="label" style="margin-bottom:0">上架状态</text>
          <switch :checked="form.status === 'on'" @change="onStatusChange" color="#d4756e" />
        </view>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="bottom-actions">
      <button class="btn-save" @click="handleSave" :disabled="saving">
        {{ saving ? '保存中...' : (isEdit ? '保存修改' : '创建商品') }}
      </button>
    </view>
  </view>
</template>

<script>
import { getProductById, createProduct, updateProduct, uploadImage, getSession } from '../../api/product.js'
import { supabase } from '../../lib/supabase.js'

export default {
  data() {
    return {
      isEdit: false,
      editId: null,
      saving: false,
      form: {
        name: '',
        price: '',
        originalPrice: '',
        category: '',
        description: '',
        sizes: [],
        colors: [],
        images: [],
        isNew: false,
        isHot: false,
        status: 'on'
      },
      sizesText: '',
      colorsText: '',
      categoryList: [
        { id: 'dress', name: '连衣裙' },
        { id: 'top', name: '上衣' },
        { id: 'pants', name: '裤装' },
        { id: 'skirt', name: '半裙' },
        { id: 'health', name: '健康好物' }
      ],
      categoryIndex: 0
    }
  },
  computed: {
    categoryNames() {
      return this.categoryList.map(c => c.name)
    }
  },
  async onLoad(options) {
    const session = await getSession()
    if (!session) {
      uni.redirectTo({ url: '/pages/admin/login' })
      return
    }

    if (options.id) {
      this.isEdit = true
      this.editId = Number(options.id)
      uni.setNavigationBarTitle({ title: '编辑商品' })
      try {
        const product = await getProductById(this.editId)
        if (product) {
          this.form = {
            name: product.name,
            price: String(product.price),
            originalPrice: product.originalPrice ? String(product.originalPrice) : '',
            category: product.category,
            description: product.description || '',
            sizes: product.sizes || [],
            colors: product.colors || [],
            images: product.images || [],
            isNew: product.isNew,
            isHot: product.isHot,
            status: product.status
          }
          this.sizesText = this.form.sizes.join(',')
          this.colorsText = this.form.colors.join(',')
          const idx = this.categoryList.findIndex(c => c.id === product.category)
          if (idx >= 0) this.categoryIndex = idx
        }
      } catch (e) {
        uni.showToast({ title: '加载商品失败', icon: 'none' })
      }
    } else {
      uni.setNavigationBarTitle({ title: '新增商品' })
    }
  },
  methods: {
    onCategoryChange(e) {
      this.categoryIndex = e.detail.value
      this.form.category = this.categoryList[this.categoryIndex].id
    },
    onStatusChange(e) {
      this.form.status = e.detail.value ? 'on' : 'off'
    },
    removeImage(idx) {
      this.form.images.splice(idx, 1)
    },
    async chooseImage() {
      uni.chooseImage({
        count: 5 - this.form.images.length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: async (res) => {
          for (const tempPath of res.tempFilePaths) {
            try {
              uni.showLoading({ title: '上传中...' })
              // 读取文件并上传
              const response = await fetch(tempPath)
              const blob = await response.blob()
              const fileName = `products/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.jpg`

              const { error } = await supabase.storage
                .from('product-images')
                .upload(fileName, blob, { contentType: 'image/jpeg' })

              if (error) throw error

              const { data: urlData } = supabase.storage
                .from('product-images')
                .getPublicUrl(fileName)

              this.form.images.push(urlData.publicUrl)
            } catch (e) {
              uni.showToast({ title: '上传失败', icon: 'none' })
            } finally {
              uni.hideLoading()
            }
          }
        }
      })
    },
    async handleSave() {
      // 校验
      if (!this.form.name.trim()) {
        uni.showToast({ title: '请输入商品名称', icon: 'none' })
        return
      }
      if (!this.form.price || Number(this.form.price) <= 0) {
        uni.showToast({ title: '请输入有效价格', icon: 'none' })
        return
      }
      if (!this.form.category) {
        this.form.category = this.categoryList[this.categoryIndex].id
      }

      // 处理尺码和颜色
      this.form.sizes = this.sizesText ? this.sizesText.split(',').map(s => s.trim()).filter(Boolean) : []
      this.form.colors = this.colorsText ? this.colorsText.split(',').map(s => s.trim()).filter(Boolean) : []

      const productData = {
        name: this.form.name.trim(),
        price: Number(this.form.price),
        originalPrice: this.form.originalPrice ? Number(this.form.originalPrice) : null,
        category: this.form.category,
        description: this.form.description.trim(),
        sizes: this.form.sizes,
        colors: this.form.colors,
        images: this.form.images,
        isNew: this.form.isNew,
        isHot: this.form.isHot,
        status: this.form.status
      }

      this.saving = true
      try {
        if (this.isEdit) {
          await updateProduct(this.editId, productData)
          uni.showToast({ title: '保存成功', icon: 'success' })
        } else {
          await createProduct(productData)
          uni.showToast({ title: '创建成功', icon: 'success' })
        }
        setTimeout(() => uni.navigateBack(), 500)
      } catch (e) {
        uni.showToast({ title: '保存失败: ' + e.message, icon: 'none', duration: 3000 })
      } finally {
        this.saving = false
      }
    }
  }
}
</script>

<style scoped>
.edit-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 140rpx;
}
.form {
  padding: 20rpx;
}
.form-item {
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
}
.form-row {
  display: flex;
  gap: 16rpx;
}
.form-item.half {
  flex: 1;
}
.label {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 12rpx;
  display: block;
}
.input {
  width: 100%;
  height: 80rpx;
  border: 1rpx solid #e0e0e0;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}
.textarea {
  width: 100%;
  height: 180rpx;
  border: 1rpx solid #e0e0e0;
  border-radius: 8rpx;
  padding: 16rpx 20rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}
.picker {
  height: 80rpx;
  line-height: 80rpx;
  border: 1rpx solid #e0e0e0;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #333;
}
.tag-row {
  display: flex;
  gap: 20rpx;
}
.tag-toggle {
  padding: 12rpx 32rpx;
  border: 1rpx solid #e0e0e0;
  border-radius: 8rpx;
  font-size: 26rpx;
  color: #666;
}
.tag-toggle.active {
  background: #fdf0ee;
  border-color: #d4756e;
  color: #d4756e;
  font-weight: bold;
}
.switch-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}
.image-item {
  position: relative;
  width: 180rpx;
  height: 180rpx;
}
.preview-img {
  width: 100%;
  height: 100%;
  border-radius: 8rpx;
}
.remove-img {
  position: absolute;
  top: -10rpx;
  right: -10rpx;
  width: 40rpx;
  height: 40rpx;
  background: #e53935;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
}
.image-add {
  width: 180rpx;
  height: 180rpx;
  border: 2rpx dashed #ccc;
  border-radius: 8rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.add-icon {
  font-size: 48rpx;
  color: #ccc;
}
.add-text {
  font-size: 22rpx;
  color: #999;
  margin-top: 8rpx;
}
.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 30rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background: #fff;
  box-shadow: 0 -2rpx 12rpx rgba(0,0,0,0.06);
}
.btn-save {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(135deg, #d4756e, #e8a0a0);
  color: #fff;
  font-size: 30rpx;
  font-weight: bold;
  border-radius: 12rpx;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-save[disabled] {
  opacity: 0.6;
}
</style>
