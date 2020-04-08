import axios from "../../http";
import qs from "qs";

const hkywhdUserPortraint = {
  // 获取语文用户列表
  getUserPortraintOverview(params) {
    return axios.get("/xumg/userPortraint/getUserPortraintOverview", {params: params});
  },
  getUserPortraintByRole(params) {
    return axios.get("/xumg/userPortraint/getUserPortraintByRole", {params: params});
  }
};

export default hkywhdUserPortraint;
