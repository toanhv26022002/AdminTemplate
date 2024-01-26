<template>
  <VForm ref="form" class="column">
    <!-- aws endpoint, access key, secretkey, bucket -->
    <div class="field-container">
      <!-- Platform -->
      <VSelect
        v-model="props.data.platform"
        class="row"
        :items="platforms"
        item-value="name"
        item-title="name"
        label="Platform"
        :placeholder="$t('Select a Platform')"
        filled
        background-color="#F1F9FF"
        color="#8CB9DC"
        :rules="[rules.required]"
        variant="outlined"
        :disabled="isUpdate"
      />
      <!-- aws endpoint -->
      <VTextField
        v-model="props.data.s3_meta.endpoint"
        class="row"
        label="Aws Endpoint"
        variant="outlined"
        :disabled="isUpdate"
      >
        <template #append-inner>
          <VTooltip location="bottom">
            <template #activator="{ props }">
              <VIcon
                class="btn"
                v-bind="props"
                icon="ri-question-line"
              />
            </template>
            <!-- Enter a title for your dataset. -->
          </VTooltip>
        </template>
      </VTextField>
      <!-- access key -->
      <VTextField
        v-model="props.data.s3_meta.access_key"
        class="row"
        :disabled="isUpdate"
        label="Access Key"
        variant="outlined"
      >
        <template #append-inner>
          <VTooltip location="bottom">
            <template #activator="{ props }">
              <VIcon
                class="btn"
                v-bind="props"
                icon="ri-question-line"
              />
            </template>
            <!-- Enter a title for your dataset. -->
          </VTooltip>
        </template>
      </VTextField>
      <!-- secretkey -->
      <VTextField
        v-model="props.data.s3_meta.secret_key"
        class="row"
        label="Secret Key"
        :disabled="isUpdate"
        variant="outlined"
      >
        <template #append-inner>
          <VTooltip location="bottom">
            <template #activator="{ props }">
              <VIcon
                class="btn"
                v-bind="props"
                icon="ri-question-line"
              />
            </template>
            <!-- Enter a title for your dataset. -->
          </VTooltip>
        </template>
      </VTextField>
      <!-- bucket -->
      <VTextField
        v-model="props.data.s3_meta.bucket"
        class="row"
        label="Bucket"
        :disabled="isUpdate"
        variant="outlined"
      >
        <template #append-inner>
          <VTooltip location="bottom">
            <template #activator="{ props }">
              <VIcon
                class="btn"
                v-bind="props"
                icon="ri-question-line"
              />
            </template>
            <!-- Enter a title for your dataset. -->
          </VTooltip>
        </template>
      </VTextField>
    </div>
    <div class="field-container">
      <!-- ID -->
      <VTextField
        v-model="props.data.id"
        class="row"
        :disabled="isUpdate"
        label="ID"
        :rules="[rules.required, rules.noSpaces, rules.noSpecialExpect, rules.max255]"
        variant="outlined"
      >
        <template #append-inner>
          <VTooltip location="bottom">
            <template #activator="{ props }">
              <VIcon
                class="btn"
                v-bind="props"
                icon="ri-question-line"
              />
            </template>
            Enter ID for your dataset. Spaces and special characters are not allowed. We
            recommend an all lowercase, underscore seperated string.
          </VTooltip>
        </template>
      </VTextField>
      <!-- Title  -->
      <VTextField
        v-model="props.data.title"
        class="row"
        label="Title"
        :rules="[rules.max255]"
        variant="outlined"
      >
        <template #append-inner>
          <VTooltip location="bottom">
            <template #activator="{ props }">
              <VIcon
                class="btn"
                v-bind="props"
                icon="ri-question-line"
              />
            </template>
            Enter a title for your dataset.
          </VTooltip>
        </template>
      </VTextField>
      <!-- Links -->
      <VCombobox
        v-model="props.data.links"
        class="row"
        label="Links"
        variant="outlined"
        multiple
        chips
        item-title="rel"
        closable-chips
        readonly
        :rules="[rules.required]"
      >
        <template #chip="data">
          <VChip
            :key="index"
            v-bind="data"
            :model-value="data"
            size="small"
            closable
            class="btn"
            label
            @click="updateLinkDialog(data.index, data.item.raw)"
            @click:close="removeLink(data.index)"
          />
        </template>
        <template #append-inner>
          <VTooltip location="bottom">
            <template #activator="{ props }">
              <VIcon
                class="btn"
                v-bind="props"
                icon="ri-add-line"
                @click="addLinkDialog"
              />
            </template>
            List of Links describing the Collection.
          </VTooltip>
        </template>
      </VCombobox>
      <!-- Keywords -->
      <VCombobox
        v-model="props.data.keywords"
        label="Keywords"
        variant="outlined"
        multiple
        class="row"
      >
        <template #chip="data">
          <VChip
            :key="props.data.index"
            v-bind="data"
            :model-value="data"
            size="small"
            closable
            label
            @click:close="removeKeyword(props.data.index)"
          />
        </template>
        <template #append-inner>
          <VTooltip location="bottom">
            <template #activator="{ props }">
              <VIcon
                class="btn"
                v-bind="props"
                icon="ri-question-line"
              />
            </template>
            List of keywords describing the Collection.
          </VTooltip>
        </template>
      </VCombobox>
      <!-- License -->
      <VTextField
        v-model="props.data.license"
        :rules="[rules.required, rules.noSpaces, rules.noSpecialExpect, rules.max255]"
        class="row"
        label="License"
        variant="outlined"
      >
        <template #append-inner>
          <VTooltip location="bottom">
            <template #activator="{ props }">
              <VIcon
                class="btn"
                v-bind="props"
                icon="ri-question-line"
              />
            </template>
            Enter a product license for your dataset. Spaces and special characters are
            not allowed.
          </VTooltip>
        </template>
      </VTextField>
      <!-- Short Description -->
      <VTextField
        v-model="props.data.short_description"
        class="row"
        label="Short Description"
        variant="outlined"
      >
        <template #append-inner>
          <VTooltip location="bottom">
            <template #activator="{ props }">
              <VIcon
                class="btn"
                v-bind="props"
                icon="ri-question-line"
              />
            </template>
            Enter a short description for your dataset. Max 255 characters. Spaces,
            special characters, etc. are all allowed.
          </VTooltip>
        </template>
      </VTextField>
      <!-- Description -->
      <VTextarea
        v-model="props.data.description"
        class="row"
        label="Description"
        :rules="[rules.required]"
        clear-icon="mdi-close-circle"
        variant="outlined"
        rows="3"
      >
        <template #append-inner>
          <VTooltip location="bottom">
            <template #activator="{ props }">
              <VIcon
                class="btn"
                v-bind="props"
                icon="ri-question-line"
              />
            </template>
            Enter a description for your dataset. Spaces, special characters, etc. are all
            allowed.
          </VTooltip>
        </template>
      </VTextarea>
    </div>
    <div class="field-container">
      <!-- Providers -->
      <VCombobox
        v-model="props.data.providers"
        class="row"
        label="Providers"
        variant="outlined"
        multiple
        chips
        item-title="name"
        closable-chips
        readonly
      >
        <template #chip="data">
          <VChip
            :key="data.index"
            v-bind="data"
            :model-value="data"
            size="small"
            closable
            class="btn"
            label
            @click="updateProviderDialog(data.index, data.item.raw)"
            @click:close="removeProvider(data.index)"
          />
        </template>
        <template #append-inner>
          <VTooltip location="bottom">
            <template #activator="{ props }">
              <VIcon
                class="btn"
                v-bind="props"
                icon="ri-add-line"
                @click="addProviderDialog"
              />
            </template>
            <!-- List of keywords describing the Collection. -->
          </VTooltip>
        </template>
      </VCombobox>
      <!-- Extensions -->
      <VSelect
        v-model="props.data.stac_extensions"
        chips
        label="Extensions"
        :items="extensions"
        item-text="label"
        item-value="value"
        item-title="label"
        variant="outlined"
        class="row"
        closable-chips
        multiple
      >
        <template #chip="data">
          <VChip
            :key="data.index"
            v-bind="data"
            :model-value="data"
            size="small"
            closable
            label
            @click:close="removeExtension(data.index)"
          />
        </template>
      </VSelect>
      <!-- Assets -->
      <VCombobox
        v-model="assets"
        class="row"
        label="Assets"
        variant="outlined"
        multiple
        chips
        item-title="name"
        closable-chips
        readonly
      >
        <template #chip="data">
          <VChip
            :key="data.index"
            v-bind="data"
            :model-value="data"
            size="small"
            closable
            class="btn"
            label
            @click="updateAssetDialog(data.item.raw)"
            @click:close="removeAsset(data.item.raw.name)"
          />
        </template>
        <template #append-inner>
          <VTooltip location="bottom">
            <template #activator="{ props }">
              <VIcon
                class="btn"
                v-bind="props"
                icon="ri-add-line"
                @click="addAssetDialog"
              />
            </template>
            <!-- List of keywords describing the Collection. -->
          </VTooltip>
        </template>
      </VCombobox>
      <!-- Item Assets -->
      <VCombobox
        v-if="hasItemAssetExt"
        v-model="itemAssets"
        class="row"
        label="Item Assets"
        variant="outlined"
        multiple
        chips
        item-title="name"
        closable-chips
        readonly
      >
        <template #chip="data">
          <VChip
            :key="data.index"
            v-bind="data"
            :model-value="data"
            size="small"
            closable
            class="btn"
            label
            @click="updateItemAssetDialog(data.item.raw)"
            @click:close="removeItemAsset(data.item.raw.name)"
          />
        </template>
        <template #append-inner>
          <VTooltip location="bottom">
            <template #activator="{ props }">
              <VIcon
                class="btn"
                v-bind="props"
                icon="ri-add-line"
                @click="addItemAssetDialog"
              />
            </template>
            <!-- List of keywords describing the Collection. -->
          </VTooltip>
        </template>
      </VCombobox>
      <!-- Extents -->
      <div>
        <VCard
          variant="outlined"
          class="row-card"
        >
          <VCardText>
            <VCardTitle class="title">
              Extent
            </VCardTitle>
            <VCardText>
              <div class="d-flex flex-row">
                <div class="extent-field-title">
                  Spatial bbox
                </div>
                <div class="d-flex flex-row bbox w-100">
                  <VTextField
                    v-model="minX"
                    min="-180"
                    max="180"
                    label="Min x"
                    type="number"
                    variant="outlined"
                    :rules="[rules.required, rules.X]"
                  />
                  <VTextField
                    v-model="minY"
                    :rules="[rules.required, rules.Y]"
                    label="Min y"
                    type="number"
                    variant="outlined"
                  />
                  <VTextField
                    v-model="maxX"
                    :rules="[rules.required, rules.X]"
                    type="number"
                    label="Max x"
                    variant="outlined"
                  />
                  <VTextField
                    v-model="maxY"
                    :rules="[rules.required, rules.Y]"
                    type="number"
                    label="Max y"
                    variant="outlined"
                  />
                </div>
              </div>
            </VCardText>
            <!-- // -->
            <VCardText>
              <div class="d-flex flex-row">
                <div class="extent-field-title">
                  Temporal
                </div>
                <div class="d-flex flex-column temporal w-100">
                  <!--
                    <VTextField
                    v-model="dateStarted"
                    type="date"
                    label="Start Date"
                    variant="outlined"
                    />
                    <VTextField
                    v-model="dateFinished"
                    type="date"
                    label="End Date"
                    variant="outlined"
                    /> 
                  -->
                  <VTextField
                    v-model="startDate"
                    type="datetime-local"
                    label="Start Date"
                    variant="outlined"
                  /> 
                  <VTextField
                    v-model="endDate"
                    type="datetime-local"
                    label="End Date"
                    variant="outlined"
                  />  
                </div>
              </div>
            </VCardText>
          </VCardText>
        </VCard>
      </div>
    </div>
  </VForm>
  <ProviderDialog
    ref="providerDialog"
    @submit="updateProvider"
  />
  <AssetDialog
    ref="assetDialog"
    @submit="updateAsset"
  />
  <ItemAssetDialog
    ref="itemAssetDialog"
    @submit="updateItemAsset"
  />
  <LinkDialog
    ref="linkDialog"
    @submit="updateLink"
  />
