<template>
  <section class="users-view">
    <ui-top-bar title="Пользователи" />

    <div class="users-view__header">
      <h1 class="users-view__title">Пользователи</h1>
    </div>

    <div class="users-view__controls">
      <div class="users-view__search">
        <Search :size="18" class="users-view__search-icon" />
        <ui-text-field
          v-model="searchQuery"
          class="users-view__search-input"
          placeholder="Фильтр по имени или Telegram"
          :disabled="isLoading"
        />
      </div>

      <UsersFilterTabs
        :tabs="filterTabs"
        :active-filter="activeFilter"
        @change="activeFilter = $event"
      />
    </div>

    <div class="users-view__body">
      <v-sheet
        v-if="isInitialLoading"
        class="users-view__loading-panel"
        rounded="lg"
        color="surface"
      >
        <v-progress-circular
          indeterminate
          color="primary"
          :size="36"
          :width="4"
        />
        <span>Загружаем пользователей</span>
      </v-sheet>

      <ui-section-card
        v-else-if="isLoadError"
        class="users-view__status-card"
        title="Не удалось загрузить пользователей"
      >
        <p class="users-view__status-copy">{{ loadErrorMessage }}</p>
        <ui-button :loading="isLoading" @click="reloadUsers">
          Повторить
        </ui-button>
      </ui-section-card>

      <ui-empty-state
        v-else-if="filteredUsers.length === 0"
        :icon="UsersIcon"
        title="Пользователей нет"
        subtitle="Они появятся после активации бота"
      />

      <UsersList
        v-else
        :users="filteredUsers"
        :assigning-user-id="store.state.assigningUserId"
        @assign-role="openAssignRoleDialog"
      />
    </div>

    <AssignRoleDialog
      :open="assignRoleDialogOpen"
      :user="selectedUser"
      :is-saving="isAssigningRole"
      :error-message="assignErrorMessage"
      @close="closeAssignRoleDialog"
      @submit="submitAssignedRole"
    />

    <v-snackbar
      v-model="successToastOpen"
      location="top"
      color="success"
      :timeout="3000"
    >
      {{ usersRoleAssignmentSuccessMessage }}
    </v-snackbar>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { Search, Users as UsersIcon } from "lucide-vue-next";
import AssignRoleDialog from "@/components/users/AssignRoleDialog.vue";
import UsersFilterTabs from "@/components/users/UsersFilterTabs.vue";
import UsersList from "@/components/users/UsersList.vue";
import UiButton from "@/ui/UiButton.vue";
import UiEmptyState from "@/ui/UiEmptyState.vue";
import UiSectionCard from "@/ui/UiSectionCard.vue";
import UiTextField from "@/ui/UiTextField.vue";
import UiTopBar from "@/ui/UiTopBar.vue";
import {
  filterUserManagementUsers,
  mapUserManagementAssignError,
  mapUserManagementLoadError,
  usersRoleAssignmentSuccessMessage,
} from "@/modules/users/presentation";
import { useUserManagementStore } from "@/modules/users/store";
import type {
  AssignableUserRole,
  UserManagementUser,
  UsersFilter,
} from "@/modules/users/types";
import { validateAssignRole } from "@/modules/users/validation";

const filterTabs: readonly {
  readonly id: UsersFilter;
  readonly label: string;
}[] = [
  { id: "all", label: "Все" },
  { id: "barista", label: "Баристы" },
  { id: "blocked", label: "Заблокированные" },
];

const store = useUserManagementStore();
const activeFilter = ref<UsersFilter>("all");
const searchQuery = ref("");
const assignRoleDialogOpen = ref(false);
const selectedUser = ref<UserManagementUser | null>(null);
const successToastOpen = ref(false);

