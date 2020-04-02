import axios from "../../http";
import qs from "qs";

const tbzwVest = {
  pageActiceVest(params) {
    return axios.get("/compositionv3/vest/pageActiceVest", {params: params});
  },
  saveActiveVest(params) {
    return axios.post("/compositionv3/vest/saveActiveVest", qs.stringify(params));
  }
};

export default tbzwVest;
