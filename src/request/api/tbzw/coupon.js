import axios from "../../http";
import qs from "qs";

const tbzwCoupon = {
  pageCouponConfig(params) {
    return axios.get("/composition/coupon/pageCouponConfig", {params: params});
  },
  finishCoupon(params) {
    return axios.get("/composition/coupon/finishCoupon", {params: params});
  },
  editCouponConfig(params) {
    return axios.post("/composition/coupon/editCouponConfig", qs.stringify(params));
  },
};

export default tbzwCoupon;
