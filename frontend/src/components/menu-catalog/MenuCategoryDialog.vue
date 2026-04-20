<template>
  <ui-dialog-shell
    :open="open"
    :title="editingCategory ? 'Редактировать группу' : 'Новая группа'"
    :description="
      editingCategory
        ? `${productCount} ${productCount === 1 ? 'товар' : 'товаров'} в группе`
        : 'Создайте новую группу для организации товаров в меню'
    "
    @close="$emit('close')"
  >
    <template #headerActions>
      <ui-icon-button
        v-if="editingCategory"
        variant="ghost"
        title="Удалить группу"
        @click="$emit('delete')"
      >
        <Trash2 :size="20" />
      </ui-icon-button>
    </template>

    <form id="menu-category-dialog-form" @submit.prevent="submit">
      <div class="dialog-card__body">
        <ui-form-field label="Название группы">
          <ui-text-field
            v-model="name"
            placeholder="Например: Кофе, Чай, Десерты"
            autofocus
          />
        </ui-form-field>

        <ui-toggle-row
          :model-value="isOptionGroup"
          label="Группа опций"
          description="Эта группа является набором опций для другой группы"
          @update:model-value="toggleOptionGroup"
        />

        <ui-form-field label="Выбрать группу опций">
          <ui-select
            v-model="selectedOptionGroupId"
            :items="optionGroupItems"
            item-title="title"
            item-value="value"
            placeholder="Не выбрано"
            :disabled="isOptionGroup"
          />
          <p
            v-if="!isOptionGroup && optionGroups.length === 0"
            class="dialog-card__hint"
          >
            Нет доступных групп опций
          </p>
        </ui-form-field>
      </div>
    </form>

    <template #actions>
      <ui-button
        block
        type="submit"
        form="menu-category-dialog-form"
        :loading="isBusy"
        :disabled="isBusy"
      >
        {{ editingCategory ? "Сохранить изменения" : "Добавить категорию" }}
      </ui-button>
      <ui-button block variant="ghost" @click="$emit('close')"
        >Отмена</ui-button
      >
    </template>
  </ui-dialog-shell>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Trash2 } from "lucide-vue-next";
import UiButton from "@/ui/UiButton.vue";
import UiDialogShell from "@/ui/UiDialogShell.vue";
import UiFormField from "@/ui/UiFormField.vue";
import UiIconButton from "@/ui/UiIconButton.vue";
import UiSelect from "@/ui/UiSelect.vue";
import UiTextField from "@/ui/UiTextField.vue";
import UiToggleRow from "@/ui/UiToggleRow.vue";
import type {
  CategoryDialogSubmitPayload,
  MenuCategory,
  OptionGroup,
} from "@/modules/menu-catalog/types";

const props = defineProps<{
  open: boolean;
  isBusy: boolean;
  editingCategory: MenuCategory | null;
  productCount: number;
  optionGroups: readonly OptionGroup[];
  ownedOptionGroupId?: string;
}>();

const emit = defineEmits<{
  close: [];
  submit: [payload: CategoryDialogSubmitPayload];
  delete: [];
}>();

const name = ref("");
const isOptionGroup = ref(false);
const selectedOptionGroupId = ref("");
const optionGroupItems = computed(() =>
  props.optionGroups.map((group) => ({
    title: group.name,
    value: group.optionGroupId,
  })),
);

watch(
  () => [props.open, props.editingCategory, props.ownedOptionGroupId] as const,
  ([open, editingCategory, ownedOptionGroupId]) => {
    if (!open) {
      resetForm();
      return;
    }

    name.value = editingCategory?.name ?? "";

    const assignedOptionGroupId = editingCategory?.optionGroupRefs[0] ?? "";
    const ownedOptionGroup = props.optionGroups.find(
      (group) => group.optionGroupId === ownedOptionGroupId,
    );

    isOptionGroup.value = Boolean(ownedOptionGroup);
    selectedOptionGroupId.value = isOptionGroup.value
      ? ""
      : assignedOptionGroupId;
  },
  { immediate: true },
);

function submit(): void {
  const category = {
    name: name.value.trim(),
    optionGroupRefs:
      !isOptionGroup.value && selectedOptionGroupId.value
        ? [selectedOptionGroupId.value]
        : [],
  };

  emit("submit", {
    category,
    isOptionGroup: isOptionGroup.value,
  });
}

function toggleOptionGroup(value: boolean): void {
  isOptionGroup.value = value;
  if (value) {
    selectedOptionGroupId.value = "";
  }
}

function resetForm(): void {
  name.value = "";
  isOptionGroup.value = false;
  selectedOptionGroupId.value = "";
}
</script>

<style scoped lang="scss">
.dialog-card__body {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.dialog-card__hint {
  margin: 6px 0 0;
  color: var(--app-color-text-muted);
  font-size: 12px;
  line-height: 18px;
}
</style>
