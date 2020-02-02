import axios from "../../http";
import qs from "qs";

const tbzwVest = {
  pageActiceVest(params) {
    return axios.get("/compositionv2/vest/pageActiceVest", {params: params});
  },
  saveActiveVest(params) {
    return axios.post("/compositionv2/vest/saveActiveVest", qs.stringify(params));
  }
};

export default tbzwVest;