</template>

<script setup>
import { defineExpose, defineProps, ref } from 'vue'
import { useStore } from 'vuex'
import AssetDialog from "./dialog/asset-dialog.vue"
import ItemAssetDialog from "./dialog/item-asset-dialog.vue"
import LinkDialog from "./dialog/link-dialog.vue"

import CollectionApi from '@/api/CollectionApi'
import moment from 'moment'
import ProviderDialog from './dialog/provider-dialog.vue'

const props = defineProps({
  isUpdate: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object,
    default: () => ({}),
  },
})

const platforms = ref([])

const store = useStore()
const keyword = ref('')
const linkDialog = ref(null)
const providerDialog = ref(null)
const assetDialog = ref(null)
const itemAssetDialog = ref(null)
const form = ref(null)


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

const fetchPlatforms = async () => {
  const result = await CollectionApi.getPlatforms()

  platforms.value = result.data.data
}

onMounted(() => {
  fetchPlatforms()
})

const itemAssets = computed(()=> {
  const temp = props.data.item_assets
  if (temp && Object.keys(temp).length > 0) {
    return Object.keys(temp).map(key => {
      const value = temp[key]
        
      return {
        name: key,
        ...value,
      }
    })
  } else {
    return []
  }
})

const assets = computed(()=> {
  const temp = props.data.assets
  if (temp && Object.keys(temp).length > 0) {
    return Object.keys(temp).map(key => {
      const value = temp[key]
        
      return {
        name: key,
        ...value,
      }
    })
  } else {
    return []
  }
})

