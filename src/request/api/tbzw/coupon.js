import axios from "../../http";
import qs from "qs";

const tbzwCoupon = {
  pageCouponConfig(params) {
    return axios.get("/compositionv3/coupon/pageCouponConfig", {params: params});
  },
  finishCoupon(params) {
    return axios.get("/compositionv3/coupon/finishCoupon", {params: params});
  },
  getCouponData(params) {
    return axios.get("/compositionv3/coupon/getCouponData", {params: params});
  },
  editCouponConfig(params) {
    return axios.post("/compositionv3/coupon/editCouponConfig", qs.stringify(params));
  },
  getCouponUserDetais(params) {
    return axios.get("/compositionv3/coupon/getCouponUserDetais", {params: params});
  },
};

export default tbzwCoupon;
