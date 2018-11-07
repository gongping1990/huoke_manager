import cosdk from "cos-js-sdk-v5";
import api from "@/request/api";

export const uploadFile = new cosdk({
  // 必选参数
  getAuthorization: function (options, callback) {
    console.log(options, 'options')
    var key = options.Key || '';
    var pathname = key.indexOf('/') === 0 ? key : '/' + key;
    var data = {
      path: pathname
    };

    api.common.uploadSign(data)
      .then(
        Response => {
          console.log("CosSign数据", Response.data.resultData);
          callback({
            Authorization: Response.data.resultData
            // XCosSecurityToken: data.XCosSecurityToken, // 如果是临时密钥计算出来的签名，需要提供 XCosSecurityToken
          });
        })
  },
  // 可选参数
  FileParallelLimit: 3,    // 控制文件上传并发数
  ChunkParallelLimit: 3,   // 控制单个文件下分片上传并发数
  ProgressInterval: 300,  // 控制上传的 onProgress 回调的间隔
})
