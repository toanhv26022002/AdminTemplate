import mapboxgl from "mapbox-gl"

const state = () => ({
  tokenMapbox: 'pk.eyJ1IjoidHJpZW5uZ3V5ZW4iLCJhIjoiY2xoNHV0cG1xMDI1NDNlczgxMnV1bWZqNyJ9.GcTfYm213EVxVNHWRU3Z_g',
  initCenter: [105.8369637, 21.0227396],
  map: undefined,
})

const getters = {

}

const mutations = {

}

const actions = {
  initMap({ state }, mapId) {
    mapboxgl.accessToken = state.tokenMapbox

    state.map = new mapboxgl.Map({
      container: mapId, // container ID
      // style: "mapbox://styles/mapbox/satellite-streets-v12", // style URL
      style: "mapbox://styles/mapbox/streets-v12", // style URL
      // style: "mapbox://styles/triennguyen/clrg5rlwj00he01qt1o9o0mv7", // style pink
      center: [state.initCenter[0], state.initCenter[1]], // hanoi
      zoom: 8, // starting zoom
      attributionControl: false,
    })

  },
  resizeMap({ state }) {
    // let timer = setInterval(() => {
    //     state.map.resize()
    // }, 10)
    setTimeout(() => {
      state.map.resize()

      // clearTimeout(timer);
    }, 300)
  },
}

const map = {
  state,
  getters,
  mutations,
  actions,
}

export default map
