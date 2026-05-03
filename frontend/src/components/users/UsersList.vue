<template>
  <ui-data-table
    class="users-list"
    :headers="userHeaders"
    :items="userRows"
    item-value="userId"
    hide-default-header
  >
    <template #item="{ item }">
      <tr class="users-list__row">
        <td class="users-list__identity-cell">
          <div class="users-list__identity">
            <div class="users-list__avatar" aria-hidden="true">
              {{ getUserInitials(item.user) }}
            </div>
            <div class="users-list__copy">
              <div class="users-list__name">
                {{ getUserDisplayLabel(item.user) }}
              </div>
              <div
                v-if="getUserTelegramLabel(item.user)"
                class="users-list__telegram"
              >
                {{ getUserTelegramLabel(item.user) }}
              </div>
            </div>
          </div>
        </td>

        <td class="users-list__badge-cell">
          <span
            class="users-list__badge"
            :class="resolveUserRoleBadge(item.user.roles).className"
          >
            {{ resolveUserRoleBadge(item.user.roles).label }}
          </span>
        </td>

        <td class="users-list__status-cell">
          <span
            class="users-list__badge users-list__status"
            :class="resolveUserStatusBadge(item.user.blocked).className"
          >
            {{ resolveUserStatusBadge(item.user.blocked).label }}
          </span>
        </td>

        <td class="users-list__actions-cell">
          <UserActionsMenu
            :user="item.user"
            :disabled="assigningUserId === item.user.userId"
            @assign-role="$emit('assign-role', item.user)"
          />
        </td>
      </tr>
    </template>
  </ui-data-table>
</template>

<script setup lang="ts">
import { computed } from "vue";
import UserActionsMenu from "@/components/users/UserActionsMenu.vue";
import UiDataTable, {
  type UiDataTableHeader,
  type UiDataTableRecord,
} from "@/ui/UiDataTable.vue";
import {
  getUserDisplayLabel,
  getUserInitials,
  getUserTelegramLabel,
  resolveUserRoleBadge,
  resolveUserStatusBadge,
} from "@/modules/users/presentation";
import type { UserManagementUser } from "@/modules/users/types";

const props = withDefaults(
  defineProps<{
    users: readonly UserManagementUser[];
    assigningUserId?: string | null;
  }>(),
  {
    assigningUserId: null,
  },
);

defineEmits<{
  "assign-role": [user: UserManagementUser];
}>();

interface UserTableRow extends UiDataTableRecord {
  userId: string;
  user: UserManagementUser;
}

const userHeaders: UiDataTableHeader<UiDataTableRecord>[] = [
  { key: "identity", title: "Пользователь", sortable: false },
  { key: "role", title: "Роль", sortable: false },
  { key: "status", title: "Статус", sortable: false },
  { key: "actions", title: "Действия", align: "end", sortable: false },
];

const userRows = computed<UserTableRow[]>(() =>
  props.users.map((user) => ({
    userId: user.userId,
    user,
  })),
);
</script>

<style scoped lang="scss">
.users-list {
  overflow: hidden;
}

.users-list__row {
  height: 68px;
}

.users-list__row td {
  padding: 14px 0;
  vertical-align: middle;
}

.users-list__identity-cell {
  width: 100%;
  padding-left: var(--app-spacing-md) !important;
}

.users-list__badge-cell,
.users-list__status-cell,
.users-list__actions-cell {
  width: 1%;
  white-space: nowrap;
}

.users-list__actions-cell {
  padding-right: 8px !important;
  text-align: right;
}

.users-list__identity {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.users-list__avatar {
  flex: 0 0 36px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--app-color-accent-light);
  color: var(--app-color-accent);
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
}

.users-list__copy {
  min-width: 0;
}

.users-list__name {
  overflow: hidden;
  color: var(--app-color-text-primary);
  font-size: 15px;
  line-height: 20px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.users-list__telegram {
  overflow: hidden;
  margin-top: 2px;
  color: var(--app-color-text-muted);
  font-size: 12px;
  line-height: 16px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.users-list__badge {
  display: inline-flex;
  align-items: center;
  min-height: 22px;
  padding: 3px 8px;
  border-radius: var(--app-radius-pill);
  font-size: 12px;
  line-height: 16px;
  white-space: nowrap;
}

.users-role-badge--administrator {
  background: var(--app-color-accent-light);
  color: var(--app-color-accent);
}

.users-role-badge--barista,
.users-status-badge--active {
  background: var(--app-color-success-light);
  color: var(--app-color-success);
}

.users-role-badge--customer {
  background: var(--app-color-neutral-light);
  color: var(--app-color-neutral);
}

.users-status-badge--blocked {
  background: var(--app-color-destructive-light);
  color: var(--app-color-destructive);
}

@media (max-width: 599px) {
  .users-list__row {
    height: auto;
    min-height: 68px;
  }

  .users-list__row td {
    padding-top: 14px;
    padding-bottom: 14px;
  }

  .users-list__identity-cell {
    max-width: 1px;
  }

  .users-list__status-cell {
    display: none;
  }

  .users-list__actions-cell {
    padding-right: 4px !important;
  }
}
</style>
