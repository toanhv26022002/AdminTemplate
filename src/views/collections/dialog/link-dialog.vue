<template>
  <v-dialog v-model="dialogVisible" persistent width="500">
      <v-card>
          <v-card-title class="text-h5 grey lighten-2">
              {{ title }}
          </v-card-title>
          <v-card-text>
              <v-text-field v-model="link.href" label="Href" variant="outlined" :rules="[rules.required, rules.href]" />
              <v-select v-model="link.rel" :items="rels" label="Rel" :rules="[rules.required]" variant="outlined" />
              <v-select v-model="link.type" :items="types" label="Type" variant="outlined" />

          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="close">
                  Cancel
              </v-btn>
              <v-btn color="primary" text @click="submit">
                  Submit
              </v-btn>
          </v-card-actions>
      </v-card>
  </v-dialog>
</template>
<script>
import _ from 'lodash';
export default {
  data() {
      return {
          // open: true,
          dialogVisible: false,
          title: "Link",
          link: {
              href: "",
              rel: [],
              type: [],

          },
          rel: null,
          index: undefined,
          types: [
              "application/geo+json",
              "application/json",
          ],
          rels: [
              "self", "root", "parent", "child", "items", "license", "derived_from"
          ],
          rules: {
              required: (value) => (!!value || (value && value.length > 0)) || "Required.",
              max255: (value) =>
                  (value === null || (typeof value === 'string' && value.length <= 255) || value === "") ||
                  "Max 255 characters",
              href: (value) =>
                  /^(https?:\/\/)?([\da-zA-Z.-]+)\.([a-zA-Z.]{2,6})([/\w.-]*)*\/?$/.test(value) ||
                  "Invalid link",

          },
      };
  },
  methods: {
      open(title, index, link) {
          this.dialogVisible = true;
          this.$nextTick(() => {
              this.title = title;
              this.index = index;
              if (link) {
                  this.link = _.cloneDeep(link);
              }
          });
      },

      submit() {
          if (!this.validate()) {
              return;
          }
          this.link.roles = this.role;
          console.log("link: ", this.link);
          this.$emit("submit", this.index, this.link);
      },
      updateRoles(value) {
          this.role = value;
      },
      validate() {
          if (this.link.href.trim() == "") {
              return false;
          }
          if (this.link.rel && this.link.rel == "") {
              return false;
          }
          if (this.link.title && this.rules.max255(this.link.title.trim()) != true) {
              return false;
          }
          if (this.rules.required(this.link.href.trim()) != true) {

              return false;
          }
          // else if (this.rules.max255(this.link.name.trim()) != true) {
          //     this.$store.dispatch("notify", {
          //         type: "error",
          //         message: "Name is max 255 characters",
          //     });
          //     return false;
          // }
          return true;
      },
      close() {
          this.resetForm()
          this.dialogVisible = false;
      },

      removeRole(index) {
          console.log(index);
          this.role.splice(index, 1);
      },

      resetForm() {
          this.link = {
              name: "",
              url: "",
              roles: [],
          };
          this.role = null;
      },
  },
};
</script>
