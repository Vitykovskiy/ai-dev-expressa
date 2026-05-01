<template>
  <ui-dialog-shell
    :open="open"
    title="Назначить роль"
    description="Измените роль для выбранного пользователя"
    @close="handleClose"
  >
    <div v-if="user" class="assign-role-dialog">
      <div class="assign-role-dialog__user">
        <div class="assign-role-dialog__avatar" aria-hidden="true">
          {{ getUserInitials(user) }}
        </div>
        <div class="assign-role-dialog__user-copy">
          <div class="assign-role-dialog__name">
            {{ getUserDisplayLabel(user) }}
          </div>
          <div
            v-if="getUserTelegramLabel(user)"
            class="assign-role-dialog__telegram"
          >
            {{ getUserTelegramLabel(user) }}
          </div>
        </div>
      </div>

      <fieldset class="assign-role-dialog__fieldset" :disabled="isSaving">
        <legend class="assign-role-dialog__legend">Роль</legend>

        <label
          v-for="option in roleOptions"
          :key="option.value"
          class="assign-role-dialog__option"
          :class="{
            'assign-role-dialog__option--active': selectedRole === option.value,
          }"
        >
          <input
            v-model="selectedRole"
            class="assign-role-dialog__radio"
            type="radio"
            name="assignedRole"
            :value="option.value"
          />
          <span class="assign-role-dialog__radio-mark" aria-hidden="true" />
          <span class="assign-role-dialog__option-copy">
            <span class="assign-role-dialog__option-title">
              {{ option.label }}
            </span>
            <span class="assign-role-dialog__option-description">
              {{ option.description }}
            </span>
          </span>
        </label>
      </fieldset>

      <p v-if="inlineError" class="assign-role-dialog__error">
        {{ inlineError }}
      </p>
    </div>

    <template #actions>
      <ui-button
        block
        :loading="isSaving"
        :disabled="isSubmitDisabled"
        @click="submitRole"
      >
        Назначить роль
      </ui-button>
      <ui-button
        block
        variant="ghost"
        :disabled="isSaving"
        @click="handleClose"
      >
        Отмена
      </ui-button>
    </template>
  </ui-dialog-shell>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import UiButton from "@/ui/UiButton.vue";
import UiDialogShell from "@/ui/UiDialogShell.vue";
import {
  getAssignableRoleInitialValue,
  getUserDisplayLabel,
  getUserInitials,
  getUserTelegramLabel,
} from "@/modules/users/presentation";
import type {
  AssignableUserRole,
  UserManagementUser,
} from "@/modules/users/types";
import { validateAssignRole } from "@/modules/users/validation";

const props = withDefaults(
  defineProps<{
    open: boolean;
    user: UserManagementUser | null;
    isSaving?: boolean;
    errorMessage?: string | null;
  }>(),
  {
    isSaving: false,
    errorMessage: null,
  },
);

const emit = defineEmits<{
  close: [];
  submit: [role: AssignableUserRole];
}>();

const roleOptions: readonly {
  readonly value: AssignableUserRole;
  readonly label: string;
  readonly description: string;
}[] = [
  {
    value: "barista",
    label: "Бариста",
    description: "Доступ к заказам и доступности",
  },
  {
    value: "administrator",
    label: "Администратор",
    description: "Полный доступ ко всем функциям",
  },
];

const selectedRole = ref<AssignableUserRole>("barista");
const validation = computed(() => validateAssignRole(selectedRole.value));
const inlineError = computed(
  () => validation.value.message ?? props.errorMessage,
);
const isSubmitDisabled = computed(
  () => props.isSaving || !validation.value.valid,
);

watch(
  () => [props.open, props.user?.userId, props.user?.roles.join(",")] as const,
  () => {
    if (props.open && props.user) {
      selectedRole.value = getAssignableRoleInitialValue(props.user.roles);
    }
  },
  { immediate: true },
);

function submitRole(): void {
  if (!validation.value.valid || !validation.value.payload) {
    return;
  }

  emit("submit", validation.value.payload.assignedRole);
}

function handleClose(): void {
  emit("close");
}
</script>

<style scoped lang="scss">
.assign-role-dialog {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.assign-role-dialog__user {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: var(--app-radius-md);
  background: var(--app-color-background-secondary);
}

.assign-role-dialog__avatar {
  flex: 0 0 40px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--app-color-accent-light);
  color: var(--app-color-accent);
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
}

.assign-role-dialog__user-copy {
  min-width: 0;
}

.assign-role-dialog__name {
  overflow: hidden;
  color: var(--app-color-text-primary);
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.assign-role-dialog__telegram {
  overflow: hidden;
  margin-top: 2px;
  color: var(--app-color-text-muted);
  font-size: 12px;
  line-height: 16px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.assign-role-dialog__fieldset {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  padding: 0;
  margin: 0;
  border: 0;
}

.assign-role-dialog__legend {
  padding: 0 0 4px;
  color: var(--app-color-text-secondary);
  font-size: 13px;
  line-height: 18px;
  font-weight: 500;
}

.assign-role-dialog__option {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 70px;
  padding: 12px;
  border: 1px solid var(--app-color-border);
  border-radius: var(--app-radius-md);
  cursor: pointer;
  transition:
    background-color var(--app-motion-fast) var(--app-motion-easing),
    border-color var(--app-motion-fast) var(--app-motion-easing);
}

.assign-role-dialog__option:hover,
.assign-role-dialog__option--active {
  background: var(--app-color-background-secondary);
}

.assign-role-dialog__option--active {
  border-color: var(--app-color-accent);
}

.assign-role-dialog__radio {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.assign-role-dialog__radio-mark {
  flex: 0 0 20px;
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--app-color-border-strong);
  border-radius: 50%;
}

.assign-role-dialog__radio:checked + .assign-role-dialog__radio-mark {
  border-color: var(--app-color-accent);
  background:
    radial-gradient(circle at center, #ffffff 0 35%, transparent 38%),
    var(--app-color-accent);
}

.assign-role-dialog__option-copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.assign-role-dialog__option-title {
  color: var(--app-color-text-primary);
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
}

.assign-role-dialog__option-description {
  color: var(--app-color-text-muted);
  font-size: 12px;
  line-height: 16px;
}

.assign-role-dialog__error {
  margin: 0;
  color: var(--app-color-destructive);
  font-size: 13px;
  line-height: 20px;
}
</style>
