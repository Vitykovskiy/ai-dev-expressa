import { onBeforeUnmount, onMounted, type Ref } from 'vue';

export function useMenuCatalogLeaveProtection(isDirty: Ref<boolean>) {
  function handleBeforeUnload(event: BeforeUnloadEvent) {
    if (!isDirty.value) {
      return;
    }

    event.preventDefault();
    event.returnValue = '';
  }

  onMounted(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
  });

  onBeforeUnmount(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.removeEventListener('beforeunload', handleBeforeUnload);
  });
}
