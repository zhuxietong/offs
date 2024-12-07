import { ref } from 'vue';

export const useNavigation = () => {
  const statusBarHeight = ref(_Window.statusBarHeight);
  const navigationBarHeight = ref(_Window.navigationBarHeight);
  const navigationContentHeight = ref(_Window.navigationContentHeight);

  return {
    navigationBarHeight,
    statusBarHeight,
    navigationContentHeight,
  };
};