const filteredUsers = computed(() =>
  filterUserManagementUsers(
    store.state.users,
    activeFilter.value,
    searchQuery.value,
  ),
);
const isLoading = computed(() => store.state.loadStatus === "loading");
const isInitialLoading = computed(
  () => isLoading.value && store.state.users.length === 0,
);
const isLoadError = computed(
  () => store.state.loadStatus === "error" && store.state.users.length === 0,
);
const isAssigningRole = computed(() => store.state.assignStatus === "saving");
const loadErrorMessage = computed(() =>
  mapUserManagementLoadError(store.state.loadErrorCode),
);
const assignErrorMessage = computed(() =>
  mapUserManagementAssignError(store.state.assignErrorCode),
);

onMounted(() => {
  void loadUsers();
});

async function loadUsers(force = false): Promise<void> {
  try {
    await store.loadUsers({ force });
  } catch {
    // The view renders retry/error state from store state.
  }
}

async function reloadUsers(): Promise<void> {
  await loadUsers(true);
}

function openAssignRoleDialog(user: UserManagementUser): void {
  store.resetAssignState();
  selectedUser.value = user;
  assignRoleDialogOpen.value = true;
}

function closeAssignRoleDialog(): void {
  if (isAssigningRole.value) {
    return;
  }

  assignRoleDialogOpen.value = false;
  selectedUser.value = null;
  store.resetAssignState();
}

async function submitAssignedRole(role: AssignableUserRole): Promise<void> {
  if (!selectedUser.value) {
    return;
  }

  const validation = validateAssignRole(role);
  if (!validation.valid || !validation.payload) {
    return;
  }

  try {
    await store.assignRole(selectedUser.value.userId, validation.payload);
    successToastOpen.value = true;
    assignRoleDialogOpen.value = false;
    selectedUser.value = null;
  } catch {
    // Inline dialog error is driven by store.assignErrorCode.
  }
}
</script>

<style scoped lang="scss">
.users-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--app-color-background-secondary);
}

@media (min-width: 960px) {
  .users-view {
    background: var(--app-color-background-primary);
  }
}

.users-view__header {
  display: none;
}

@media (min-width: 960px) {
  .users-view__header {
    display: block;
    width: 100%;
    max-width: 720px;
    margin: 0 auto;
    padding: var(--app-spacing-lg) var(--app-spacing-lg) 0;
  }
}

.users-view__title {
  margin: 0;
  color: var(--app-color-text-primary);
  font-size: 32px;
  line-height: 40px;
  font-weight: 700;
}

.users-view__controls {
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
}

@media (min-width: 960px) {
  .users-view__controls {
    padding: var(--app-spacing-md) var(--app-spacing-lg) 0;
  }
}

.users-view__search {
  position: relative;
  padding: var(--app-spacing-md) var(--app-spacing-md) 12px;
}

@media (min-width: 960px) {
  .users-view__search {
    padding: 0 0 var(--app-spacing-md);
  }
}

.users-view__search-icon {
  position: absolute;
  top: calc(50% + 2px);
  left: calc(var(--app-spacing-md) + 12px);
  z-index: 1;
  transform: translateY(-50%);
  color: var(--app-color-text-muted);
  pointer-events: none;
}

@media (min-width: 960px) {
  .users-view__search-icon {
    top: calc(50% - 8px);
    left: 12px;
  }
}

.users-view__search-input {
  width: 100%;
}

.users-view__search-input :deep(input) {
  padding-left: 34px;
}

.users-view__body {
  flex: 1;
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  padding: var(--app-spacing-md) var(--app-spacing-md) 84px;
}

@media (min-width: 960px) {
  .users-view__body {
    padding: var(--app-spacing-md) var(--app-spacing-lg) var(--app-spacing-lg);
  }
}

.users-view__loading-panel {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px;
  color: var(--app-color-text-secondary);
  font-size: 14px;
  border: 1px solid var(--app-color-border);
  box-shadow: none;
}

.users-view__status-card {
  display: flex;
  flex-direction: column;
  gap: var(--app-spacing-md);
}

.users-view__status-copy {
  margin: 0 0 var(--app-spacing-md);
  color: var(--app-color-text-secondary);
  font-size: 14px;
  line-height: 22px;
}
</style>
