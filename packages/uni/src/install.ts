import Section from "./components/section/section.vue"
import SectionRow from "./components/section/section-row.vue"
import Paging from "./components/paging.vue"
import Detail from "./components/detail.vue"

export function install_comps(app: any) {
  app.component('me-section', Section)
  app.component('me-section-row', SectionRow)
  app.component('me-paging', Paging)
  app.component('me-detail', Detail)
}
