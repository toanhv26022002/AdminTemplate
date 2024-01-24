<template>
  <div class="item-container">
    <div class="d-flex align-center">
      <div class="d-flex w-75">
        <div class="w-50 ma-2">
          <VSelect
            v-model="currentCollection"
            :items="collectionName"
            :label="$t('Collections')"
            prepend-inner-icon="ri-filter-2-line"
            clearable
            hide-details
          />
        </div>
        <div class="w-50 ma-2">
          <VTextField
            v-model="search"
            :label="$t('Search items by ID')"
            prepend-inner-icon="ri-search-2-line"
            hide-details
          />
        </div>
      </div>
      <div class="text-end w-25">
        <VBtn color="primary">
          {{ $t("Map view") }}
        </VBtn>
      </div>
    </div>
    <div style="margin-top: 20px">
      <TableView
        ref="table"
        :items="items"
        :headers="headers"
        :loading="loading"
        :show-pagination="showPagination"
        :total-page="totalPage"
        :total-items="totalItems"
        :total-visible="totalVisible"
        @next-page="getNextPageItems"
        @prev-page="getPrevPageItems"
        @set-items-per-page="setItemsPerPage"
      />
    </div>
  </div>
</template>

<script setup>
import CollectionApi from '@/api/CollectionApi'
import TableView from "@/components/table/table-view.vue"
import moment from 'moment'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const currentCollection = ref(undefined)
const headers = ref([])
const items = ref([])
const collectionName = ref([])
const loading = ref(false)
const search = ref(undefined)
const timeOut = ref(null)
const bodyRequestToNextPage = ref(undefined)
const bodyRequestToPrevPage = ref(undefined)
const showPagination = ref(true)
const totalPage = ref(undefined)
const table = ref()
const itemsPerPage = ref(10)
const totalItems = ref(undefined)
const totalVisible = ref(1)

const { t } = useI18n()
const route = useRoute()

const initData = () => {
  headers.value = [
    { title: t("Index"), value: "index" },
    { title: t("Platform"), value: "platform" },
    { title: t("ID"), value: "id", sortable: false },
    { title: t("Instrument"), value: "instrument", sortable: false },
    { title: t("Product Type"), value: "product_type", sortable: false },
    { title: t("Acquired"), value: "acquired", sortable: false },
    { title: t("Actions"), value: "actions", sortable: false, class: "text-end", align: "end" },
  ]
}

const fetchItems = async params => {
  loading.value = true
  items.value = []

  const result = await CollectionApi.getItems(params)
  if (result !== undefined) {
    result.data.features.forEach((feature, index) => {
      const item = {
        index: index + 1,
        platform: feature.properties.platform,
        id: feature.id,
        instrument: feature.properties.instruments.join(", "),
        product_type: feature.properties["sar:product_type"],
        acquired: moment(feature.properties["start_datetime"]).format('MMMM Do YYYY, h:mm:ss a'),
      }

      items.value.push(item)
    })
  }
  const prevLink = result?.data.links.find(link => link.rel === "previous")

  bodyRequestToPrevPage.value = prevLink ? prevLink.body : undefined

  const nextLink = result?.data.links.find(link => link.rel === "next")

  bodyRequestToNextPage.value = nextLink ? nextLink.body : undefined
  showPagination.value = !bodyRequestToNextPage.value && !bodyRequestToPrevPage.value
  totalPage.value = Math.ceil(result?.data.context.matched / result?.data.context.limit)
  totalItems.value = result?.data.context.matched
  loading.value = false
}

const fetchData = async () => {
  await fetchItems({
    collection: currentCollection.value,
    search: search.value,
    limit: itemsPerPage.value,
  })
}

const getNextPageItems = async () => {
  await fetchItems({
    collection: currentCollection.value,
    search: search.value,
    bodyRequestToNextPage: bodyRequestToNextPage.value,
  })
}

const getPrevPageItems = async () => {
  await fetchItems({
    collection: currentCollection.value,
    search: search.value,
    bodyRequestToPrevPage: bodyRequestToPrevPage.value,
  })
}

const getCollectionName = async () => {
  const result = await CollectionApi.getAll()

  collectionName.value = result.data.data.map(collection => collection.id)
}

const setItemsPerPage = number => {
  itemsPerPage.value = number
}

const getCollectionNameFromParams = () => {
  if (route.query.collection_id) {
    currentCollection.value = route.query.collection_id
  }
}

onMounted(() => {
  initData()
  getCollectionName()
  getCollectionNameFromParams()
  fetchData()
})

onUnmounted(() => {
  items.value = []
})

watch(currentCollection, () => {
  table.value.resetPagination()
  fetchData()
})

watch(search, () => {
  if (timeOut.value) {
    clearTimeout(timeOut.value)
  }
  timeOut.value = setTimeout(() => {
    table.value.resetPagination()
    fetchData()
  }, 500)
})

watch(itemsPerPage, () => {
  table.value.resetPagination()
  fetchData()
})
</script>


<style scoped>
.item-container {
  padding: 20px 32px;
}
</style>
