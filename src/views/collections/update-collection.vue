<template>
  <div class="header">
    <div class="d-flex flex-row align-center">
      <v-icon @click="$router.back()">mdi-arrow-left</v-icon>
      <h1>{{ $t("Update Collection") }}</h1>
    </div>
    <v-switch
      v-model="showEditor"
      class="btnChange"
      color="primary"
      label="Editor"
      value="true"
      @change="change"
      hide-details
    ></v-switch>
    <v-btn class="btnSave" color="primary" @click="save">{{ $t("Update") }}</v-btn>
  </div>
  <v-card class="card">
    <template v-if="showEditor">
      <div class="container_swap">
        <input class="div_left" type="checkbox" v-model="lineNumbers" /> Linenumbers
        <v-switch
          class="div_right"
          v-model="backgroundLight"
          color="primary"
          value="true"
          :label="$t('Dark Mode')"
          @change="changeBackground"
          hide-details
        ></v-switch>
      </div>

      <vue-monaco-editor
        v-model:value="codeData"
        theme="vs-dark"
        :options="options"
        defaultLanguage="json"
      />
    </template>
    <template v-else>
      <CollectionForm :isUpdate="true"></CollectionForm>
    </template>
  </v-card>

  <ConfirmDialog
    :visible="isDialogConfirm"
    @visible-changed="handleDialogVisibilityChange"
    @cancel="handleCancel"
    @confirm="handleConfirm"
    title="Confirm"
    content="Do you want to update this collection?"
    okButtonText="OK"
    width="400"
    color="red"
  />
</template>

<script>
import CollectionApi from "@/api/CollectionApi";
import ConfirmDialog from "@/components/confirm-dialog/ConfirmDialog.vue";
import { mapActions, mapGetters } from "vuex";
import CollectionForm from "./collection-form.vue";
export default {
  components: {
    CollectionForm,
    ConfirmDialog,
  },
  // props:()=>{
  //     id = defineProps(['id']);
  // },
  data: () => ({
    options: {
      automaticLayout: true,
      formatOnType: true,
      formatOnPaste: true,
    },
    codeData: null,
    lineNumbers: true,
    showEditor: false,
    switch: "Form",
    isDialogConfirm: false,
    backgroundLight: true,
    editorBackground: "#f2f5f8",
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
  }),

  async created() {
    this.codeData = JSON.stringify(this.dataCollection, null, 2);
    this.fetchCollection();
  },
  computed: {
    ...mapGetters(["dataCollection"]),
  },
  methods: {
    ...mapActions(["saveData", "btnChange"]),
    highlighter(codeData) {
      return highlight(codeData, languages.js);
    },
    change() {
      if (this.showEditor) {
        this.btnChange(this.dataCollection);
        this.codeData = JSON.stringify(this.dataCollection, null, 2);
      } else {
        const dataCollection = JSON.parse(this.codeData);
        this.btnChange(dataCollection);
      }
    },
    async save() {
      try {
        if (this.showEditor) {
          const dataCollection = JSON.parse(this.codeData);
          this.btnChange(dataCollection);
          console.log(this.dataCollection);
        }
        if (!this.validate()) {
          return;
        } else {
          this.isDialogConfirm = true;
        }
      } catch (error) {
        this.$store.dispatch("notify", {
          type: "error",
          message: "Please enter correct json configuration!",
        });
      }
    },
    async fetchCollection() {
      const response = await CollectionApi.getCollection(this.$route.params.collection);
      this.btnChange(response.data);
      console.log(this.dataCollection);
    },
    validate() {
      if (
        !this.dataCollection.platform ||
        (this.dataCollection.platform && this.dataCollection.platform.trim().length === 0)
      ) {
        this.$store.dispatch("notify", {
          type: "error",
          message: "Platform is required",
        });
        return false;
      }
      if (
        this.dataCollection.id == null ||
        (this.dataCollection.id && this.dataCollection.id.trim().length === 0)
      ) {
        this.$store.dispatch("notify", {
          type: "error",
          message: "ID is required",
        });
        return false;
      }
      if (
        !this.dataCollection.license ||
        (this.dataCollection.license && this.dataCollection.license.trim() == "") ||
        this.dataCollection.license == null
      ) {
        this.$store.dispatch("notify", {
          type: "error",
          message: "License is required",
        });
        return false;
      }
      if (
        !this.dataCollection.description ||
        (this.dataCollection.description &&
          this.dataCollection.description.trim().length === 0)
      ) {
        this.$store.dispatch("notify", {
          type: "error",
          message: "Description is required",
        });
        return false;
      }
      if (
        !this.dataCollection.assets ||
        Object.keys(this.dataCollection.assets).length === 0
      ) {
        this.$store.dispatch("notify", {
          type: "error",
          message: "Assets is required",
        });
        return false;
      }
      if (
        !this.dataCollection.extent ||
        !this.dataCollection.extent.spatial ||
        !this.dataCollection.extent.spatial.bbox
      ) {
        this.$store.dispatch("notify", {
          type: "error",
          message: "Fields's spatial is required",
        });
        return false;
      }
      if (
        !this.dataCollection.extent ||
        !this.dataCollection.extent.temporal ||
        !this.dataCollection.extent.temporal.interval
      ) {
        this.$store.dispatch("notify", {
          type: "error",
          message: "Fields's spatial is required",
        });
        return false;
      }

      if (
        this.dataCollection.id &&
        this.rules.nospecial_expect(this.dataCollection.id.trim()) != true
      ) {
        this.$store.dispatch("notify", {
          type: "error",
          message: "ID doesn't include special characters",
        });
        return false;
      }
      if (
        this.dataCollection.id &&
        this.rules.nospaces(this.dataCollection.id.trim()) != true
      ) {
        this.$store.dispatch("notify", {
          type: "error",
          message: "ID doesn't include spaces",
        });
        return false;
      }
      if (
        this.dataCollection.title &&
        this.rules.max255(this.dataCollection.title.trim()) != true
      ) {
        this.$store.dispatch("notify", {
          type: "error",
          message: "Title is max 255 characters",
        });
        return false;
      }

      return true;
    },
    changeBackground() {
      if (this.backgroundLight) {
        this.editorBackground = "#2d2d2d";
      } else {
        this.editorBackground = "#f2f5f8";
      }
    },
    async handleConfirm() {
      try {
        const response = await CollectionApi.updateCollection(
          this.dataCollection.id,
          this.dataCollection
        );
        console.log(response);
        this.$router.back();
        this.isDialogConfirm = false;
        this.$store.dispatch("notify", {
          type: "success",
          message: response.data.message,
        });
      } catch (error) {
        console.log(error.response && error.response.status === 400);
        if (error.response && error.response.status === 400) {
          const errorMessage = error.response.data?.error;
          this.$store.dispatch("notify", {
            type: "error",
            message: errorMessage,
          });
        } else {
          this.$store.dispatch("notify", {
            type: "error",
            message: "An error occurred while updating the collection",
          });
        }
      }
    },

    handleCancel() {
      this.isDialogConfirm = false;
    },
  },
};
</script>

<style lang="scss">
.my-editor {
  background: #f2f5f8;
  //color: #0c0820;
  height: calc(100vh - 300px);
  font-family: Fira data, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px;
}

// optional
.prism-editor__textarea:focus {
  outline: none;
}

h1 {
  margin: 20px;
}

.card {
  margin: 20px;
  margin-top: 5px !important;
  padding: 20px;
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
