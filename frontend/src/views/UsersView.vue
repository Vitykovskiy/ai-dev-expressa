<template>
  <section class="users-view">
    <ui-top-bar title="Пользователи">
      <template #right>
        <ui-icon-button title="Поиск" @click="toggleSearch">
          <Search :size="20" />
        </ui-icon-button>
      </template>
    </ui-top-bar>

    <div class="users-view__header">
      <div>
        <h1 class="users-view__title">Пользователи</h1>
        <p v-if="totalUsers > 0" class="users-view__subtitle">
          {{ totalUsers }}
          {{ totalUsers === 1 ? "пользователь" : "пользователей" }}
        </p>
      </div>

      <ui-icon-button title="Поиск" @click="toggleSearch">
        <Search :size="20" />
      </ui-icon-button>
    </div>

    <div class="users-view__actions">
      <ui-button
        class="users-view__add-button"
        :disabled="isLoading || users.length === 0"
        @click="openAssignmentDialog()"
      >
        <Plus :size="18" />
        <span>Добавить пользователя</span>
      </ui-button>
    </div>

    <div v-if="searchOpen" class="users-view__search">
      <ui-text-field
        v-model="searchDraft"
        placeholder="Поиск по имени или Telegram"
        autofocus
      />
    </div>

    <div class="users-view__filters">
      <UserManagementFilterTabs
        :active-filter="activeFilter"
        :disabled="isLoading"
        @select="selectFilter"
      />
    </div>

    <div class="users-view__body">
      <v-sheet
        v-if="isLoading && !hasSnapshot"
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
        v-else-if="isLoadError && !hasSnapshot"
        class="users-view__status-card"
        title="Не удалось загрузить пользователей"
      >
        <p class="users-view__status-copy">{{ loadErrorMessage }}</p>
        <ui-button @click="reloadUsers">Повторить</ui-button>
      </ui-section-card>

      <ui-empty-state
        v-else-if="users.length === 0"
        :icon="Users"
        title="Пользователей нет"
        subtitle="Они появятся после активации бота"
      />

      <UserManagementList
        v-else
        :users="users"
        @assign="openAssignmentDialog"
      />
    </div>

    <user-role-assignment-dialog
      :open="dialogOpen"
      :is-busy="isAssigning"
      :users="users"
      :selected-user-id="selectedUserId"
      :name="assignmentName"
      :telegram-username="assignmentTelegramUsername"
      :role="selectedRole"
      :submit-disabled="isDialogSubmitDisabled"
      :errors="dialogErrors"
      :form-error="dialogFormError"
      @close="closeAssignmentDialog"
      @submit="submitAssignment"
      @update:name="assignmentName = $event"
      @update:telegram-username="assignmentTelegramUsername = $event"
      @update:role="selectedRole = $event"
    />

    <v-snackbar
      v-model="successToastOpen"
      location="top"
      color="success"
      :timeout="3000"
    >
      {{ userRoleAssignmentSuccessMessage }}
    </v-snackbar>
  </section>
</template>

<script setup lang="ts">
import { Search, Plus, Users } from "lucide-vue-next";
import { computed, onMounted, ref, watch } from "vue";
import UserManagementFilterTabs from "@/components/user-management/UserManagementFilterTabs.vue";
import UserManagementList from "@/components/user-management/UserManagementList.vue";
import UserRoleAssignmentDialog from "@/components/user-management/UserRoleAssignmentDialog.vue";
import UiButton from "@/ui/UiButton.vue";
import UiEmptyState from "@/ui/UiEmptyState.vue";
import UiIconButton from "@/ui/UiIconButton.vue";
import UiSectionCard from "@/ui/UiSectionCard.vue";
import UiTextField from "@/ui/UiTextField.vue";
import UiTopBar from "@/ui/UiTopBar.vue";
import { getFirstAssignableRole } from "@/modules/user-management/access";
import {
  mapUserManagementLoadError,
  mapUserRoleAssignmentError,
  mergeRoleAssignmentErrors,
  userRoleAssignmentSuccessMessage,
} from "@/modules/user-management/presentation";
import { useUserManagementStore } from "@/modules/user-management/store";
import type {
  AssignableUserRole,
  UserManagementErrorCode,
  UserSummary,
} from "@/modules/user-management/types";
import { validateRoleAssignmentDraft } from "@/modules/user-management/validation";

const store = useUserManagementStore();
const searchDraft = ref(store.state.search);
const searchOpen = ref(false);
const dialogOpen = ref(false);
const selectedUserId = ref("");
const assignmentName = ref("");
const assignmentTelegramUsername = ref("");
const selectedRole = ref<AssignableUserRole | "">("");
const submittedAssignErrorCode = ref<UserManagementErrorCode | null>(null);
const successToastOpen = ref(false);

let searchTimer: ReturnType<typeof setTimeout> | null = null;

