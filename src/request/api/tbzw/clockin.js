import axios from "../../http";
import qs from "qs";

const tbzwClockin = {
  pageClassProgressByList(params) {
    return axios.post("/compositionv2/clockin/pageClassProgressByList", qs.stringify(params));
  },
};

export default tbzwClockin;
