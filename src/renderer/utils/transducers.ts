import { isPlainObject, entries } from 'lodash';

export function pushReducer(accumulation, value) {
  accumulation.push(value);
  return accumulation;
}

export function objectReducer(accumulation, value) {
  return { ...accumulation, ...value };
}

export function sumReducer(accumulation: number, value: number) {
  return accumulation + value;
}

export function map<T>(fx: (arg: T) => T) {
  return (reducer) => (accumulation: T[], value: T) => {
    return reducer(accumulation, fx(value));
  };
}

export function filter<T>(predicate: (arg: T) => boolean) {
  return (reducer) => (accumulation: T[], value: T) => {
    if (predicate(value)) {
      return reducer(accumulation, value);
    }
    return accumulation;
  };
}

[1, 2, 3, 4].reduce(
  map((v: number) => v * 2)(sumReducer),
  0
);

export function transduce(fx, reducer, seed, _collection) {
  let accumulation = seed;
  const transformedReducer = fx(reducer);

  const collection = isPlainObject(_collection) ? entries(_collection) : _collection;

  for (const value of collection) {
    accumulation = transformedReducer(accumulation, value);
  }

  return accumulation;
}


export function seq(fx, collection) {
  if (Array.isArray(collection)) {
    return transduce(fx, pushReducer, [], collection);
  } else if (isPlainObject(collection)) {
    return transduce(fx, objectReducer, {}, collection);
  }

  throw new Error('Unexpected type to seq');
}
