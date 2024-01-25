<template>
  <div class="column">
    <!-- aws endpoint, access key, secretkey, bucket -->
    <div class="field-container">
      <!-- Platform -->
      <v-select
        class="row"
        v-model="dataCollection.platform"
        :items="platforms"
        item-value="name"
        item-title="name"
        label="Platform"
        :placeholder="$t('Select a Platform')"
        prepend-inner-icon="mdi-satellite-variant"
        filled
        background-color="#F1F9FF"
        color="#8CB9DC"
        :rules="[rules.required]"
        variant="outlined"
        :disabled="isUpdate"
      />
      <!-- aws endpoint -->
      <v-text-field
        v-model="dataCollection.s3_meta.endpoint"
        class="row"
        label="Aws Endpoint"
        variant="outlined"
        :disabled="isUpdate"
      >
        <template v-slot:append-inner>
          <v-tooltip location="bottom">
            <template v-slot:activator="{ props }">
              <v-icon class="btn" v-bind="props" icon="mdi-help-circle-outline"></v-icon>
            </template>
            <!-- Enter a title for your dataset. -->
          </v-tooltip>
        </template>
      </v-text-field>
      <!-- access key -->
      <v-text-field
        v-model="dataCollection.s3_meta.access_key"
        class="row"
        :disabled="isUpdate"
        label="Access Key"
        variant="outlined"
      >
        <template v-slot:append-inner>
          <v-tooltip location="bottom">
            <template v-slot:activator="{ props }">
              <v-icon class="btn" v-bind="props" icon="mdi-help-circle-outline"></v-icon>
            </template>
            <!-- Enter a title for your dataset. -->
          </v-tooltip>
        </template>
      </v-text-field>
      <!-- secretkey -->
      <v-text-field
        class="row"
        v-model="dataCollection.s3_meta.secret_key"
        label="Secret Key"
        :disabled="isUpdate"
        variant="outlined"
      >
        <template v-slot:append-inner>
          <v-tooltip location="bottom">
            <template v-slot:activator="{ props }">
              <v-icon class="btn" v-bind="props" icon="mdi-help-circle-outline"></v-icon>
            </template>
            <!-- Enter a title for your dataset. -->
          </v-tooltip>
        </template>
      </v-text-field>
      <!-- bucket -->
      <v-text-field
        v-model="dataCollection.s3_meta.bucket"
        class="row"
        label="Bucket"
        :disabled="isUpdate"
        variant="outlined"
      >
        <template v-slot:append-inner>
          <v-tooltip location="bottom">
            <template v-slot:activator="{ props }">
              <v-icon class="btn" v-bind="props" icon="mdi-help-circle-outline"></v-icon>
            </template>
            <!-- Enter a title for your dataset. -->
          </v-tooltip>
        </template>
      </v-text-field>
    </div>
    <div class="field-container">
      <!-- ID -->
      <v-text-field
        v-model="dataCollection.id"
        class="row"
        :disabled="isUpdate"
        label="ID"
        :rules="[rules.required, rules.nospaces, rules.nospecial_expect, rules.max255]"
        variant="outlined"
      >
        <template v-slot:append-inner>
          <v-tooltip location="bottom">
            <template v-slot:activator="{ props }">
              <v-icon class="btn" v-bind="props" icon="mdi-help-circle-outline"></v-icon>
            </template>
            Enter ID for your dataset. Spaces and special characters are not allowed. We
            recommend an all lowercase, underscore seperated string.
          </v-tooltip>
        </template>
      </v-text-field>
      <!-- Title  -->
      <v-text-field
        class="row"
        v-model="dataCollection.title"
        label="Title"
        :rules="[rules.max255]"
        variant="outlined"
      >
        <template v-slot:append-inner>
          <v-tooltip location="bottom">
            <template v-slot:activator="{ props }">
              <v-icon class="btn" v-bind="props" icon="mdi-help-circle-outline"></v-icon>
            </template>
            Enter a title for your dataset.
          </v-tooltip>
        </template>
      </v-text-field>
      <!-- Links -->
      <v-combobox
        class="row"
        v-model="dataCollection.links"
        label="Links"
        variant="outlined"
        multiple
        chips
        item-title="rel"
        :closable-chips="true"
        readonly
        :rules="[rules.required]"
      >
        <template v-slot:chip="data">
          <v-chip
            :key="data.index"
            v-bind="data"
            :model-value="data"
            size="small"
            closable
            @click="updateLinkDialog(data.index, data.item.raw)"
            class="btn"
            @click:close="removeLink(data.index)"
            :label="true"
          >
          </v-chip>
        </template>
        <template v-slot:append-inner>
          <v-tooltip location="bottom">
            <template v-slot:activator="{ props }">
              <v-icon
                class="btn"
                @click="addLinkDialog()"
                v-bind="props"
                icon="mdi-plus"
              ></v-icon>
            </template>
            List of Links describing the Collection.
          </v-tooltip>
        </template>
      </v-combobox>

      <!-- License -->
      <v-text-field
        v-model="dataCollection.license"
        :rules="[rules.required, rules.nospaces, rules.nospecial_expect, rules.max255]"
        class="row"
        label="License"
        variant="outlined"
      >
        <template v-slot:append-inner>
          <v-tooltip location="bottom">
            <template v-slot:activator="{ props }">
              <v-icon class="btn" v-bind="props" icon="mdi-help-circle-outline"></v-icon>
            </template>
            Enter a product license for your dataset. Spaces and special characters are
            not allowed.
          </v-tooltip>
        </template>
      </v-text-field>
      <!-- Short Description -->
      <v-text-field
        class="row"
        v-model="dataCollection.short_description"
        label="Short Description"
        variant="outlined"
      >
        <template v-slot:append-inner>
          <v-tooltip location="bottom">
            <template v-slot:activator="{ props }">
              <v-icon class="btn" v-bind="props" icon="mdi-help-circle-outline"></v-icon>
            </template>
            Enter a short description for your dataset. Max 255 characters. Spaces,
            special characters, etc. are all allowed.
          </v-tooltip>
        </template>
      </v-text-field>
      <!-- Description -->
      <v-textarea
        class="row"
        v-model="dataCollection.description"
        clearable
        label="Description"
        :rules="[rules.required]"
        clear-icon="mdi-close-circle"
        variant="outlined"
        rows="3"
      >
        <template v-slot:append-inner>
          <v-tooltip location="bottom">
            <template v-slot:activator="{ props }">
              <v-icon class="btn" v-bind="props" icon="mdi-help-circle-outline"></v-icon>
            </template>
            Enter a description for your dataset. Spaces, special characters, etc. are all
            allowed.
          </v-tooltip>
        </template>
      </v-textarea>
    </div>
    <div class="field-container">
      <!-- Keywords -->
      <v-combobox
        v-model="dataCollection.keywords"
        label="Keywords"
        variant="outlined"
        multiple
        class="row"
      >
        <template v-slot:chip="data">
          <v-chip
            :key="data.index"
            v-bind="data"
            :model-value="data"
            size="small"
            closable
            @click:close="removeKeyword(data.index)"
            :label="true"
          >
          </v-chip>
        </template>
        <template v-slot:append-inner>
          <v-tooltip location="bottom">
            <template v-slot:activator="{ props }">
              <v-icon class="btn" v-bind="props" icon="mdi-help-circle-outline"></v-icon>
            </template>
            List of keywords describing the Collection.
          </v-tooltip>
        </template>
      </v-combobox>
      <!-- Providers -->
      <v-combobox
        class="row"
        v-model="dataCollection.providers"
        label="Providers"
        variant="outlined"
        multiple
        chips
        item-title="name"
        :closable-chips="true"
        readonly
      >
        <template v-slot:chip="data">
          <v-chip
            :key="data.index"
            v-bind="data"
            :model-value="data"
            size="small"
            closable
            @click="updateProviderDialog(data.index, data.item.raw)"
            class="btn"
            @click:close="removeProvider(data.index)"
            :label="true"
          >
          </v-chip>
        </template>
        <template v-slot:append-inner>
          <v-tooltip location="bottom">
            <template v-slot:activator="{ props }">
              <v-icon
                class="btn"
                @click="addProviderDialog()"
                v-bind="props"
                icon="mdi-plus"
              ></v-icon>
            </template>
            <!-- List of keywords describing the Collection. -->
          </v-tooltip>
        </template>
      </v-combobox>
      <!-- Extensions -->
      <v-select
        chips
        label="Extensions"
        v-model="dataCollection.stac_extensions"
        :items="extensions"
        item-text="label"
        item-value="value"
        item-title="label"
        variant="outlined"
        class="row"
        :closable-chips="true"
        multiple
      >
        <template v-slot:chip="data">
          <v-chip
            :key="data.index"
            v-bind="data"
            :model-value="data"
            size="small"
            closable
            @click:close="removeExtension(data.index)"
            :label="true"
          >
          </v-chip>
        </template>
      </v-select>
      <!-- Assets -->
      <v-combobox
        class="row"
        v-model="collectionAssets"
        label="Assets"
        variant="outlined"
        multiple
        chips
        item-title="name"
        :closable-chips="true"
        readonly
      >
        <template v-slot:chip="data">
          <v-chip
            :key="data.index"
            v-bind="data"
            :model-value="data"
            size="small"
            closable
            @click="updateAssetDialog(data.item.raw)"
            class="btn"
            @click:close="removeAsset(data.item.raw.name)"
            :label="true"
          >
          </v-chip>
        </template>
        <template v-slot:append-inner>
          <v-tooltip location="bottom">
            <template v-slot:activator="{ props }">
              <v-icon
                class="btn"
                @click="addAssetDialog()"
                v-bind="props"
                icon="mdi-plus"
              ></v-icon>
            </template>
            <!-- List of keywords describing the Collection. -->
          </v-tooltip>
        </template>
      </v-combobox>
      <!-- Item Assets -->
      <v-combobox
        class="row"
        v-model="collectionItemAssets"
        label="Item Assets"
        variant="outlined"
        multiple
        chips
        item-title="name"
        :closable-chips="true"
        readonly
      >
        <template v-slot:chip="data">
          <v-chip
            :key="data.index"
            v-bind="data"
            :model-value="data"
            size="small"
            closable
            @click="updateItemAssetDialog(data.item.raw)"
            class="btn"
            @click:close="removeItemAsset(data.item.raw.name)"
            :label="true"
          >
          </v-chip>
        </template>
        <template v-slot:append-inner>
          <v-tooltip location="bottom">
            <template v-slot:activator="{ props }">
              <v-icon
                class="btn"
                @click="addItemAssetDialog()"
                v-bind="props"
                icon="mdi-plus"
              ></v-icon>
            </template>
            <!-- List of keywords describing the Collection. -->
          </v-tooltip>
        </template>
      </v-combobox>
      <!-- Extents -->
      <div>
        <v-card variant="outlined" class="row-card">
          <v-card-text>
            <v-card-title class="title"> Extent </v-card-title>
            <v-card-text>
              <div class="d-flex flex-row">
                <div class="extent-field-title">Spatial bbox</div>
                <div class="d-flex flex-row bbox w-100">
                  <v-text-field
                    v-model="minX"
                    min="-180"
                    max="180"
                    label="Min x"
                    type="number"
                    variant="outlined"
                    :rules="[rules.required, rules.X]"
                  />
                  <v-text-field
                    v-model="minY"
                    :rules="[rules.required, rules.Y]"
                    label="Min y"
                    type="number"
                    variant="outlined"
                  />
                  <v-text-field
                    v-model="maxX"
                    :rules="[rules.required, rules.X]"
                    type="number"
                    label="Max x"
                    variant="outlined"
                  />
                  <v-text-field
                    v-model="maxY"
                    :rules="[rules.required, rules.Y]"
                    type="number"
                    label="Max y"
                    variant="outlined"
                  />
                </div>
              </div>
            </v-card-text>
            <!-- // -->
            <v-card-text>
              <div class="d-flex flex-row">
                <div class="extent-field-title">Temporal</div>
                <div class="d-flex flex-row bbox w-100">
                  <v-text-field
                    v-model="dateStarted"
                    type="date"
                    label="Date Started"
                    variant="outlined"
                  />
                  <v-text-field
                    v-model="dateFinished"
                    type="date"
                    label="Date Finished"
                    variant="outlined"
                  />
                </div>
              </div>
            </v-card-text>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </div>
  <ProviderDialog ref="providerDialog" @submit="updateProvider" />
  <AssetDialog ref="assetDialog" @submit="updateAsset" />
  <ItemAssetDialog ref="itemAssetDialog" @submit="updateItemAsset" />
  <LinkDialog ref="linkDialog" @submit="updateLink" />
