<template>
  <v-menu
    v-model="isMenuOpen"
    location="bottom end"
    :close-on-content-click="true"
  >
    <template #activator="{ props: activatorProps }">
      <ui-icon-button
        v-bind="activatorProps"
        class="user-actions-menu__trigger"
        title="Действия пользователя"
        :disabled="disabled"
      >
        <MoreVertical :size="20" />
      </ui-icon-button>
    </template>

    <v-list class="user-actions-menu" density="compact" rounded="lg">
      <template v-if="!user.blocked">
        <v-list-item
          class="user-actions-menu__item"
          @click="handleAssignRoleClick"
        >
          <template #prepend>
            <UserCog :size="18" class="user-actions-menu__icon" />
          </template>
          <v-list-item-title>Назначить роль</v-list-item-title>
        </v-list-item>

        <v-list-item v-if="isBarista" class="user-actions-menu__item" disabled>
          <template #prepend>
            <UserMinus :size="18" class="user-actions-menu__icon" />
          </template>
          <v-list-item-title>Снять роль баристы</v-list-item-title>
        </v-list-item>

        <v-divider class="user-actions-menu__divider" />

        <v-list-item class="user-actions-menu__item" disabled>
          <template #prepend>
            <Ban :size="18" class="user-actions-menu__icon--destructive" />
          </template>
          <v-list-item-title>Заблокировать</v-list-item-title>
        </v-list-item>
      </template>

      <v-list-item v-else class="user-actions-menu__item" disabled>
        <template #prepend>
          <Unlock :size="18" class="user-actions-menu__icon--success" />
        </template>
        <v-list-item-title>Разблокировать</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import { Ban, MoreVertical, Unlock, UserCog, UserMinus } from "lucide-vue-next";
import UiIconButton from "@/ui/UiIconButton.vue";
import { getPrimaryOperationalRole } from "@/modules/users/presentation";
import type { UserManagementUser } from "@/modules/users/types";

const props = withDefaults(
  defineProps<{
    user: UserManagementUser;
    disabled?: boolean;
  }>(),
  {
    disabled: false,
  },
);

const emit = defineEmits<{
  "assign-role": [];
}>();

const isMenuOpen = ref(false);
const isBarista = computed(
  () => getPrimaryOperationalRole(props.user.roles) === "barista",
);

async function handleAssignRoleClick(): Promise<void> {
  isMenuOpen.value = false;
  await nextTick();
  emit("assign-role");
}
</script>

<style scoped lang="scss">
.user-actions-menu {
  min-width: 220px;
  padding: 4px;
  border: 1px solid var(--app-color-border);
  box-shadow: var(--app-shadow-modal);
}

.user-actions-menu__trigger {
  color: var(--app-color-text-muted) !important;
}

.user-actions-menu__item {
  min-height: 40px;
  border-radius: 8px !important;
  color: var(--app-color-text-primary);
  font-size: 14px;
}

.user-actions-menu__item :deep(.v-list-item-title) {
  font-size: 14px;
  line-height: 20px;
}

.user-actions-menu__icon {
  color: var(--app-color-text-secondary);
}

.user-actions-menu__icon--destructive {
  color: var(--app-color-destructive);
}

.user-actions-menu__icon--success {
  color: var(--app-color-success);
}

.user-actions-menu__divider {
  margin: 4px 0;
  color: var(--app-color-border);
}
</style>
