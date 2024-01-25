<template>
  <VDataTable
    :items="items"
    :headers="headers"
    :height="tableHeight"
    items-per-page="-1"
    class="overflow-x-auto"
    fixed-header
  >
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
        />
        <div class="d-flex h-100 justify-end align-center">
          <p style="margin-left: 10px">Items per page:</p>
          <div>
            <VSelect
              v-model="itemsPerPage"
              variant="outlined"
              density="compact"
              style="width: 100px; margin-left: 10px"
              :items="[10, 20, 50, 100]"
              hide-details
            />
          </div>
          <p style="margin: 0 10px">Total: {{ totalItems }}</p>
        </div>
      </div>
    </template>
  </VDataTable>
</template>

<script setup>
import { defineEmits, ref, watch } from 'vue';

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
const itemsPerPage = ref(10)

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
  emit('editItem', item)
}

const deleteItem = item => {
  emit('deleteItem', item)
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
  text-wrap: nowrap;
}
</style>
