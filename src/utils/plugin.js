import dayjs from 'dayjs'
let pluginDom = {}
pluginDom.install = function (Vue,options) {
  // Vue.mixin({
  //   data() {
  //     return {
  //       tab: {
  //         page: 1,
  //         currentPage: 1,
  //         pageSize: 10
  //       },
  //       total: 0,
  //     }
  //   }
  // })

  Vue.prototype.$utilsMethod = {
    isPhone: (phone)=> {
      if (!/^1[34578]\d{9}$/.test(phone)) {
        return false
      }
      return true
    },
    thousandFormatter: function (num) {
      num = (num-0).toFixed(2);
      let toString = num.toString()
      let numOne = ''
      let numTwo = ''
      let formatterNum = ''
      if(toString.indexOf('.')>-1){
        [numOne,numTwo] = toString.split('.')
      }
      formatterNum = (numOne || num).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
      return numTwo ? `${formatterNum}.${numTwo}` : `${formatterNum}.00`
    },
    pointsFormatter: (value)=> {
      return value*100
    },
    formatTime: function (msTime) {

      let time = msTime /1000;

      let day = Math.floor(time /60 /60 /24);

      let hour = Math.floor(time /60 /60) %24;

      let minute = Math.floor(time /60) %60;

      let second = Math.floor(time) %60;

      function zeroMat(num) {
        if (num < 10) {
          return '0' + num;
        } else {
          return '' + num;
        }
      }

      return `${zeroMat(hour)}:${zeroMat(minute)}:${zeroMat(second)}`

    }
  }

  Vue.filter('moneyFormatter', function (value) {
    return (value / 100.0).toFixed(2);
  })

  Vue.filter('timeDateFormatter', function (value) {
    return (dayjs(+value).format('YYYY-MM-DD HH:mm:ss'));
  })
}

export default pluginDom
