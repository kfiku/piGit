export default function compose(...fns: ((...args) => any)[]) {
  return fns.reduce((accumulation, value) => {
    return (...args) => accumulation(value(...args));
  }, x => x);
}
