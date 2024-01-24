import BaseApi from "./BaseApi"
import config from "@/config";
class AuthApi extends BaseApi {
    //example
    // getSomething(params) {
    //     return super.submit('get', '/getst', params)
    // }
    async getAuthMe () {
        return this.submitAuth('get', '/auth/me');
        //return this.submitAuth('get',config.url_auth+ '/me');
      }
    
    logout(){
        return this.submitAuth('post',config.url_auth + '/logout')
    }
    
}

export default new AuthApi()