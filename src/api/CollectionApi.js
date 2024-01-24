import BaseApi from "./BaseApi"

class CollectionApi extends BaseApi {
  getAll = params => {
    return this.submitAuth("get", "/stac/collections", params)
  }
  createCollection = data => {
    return this.submitAuth("post", "/stac/collections", data)
  }
  getPlatforms = params => {
    return this.submitAuth("get", "/stac/platforms", params)
  }
  getItems = params => {
    let body = {}
    if (params.collection) {
      body["collections"] = [params.collection]
    }
    if (params.search) {
      body["filter-lang"] = "cql2-json"

      body["filter"] = {
        op: "ilike",
        args: [
          {
            property: "id",
          },
          `%${params.search}%`,
        ],
      }
    }
    if (params.bodyRequestToNextPage) {
      body = { ...body, ...params.bodyRequestToNextPage }
    }
    if (params.bodyRequestToPrevPage) {
      body = { ...body, ...params.bodyRequestToPrevPage }
    }
    if (params.limit) {
      body["limit"] = params.limit
    }
    
    return this.submitAuth("post", "/stac/items", body)
  }
  updateCollection = (id, data) => {
    return this.submitAuth("put", `/stac/collection/${id}`, data)
  }
  getCollection = id => {
    return this.submitAuth("get", `/stac/collection/${id}`)
  }
  deleteCollection = id => {
    return this.submitAuth("delete", `/stac/collection/${id}`)
  }
}

export default new CollectionApi()
