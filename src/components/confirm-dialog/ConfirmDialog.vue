<template>
  <v-dialog v-model="dialogVisible" :width="width">
    <v-card>
      <v-card-title class="background--primary-dark">
        <div>{{ $t(title) }}</div>
        <v-spacer />
      </v-card-title>

      <v-card-text class="pa-8">
        {{ $t(content) }}
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="btn-container">
        <v-btn style="flex:1" text @click="onCancel" :disabled="loading">
          {{ $t("Cancel") }}
        </v-btn>

        <v-btn style="flex:1" :color="color" @click="onConfirm" :loading="loading" :disabled="loading">
          {{ $t(okButtonText) }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    visible: { type: Boolean, default: false },
    title: { type: String, default: "Warning" },
    content: { type: String, default: "Do you want to delete?" },
    okButtonText: { type: String, default: "Delete" },
    width: { type: [Number, String], default: 300 },
    color: { type: String, default: "error" }
  },

  data() {
    return {
      loading: false
    };
  },

  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("visible-changed", val);
      }
    }
  },

  methods: {
    onCancel() {
      this.$emit("cancel");
      this.dialogVisible = false;
    },

    onConfirm() {
      this.$emit("confirm");
      this.dialogVisible = false;
      this.$nextTick(() => {
        console.log(1, this.dialogVisible);
      })
    },

    setLoading(val) {
      this.loading = val;
    }
  }
};
</script>
<style scoped lang="scss">
.btn-container {
  
  justify-content: space-around;

 
}
</style>
