// 基本使用
import uniKy from './ky'

// // GET 请求
// uniKy.get('users').then(data => {
//   console.log(data);
// });
//
// // POST 请求
// uniKy.post('users', {
//   data: { name: '张三', age: 25 }
// }).then(data => {
//   console.log(data);
// });

// 创建自定义实例
const api = uniKy.create({
  prefixUrl: 'http://localhost:3111',
  headers: {
    Authorization: 'Bearer token123',
  },
  searchParams:{
    id: 1
  },
  hooks: {
    beforeRequest: [
      (request, options) => {
        console.log('----beforeRequest0001', request, options)
      },
    ],
    afterResponse: [
      (resp, request, options) => {
        resp.data = {
          ok:true,
          ...resp.data,
        }
        console.log('----resp1', resp)
      },
    ],
  },
  timeout: 30000,
})
export default api
