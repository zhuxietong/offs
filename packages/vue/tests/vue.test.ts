import { useFetch } from '@offs/vue';

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
    useFetch('http://localhost:3000/api/v1/users');

    // console.log(extractValues(obj, "a=b|d|o('age'),<list>,row('page')"));
  });
});
