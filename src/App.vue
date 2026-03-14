<script>
export default {
  onLaunch() {
    console.log('小白衣橱启动')
  }
}
</script>

<style>
page {
  background-color: #faf8f6;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  color: #333;
  font-size: 28rpx;
  line-height: 1.6;
}

/* 全局工具类 */
.price {
  color: #d4756e;
  font-weight: bold;
}
.price-symbol {
  font-size: 24rpx;
}
.price-original {
  color: #999;
  font-size: 22rpx;
  text-decoration: line-through;
  margin-left: 8rpx;
}
.tag {
  display: inline-block;
  padding: 2rpx 12rpx;
  border-radius: 6rpx;
  font-size: 20rpx;
  margin-right: 8rpx;
}
.tag-new {
  background: #fdf0ee;
  color: #d4756e;
}
.tag-hot {
  background: #fff8ee;
  color: #f5a623;
}
</style>
