import compose from '../compose';

const doubleTheNumber = (v: number) => v * 2;
const tripleTheNumber = (v: number) => v * 3;
const powerTheNumber = (v: number) => v * v;

it('compose should work well', () => {
  const composed = compose(doubleTheNumber, tripleTheNumber, powerTheNumber);
  // 4, 12, 24
  expect(composed(2)).toEqual(24);

  const composed2 = compose(powerTheNumber, tripleTheNumber, doubleTheNumber);
  // 4, 12, 144
  expect(composed2(2)).toEqual(144);
});

