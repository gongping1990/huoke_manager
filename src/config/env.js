/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * baseImgPath: 图片存放地址
 *
 */
let baseUrl = '';
let routerMode = 'history';
let baseImgPath;
let copyUrl = ''

if (process.env.NODE_ENV == 'development') {
    baseUrl = '//localhost:8002';
    baseImgPath = '/img/';
    copyUrl = 'http://testh5.k12.vip/coupon'
} else {
    baseUrl = '//huoke.prod.k12.vip';
    baseImgPath = '//huoke.prod.k12.vip/img/';
    copyUrl = 'http://huoke.k12.vip/coupon'
}

export {
    baseUrl,
    routerMode,
    baseImgPath,
    copyUrl
}
