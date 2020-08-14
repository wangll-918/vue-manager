// 引入axios
import axios from 'axios';

// 设置请求基本路径 -- 请求时，会自动将它添加到地址前

const IPpath = 'http://127.0.0.1:5000';

axios.defaults.baseURL = IPpath;

// 头像上传地址
export const uploadimginfo = IPpath + '/users/avatar_upload/';

// 图片上传地址
export const  Goods_img_upload = IPpath + '/goods/goods_img_upload/';

// 图片获取地址
export const GET_goods_img = IPpath + '/upload/imgs/goods_img/';

// 店铺图片获取地址
export const GET_shop_img = IPpath + '/upload/shop/';

// 店铺图片上传接口
export const  Shop_img_upload = IPpath + '/shop/upload/';


// 封装并暴露 
// ES5
/* export function login(acc, pwd) {
    return axios.post('/users/checkLogin', {acc, pwd})} */

// ES6
// =====================================账号管理模块============================================
// 登录接口
export var login = (account, password) => axios.post('/users/checkLogin', { account, password });

// 验证token是否失效
export var checktoken = (token) => axios.get('/users/checktoken', { params: { token }} );

//添加账号
export var useradd = (account, password, userGroup) => axios.post('/users/add', { account, password, userGroup });

// 获取账号列表
export var userlist = (currentPage, pageSize) => axios.get('/users/list', { params: { currentPage, pageSize}});

// 删除账号
export var userdel = (id) => axios.get('/users/del', { params: { id }});

// 批量删除账号
export var userbatchdel = (ids) => axios.get('/users/batchdel', { params: { ids }});

// 修改账号
export var useredit = (id, account, userGroup) => axios.post('/users/edit', { id, account, userGroup });

// 检查旧密码是否正确
export var checkoldpwd = (oldPwd, id) => axios.get('/users/checkoldpwd', { params: { oldPwd, id }});

// 修改密码
export var editpwd = (id, newPwd) => axios.post('/users/editpwd', { id, newPwd });

// 9. 获取账号（个人中心）信息
export var accountinfo = (id) => axios.get('/users/accountinfo', { params: { id }});

// 10. 头像上传接口
export var upload = (id) => axios.post('/users/avatar_upload', { id });

// ============================================商品管理模块==============================================
// 12. 添加分类
export var addcate = (cateName, state) => axios.post('/goods/addcate', { cateName, state });

// 13. 获取分类
export var catelist = (currentPage, pageSize) => axios.get('/goods/catelist', { params: { currentPage, pageSize }});

// 14. 删除分类
export var delcate = (id) => axios.get('/goods/delcate', { params: { id }});

// 15. 修改分类
export var editcate = (params) => axios.post('/goods/editcate', params );

// 16. 查询所有分类名称
export var categories = (id) => axios.get('/goods/categories', { params: { id }});

// 17. 商品图片上传接口
export var goods_img_upload = () => axios.post('/goods/goods_img_upload');

// 18. 添加商品
export var add= (name, category, price, imgUrl, goodsDesc) => axios.post('/goods/add', { name, category, price, imgUrl, goodsDesc });

// 19. 获取商品列表
export var list = (currentPage, pageSize) => axios.get('/goods/list', { params: { currentPage, pageSize }});

// 20. 删除商品
export var del = (id) => axios.get('/goods/del', { params: { id }});

// 21. 修改商品
export var edit= (name, category, price, imgUrl, goodsDesc, id) => axios.post('/goods/edit', { name, category, price, imgUrl, goodsDesc, id });

// =======================================订单管理模块===================================================
// 22. 获取订单列表(带查询功能)
export var orderlist = (currentPage, pageSize, orderNo, consignee, phone, orderState, date) => axios.get('/order/list', { params: { currentPage, pageSize, orderNo, consignee, phone, orderState, date }});

// 23. 查询
export var ordersearch = (currentPage, pageSize, orderNo, consignee, phone, orderState, date) => axios.get('/order/search', { params: { currentPage, pageSize, orderNo, consignee, phone, orderState, date }});

// 24. 获取订单详情
export var orderdetail = (id) => axios.get('/order/detail', { params: { id }});

// 25. 修改订单
export var orderedit= (id, orderNo, orderTime, phone, consignee, deliverAddress, deliveryTime, remarks, orderAmount, orderState) => axios.post('/order/edit', { id, orderNo, orderTime, phone, consignee, deliverAddress, deliveryTime, remarks, orderAmount, orderState });

// =======================================店铺管理模块===================================================
// 26. 获取店铺详情
export var shopinfo = () => axios.get('shop/info');

// 28. 店铺内容修改
export var shopedit = (id, name, bulletin, avatar, pics, deliveryPrice, deliveryTime, description, score, sellCount, supports, date) => axios.post('/shop/edit', { id, name, bulletin, avatar, pics, deliveryPrice, deliveryTime, description, score, sellCount, supports, date });

// =======================================报表模块===================================================
// 首页报表
export var totaldata = () => axios.get('/order/totaldata');

// 订单报表
export var ordertotal = (date) => axios.get('/order/ordertotal', { params: { date }});

