<template>
  <v-dialog
    v-model="dialogVisible"
    persistent
    width="500"
  >
    <v-card>
      <v-form @submit.prevent>
        <v-card-title class="text-h5 grey lighten-2">
          {{ title }}
        </v-card-title>
        <v-card-text>
          <v-text-field
            class="mb-2"
            v-model="provider.name"
            label="Name"
            variant="outlined"
            :rules="[rules.required, rules.max255]"
          />
          <v-text-field
            class="mb-2"
            label="URL"
            :rules="[rules.required, rules.max255, rules.href]"
            v-model="provider.url"
            variant="outlined"
            density="compact"
          ></v-text-field>
          <!-- <v-file-input label="URL" v-model="provider.url" variant="outlined" density="compact"></v-file-input> -->
          <v-combobox
            :items="roles"
            v-model="provider.roles"
            label="Roles"
            variant="outlined"
            multiple
            class="row"
            @update:model-value="updateRoles"
          >
            <template v-slot:chip="data">
              <v-chip
                v-if="data.item.title"
                :key="JSON.stringify(data.item)"
                v-bind="data.attrs"
                :disabled="data.disabled"
                size="small"
                @click:close="removeRole(data.index)"
                :label="true"
                closable
              >
              </v-chip>
            </template>
            <template v-slot:append-inner>
              <v-tooltip location="bottom">
                <template v-slot:activator="{ props }">
                  <v-icon
                    v-bind="props"
                    icon="mdi-help-circle-outline"
                  ></v-icon>
                </template>
                List of keywords describing the Collection.
              </v-tooltip>
            </template>
          </v-combobox>
        </v-card-text>
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
            color="primary"
            type="submit"
            text
            @click="submit"
          >
            Submit
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
<script>
import _ from 'lodash'
export default {
  data() {
    return {
      // open: true,
      dialogVisible: false,
      title: 'Provider',
      provider: {
        name: '',
        url: [],
        roles: [],
      },
      role: null,
      index: undefined,
      roles: ['licensor', 'producer', 'processor', 'host'],
      rules: {
        required: value => !!value || (value && value.length > 0) || 'Required.',
        max255: value =>
          value === null || (typeof value === 'string' && value.length <= 255) || value === '' || 'Max 255 characters',
        href: value => /^(https?:\/\/)?([\da-zA-Z.-]+)\.([a-zA-Z.]{2,6})([/\w.-]*)*\/?$/.test(value) || 'Invalid link',
      },
    }
  },
  methods: {
    open(title, index, provider) {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.title = title
        this.index = index
        console.log(provider)
        if (provider) {
          this.provider = _.cloneDeep(provider)
        }
      })
    },

    submit() {
      if (!this.validate()) {
        return
      }
      this.provider.roles = this.role
      console.log('provider: ', this.provider)
      this.$emit('submit', this.index, this.provider)
    },
    updateRoles(value) {
      this.role = value
    },
    validate() {
      if (this.provider.name.trim() == '') {
        return false
      } else if (this.rules.max255(this.provider.name.trim()) != true) {
        return false
      }
      return true
    },
    close() {
      this.resetForm()
      this.dialogVisible = false
    },

    removeRole(index) {
      console.log(index)
      this.role.splice(index, 1)
    },

    resetForm() {
      this.provider = {
        name: '',
        url: '',
        roles: [],
      }
      this.role = null
    },
  },
}
</script>
