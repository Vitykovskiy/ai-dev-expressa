<template>
  <v-data-table
    class="app-data-table"
    :headers="headers"
    :items="items"
    :item-value="itemValue"
    :group-by="groupBy"
    :items-per-page="itemsPerPage"
    :hide-default-footer="hideDefaultFooter"
    :hide-default-header="hideDefaultHeader"
    :no-data-text="noDataText"
  >
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps ?? {}" />
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import type { DataTableHeader, DataTableSortItem } from "vuetify/lib/types.js";

export type UiDataTableRecord = Record<string, unknown>;
export type UiDataTableHeader<T extends UiDataTableRecord> = DataTableHeader<T>;
export type UiDataTableGroupBy = DataTableSortItem;

withDefaults(
  defineProps<{
    headers: readonly UiDataTableHeader<UiDataTableRecord>[];
    items: readonly UiDataTableRecord[];
    itemValue?: string;
    groupBy?: readonly UiDataTableGroupBy[];
    itemsPerPage?: number;
    hideDefaultFooter?: boolean;
    hideDefaultHeader?: boolean;
    noDataText?: string;
  }>(),
  {
    itemValue: "id",
    groupBy: () => [],
    itemsPerPage: -1,
    hideDefaultFooter: true,
    hideDefaultHeader: false,
    noDataText: "Нет данных",
  },
);
</script>

<style scoped lang="scss">
.app-data-table {
  overflow: hidden;
  border: 1px solid var(--app-color-border);
  border-radius: var(--app-radius-lg);
  background: var(--app-color-background-surface);
  box-shadow: none;
}

.app-data-table:deep(.v-table__wrapper) {
  border-radius: inherit;
}

.app-data-table:deep(table) {
  border-collapse: collapse;
}

.app-data-table:deep(thead) {
  background: var(--app-color-background-secondary);
}

.app-data-table:deep(th) {
  color: var(--app-color-text-muted);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0;
  text-transform: uppercase;
}

.app-data-table:deep(td),
.app-data-table:deep(th) {
  border-bottom: 1px solid var(--app-color-border);
}

.app-data-table:deep(tbody tr:last-child td) {
  border-bottom: 0;
}
</style>
