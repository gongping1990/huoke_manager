import axios from "../../http";
import qs from "qs";

const tbzwClockin = {
  pageClassProgressByList(params) {
    return axios.post("/compositionv3/clockin/pageClassProgressByList", qs.stringify(params));
  },
};

export default tbzwClockin;