</template>
<script>
import CollectionApi from "@/api/CollectionApi";
import dataCollection from "@/store/modules/dataCollection";
import moment from "moment";
import { mapGetters } from "vuex";
import AssetDialog from "./dialog/asset-dialog.vue";
import ItemAssetDialog from "./dialog/item-asset-dialog.vue";
import LinkDialog from "./dialog/link-dialog.vue";
import ProviderDialog from "./dialog/provider-dialog.vue";
export default {
  components: {
    ProviderDialog,
    AssetDialog,
    ItemAssetDialog,
    LinkDialog,
  },
  data: () => ({
    keyword: "",
    dialog: false,
    value: "",
    platforms: [],
    dateStarted: null,
    dateFinished: null,
    rules: {
      required: (value) => !!value || (value && value.length > 0) || "Required.",
      max255: (value) =>
        value === null ||
        (typeof value === "string" && value.length <= 255) ||
        value === "" ||
        "Max 255 characters",
      nospaces: (value) => (value && !value.includes(" ")) || "No spaces",
      nospecial: (value) =>
        (value && !/[^a-zA-Z0-9]/.test(value)) || " No special characters",
      nospecial_expect: (value) =>
        /^[a-zA-Z0-9.\-_+]+$/.test(value) || "No special characters except .-+_",
      X: (value) => (value <= 180 && value >= -180) || "X should be in range [-180,180]",
      Y: (value) => (value <= 90 && value >= -90) || "Y should be in range [-90,90]",
    },
    selectKey: [],
    extensions: [
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
    ],
  }),
  props: {
    isUpdate: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    this.getPlatforms();
    this.updateDate();
  },
  computed: {
    ...mapGetters(["dataCollection"]),
    collectionAssets: {
      get() {
        const assets = this.dataCollection.assets;

        if (assets && Object.keys(assets).length > 0) {
          return Object.keys(assets).map((key) => {
            const value = assets[key];
            return {
              name: key,
              ...value,
            };
          });
        } else {
          return [];
        }
      },
    },
    collectionItemAssets: {
      get() {
        const item_assets = this.dataCollection.item_assets;

        if (item_assets && Object.keys(item_assets).length > 0) {
          return Object.keys(item_assets).map((key) => {
            const value = item_assets[key];
            return {
              name: key,
              ...value,
            };
          });
        } else {
          return [];
        }
      },
    },
    minX: {
      get() {
        if (this.dataCollection.extent) {
          return this.dataCollection.extent.spatial.bbox[0][0];
        }
      },
      set(value) {
        this.dataCollection.extent.spatial.bbox[0][0] = Number(value);
      },
    },
    minY: {
      get() {
        if (this.dataCollection.extent) {
          return this.dataCollection.extent.spatial.bbox[0][1];
        }
      },
      set(value) {
        this.dataCollection.extent.spatial.bbox[0][1] = Number(value);
      },
    },
    maxX: {
      get() {
        if (this.dataCollection.extent) {
          return this.dataCollection.extent.spatial.bbox[0][2];
        }
      },
      set(value) {
        this.dataCollection.extent.spatial.bbox[0][2] = Number(value);
      },
    },
    maxY: {
      get() {
        if (this.dataCollection.extent) {
          return this.dataCollection.extent.spatial.bbox[0][3];
        }
      },
      set(value) {
        this.dataCollection.extent.spatial.bbox[0][3] = Number(value);
      },
    },
  },
  watch: {
    dataCollection: {
      handler(newValue, oldValue) {
        this.dataCollection.s3_meta = this.dataCollection.s3_meta || {};
      },
      deep: true,
    },
    dateStarted: {
      handler(newValue, oldValue) {
        if (newValue != "") {
          this.dataCollection.extent.temporal.interval[0][0] = moment(newValue)
            .utc()
            .format("YYYY-MM-DDTHH:mm:ss[Z]");
        } else {
          this.dataCollection.extent.temporal.interval[0][0] = null;
        }
      },
    },
    dateFinished: {
      handler(newValue, oldValue) {
        console.log(newValue);
        if (newValue != "") {
          this.dataCollection.extent.temporal.interval[0][1] = moment(newValue)
            .utc()
            .format("YYYY-MM-DDTHH:mm:ss[Z]");
        } else {
          this.dataCollection.extent.temporal.interval[0][1] = null;
        }
      },
    },
  },
  methods: {
    updateDate() {
      this.dateStarted = moment
        .utc(this.dataCollection.extent.temporal.interval[0][0])
        .format("YYYY-MM-DD");
      this.dateFinished = moment
        .utc(this.dataCollection.extent.temporal.interval[0][1])
        .format("YYYY-MM-DD");
      console.log(this.dateStarted);
    },
    // keyword
    removeKeyword(index) {
      this.dataCollection.keywords.splice(index, 1);
    },
    addKeyword() {
      this.dataCollection.keywords = this.dataCollection.keywords || [];
      if (this.dataCollection.keywords.includes(this.keyword.trim())) {
        this.$store.dispatch("notify", {
          type: "error",
          message: "Keyword already exists",
        });
        return;
      }
      if (this.keyword.trim() != "") {
        this.dataCollection.keywords.push(this.keyword.trim());
        this.keyword = "";
      }
    },
    // Providers
    addProviderDialog() {
      this.$refs.providerDialog.open("Add Provider", undefined, undefined);
    },

    updateProvider(index, provider) {
      this.dataCollection.providers = this.dataCollection.providers || [];
      if (
        this.dataCollection.providers.some(
          (element, i) => element.name === provider?.name && i !== index
        )
      ) {
        this.$store.dispatch("notify", {
          type: "error",
          message: "Name already exists",
        });
        return;
      }
      if (index != undefined) {
        this.dataCollection.providers[index] = provider;
      } else {
        this.dataCollection.providers.push(provider);
      }
      this.$refs.providerDialog.close();
    },
    updateProviderDialog(index, provider) {
      this.$refs.providerDialog.open("Update Provider", index, provider);
    },
    removeProvider(index) {
      this.dataCollection.providers.splice(index, 1);
    },
    //Extensions
    removeExtension(index) {
      this.dataCollection.stac_extensions.splice(index, 1);
    },
    //Assets
    addAssetDialog() {
      this.$refs.assetDialog.open("Add Asset", undefined, undefined);
    },
    updateAsset(name, asset) {
      this.dataCollection.assets = this.dataCollection.assets || {};
      if (this.dataCollection.assets && name in this.dataCollection.assets) {
        this.$store.dispatch("notify", {
          type: "error",
          message: "Name already exists",
        });
        return;
      } else {
        this.dataCollection.assets[name] = asset;
        this.$refs.assetDialog.close();
      }
    },
    updateAssetDialog(asset) {
      console.log(this.collectionAsset);
      this.$refs.assetDialog.open("Update Asset", asset);
    },
    removeAsset(name) {
      delete this.dataCollection.assets[name];
    },
    //Item Assets
    addItemAssetDialog() {
      this.$refs.itemAssetDialog.open("Add Item Asset", undefined, undefined);
    },
    removeItemAsset(name) {
      delete this.dataCollection.item_assets[name];
    },
    updateItemAsset(name, item_asset) {
      this.dataCollection.item_assets = this.dataCollection.item_asset || {};
      if (name in this.dataCollection.item_assets) {
        this.$store.dispatch("notify", {
          type: "error",
          message: "Name already exists",
        });
        return;
      } else {
        this.dataCollection.item_assets[name] = item_asset;
        this.$refs.itemAssetDialog.close();
      }
    },
    updateItemAssetDialog(item_asset) {
      this.$refs.itemAssetDialog.open("Update Item Asset", item_asset);
    },
    async getPlatforms() {
      const res = await CollectionApi.getPlatforms(null);
      this.platforms = res.data;
      console.log(this.platforms);
    },
    // Links
    addLinkDialog() {
      this.$refs.linkDialog.open("Add Link", undefined, undefined);
    },

    updateLink(index, link) {
      this.dataCollection.links = this.dataCollection.links || [];
      if (
        this.dataCollection.links.some(
          (element, i) => element.rel === link.rel && i !== index
        )
      ) {
        this.$store.dispatch("notify", {
          type: "error",
          message: "Rel already exists",
        });
        return;
      }
      if (index != undefined) {
        this.dataCollection.links[index] = link;
      } else {
        this.dataCollection.links.push(link);
      }
      this.$refs.linkDialog.close();
    },
    updateLinkDialog(index, link) {
      this.$refs.linkDialog.open("Update Link", index, link);
    },
    removeLink(index) {
      this.dataCollection.links.splice(index, 1);
    },
  },
};
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
  /* margin-left: 10px; */
  /* margin-right: 10px; */
  margin: 8px 0;
  height: max-content;
}

.row-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 8px;
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

.bbox > * {
  flex: 1;
  margin: 0 5px;
}

.title {
  padding: 0.5rem 0.25rem;
}

.extent-field-title {
  width: 80px !important;
}
</style>