const startDate = ref(undefined)
const endDate = ref(undefined)

watch(() => {
  if (props.data.extent && props.data.extent.temporal) {
    const startDateMoment = moment(props.data.extent.temporal.interval[0][0])

    startDate.value = startDateMoment.format("YYYY-MM-DDTHH:mm")

    const endDateMoment = moment(props.data.extent.temporal.interval[0][1])

    endDate.value = endDateMoment.format("YYYY-MM-DDTHH:mm")
  } else {
    startDate.value = undefined
    endDate.value = undefined
  }
})

watch(startDate, () => {
  if (startDate.value) {
    props.data.extent.temporal.interval[0][0] = moment(startDate.value).utc().format()
  }
})

watch(endDate, () => {
  if (endDate.value) {
    props.data.extent.temporal.interval[0][1] = moment(endDate.value).utc().format()
  }
})


// Extent
const minX = ref(undefined)
const minY = ref(undefined)
const maxX = ref(undefined)
const maxY = ref(undefined)

watch(() => {
  if (props.data.extent && props.data.extent.spatial) {
    minX.value = props.data.extent.spatial.bbox[0][0]
    minY.value = props.data.extent.spatial.bbox[0][1]
    maxX.value = props.data.extent.spatial.bbox[0][2]
    maxY.value = props.data.extent.spatial.bbox[0][3]
  } else {
    minX.value = undefined
    minY.value = undefined
    maxX.value = undefined
    maxY.value = undefined
  }
})


