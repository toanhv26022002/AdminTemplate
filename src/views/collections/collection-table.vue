<template>
  <div class="d-flex justify-space-between align-center">
    <div class="w-50">
      <VTextField
        v-model="search"
        :label="$t('Search items by ID')"
        clearable
        prepend-inner-icon="ri-search-2-line"
      />
    </div>
    <VSpace />
    <div class="text-end">
      <VBtn
        to="/collections/add"
        color="primary"
      >
        {{ $t("Create Collection") }}
      </VBtn>
    </div>
  </div>
  <Table
    class="flex-grow-1 mt-5"
    :headers="headers"
    :items="items"
    :loading="loading"
    :total-page="totalPage"
    @view-item="viewItem"
    @next-page="nextPage"
    @prev-page="prevPage"
    @set-items-per-page="setItemsPerPage"
    @change-page="changePage"
    @edit-item="editItem"
    @delete-item="deleteItem"
  />
</template>

<script setup>
import CollectionApi from "@/api/CollectionApi"
import Table from "@/components/table/table-view.vue"
import moment from "moment"
import { onMounted, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import { useStore } from "vuex"

const search = ref("")
const router = useRouter()
const headers = ref([])
const items = ref([])
const loading = ref(false)
const totalPage = ref()
const currentPage = ref(1)
const itemsPerPage = ref(10)
let timeOut = null
const { t } = useI18n()
const store = useStore()

const initData = () => {
  headers.value = [
    { title: "Name", value: "id" },
    { title: "Type", value: "platform", sortable: false },
    { title: "Updated at", value: "updated_at", sortable: false },
    { title: "Created at", value: "created_at", sortable: false },
    {
      title: "Actions",
      value: "actions",
      sortable: false,
      class: "text-end",
      align: "end",
    },
  ]
}

const getItems = async () => {
  loading.value = true

  const params = {
    search: search.value,
    page: currentPage.value,
    perPage: itemsPerPage.value,
  }

  const respone = await CollectionApi.getAll(params)
  const result = respone.data

  result.data.forEach(collection => {
    collection.created_at = moment(collection.created_at).format(
      "MMMM Do YYYY, h:mm:ss a",
    )
    collection.updated_at = moment(collection.updated_at).format(
      "MMMM Do YYYY, h:mm:ss a",
    )
  })
  totalPage.value = result.totalPage
  items.value = result.data
  loading.value = false
}

const viewItem = item => {
  router.push({ name: "items", query: { collection_id: item.id } })
}

const editItem = item => {
  router.push({ path: `/collections/${item.id}/update` })
}

const deleteItem = async item => {
  try {
    await CollectionApi.deleteCollection(item.id)
    store.dispatch("notify", {
      type: "success",
      message: "Delete success!",
    })
    getItems()
  } catch {
    store.dispatch("notify", {
      type: "error",
      message: "Delete fail!",
    })
  }
}

const nextPage = () => {
  currentPage.value++
}

const prevPage = () => {
  currentPage.value--
}

const changePage = val => {
  currentPage.value = val
}

const setItemsPerPage = number => {
  itemsPerPage.value = number
}

onMounted(() => {
  initData()
  getItems()
})

watch(search, () => {
  if (timeOut) {
    clearTimeout(timeOut)
  }
  timeOut = setTimeout(() => {
    getItems()
  }, 300)
})
watch(currentPage, () => {
  if (timeOut) {
    clearTimeout(timeOut)
  }
  timeOut = setTimeout(() => {
    getItems()
  }, 300)
})
watch(itemsPerPage, () => {
  if (timeOut) {
    clearTimeout(timeOut)
  }
  timeOut = setTimeout(() => {
    getItems()
  }, 300)
})
</script>
