import axios from "../../http";
import qs from "qs";

const tbzwCoupon = {
  pageCouponConfig(params) {
    return axios.get("/compositionv2/coupon/pageCouponConfig", {params: params});
  },
  finishCoupon(params) {
    return axios.get("/compositionv2/coupon/finishCoupon", {params: params});
  },
  getCouponData(params) {
    return axios.get("/compositionv2/coupon/getCouponData", {params: params});
  },
  editCouponConfig(params) {
    return axios.post("/compositionv2/coupon/editCouponConfig", qs.stringify(params));
  },
  getCouponUserDetais(params) {
    return axios.get("/compositionv2/coupon/getCouponUserDetais", {params: params});
  },
};

export default tbzwCoupon;