// Extension
const extensions = ref([  
  {
    label: "item-assets",
    value: "https://stac-extensions.github.io/item-assets/v1.0.0/schema.json",
  },
  {
    label: "eo",
    value: "https://stac-extensions.github.io/eo/v1.1.0/schema.json",
  },
  {
    label: "raster",
    value: "https://stac-extensions.github.io/raster/v1.0.0/schema.json",
  },
  {
    label: "view",
    value: "https://stac-extensions.github.io/view/v1.0.0/schema.json",
  },
  {
    label: "proj",
    value: "https://stac-extensions.github.io/projection/v1.0.0/schema.json",
  },
  {
    label: "sar",
    value: "https://stac-extensions.github.io/sar/v1.0.0/schema.json",
  },
  {
    label: "sat",
    value: "https://stac-extensions.github.io/sat/v1.0.0/schema.json",
  },
  {
    label: "pointcloud",
    value: "https://stac-extensions.github.io/pointcloud/v1.0.0/schema.json",
  },
  {
    label: "checksum",
    value: "https://stac-extensions.github.io/checksum/v1.0.0/schema.json",
  },
  {
    label: "datacube",
    value: "https://stac-extensions.github.io/datacube/v1.0.0/schema.json",
  },
  {
    label: "version",
    value: "https://stac-extensions.github.io/version/v1.0.0/schema.json",
  },
  {
    label: "label",
    value: "https://stac-extensions.github.io/label/v1.0.0/schema.json",
  },
  {
    label: "scientific",
    value: "https://stac-extensions.github.io/scientific/v1.0.0/schema.json",
  },
  {
    label: "pointcloud",
    value: "https://stac-extensions.github.io/pointcloud/v1.0.0/schema.json",
  },
  {
    label: "checksum",
    value: "https://stac-extensions.github.io/checksum/v1.0.0/schema.json",
  },
  {
    label: "datacube",
    value: "https://stac-extensions.github.io/datacube/v1.0.0/schema.json",
  },
  {
    label: "version",
    value: "https://stac-extensions.github.io/version/v1.0.0/schema.json",
  },
  {
    label: "label",
    value: "https://stac-extensions.github.io/label/v1.0.0/schema.json",
  },
])


