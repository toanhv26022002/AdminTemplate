<template>
  <VDataTable
    :items="items"
    :headers="headers"
    :height="tableHeight"
    items-per-page="-1"
    class="overflow-x-auto"
    fixed-header
    :loading="loading"
  >
    <!--
      <template #headers>
      <tr>
      <th
      v-for="header in headers"
      :key="header.id"
      :class="{ 'text-end': header.align === 'end' }"
      >
      {{ $t(header.title) }}
      </th>
      </tr>
      </template> 
    -->
    <template #item.actions="{ item }">
      <div class="text-end">
        <VIcon
          size="small"
          class="me-2"
          color="#B6BBC4"
          @click="viewItem(item)"
        >
          ri-eye-line
        </VIcon>
        <VIcon
          size="small"
          class="me-2"
          @click="editItem(item)"
        >
          ri-edit-2-line
        </VIcon>
        <VIcon
          size="small"
          color="red"
          @click="deleteItem(item)"
        >
          ri-delete-bin-2-line
        </VIcon>
      </div>
    </template>
    <template #bottom>
      <div class="d-flex footer mt-2 align-center">
        <VSpacer />
        <VPagination
          v-if="!showPagination"
          v-model="currentPage"
          :length="totalPage"
          size="small"
          :total-visible="totalVisible"
          @next="next"
          @prev="prev"
          :show-first-last-page="false"
        />
        <div class="d-flex h-100 justify-end align-center">
          <div style="margin-inline-start: 10px">
            Items per page:
          </div>
          <div>
            <VSelect
              v-model="itemsPerPage"
              variant="outlined"
              density="compact"
              class="per-page"
              style="inline-size: 100px; margin-inline-start: 10px;"
              :items="[10, 20, 50, 100]"
              hide-details
            />
          </div>
          <p style="margin-block: 0;margin-inline: 10px">
            Total: {{ totalItems }}
          </p>
        </div>
      </div>
    </template>
  </VDataTable>
  <ConfirmDialog
    :visible="isDeleteDialogVisible"
    title="Delete Confirmation"
    content="Are you sure you want to delete"
    ok-button-text="Delete"
    width="400"
    color="error"
    @cancel="handleCancelDelete"
    @confirm="handleConfirmDelete"
  />
</template>

<script setup>
import ConfirmDialog from '@/components/confirm-dialog/ConfirmDialog.vue';
import { ref, watch } from 'vue';

const props = defineProps({
  headers: {
    type: Array,
    default: () => [],
  },
  items: {
    type: Array,
  },
  showPagination: {
    type: Boolean,
  },
  totalPage: {
    type: Number,
    default: undefined,
  },
  totalItems: {
    type: Number,
  },
  totalVisible: {
    type: Number,
  },
  loading: {
    type: Boolean,
    default: false,
  }
})

const emit = defineEmits([
  'next',
  'prev',
  'setItemsPerPage',
  'viewItem',
  'editItem',
  'deleteItem',
  'changePage',
  'nextPage',
  'prevPage',
])

const currentPage = ref(1)
const tableHeight = ref('100%')
const isDeleteDialogVisible = ref(false)
const itemsPerPage = ref(10)
const currentItem = ref(null)

const viewItem = item => {
  emit('viewItem', item)
}

const next = () => {
  emit('nextPage')
}

const prev = () => {
  emit('prevPage')
}

const resetPagination = () => {
  currentPage.value = 1
}

const editItem = item => {
 
  emit("editItem", item)
}

const deleteItem = item => {
  currentItem.value = item
  isDeleteDialogVisible.value = true
  
}

const handleCancelDelete = () => {
  isDeleteDialogVisible.value = false
}

const handleConfirmDelete = ()=>{
  emit("deleteItem", currentItem.value)
  isDeleteDialogVisible.value = false
}

watch(itemsPerPage, newVal => {
  emit('setItemsPerPage', newVal)
})
watch(currentPage, newVal => {
  emit('changePage', newVal)
})
defineExpose({ resetPagination })
</script>

<style scoped>
.footer > * {
  flex: 1;
}

.overflow-x-auto {
  overflow-x: auto;
}

.v-data-table {
  flex-grow: 1;
  margin-block-start: 20px;
  text-wrap: nowrap;
}
</style>
