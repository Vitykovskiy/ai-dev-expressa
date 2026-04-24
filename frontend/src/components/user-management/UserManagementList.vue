<template>
  <ui-section-list>
    <div
      v-for="(user, index) in users"
      :key="user.userId"
      class="user-row"
      :class="{ 'user-row--divided': index > 0 }"
    >
      <div class="user-row__identity">
        <div class="user-row__avatar">
          {{ getUserInitials(user.displayName) }}
        </div>

        <div class="user-row__copy">
          <div class="user-row__name">{{ user.displayName }}</div>
          <div class="user-row__telegram">{{ user.telegramUsername }}</div>
        </div>
      </div>

      <div class="user-row__meta">
        <span class="user-row__badge" :style="getRoleBadgeStyle(user)">
          {{ getPrimaryRoleLabel(user) }}
        </span>
        <span class="user-row__badge" :style="getStatusBadge(user).style">
          {{ getStatusBadge(user).label }}
        </span>

        <v-menu location="bottom end">
          <template #activator="{ props: menuProps }">
            <ui-icon-button
              title="Действия пользователя"
              :disabled="!canAssignRole(user)"
              v-bind="menuProps"
            >
              <MoreVertical :size="18" />
            </ui-icon-button>
          </template>

          <v-list density="compact" nav>
            <v-list-item
              title="Назначить роль"
              :disabled="!canAssignRole(user)"
              @click="$emit('assign', user.userId)"
            />
          </v-list>
        </v-menu>
      </div>
    </div>
  </ui-section-list>
</template>

<script setup lang="ts">
import { MoreVertical } from "lucide-vue-next";
import UiIconButton from "@/ui/UiIconButton.vue";
import UiSectionList from "@/ui/UiSectionList.vue";
import { canAssignRole } from "@/modules/user-management/access";
import {
  getPrimaryRoleLabel,
  getRoleBadgeStyle,
  getStatusBadge,
  getUserInitials,
} from "@/modules/user-management/presentation";
import type { UserSummary } from "@/modules/user-management/types";

defineProps<{
  users: readonly UserSummary[];
}>();

defineEmits<{
  assign: [userId: string];
}>();
</script>

<style scoped lang="scss">
.user-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
}

.user-row--divided {
  border-top: 1px solid var(--app-color-border);
}

.user-row__identity {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-row__avatar {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: var(--app-color-accent-light);
  color: var(--app-color-accent);
  font-size: 12px;
  line-height: 16px;
  font-weight: 600;
}

.user-row__copy {
  min-width: 0;
}

.user-row__name {
  color: var(--app-color-text-primary);
  font-size: 15px;
  line-height: 20px;
  font-weight: 600;
}

.user-row__telegram {
  overflow: hidden;
  color: var(--app-color-text-muted);
  font-size: 12px;
  line-height: 16px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-row__meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-row__badge {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 3px 10px;
  border-radius: var(--app-radius-pill);
  font-size: 12px;
  line-height: 16px;
}

@media (max-width: 959px) {
  .user-row {
    align-items: flex-start;
  }

  .user-row__meta {
    align-self: center;
    flex-wrap: wrap;
    justify-content: flex-end;
  }
}
</style>
