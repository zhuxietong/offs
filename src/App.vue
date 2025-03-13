<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import api from '@/req/api.ts'

onLaunch(() => {
  console.log('App Launch')

  _api('list', {
    body: {
      page: 1,
      limit: 10,
    },
    hooks: {
      beforeRequest: (req,config) => {
        console.log('000000---1', config)
      },
      afterResponse: (response: any) => {
        console.log('afterResponse', response)
      },
    },
  }).then((r: any) => {
    console.log('.==========', r)
  })
})
onShow(() => {
  console.log('App Show')
})
onHide(() => {
  console.log('App Hide')
})
</script>
<style lang="scss">
@import './.offs/style';

page {
  background-color: #f7f8fa;
}
</style>
