import compose from '../compose';
import { pushReducer, sumReducer, map, filter, transduce, seq } from '../transducers';

const doubleTheNumber = (v: number) => v * 2;
const isEven = (v: number) => v % 2 === 0;
const isNot2 = (v: number) => v !== 2;
const isEvenFilter = filter(isEven);
const isNotEvenFilter = filter((v: number) => v % 2 !== 0);
const doubleMap = map(doubleTheNumber);

it('map should work well', () => {
  expect([1, 2, 3, 4].reduce(doubleMap(pushReducer), [])).toEqual([2, 4, 6, 8]);
});

it('filter should work well', () => {
  expect([1, 2, 3, 4].reduce(isEvenFilter(pushReducer), [])).toEqual([2, 4]);
  expect([1, 2, 3, 4].reduce(isNotEvenFilter(pushReducer), [])).toEqual([1, 3]);
});

it('filter with map should work well', () => {
  const isEvenFlt = filter(isEven);
  expect([1, 2, 3, 4]
    .reduce(isEvenFlt(doubleMap(pushReducer)), [])
  ).toEqual([4, 8]);

  const isNot2Flt = filter(isNot2);
  expect([1, 2, 3, 4, 5, 6]
    .reduce(isNot2Flt(isEvenFlt(doubleMap(pushReducer))), [])
  ).toEqual([8, 12]);
});

it('filter with map with compose should work well', () => {
  const isEvenFlt = filter(isEven);
  expect([1, 2, 3, 4]
    .reduce(compose(isEvenFlt, doubleMap)(pushReducer), [])
  ).toEqual([4, 8]);

  const isNot2Flt = filter(isNot2);
  expect([1, 2, 3, 4, 5, 6]
    .reduce(compose(isNot2Flt, isEvenFlt, doubleMap)(pushReducer), [])
  ).toEqual([8, 12]);
});

it('filter with map with compose and sum reducer should work well', () => {
  const isEvenFlt = filter(isEven);
  expect([1, 2, 3, 4]
    .reduce(compose(isEvenFlt, doubleMap)(sumReducer), 0)
  ).toEqual(12);

  const isNot2Flt = filter(isNot2);
  expect([1, 2, 3, 4, 5, 6]
    .reduce(compose(isNot2Flt, isEvenFlt, doubleMap)(sumReducer), 0)
  ).toEqual(20);
});

it('transduce should work well', () => {
  const isEvenFlt = filter(isEven);
  expect(
    transduce(
      compose(isEvenFlt, doubleMap),
      sumReducer,
      0,
      [1, 2, 3, 4]
    )
  ).toEqual(12);

  expect(
    transduce(
      compose(isEvenFlt, doubleMap),
      pushReducer,
      [],
      [1, 2, 3, 4]
    )
  ).toEqual([4, 8]);
});

it('seq should work well', () => {
  const isEvenFlt = filter(isEven);
  expect(
    seq(
      compose(isEvenFlt, doubleMap),
      [1, 2, 3, 4]
    )
  ).toEqual([4, 8]);

  expect(
    seq(
      compose(filter(v => v[1] % 2 === 0), map(v => ({ [v[1]]: v[0] }))),
      { a: 1, b: 2, c: 3, d: 4 }
    )
  ).toEqual({'2': 'b', '4': 'd'});
});

