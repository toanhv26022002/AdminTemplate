const state = () => ({
  dataCollection: {
    stac_version: "1.0.0",
    platform: null,
    s3_meta: {
      endpoint: null,
      access_key: null,
      secret_key: null,
      bucket: null,
    },
    id: null,
    type: "Collection",
    title: null,
    description: null,
    short_description: null,
    keywords: [],
    license: null,
    stac_extensions: [],
    providers: [],
    assets: {},
    item_assets: {},
    extent: {
      spatial: {
        bbox: [[-180.0, -90.0, 180.0, 90.0]],
      },
      temporal: {
        interval: [[null, null]],
      },
    },
    links: [],
  },
  // showEditor: true,
  // codeData: null
});

const getters = {
  dataCollection(state) {
    return state.dataCollection;
  },
};

const mutations = {
  resetForm(state) {
    state.dataCollection = {
      platform: null,
      s3_meta: {
        endpoint: null,
        access_key: null,
        secret_key: null,
        bucket: null,
      },
      id: null,
      stac_version: "1.0.0",
      type: "Collection",
      title: null,
      description: null,
      short_description: null,
      keywords: [],
      license: null,
      stac_extensions: [],
      providers: [],
      assets: {},
      item_assets: {},
      extent: {
        spatial: {
          bbox: [[-180.0, -90.0, 180.0, 90.0]],
        },
        temporal: {
          interval: [[null, null]],
        },
      },
      links: [],
    };
  },
  ensureForm(state) {
    const requiredFields = [
        'platform',
        's3_meta',
        'id',
        'type',
        'title',
        'description',
        'short_description',
        'keywords',
        'license',
        'stac_extensions',
        'stac_version',
        'providers',
        'assets',
        'item_assets',
        'extent',
        'links'
      ];
    
      // Duyệt qua từng trường
      requiredFields.forEach(field => {
        // Kiểm tra nếu trường không tồn tại hoặc là null, thêm nó vào đối tượng
        if (!state.hasOwnProperty(field) || state[field] === null) {
          state[field] = this.resetForm(field);
        }
      });
    
      return dataCollection;
  },
};

const actions = {
  btnChange({ state }, dataCollection) {
    console.log(state.dataCollection);
    state.dataCollection = dataCollection;
  },
  resetForm({ commit }) {
    commit('resetForm');
  },
};

const dataCollection = {
  state,
  getters,
  mutations,
  actions,
};

export default dataCollection;
