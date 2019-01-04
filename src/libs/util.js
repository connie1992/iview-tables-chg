let util = {};

util.copyObject = (obj) => {
  if (!(obj instanceof Array)) {
    let newObj = Object.assign({}, obj);
    return newObj;
  } else {
    return obj.map((item) => {
      return Object.assign({}, item);
    })
  }
};


export default util;
