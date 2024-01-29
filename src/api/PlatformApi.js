import BaseApi from "./BaseApi";

class PlatformApi extends BaseApi {
  getAll = (params) => {
    return this.submitAuth("get", "/stac/platforms", params);
  };
  create = (params) => {
    return this.submitAuth("post", "/stac/platforms", params);
  };
  update = (params) => {
    return this.submitAuth("put", "/stac/platforms", params);
  };
  delete = (params) => {
    return this.submitAuth("delete", "/stac/platforms", params);
  };
}

export default new PlatformApi();
