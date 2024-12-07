<template>
  <a-menu
    ref="menuRef"
    class="co-side-menu"
    :style="{ height: `${height}px` }"
    :selected-keys="selectedKeys"
    :auto-open-selected="true"
    @menu-item-click="handleMenuItemClick"
  >
    <template :key="i" v-for="(menu, i) in tree">
      <a-menu-item :key="menu.key" v-if="!menu.children">
        <template #icon v-if="menu.icon">
          <component :is="renderIcon(menu.icon)" />
        </template>
        {{ menu.title }}
      </a-menu-item>
      <a-sub-menu v-else :key="menu.key + ''" :title="menu.title">
        <template #icon v-if="menu.icon">
          <component :is="renderIcon(menu.icon)" />
        </template>
        <template v-for="(sub, j) in menu.children" :key="i + '-' + j">
          <template v-if="!sub.children">
            <a-menu-item :key="sub.key">
              <template #icon v-if="sub.icon">
                <component :is="renderIcon(sub.icon)" />
              </template>
              {{ sub.title }}
            </a-menu-item>
          </template>
          <a-sub-menu v-else :key="sub.key" :title="sub.title">
            <template #icon v-if="sub.icon">
              <component :is="renderIcon(sub.icon)" />
            </template>
            <template v-for="(child, o) in sub.children" :key="i + '-' + j + '-' + o">
              <template>
                <a-menu-item :key="child.key">
                  <template #icon v-if="child.icon">
                    <component :is="renderIcon(child.icon)" :key="o" />
                  </template>
                  {{ child.title }}
                </a-menu-item>
              </template>
            </template>
          </a-sub-menu>
        </template>
      </a-sub-menu>
    </template>
  </a-menu>
</template>

<script lang="tsx" setup>
import type { MenuInstance } from '@arco-design/web-vue'
import { ref, VNode, watch, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBreadcrumbs } from '../hook/useBreadcrumbs'

const route = useRoute()

const props = withDefaults(
  defineProps<{
    height: number;
    tree: MenuTree[];
  }>(),
  {
    height: 1000
  }
)

function findTitlesByKey(menus: MenuTree[], targetKey: string): string[] {
  const titles: string[] = []

  function findPath(items: MenuTree[], key: string, currentPath: string[]): boolean {
    for (const item of items) {
      // 创建当前路径的副本，并添加当前项的 title
      const path = [...currentPath, item.title]

      // 如果找到目标 key
      if (item.key === key) {
        titles.push(...path)
        return true
      }

      // 如果有子菜单，递归搜索
      if (item.children) {
        if (findPath(item.children, key, path)) {
          return true
        }
      }
    }

    return false
  }

  findPath(menus, targetKey, [])
  return titles
}

const breadcrumbs = useBreadcrumbs()

// 选中的菜单项
const selectedKeys = ref<string[]>([route.path])

// onMounted(()=>{
//   breadcrumbs.value = findTitlesByKey(props.tree,route.path)
// })


function renderIcon(icon: any | (() => VNode) | undefined): VNode | null {
  if (!icon) return null
  return typeof icon === 'function' ? (icon as Function)() : h(icon)
}

const menuRef = ref<MenuInstance | null>(null)
const router = useRouter()



// 监听路由变化，更新选中的菜单项
watch(
  () => route.path,
  (newPath) => {
    try {
      breadcrumbs.value = findTitlesByKey(props.tree, route.path)
      selectedKeys.value = [newPath]
    } catch (e) {

    }
  },
  { immediate: true }
)

// 菜单项点击事件，进行路由跳转
function handleMenuItemClick(key: string) {
  if (key !== route.path) {
    router.push(key)
  }
}

</script>

<style lang="scss" scoped>
.co-side-menu {
  :deep(.arco-icon) {
    font-size: 16px;
  }

  :deep(.arco-menu-item) {
    background-color: transparent;
  }

  :deep(.arco-menu-item.arco-menu-selected) {
    border-radius: 10px;
    background: rgba(27, 89, 248, 0.1);
    color: rgb(var(--arcoblue-6));

    .arco-icon {
      color: rgb(var(--arcoblue-6));
    }
  }

  :deep(.arco-menu-inline-header) {
    background-color: transparent;
  }
}
</style>
