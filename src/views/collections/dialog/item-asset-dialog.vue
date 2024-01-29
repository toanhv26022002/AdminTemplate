<template>
  <div class="dialog-container">
    <v-dialog
      v-model="dialogVisible"
      persistent
      class="dialog-container"
      width="1000px"
    >
      <v-card>
        <v-form @submit.prevent>
          <v-card-title class="text-h5 grey lighten-2">
            {{ title }}
          </v-card-title>
          <div class="d-flex flex-row">
            <v-card-text class="card-text">
              <v-text-field
                v-model="name"
                label="Name"
                :disabled="isUpdate"
                variant="outlined"
                class="mb-3 mt-3"
                :rules="[rules.required, rules.max255]"
                @keyup.enter="this.$refs.title.focus()"
              />
              <v-text-field
                v-model="itemAsset.title"
                label="Title"
                variant="outlined"
                class="mb-3"
                :rules="[rules.max255]"
                @keyup.enter="this.$refs.type.focus()"
                ref="title"
              />
              <v-select
                v-model="itemAsset.type"
                :items="types"
                label="Type"
                class="mb-3"
                variant="outlined"
                @keyup.enter="this.$refs.roles.focus()"
                ref="type"
              />

              <!-- Role -->
              <v-combobox
                v-model="itemAsset.roles"
                :items="roles"
                label="Roles"
                variant="outlined"
                multiple
                ref="roles"
              >
                <template v-slot:chip="data">
                  <v-chip
                    v-if="data.item.title"
                    :key="JSON.stringify(data.item)"
                    v-bind="data.attrs"
                    :disabled="data.disabled"
                    size="small"
                    @update:model-value="updateRoles"
                    @click:close="removeRole(data.index)"
                    :label="true"
                    closable
                  >
                  </v-chip>
                </template>
              </v-combobox>
              <input
                type="checkbox"
                v-model="isAddOptions"
              />
              Additional properties
            </v-card-text>

            <div v-show="isAddOptions">
              <VueMonacoEditor
                class="my-editor"
                v-model="codeData"
                :highlight="highlighter"
                :style="{ background: editorBackground }"
                :line-numbers="lineNumbers"
              ></VueMonacoEditor>
            </div>
          </div>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              @click="close"
            >
              Cancel
            </v-btn>
            <v-btn
              type="submit"
              color="primary"
              text
              @click="submit"
            >
              Submit
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <RasterBandDialog
      ref="rasterBandDialog"
      @submit="updateRasterBand"
    ></RasterBandDialog>
  </div>
</template>
<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
import RasterBandDialog from './raster-band-dialog.vue'
export default {
  components: {
    RasterBandDialog,
  },
  data() {
    return {
      dialogVisible: false,
      title: 'Asset',
      itemAsset: {
        title: '',
        type: '',
        'eo:bands': [],
        'raster:bands': [],
        roles: [],
      },
      rules: {
        required: value => !!value || (value && value.length > 0) || 'Required.',
        max255: value =>
          value === null || (typeof value === 'string' && value.length <= 255) || value === '' || 'Max 255 characters',
      },
      name: '',
      role: null,
      key: undefined,
      types: ['image/tiff; application=geotiff; profile=cloud-optimized', 'application/xml'],
      roles: ['thumbnail', 'overview', 'data', 'metadata'],
      eoBands: [],
      isUpdate: false,
      isAddOptions: true,
      codeData: null,
    }
  },
  created() {
    this.resetForm()
  },
  computed: {
    ...mapGetters(['dataCollection']),
    hasRasterExt: {
      get() {
        return this.dataCollection.stac_extensions.includes(
          'https://stac-extensions.github.io/raster/v1.0.0/schema.json',
        )
      },
    },
  },
  methods: {
    open(title, itemAsset, eoBands) {
      this.dialogVisible = true
      this.title = title
      if (itemAsset) {
        console.log(itemAsset)
        this.name = itemAsset.name
        this.isUpdate = true
        this.itemAsset = _.cloneDeep(itemAsset)
        delete this.itemAsset.name
      }
      this.eoBands = eoBands
    },

    submit() {
      if (!this.validate()) {
        return
      }
      this.$emit('submit', this.name, this.itemAsset)
    },
    validate() {
      if (this.rules.required(this.name.trim()) != true) {
        return false
      }
      if (this.rules.max255(this.name.trim()) != true) {
        return false
      }
      if (this.rules.max255(this.itemAsset.title.trim()) != true) {
        return false
      }

      return true
    },

    close() {
      this.resetForm()
      this.dialogVisible = false
    },

    removeRole(index) {
      this.roles.splice(index, 1)
    },

    removeEOBand(index) {
      this.itemAsset['raster:bands'].splice(index, 1)
    },
    updateRoles(value) {
      this.role = value
    },
    resetForm() {
      ;(this.itemAsset = {
        title: '',
        type: '',
        'eo:bands': [],
        'raster:bands': [],
        roles: [],
      }),
        (this.name = '')
      this.isUpdate = false
      this.role = null
    },
    // Raster Bands
    updateRasterBand(index, rasterBand) {
      if (index != undefined) {
        this.itemAsset['raster:bands'][index] = rasterBand
      } else {
        this.itemAsset['raster:bands'].push(rasterBand)
      }
      this.$refs.rasterBandDialog.close()
    },
    addRasterBandDialog() {
      this.$refs.rasterBandDialog.open('Add Raster Band', undefined, undefined)
    },
    updateRasterBandDialog(index, rasterBand) {
      this.$refs.rasterBandDialog.open('Update Raster Band', index, rasterBand)
    },
    removeRasterBand(index) {
      this.itemAsset['raster:bands'].splice(index, 1)
    },
    formatSelection(item) {
      return `nodata: ${item.nodata}, data_type: ${item.data_type}, spatial_resolution: ${item.spatial_resolution}`
    },
  },
}
</script>
<style scoped>
.my-editor {
  display: flex;
  margin: 10px;
  background: #2d2d2d;
  color: #ccc;
  height: 500px !important;
  width: 500px !important;
  font-family: Fira data, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px;
}
.dialog-container {
  display: flex;
}
</style>
