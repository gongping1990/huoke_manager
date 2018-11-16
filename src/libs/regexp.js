
export const pattern = {
  positiveInteger: new RegExp(/^[0-9]*[1-9][0-9]*$/),  // 正整数
  url: new RegExp(/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?/), // url验证
  digitalRange : new RegExp(/^(\d{1,2}(\.\d{1,2})?|100(\.0{1,2})?)$/), // 数字范围验证 （0.00-100.00）
  positive : new RegExp(/^[0-9]+([.]{1}[0-9]{1,2})?$/) // 正数，保留两位小数点
}

