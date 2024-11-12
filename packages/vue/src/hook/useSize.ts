import { ref, onMounted, onBeforeUnmount, Ref, unref } from 'vue';
import type { ComponentPublicInstance } from 'vue';

type MaybeElement = HTMLElement | null;
type MaybeComponentInstance = ComponentPublicInstance | null;
type TargetRef = Ref<MaybeElement | MaybeComponentInstance>;

export function useSize(targetRef: TargetRef) {
  const size = ref<{ height: number; width: number }>({
    height: 0,
    width: 0,
  });

  let resizeObserver: ResizeObserver | null = null;

  const getElement = (): MaybeElement => {
    const element = unref(targetRef);
    if (element) {
      if (element instanceof HTMLElement) {
        return element;
      } else if ('$el' in element && element.$el instanceof HTMLElement) {
        // 如果是组件实例，获取其 $el 属性
        return element.$el;
      }
    }
    return null;
  };

  const updateSize = () => {
    const element = getElement();
    if (element) {
      size.value.width = element.offsetWidth;
      size.value.height = element.offsetHeight;
    }
  };

  onMounted(() => {
    updateSize();
    const element = getElement();
    if (element) {
      resizeObserver = new ResizeObserver(() => {
        updateSize();
      });
      resizeObserver.observe(element);
    }
  });

  onBeforeUnmount(() => {
    const element = getElement();
    if (resizeObserver && element) {
      resizeObserver.unobserve(element);
    }
    resizeObserver = null;
  });

  return size;
}
