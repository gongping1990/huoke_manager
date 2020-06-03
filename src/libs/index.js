export function isWeiXin() {
  //window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
  var ua = window.navigator.userAgent.toLowerCase();
  //通过正则表达式匹配ua中是否含有MicroMessenger字符串
  if (ua.match(/MicroMessenger/i) == "micromessenger") {
    return true;
  } else {
    return false;
  }
}

export function checkPhone(phone) {
  if (!/^1[34578]\d{9}$/.test(phone)) {
    return false;
  }
  return true;
}

export function UA() {
  var u = navigator.userAgent,
    app = navigator.appVersion;
  var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //g
  var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  if (isAndroid) {
    return 1;
  }
  if (isIOS) {
    return 0;
  }
}

export function setRouter(to, from) {
  //此时假设从index页面跳转到pointList页面
  console.log(to, from);
  let routeDeep = [];
  this.$router.options.routes.forEach(e => {
    routeDeep.push(e.name);
    if (e.children) {
      e.children.forEach(_e => {
        routeDeep.push(_e.name);
      });
    }
  });
  const toDepth = routeDeep.indexOf(to.name);
  const fromDepth = routeDeep.indexOf(from.name);
  const transitionName =
    toDepth == fromDepth
      ? "fold-left"
      : toDepth > fromDepth
      ? "fold-left"
      : "fold-right";
  this.$store.commit("SET_TRANSTION_NAME", transitionName);
}

export const copyUrl = () => {
  // 环境的切换
  if (process.env.NODE_ENV == "development" || process.env.NODE_ENV == "test") {
    return "http://testh5.k12.vip/courseInfo";
  }
  return "http://huoke.k12.vip/courseInfo";
};

export const getBaseUrl = () => {
  // 环境的切换
  if (process.env.NODE_ENV == "development" || process.env.NODE_ENV == "test") {
    return "http://huoke.prod.k12.vip";
  }
  return "http://huoke.prod.k12.vip";
};

// 线上地址
export const getVisitUrl = () => {
  // 环境的切换
  if (process.env.NODE_ENV == "development" || process.env.NODE_ENV == "test") {
    return process.env.NODE_ENV == "development"
      ? "http://localhost:8080"
      : "http://testadmin.k12.vip";
  }
  return "http://huoke.admin.k12.vip";
};

export const getGroupPrice = (groupPrice, price) => {
  if (groupPrice) {
    return groupPrice == 0 ? "免费" : groupPrice / 100;
  } else {
    return price == "0" ? "免费" : price / 100;
  }
};

export const thousandFormatter = function(num) {
  num = (num - 0).toFixed(2);
  let toString = num.toString();
  let numOne = "";
  let numTwo = "";
  let formatterNum = "";
  if (toString.indexOf(".") > -1) {
    [numOne, numTwo] = toString.split(".");
  }
  formatterNum = (numOne || num)
    .toString()
    .replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
  return numTwo ? `${formatterNum}.${numTwo}` : `${formatterNum}.00`;
}; // 重置千位符

export const formatTime = function(msTime) {
  let time = msTime / 1000;

  let day = Math.floor(time / 60 / 60 / 24);

  let hour = Math.floor(time / 60 / 60) % 24;

  let minute = Math.floor(time / 60) % 60;

  let second = Math.floor(time) % 60;

  function zeroMat(num) {
    if (num < 10) {
      return "0" + num;
    } else {
      return "" + num;
    }
  }

  return `${zeroMat(hour)}:${zeroMat(minute)}:${zeroMat(second)}`;
};

export const firstdate  = function() {
  var date = new Date();
  date.setDate(1);
  var month = parseInt(date.getMonth()+1);
  var day = date.getDate();
  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }
  return date.getFullYear() + '-' + month + '-' + day;
};

export const lastdate  = function() {
  var date=new Date();
  var currentMonth=date.getMonth();
  var nextMonth=++currentMonth;
  var nextMonthFirstDay=new Date(date.getFullYear(),nextMonth,1);
  var oneDay=1000*60*60*24;
  var lastTime = new Date(nextMonthFirstDay-oneDay);
  var month = parseInt(lastTime.getMonth()+1);
  var day = lastTime.getDate();
  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }
  return date.getFullYear() + '-' + month + '-' + day;
};

