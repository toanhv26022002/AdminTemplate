import config from "@/config"
import axios from "axios"

export default class BaseApi {
  getToken() {
    return window.localStorage.getItem("access_token")
  }
  deleteToken() {
    window.localStorage.removeItem("access_token")
  }
  setToken(token) {
    window.localStorage.setItem("access_token", token)
  }

  static submit(method, url, params = {}, configRequest = {}) {
    if (!url.includes("https://") && !url.includes("http://")) {
      url = config.url_backend + url
    }
    configRequest = {
      method: method,
      url: url,
      params: method === "get" || method === "GET" ? params : "",
      data: method !== "get" && method !== "GET" ? params : "",
      headers: {
        "Content-Type": "application/json",
      },
      ...configRequest,
    }
    
    return axios(configRequest)
  }

  submitAuth(method, url, params = {}, configRequest = {}) {
    if (!url.includes("https://") && !url.includes("http://")) {
      url = config.url_backend + url
    }

    const token = this.getToken()

    configRequest = {
      method: method,
      url: url,
      params: method === "get" || method === "GET" ? params : "",
      data: method !== "get" && method !== "GET" ? params : "",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      ...configRequest,
    }
    
    return axios(configRequest)
  }
}
