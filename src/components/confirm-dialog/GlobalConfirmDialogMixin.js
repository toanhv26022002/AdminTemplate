// GlobalConfirmDialogMixin.js
import ConfirmDialog from "@/components/confirm-dialog/ConfirmDialog.vue";
import { getCurrentInstance, onMounted, ref } from 'vue';

const confirmDialog = ref({
  props: {},
  events: {
    "visible-changed": undefined,
    confirm: undefined,
    cancel: undefined,
  },
  callbacks: {
    resolve: undefined,
    reject: undefined,
  },
});

onMounted(() => {
  const app = getCurrentInstance().app;

  // Confirm
  app.config.globalProperties.$confirm = (options) => {
    return new Promise((resolve, reject) => {
      confirmDialog.value.props = Object.assign(
        {},
        {
          visible: false,
          title: "Warning",
          content: "Do you want to delete?",
          okButtonText: "Delete",
          cancelButtonText: "Cancel",
          width: 300,
        },
        options
      );

      confirmDialog.value.props.visible = true;
      confirmDialog.value.callbacks.resolve = resolve;
      confirmDialog.value.callbacks.reject = reject;
    });
  };

  confirmDialog.value.events["visible-changed"] = onVisibleChanged;
  confirmDialog.value.events.confirm = onConfirm;
  confirmDialog.value.events.cancel = onCancelConfirmation;
});

function onVisibleChanged(visible) {
  confirmDialog.value.props.visible = visible;
}

function onConfirm() {
  if (confirmDialog.value.callbacks.resolve instanceof Function) {
    confirmDialog.value.callbacks.resolve();
    confirmDialog.value.props.visible = false;
  }
}

function onCancelConfirmation() {
  if (confirmDialog.value.callbacks.reject instanceof Function) {
    confirmDialog.value.callbacks.reject(new Error("Cancel Dialog"));
    confirmDialog.value.props.visible = false;
  }
}

export default {
  components: {
    ConfirmDialog,
  },
};
