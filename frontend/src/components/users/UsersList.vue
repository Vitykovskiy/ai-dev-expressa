<template>
  <ui-section-card class="users-list" flush>
    <div
      v-for="(user, index) in users"
      :key="user.userId"
      class="users-list__row"
      :class="{ 'users-list__row--bordered': index !== users.length - 1 }"
    >
      <div class="users-list__identity">
        <div class="users-list__avatar" aria-hidden="true">
          {{ getUserInitials(user) }}
        </div>
        <div class="users-list__copy">
          <div class="users-list__name">{{ getUserDisplayLabel(user) }}</div>
          <div v-if="getUserTelegramLabel(user)" class="users-list__telegram">
            {{ getUserTelegramLabel(user) }}
          </div>
        </div>
      </div>

      <div class="users-list__meta">
        <span
          class="users-list__badge"
          :class="resolveUserRoleBadge(user.roles).className"
        >
          {{ resolveUserRoleBadge(user.roles).label }}
        </span>
        <span
          class="users-list__badge users-list__status"
          :class="resolveUserStatusBadge(user.blocked).className"
        >
          {{ resolveUserStatusBadge(user.blocked).label }}
        </span>
        <UserActionsMenu
          :user="user"
          :disabled="assigningUserId === user.userId"
          @assign-role="$emit('assign-role', user)"
        />
      </div>
    </div>
  </ui-section-card>
</template>

<script setup lang="ts">
import UserActionsMenu from "@/components/users/UserActionsMenu.vue";
import UiSectionCard from "@/ui/UiSectionCard.vue";
import {
  getUserDisplayLabel,
  getUserInitials,
  getUserTelegramLabel,
  resolveUserRoleBadge,
  resolveUserStatusBadge,
} from "@/modules/users/presentation";
import type { UserManagementUser } from "@/modules/users/types";

withDefaults(
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
</script>

<style scoped lang="scss">
.users-list {
  overflow: hidden;
}

.users-list__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--app-spacing-md);
  min-height: 68px;
  padding: 14px var(--app-spacing-md);
}

.users-list__row--bordered {
  border-bottom: 1px solid var(--app-color-border);
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

.users-list__meta {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
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
    align-items: flex-start;
  }

  .users-list__meta {
    flex-wrap: wrap;
    max-width: 148px;
  }

  .users-list__status {
    display: none;
  }
}
</style>
