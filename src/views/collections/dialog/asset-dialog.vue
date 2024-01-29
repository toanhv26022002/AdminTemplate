<template>
  <div class="text-center">
    <VDialog
      v-model="dialogVisible"
      persistent
      width="500"
    >
      <VCard>
        <VForm @submit.prevent>
          <VCardTitle class="text-h5 grey lighten-2">
            {{ title }}
          </VCardTitle>
          <VCardText>
            <VTextField
              class="mb-2"
              v-model="name"
              :rules="[rules.required, rules.max255]"
              label="Name"
              variant="outlined"
              :disabled="isUpdate"
            />
            <VTextField
              class="mb-2"
              v-model="asset.title"
              variant="outlined"
              label="Title"
            />
            <VSelect
              class="mb-2"
              v-model="asset.type"
              :items="types"
              variant="outlined"
              label="Type"
            />
            <VTextField
              class="mb-2"
              v-model="asset.href"
              variant="outlined"
              label="Href"
              :rules="[rules.required, rules.href]"
            />
            <VCombobox
              v-model="asset.roles"
              :items="roles"
              label="Roles"
              variant="outlined"
              multiple
              class="row"
              @update:model-value="updateRoles"
            >
              <template #chip="data">
                <VChip
                  v-if="data.item.title"
                  :key="JSON.stringify(data.item)"
                  v-bind="data.attrs"
                  :disabled="data.disabled"
                  size="small"
                  :label="true"
                  closable
                  @click:close="removeRole(data.index)"
                />
              </template>
              <template #append-inner>
                <VTooltip location="bottom">
                  <template #activator="{ props }">
                    <VIcon
                      v-bind="props"
                      icon="mdi-help-circle-outline"
                    />
                  </template>
                  List of keywords describing the Collection.
                </VTooltip>
              </template>
            </VCombobox>
          </VCardText>
          <VDivider />
          <VCardActions>
            <VSpacer />
            <VBtn
              color="primary"
              text
              @click="close"
            >
              Cancel
            </VBtn>
            <VBtn
              color="primary"
              type="submit"
              text
              @click="submit"
            >
              Submit
            </VBtn>
          </VCardActions>
        </VForm>
      </VCard>
    </VDialog>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  data() {
    return {
      dialogVisible: false,
      title: 'Asset',
      asset: {
        title: '',
        type: '',
        href: '',
        roles: [],
      },
      role: null,
      name: '',
      types: ['image/png', 'application/x-parquet', 'application/vnd+zarr'],
      roles: ['thumbnail', 'overview', 'data', 'metadata'],
      isUpdate: false,
      rules: {
        required: value => !!value || (value && value.length > 0) || 'Required.',
        max255: value =>
          value === null || (typeof value === 'string' && value.length <= 255) || value === '' || 'Max 255 characters',
        nospaces: value => (value && !value.includes(' ')) || 'No spaces',
        nospecial: value => (value && !/[^a-zA-Z0-9]/.test(value)) || ' No special characters',
        nospecial_expect: value => /^[a-zA-Z0-9.\-_+]+$/.test(value) || 'No special characters except .-+_',
        href: value => /^(https?:\/\/)?([\da-zA-Z.-]+)\.([a-zA-Z.]{2,6})([/\w.-]*)*\/?$/.test(value) || 'Invalid link',
      },
    }
  },
  methods: {
    open(title, asset) {
      console.log(asset)
      this.dialogVisible = true
      this.title = title
      if (asset) {
        this.name = asset.name
        this.isUpdate = true
        this.asset = _.cloneDeep(asset)
        delete this.asset.name
      }
    },

    submit() {
      if (!this.validate()) {
        return
      } else {
        this.asset.roles = this.role
        this.$emit('submit', this.name, this.asset)
      }
    },
    updateRoles(value) {
      this.role = value
    },
    validate() {
      if (this.rules.required(this.name.trim()) != true) {
        return false
      }
      if (this.rules.max255(this.name.trim()) != true) {
        return false
      }

      if (this.rules.required(this.asset.href.trim()) != true) {
        return false
      }

      if (this.rules.href(this.asset.href.trim()) != true) {
        return false
      }

      return true
    },

    close() {
      this.resetForm()
      this.dialogVisible = false
    },

    removeRole(index) {
      this.asset.roles.splice(index, 1)
    },

    resetForm() {
      this.asset = {
        title: '',
        type: '',
        href: '',
        roles: [],
      }
      this.name = ''
      this.isUpdate = undefined
      this.role = null
    },
  },
}
</script>
