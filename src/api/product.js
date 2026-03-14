/**
 * 商品数据访问层
 * 当前：读取本地 JSON 文件
 * 后期：替换为 API 请求，页面代码无需修改
 */

import products from '../data/products.json'
import categories from '../data/categories.json'

// 获取所有在架商品
export function getProducts() {
  return products.filter(p => p.status === 'on')
}

// 按分类获取商品
export function getProductsByCategory(categoryId) {
  if (categoryId === 'all') return getProducts()
  return getProducts().filter(p => p.category === categoryId)
}

// 获取单个商品详情
export function getProductById(id) {
  return products.find(p => p.id === Number(id))
}

// 获取推荐商品（新品 + 热销）
export function getRecommendProducts() {
  return getProducts().filter(p => p.isNew || p.isHot)
}

// 获取新品
export function getNewProducts() {
  return getProducts().filter(p => p.isNew)
}

// 获取热销商品
export function getHotProducts() {
  return getProducts().filter(p => p.isHot)
}

// 获取所有分类
export function getCategories() {
  return categories
}

// 搜索商品
export function searchProducts(keyword) {
  const kw = keyword.toLowerCase()
  return getProducts().filter(p =>
    p.name.toLowerCase().includes(kw) ||
    p.description.toLowerCase().includes(kw)
  )
}
