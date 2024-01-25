<template>
  <div class="header">
    <div class="d-flex flex-row align-center">
      <v-icon @click="$router.back()">mdi-arrow-left</v-icon>
      <h1>{{ $t("Create Collection") }}</h1>
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
    <v-btn class="btnSave" color="primary" @click="save">{{ $t("Create") }}</v-btn>
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

      <prism-editor
        class="my-editor"
        v-model="codeData"
        :highlight="highlighter"
        :style="{ background: editorBackground }"
        :line-numbers="lineNumbers"
      ></prism-editor>
    </template>
    <template v-else>
      <CollectionForm></CollectionForm>
    </template>
  </v-card>
  <ConfirmDialog
    :visible="isDialogConfirm"
    @visible-changed="handleDialogVisibilityChange"
    @cancel="handleCancel"
    @confirm="handleConfirm"
    title="Confirm"
    content="Do you want to create this collection?"
    okButtonText="OK"
    width="400"
    color="primary"
  />
  <!-- <CollectionForm @exchangeData="exchangeData" /> -->
</template>

<script>
import CollectionApi from "@/api/CollectionApi";
import ConfirmDialog from "@/components/confirm-dialog/ConfirmDialog.vue";
import "prismjs/components/prism-clike";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-tomorrow.css";
import { PrismEditor } from "vue-prism-editor";
import "vue-prism-editor/dist/prismeditor.min.css";
import { mapActions, mapGetters } from "vuex";
import CollectionForm from "./collection-form.vue";
export default {
  components: {
    PrismEditor,
    CollectionForm,
    ConfirmDialog,
  },
  data: () => ({
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

  created() {
    this.$store.dispatch("resetForm");
    this.codeData = JSON.stringify(this.dataCollection, null, 2);
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
    validate() {
      if (
        (this.dataCollection.platform &&
          this.dataCollection.platform.trim().length === 0) ||
        this.dataCollection.platform == null
      ) {
        this.$store.dispatch("notify", {
          type: "error",
          message: "Platform is required",
        });
        return false;
      }
      if (
        (this.dataCollection.id && this.dataCollection.id.trim().length === 0) ||
        this.dataCollection.id == null
      ) {
        this.$store.dispatch("notify", {
          type: "error",
          message: "ID is required",
        });
        return false;
      }
      if (
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
        (this.dataCollection.description &&
          this.dataCollection.description.trim().length === 0) ||
        this.dataCollection.description == null
      ) {
        this.$store.dispatch("notify", {
          type: "error",
          message: "Description is required",
        });
        return false;
      }
      if (
        Object.keys(this.dataCollection.assets).length === 0 ||
        !this.dataCollection.assets
      ) {
        this.$store.dispatch("notify", {
          type: "error",
          message: "Assets is required",
        });
        return false;
      }
      // if (Object.keys(this.dataCollection.item_assets).length === 0) {
      //     this.$store.dispatch("notify", {
      //         type: "error",
      //         message: "Spatial BBox is required",
      //     });
      //     return false;
      // }
      // if (this.dataCollection.temporal==null) {
      //     this.$store.dispatch("notify", {
      //         type: "error",
      //         message: "Temporal Interval is required",
      //     });
      //     return false;
      // }

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
        const response = await CollectionApi.createCollection(this.dataCollection);
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
            message: "An error occurred while creating the collection",
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
  background: #2d2d2d;
  color: #ccc;
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
