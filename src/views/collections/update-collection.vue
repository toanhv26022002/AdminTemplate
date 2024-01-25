<template>
  <div class="header">
    <div class="d-flex flex-row align-center">
      <VIcon @click="$router.back()">
        ri-corner-up-left-line
      </VIcon>
      <h1>{{ $t("Update Collection") }}</h1>
    </div>
    <div class="d-flex align-center">
      <VSwitch
        v-model="showEditor"
        class="btnChange"
        color="primary"
        label="Editor"
        value="true"
        hide-details
      />
      <VBtn
        color="primary"
        @click="save"
      >
        {{ $t("Update") }}
      </VBtn>
    </div>
  </div>
  <VCard class="card">
    <VueMonacoEditor 
      v-if="showEditor"
      v-model:value="codeData"
      :theme="themeEditor"
      :options="options"
      default-language="json"
    />
    <CollectionForm
      v-else
      :data="data"
      :is-update="true"
    />
  </VCard>
  
  <ConfirmDialog
    :visible="isDialogConfirm"
    title="Confirm"
    content="Do you want to create this collection?"
    ok-button-text="OK"
    width="400"
    color="primary"
    @cancel="handleCancel"
    @confirm="handleConfirm"
  />
</template>

<script setup>
import CollectionApi from "@/api/CollectionApi"
import ConfirmDialog from "@/components/confirm-dialog/ConfirmDialog.vue"
import { inject, ref } from 'vue'
import { useRoute } from "vue-router"
import { useTheme } from 'vuetify'
import CollectionForm from "./collection-form.vue"


const options = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
}

const showEditor = ref(false)
const isDialogConfirm = ref(false)
const themeEditor = ref('light')
const theme = useTheme()
const store = inject('store')
const route = useRoute()

const fetchCollection = async () => {
  try {
    const response = await CollectionApi.getCollection(route.params.collection)

    data.value = response.data
  } catch (error) {
    store.dispatch("notify", {
      type: "error",
      message: "An error occurred while fetching the collection",
    })
  }
}

const rules = {
  required: value => !!value || (value && value.length > 0) || "Required.",
  max255: value =>
    value === null ||
        (typeof value === "string" && value.length <= 255) ||
        value === "" ||
        "Max 255 characters",
  noSpaces: value => (value && !value.includes(" ")) || "No spaces",
  noSpecial: value =>
    (value && !/[^a-zA-Z0-9]/.test(value)) || " No special characters",
  noSpecialExpect: value =>
    /^[a-zA-Z0-9.\-_+]+$/.test(value) || "No special characters except .-+_",
  X: value => (value <= 180 && value >= -180) || "X should be in range [-180,180]",
  Y: value => (value <= 90 && value >= -90) || "Y should be in range [-90,90]",
}

onMounted(() => {
  fetchCollection()
})

const data = ref({
  platform: null,
  s3_meta: {
    endpoint: null,
    access_key: null,
    secret_key: null,
    bucket: null,
  },
  id: null,
  type: "Collection",
  title: null,
  description: null,
  short_description: null,
  keywords: [],
  license: null,
  stac_extensions: [],
  providers: [],
  assets: {},
  item_assets: {},
  extent: {
    spatial: {
      bbox: [[-180.0, -90.0, 180.0, 90.0]],
    },
    temporal: {
      interval: [[null, null]],
    },
  },
  links: [],
})

const codeData = ref(JSON.stringify(data.value, null, 2))

watch(theme.global.name.value, (newValue, oldValue) => {
  themeEditor.value = newValue.global.name.value === 'light' ? 'vs-light' : 'vs-dark'
}, { deep: true })

watch(showEditor, (newValue, oldValue) => {
  if (newValue) {
    codeData.value = JSON.stringify(data.value, null, 2)
  } else {
    data.value = JSON.parse(codeData.value)
  }
}, { deep: true })

const validate = () => {
  if (
    (data.value.platform &&
          data.value.platform.trim().length === 0) ||
        data.value.platform == null
  ) {
    store.dispatch("notify", {
      type: "error",
      message: "Platform is required",
    })
        
    return false
  }

  if (
    (data.value.id && data.value.id.trim().length === 0) ||
        data.value.id == null
  ) {
    store.dispatch("notify", {
      type: "error",
      message: "ID is required",
    })
        
    return false
  }
  if (
    (data.value.license && data.value.license.trim() == "") ||
        data.value.license == null
  ) {
    store.dispatch("notify", {
      type: "error",
      message: "License is required",
    })
        
    return false
  }
  if (
    (data.value.description &&
          data.value.description.trim().length === 0) ||
        data.value.description == null
  ) {
    store.dispatch("notify", {
      type: "error",
      message: "Description is required",
    })
        
    return false
  }
  if (
    Object.keys(data.value.assets).length === 0 ||
        !data.value.assets
  ) {
    store.dispatch("notify", {
      type: "error",
      message: "Assets is required",
    })
        
    return false
  }

  if (
    data.value.id &&
        rules.nospecial_expect(data.value.id.trim()) != true
  ) {
    store.dispatch("notify", {
      type: "error",
      message: "ID doesn't include special characters",
    })
        
    return false
  }
  if (
    data.value.id &&
        rules.nospaces(data.value.id.trim()) != true
  ) {
    store.dispatch("notify", {
      type: "error",
      message: "ID doesn't include spaces",
    })
        
    return false
  }
  if (
    data.value.title &&
        rules.max255(data.value.title.trim()) != true
  ) {
    store.dispatch("notify", {
      type: "error",
      message: "Title is max 255 characters",
    })
        
    return false
  }

  return true
}

const handleConfirm = async () => {
  try {
    const response = await CollectionApi.createCollection(data.value)

    this.$router.back()
    isDialogConfirm.value = false
    store.dispatch("notify", {
      type: "success",
      message: response.data.message,
    })
  } catch (error) {
    if (error.response && error.response.status === 400) {
      const errorMessage = error.response.data?.error

      store.dispatch("notify", {
        type: "error",
        message: errorMessage,
      })
    } else {
      store.dispatch("notify", {
        type: "error",
        message: "An error occurred while creating the collection",
      })
    }
  }
}

const handleCancel = () => {
  isDialogConfirm.value = false
}

const save = () => {
  if (!validate()) {
    return
  }
  isDialogConfirm.value = true
}
</script>

<style lang="scss">
h1 {
  margin: 20px;
}

.card {
  // margin: 20px;
  // margin-top: 5px !important;
  //padding: 20px;
  overflow: auto;
  height: calc(100vh - 200px);
}

.btnSave {
  background: #2c3e50;
  color: #ffff;
  padding: 5px;
  margin: 10px;
  float: right;
}

.btnChange {
  //background: #2c3e50;
  color: #ffff;
  padding: 5px;
  margin: 10px;
  float: right;
  max-width: 200px;
}

.header {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 10px;
  justify-content: space-between;
}

.content {
  display: flex;
  flex-direction: row;
  margin-right: 10px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.contentInput {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  margin-right: 10px;
  width: calc(30% - 100px);
  margin-bottom: 40px;
  height: 50px;
}

.contentColumn {
  display: flex;
  flex-direction: column;
}

.contentText {
  width: 80%;
}

.container_swap {
  display: flex;
  align-items: center;
  margin-right: 10px;
  justify-content: space-between;
}

.div_right {
  display: flex;
  justify-content: flex-end;
}
</style>
