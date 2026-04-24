<template>
  <ui-dialog-shell
    :open="open"
    title="Новый пользователь"
    description="Добавьте нового пользователя в систему"
    @close="$emit('close')"
  >
    <div class="user-role-dialog">
      <ui-form-field
        label="Имя"
        input-id="users-dialog-name"
        :error="errors.name"
      >
        <ui-text-field
          id="users-dialog-name"
          :model-value="name"
          placeholder="Например: Иван Петров"
          :disabled="isBusy"
          autofocus
          @update:model-value="$emit('update:name', String($event ?? ''))"
        />
      </ui-form-field>

      <ui-form-field
        label="Telegram Username"
        input-id="users-dialog-telegram"
        :error="errors.telegramUsername"
      >
        <ui-text-field
          id="users-dialog-telegram"
          :model-value="telegramUsername"
          placeholder="@username"
          :disabled="isBusy"
          @update:model-value="
            $emit('update:telegramUsername', normalizeTelegramUsername($event))
          "
        />
      </ui-form-field>

      <ui-form-field
        label="Роль"
        input-id="users-dialog-role"
        :hint="roleHint"
        :error="errors.role"
      >
        <ui-select
          id="users-dialog-role"
          :model-value="role"
          :items="roleOptions"
          item-title="label"
          item-value="value"
          placeholder="Выберите роль"
          :disabled="isBusy || roleOptions.length === 0"
          @update:model-value="
            $emit(
              'update:role',
              String($event ?? '') as AssignableUserRole | '',
            )
          "
        />
      </ui-form-field>

      <p v-if="formError" class="user-role-dialog__form-error">
        {{ formError }}
      </p>
    </div>

    <template #actions>
      <ui-button
        block
        :loading="isBusy"
        :disabled="submitDisabled"
        @click="$emit('submit')"
      >
        Добавить пользователя
      </ui-button>
      <ui-button
        block
        variant="ghost"
        :disabled="isBusy"
        @click="$emit('close')"
      >
        Отмена
      </ui-button>
    </template>
  </ui-dialog-shell>
</template>

<script setup lang="ts">
import { computed } from "vue";
import UiButton from "@/ui/UiButton.vue";
import UiDialogShell from "@/ui/UiDialogShell.vue";
import UiFormField from "@/ui/UiFormField.vue";
import UiSelect from "@/ui/UiSelect.vue";
import UiTextField from "@/ui/UiTextField.vue";
import {
  getAssignableRoleOptions,
  type AssignableRoleOption,
} from "@/modules/user-management/access";
import type {
  AssignableUserRole,
  UserRoleAssignmentFieldErrors,
  UserSummary,
} from "@/modules/user-management/types";

const props = defineProps<{
  open: boolean;
  isBusy: boolean;
  users: readonly UserSummary[];
  selectedUserId: string;
  name: string;
  telegramUsername: string;
  role: AssignableUserRole | "";
  submitDisabled: boolean;
  errors: UserRoleAssignmentFieldErrors;
  formError: string | null;
}>();

defineEmits<{
  close: [];
  submit: [];
  "update:name": [value: string];
  "update:telegramUsername": [value: string];
  "update:role": [value: AssignableUserRole | ""];
}>();

const selectedUser = computed(
  () =>
    props.users.find((user) => user.userId === props.selectedUserId) ?? null,
);
const roleOptions = computed<readonly AssignableRoleOption[]>(() =>
  getAssignableRoleOptions(selectedUser.value),
);
const roleHint = computed(() =>
  props.role === "administrator"
    ? "Администраторы имеют полный доступ ко всем функциям"
    : undefined,
);

function normalizeTelegramUsername(value: unknown): string {
  const nextValue = String(value ?? "");
  return nextValue && !nextValue.startsWith("@") ? `@${nextValue}` : nextValue;
}
</script>

<style scoped lang="scss">
.user-role-dialog {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.user-role-dialog__form-error {
  margin: 0;
  color: var(--app-color-destructive);
  font-size: 13px;
  line-height: 20px;
}
</style>
