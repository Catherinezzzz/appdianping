// 封装项目中所有会使用到的URL
// 创建一个对象，对象的每一个属性都定义为一个方法

const url = {
  /**
   * 封装请求产品列表的URL
   * @param {*} path 不同的path代表获取的是不同类型资源的数据
   * @param {*} rowIndex 从哪一条开始获取数据
   * @param {*} pageSize 每一页显示多少条数据
   * @returns 请求产品列表的URL(String)
   */
  getProductList: (path, rowIndex, pageSize) =>
    `/mock/products/${path}.json?rowIndex=${rowIndex}&pageSize=${pageSize}`,
  /**
   * 封装获取商品详情的URL
   * @param {*} id 商品对应的id
   * @returns 获取商品详情的URL(String)
   */
  getProductDetail: (id) => `/mock/product_detail/${id}.json`,

  /**
   * 封装获取商品相关店铺信息的URL
   * @param {*} id 店铺的id
   * @returns 获取商品相关店铺信息的URL(String)
   */
  getShopById: (id) => `/mock/shops/${id}.json`,

  /**
   * 封装获取热门检索词的URL
   * @returns 获取热门检索词的URL
   */
  getPopularKeywords: () => `/mock/keywords/popular.json`,

  /**
   * 封装根据输入内容获取后台相关检索词的URL
   * 目前是根据mock方式获取数据，传入的参数不会起到实际的作用
   * @param {*} text 搜索框中输入的文字
   * @returns 根据输入内容获取后台相关检索词的URL
   */
  getRelatedKeywords: (text) => `/mock/keywords/related.json?keyword=${text}`,

  /**
   * 封装根据关键词获取相关店铺信息的URL
   * @param {*} keyword 检索的关键词
   * @returns 根据关键词获取相关店铺信息的URL
   */
  getRelatedShops: (keyword) => `/mock/shops/related.json`,

  /**
   * 封装获取订单信息的URL
   * @returns 获取订单信息的URL
   */
  getOrders: () => `/mock/orders/orders.json`,
};

export default url;
