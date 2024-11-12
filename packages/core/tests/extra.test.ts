import { extractValues } from '@offs/core';

describe('coreFunction', () => {
  it('should log "Core function"', () => {

    const obj = {
      b: 1,
      d: 2,
      o: { age: 30 },
      c: 3,
      list: [{ b: 10 }, { b: 20 }],
      page: 5
    };

    console.log(extractValues(obj, "a=b|d|o('age'),<list>,row('page')"));
  });
});
