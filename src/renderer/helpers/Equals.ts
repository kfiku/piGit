const equals = (obj, obj2) => {
  // console.log(JSON.stringify(obj), JSON.stringify(obj2););
  return JSON.stringify(obj) === JSON.stringify(obj2);
};

export default equals;