// Links
function addLinkDialog() {
  linkDialog.value.open("Add Link", undefined, undefined)
}
function updateLink(index, link) {
  props.data.links = props.data.links || []
  if (
    props.data.links.some(
      (element, i) => element.rel === link.rel && i !== index,
    )
  ) {
    store.dispatch("notify", {
        type: "success",
        message: "Update success!",
    });
    
    return
  }
  if (index != undefined) {
    props.data.links[index] = link
  } else {
    props.data.links.push(link)
  }
  linkDialog.value.close()
}
function updateLinkDialog(index, link) {
  linkDialog.value.open("Update Link", index, link)
}
function removeLink(index) {
  props.data.links.splice(index, 1)
}

// Keywords
function removeKeyword(index) {
  props.data.keywords.splice(index, 1)
}

// Providers
function addProviderDialog() {
  providerDialog.value.open("Add Provider", undefined, undefined)
}

function updateProvider(index, provider) {
  props.data.providers =props.data.providers || []
  if (
    props.data.providers.some(
      (element, i) => element.name === provider?.name && i !== index,
    )
  ) {
    store.dispatch("notify", {
      type: "error",
      message: "Name already exists",
    })
    
    return
  }
  if (index != undefined) {
    props.data.providers[index] = provider
  } else {
    props.data.providers.push(provider)
  }
  providerDialog.value.close()
}
function updateProviderDialog(index, provider) {
  providerDialog.value.open("Update Provider", index, provider)
}
function removeProvider(index) {
  props.data.providers.splice(index, 1)
}

//Extensions
function  removeExtension(index) {
  props.data.stac_extensions.splice(index, 1)
}

//Assets
function addAssetDialog() {
  assetDialog.value.open("Add Asset", undefined, undefined)
}
function updateAsset(name, asset) {
  props.data.assets = props.data.assets || {}
  if (props.data.assets && name in props.data.assets) {
    store.dispatch("notify", {
      type: "error",
      message: "Name already exists",
    })
  } else {
    props.data.assets[name] = asset
    assetDialog.value.close()
  }
}
function updateAssetDialog(asset) {
  assetDialog.value.open("Update Asset", asset)
}
function removeAsset(name) {
  delete props.data.assets[name]
}

//Item Assets
const hasItemAssetExt = computed(()=>{
  return props.data.stac_extensions && props.data.stac_extensions.includes("https://stac-extensions.github.io/item-assets/v1.0.0/schema.json")
})
 
function addItemAssetDialog() {
  itemAssetDialog.value.open("Add Item Asset", undefined, undefined)
}
function removeItemAsset(name) {
  delete props.data.item_assets[name]
}
function updateItemAsset(name, item_asset) {
  props.data.item_assets = props.data.item_asset || {}
  if (name in props.data.item_assets) {
    this.$store.dispatch("notify", {
      type: "error",
      message: "Name already exists",
    })
  } else {
    props.data.item_assets[name] = item_asset
    itemAssetDialog.value.close()
  }
}
function updateItemAssetDialog(item_asset) {
  itemAssetDialog.value.open("Update Item Asset", item_asset)
}
const test = () => {
  form.value.validate()
}

onMounted(() => {
  console.log(form.value);
  // form.value.validate()
})

defineExpose({
  test
})

</script>

<style scoped>
.add-product-container {
  width: 100%;
  height: 100%;
  padding: 26px;
}

.field-container {
  width: 100%;
  padding: 10px;
  flex-direction: column;
}

.column {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 16px;
}

.row {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 8px 0;
  height: max-content;
}

.row-card {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.btnSave {
  background: #2c3e50;
  color: #ffff;
  padding: 5px;
  margin: 10px;
  float: right;
  display: flex;
  justify-content: flex-end;
  margin-top: 420px;
}

.btn {
  cursor: pointer;
}
.bbox {
  flex-wrap: wrap;
}
.bbox > * {
  flex: 1;
  margin: 5px auto;
  min-width: 45%;
  max-width: 45%;
}
.temporal > * {
  flex: 1;
  margin: 5px;
}

.title {
  padding: 0.5rem 0.25rem;
}

.extent-field-title {
  width: 80px !important;
  justify-content: center;
}
</style>
