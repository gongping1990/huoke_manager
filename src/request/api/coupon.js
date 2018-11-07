import axios from "../http";
import qs from "qs";

const coupon = {
  // 优惠券列表
  couponList(params) {
    return axios.get("/boss/coupon/list", {params});
  },
  // 优惠券详情
  couponInfo(params) {
    return axios.get(`/boss/coupon/${params}`);
  },
  // 新增、修改优惠券
  editCoupon(params) {
    return axios.post("/boss/coupon/save", params);
  },
  // 结束优惠券
  closeCoupon(params) {
    return axios.post("/boss/coupon/close", qs.stringify(params));
  }
};

export default coupon;