const users = computed(() => store.state.snapshot?.items ?? []);
const totalUsers = computed(() => store.state.snapshot?.total ?? 0);
const activeFilter = computed(() => store.state.filter);
const selectedUser = computed<UserSummary | null>(
  () =>
    users.value.find((user) => user.userId === selectedUserId.value) ?? null,
);
const validation = computed(() =>
  validateRoleAssignmentDraft(
    {
      userId: selectedUser.value?.userId ?? "",
      name: assignmentName.value,
      telegramUsername: assignmentTelegramUsername.value,
      role: selectedRole.value,
    },
    selectedUser.value?.availableRoleAssignments ?? [],
  ),
);
const assignErrorFeedback = computed(() =>
  mapUserRoleAssignmentError(submittedAssignErrorCode.value),
);
const dialogErrors = computed(() =>
  mergeRoleAssignmentErrors(
    validation.value.errors,
    assignErrorFeedback.value.fieldErrors,
  ),
);
const dialogFormError = computed(() => assignErrorFeedback.value.formError);
const isLoading = computed(() => store.state.loadStatus === "loading");
const isLoadError = computed(() => store.state.loadStatus === "error");
const hasSnapshot = computed(() => store.state.snapshot !== null);
const isAssigning = computed(() => store.state.assignStatus === "saving");
const isDialogSubmitDisabled = computed(
  () => !validation.value.valid || isAssigning.value,
);
const loadErrorMessage = computed(() =>
  mapUserManagementLoadError(store.state.loadErrorCode),
);

onMounted(() => {
  void reloadUsers();
});

watch(
  users,
  (nextUsers) => {
    if (!dialogOpen.value) {
      return;
    }

    if (nextUsers.length === 0) {
      selectedUserId.value = "";
      selectedRole.value = "";
      return;
    }

    const preservedUser =
      nextUsers.find((user) => user.userId === selectedUserId.value) ??
      nextUsers[0] ??
      null;
    selectedUserId.value = preservedUser?.userId ?? "";
    syncAssignmentFieldsFromSelectedUser();
    ensureSelectedRole();
  },
  { immediate: true },
);

watch(
  () => store.state.assignStatus,
  (status) => {
    if (status === "success") {
      successToastOpen.value = true;
      submittedAssignErrorCode.value = null;
      closeAssignmentDialog();
      store.resetAssignState();
    }
  },
);

watch(searchDraft, (value) => {
  if (searchTimer) {
    clearTimeout(searchTimer);
  }

  searchTimer = setTimeout(() => {
    store.setSearch(value);
    void reloadUsers();
  }, 250);
});

watch(selectedUser, () => {
  syncAssignmentFieldsFromSelectedUser();
  ensureSelectedRole();
});

function toggleSearch(): void {
  searchOpen.value = !searchOpen.value;
  if (!searchOpen.value && searchDraft.value) {
    searchDraft.value = "";
  }
}

function selectFilter(value: typeof activeFilter.value): void {
  store.setFilter(value);
  void reloadUsers();
}

function openAssignmentDialog(userId?: string): void {
  dialogOpen.value = true;
  selectedUserId.value = userId ?? users.value[0]?.userId ?? "";
  syncAssignmentFieldsFromSelectedUser();
  selectedRole.value = "";
  submittedAssignErrorCode.value = null;
  ensureSelectedRole();
}

function closeAssignmentDialog(): void {
  dialogOpen.value = false;
  selectedUserId.value = "";
  assignmentName.value = "";
  assignmentTelegramUsername.value = "";
  selectedRole.value = "";
  submittedAssignErrorCode.value = null;
}

async function reloadUsers(): Promise<void> {
  try {
    await store.loadUsers();
  } catch {
    // The view renders the corresponding route-level error state.
  }
}

async function submitAssignment(): Promise<void> {
  if (!validation.value.valid || !validation.value.payload) {
    return;
  }

  submittedAssignErrorCode.value = null;

  try {
    await store.assignRole(validation.value.payload.userId, {
      role: validation.value.payload.role,
    });
  } catch {
    submittedAssignErrorCode.value = store.state.assignErrorCode;
  }
}

function ensureSelectedRole(): void {
  const nextDefaultRole = getFirstAssignableRole(selectedUser.value);
  if (
    !selectedRole.value ||
    !selectedUser.value?.availableRoleAssignments.includes(selectedRole.value)
  ) {
    selectedRole.value = nextDefaultRole;
  }
}

function syncAssignmentFieldsFromSelectedUser(): void {
  assignmentName.value = selectedUser.value?.displayName ?? "";
  assignmentTelegramUsername.value = selectedUser.value?.telegramUsername ?? "";
  submittedAssignErrorCode.value = null;
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
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 24px 24px 0;
  }
}

.users-view__title {
  margin: 0;
  color: var(--app-color-text-primary);
  font-size: 32px;
  line-height: 40px;
  font-weight: 700;
}

.users-view__subtitle {
  margin: 4px 0 0;
  color: var(--app-color-text-secondary);
  font-size: 13px;
  line-height: 20px;
}

.users-view__actions {
  padding: 16px 16px 12px;
}

@media (min-width: 960px) {
  .users-view__actions {
    padding: 16px 24px 12px;
  }
}

.users-view__add-button {
  width: 100%;
}

.users-view__add-button :deep(.v-btn__content) {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

@media (min-width: 960px) {
  .users-view__add-button {
    width: auto;
  }
}

.users-view__search {
  padding: 0 16px 12px;
}

@media (min-width: 960px) {
  .users-view__search {
    max-width: 720px;
    padding: 0 24px 16px;
  }
}

.users-view__filters {
  padding-bottom: 12px;
}

@media (min-width: 960px) {
  .users-view__filters {
    padding: 0 24px 16px;
  }
}

.users-view__body {
  flex: 1;
  padding: 4px 16px 80px;
}

@media (min-width: 960px) {
  .users-view__body {
    max-width: 720px;
    padding: 0 24px 24px;
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
  gap: 16px;
}

.users-view__status-copy {
  margin: 0 0 16px;
  color: var(--app-color-text-secondary);
  font-size: 14px;
  line-height: 22px;
}
</style>
