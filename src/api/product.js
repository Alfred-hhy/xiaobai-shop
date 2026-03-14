/**
 * 商品数据访问层
 * Supabase API 版本
 */

import { supabase } from '../lib/supabase.js'

// ============ 顾客端（读取）============

// 获取所有在架商品
export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'on')
    .order('id')
  if (error) throw error
  return transformProducts(data)
}

// 按分类获取商品
export async function getProductsByCategory(categoryId) {
  if (categoryId === 'all') return getProducts()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'on')
    .eq('category', categoryId)
    .order('id')
  if (error) throw error
  return transformProducts(data)
}

// 获取单个商品详情
export async function getProductById(id) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', Number(id))
    .single()
  if (error) throw error
  return transformProduct(data)
}

// 获取推荐商品（新品 + 热销）
export async function getRecommendProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'on')
    .or('is_new.eq.true,is_hot.eq.true')
    .order('id')
  if (error) throw error
  return transformProducts(data)
}

// 获取新品
export async function getNewProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'on')
    .eq('is_new', true)
    .order('id')
  if (error) throw error
  return transformProducts(data)
}

// 获取热销商品
export async function getHotProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'on')
    .eq('is_hot', true)
    .order('id')
  if (error) throw error
  return transformProducts(data)
}

// 获取所有分类（前端补上 "全部" 虚拟分类）
export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')
  if (error) throw error
  return [{ id: 'all', name: '全部', icon: '👗' }, ...data]
}

// 搜索商品
export async function searchProducts(keyword) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'on')
    .ilike('name', `%${keyword}%`)
    .order('id')
  if (error) throw error
  return transformProducts(data)
}

// ============ 管理端（CRUD）============

// 获取所有商品（包括下架的，管理后台用）
export async function getAllProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: false })
  if (error) throw error
  return transformProducts(data)
}

// 创建商品
export async function createProduct(product) {
  const row = transformToRow(product)
  const { data, error } = await supabase
    .from('products')
    .insert(row)
    .select()
    .single()
  if (error) throw error
  return transformProduct(data)
}

// 更新商品
export async function updateProduct(id, updates) {
  const row = transformToRow(updates)
  const { data, error } = await supabase
    .from('products')
    .update(row)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return transformProduct(data)
}

// 删除商品
export async function deleteProduct(id) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// 上传商品图片
export async function uploadImage(file) {
  const ext = file.name ? file.name.split('.').pop() : 'jpg'
  const fileName = `products/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`

  const { error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file, { contentType: file.type || 'image/jpeg' })
  if (error) throw error

  const { data: urlData } = supabase.storage
    .from('product-images')
    .getPublicUrl(fileName)

  return urlData.publicUrl
}

// ============ 认证 ============

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

// ============ 字段映射（snake_case ↔ camelCase）============

function transformProduct(row) {
  if (!row) return null
  return {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : null,
    category: row.category,
    description: row.description,
    sizes: row.sizes || [],
    colors: row.colors || [],
    images: row.images || [],
    isNew: row.is_new,
    isHot: row.is_hot,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

function transformProducts(rows) {
  return (rows || []).map(transformProduct)
}

function transformToRow(product) {
  const row = {}
  if (product.name !== undefined) row.name = product.name
  if (product.price !== undefined) row.price = product.price
  if (product.originalPrice !== undefined) row.original_price = product.originalPrice
  if (product.category !== undefined) row.category = product.category
  if (product.description !== undefined) row.description = product.description
  if (product.sizes !== undefined) row.sizes = product.sizes
  if (product.colors !== undefined) row.colors = product.colors
  if (product.images !== undefined) row.images = product.images
  if (product.isNew !== undefined) row.is_new = product.isNew
  if (product.isHot !== undefined) row.is_hot = product.isHot
  if (product.status !== undefined) row.status = product.status
  return row
}
