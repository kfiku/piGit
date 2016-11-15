const ReorderArray = (arr, fromIndex, toIndex) => {
  let el = arr[fromIndex];

  if (!el || toIndex > arr.length) {
    return arr;
  } else {
    let arrClone = arr.slice();
    arrClone.splice(fromIndex, 1);
    arrClone.splice(toIndex, 0, el);

    return arrClone;
  }
};

export default ReorderArray;
