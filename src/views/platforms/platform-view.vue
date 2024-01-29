
import LinkDialogVue from '../collections/LinkDialog.vue';
<template>
    <div class="platform-container">
        <div class="d-flex justify-space-between align-center">
            <div class="w-50">
                <v-text-field v-model="search" :label="$t('Search items by ID')" clearable
                    prepend-inner-icon="ri-search-2-line"></v-text-field>
            </div>
            <v-space />
            <div class="text-end">
                <v-dialog v-model="createDialog" persistent width="512">
                    <template v-slot:activator="{ props }">
                        <v-btn color="primary" v-bind="props">
                            Create
                        </v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                            <span class="text-h5">Create Platform</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12">
                                        <v-text-field v-model="createName" label="Platform name" required></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue-darken-1" variant="text" @click="createDialog = false">
                                Close
                            </v-btn>
                            <v-btn color="blue-darken-1" variant="text" @click="create">
                                Save
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </div>
        </div>
            <Table :headers="headers" :items="items" :loading="loading" @viewItem="viewItem" :totalPage="totalPage"
                @nextPage="nextPage" @prevPage="prevPage" @setItemsPerPage="setItemsPerPage" @changePage="changePage"
                @editItem="editItem" @deleteItem="deleteItem" :totalItems="totalItems" />
              </div>
              <v-row justify="center">
                  <v-dialog v-model="dialogUpdate" persistent width="512">
                      <v-card>
                          <v-card-title>
                              <span class="text-h5">Update Platform</span>
                          </v-card-title>
                          <v-card-text>
                              <v-container>
                                  <v-row>
                                      <v-col cols="12">
                                          <v-text-field v-model="updateName" label="Platform name" required></v-text-field>
                                      </v-col>
                                  </v-row>
                              </v-container>
                          </v-card-text>
                          <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn color="blue-darken-1" variant="text" @click="dialogUpdate = false">
                                  Close
                              </v-btn>
                              <v-btn color="blue-darken-1" variant="text" @click="update">
                                  Save
                              </v-btn>
                          </v-card-actions>
                      </v-card>
                  </v-dialog>
              </v-row>
</template>

<script setup>
import PlatformApi from "@/api/PlatformApi";
import Table from "@/components/table/table-view.vue";
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
const search = ref("");
const headers = ref([]);
const items = ref([]);
const loading = ref(false);
const totalPage = ref();
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalItems = ref();
const dialogUpdate = ref(false);
const createName = ref();
const createDialog = ref(false);
const updateName = ref();
const itemNeedUpdate = ref(undefined);
let timeOut = null;
const store = useStore();
const { t } = useI18n();
const initData = () => {
    headers.value = [
        { title: t("ID"), value: "id" },
        { title: t("Name"), value: "name", sortable: true },
        {
            title: t("Actions"),
            value: "actions",
            sortable: false,
            class: "text-end",
            align: "end",
        },
    ];
};

const getItems = async () => {
    loading.value = true;
    const params = {
        search: search.value,
        page: currentPage.value,
        perPage: itemsPerPage.value,
    };
    const response = await PlatformApi.getAll(params);
    const result = response.data;
    totalPage.value = result.totalPage;
    totalItems.value = result.total;
    items.value = result.data;
    loading.value = false;
};

const create = async () => {
    try {
        await PlatformApi.create({ name: createName.value });
        getItems();
    } catch (err) {
        store.dispatch("notify", {
            type: "error",
            message: err.response.data.err,
        });
    } finally {
        createDialog.value = false;
        createName.value = undefined;
    }
}

const deleteItem = async (item) => {
    try {
        await PlatformApi.delete({ id: item.id });
        store.dispatch("notify", {
            type: "success",
            message: "Delete success!",
        });
        getItems();
    } catch {
        store.dispatch("notify", {
            type: "error",
            message: "Delete fail!",
        });
    }
};

const editItem = async (item) => {
    dialogUpdate.value = true;
    updateName.value = item.name;
    itemNeedUpdate.value = item;
}

const update = async () => {
    try {
        await PlatformApi.update({ id: itemNeedUpdate.value.id, name: updateName.value });
        store.dispatch("notify", {
            type: "success",
            message: "Update success!",
        });
        getItems();
    } catch (err) {
        store.dispatch("notify", {
            type: "error",
            message: err.response.data.err,
        });
    } finally {
        dialogUpdate.value = false;
    }
}

const nextPage = () => {
    currentPage.value++;
};

const prevPage = () => {
    currentPage.value--;
};

const changePage = (val) => {
    currentPage.value = val;
};

const setItemsPerPage = (number) => {
    itemsPerPage.value = number;
};

onMounted(() => {
    initData();
    getItems();
});

watch(search, () => {
    if (timeOut) {
        clearTimeout(timeOut);
    }
    timeOut = setTimeout(() => {
        getItems();
    }, 300);
});
watch(currentPage, () => {
    if (timeOut) {
        clearTimeout(timeOut);
    }
    timeOut = setTimeout(() => {
        getItems();
    }, 300);
});
watch(itemsPerPage, () => {
    if (timeOut) {
        clearTimeout(timeOut);
    }
    timeOut = setTimeout(() => {
        getItems();
    }, 300);
});
</script>

<style scoped>
  .platform-container {
    position: relative;
    display: flex;
    flex-direction: column;
    block-size: 100%;
    inline-size: 100%;
    padding-block: 0 40px;
    padding-inline: 32px;
  }

</style>
../../api/CollectionApi.js
