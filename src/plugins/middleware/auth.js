import AuthApi from '@/api/AuthApi';
import config from '@/config';
import store from '@/store';

const requiredAuth = function({ isSuperUser } = { isSuperUser: false }) {
    return function(to, from, next) {
      const token = AuthApi.getToken();
      if (!token) {
        goToLogin();
      } else {
         AuthApi.getAuthMe ()
         .then(success => {
            store.commit("user/setUser", success.data);
            console.log(success.data)
            if (isSuperUser && !success.data.is_superuser) {
                next({ name: "forbidden" });
                return;
            }
            next();
          })
          .catch(e => {
            if (e.response.status === 400) {
             goToLogin();
            } else {
             next({ name: "forbidden" });
            }
          });
      }
    };
  };
  const goToLogin = () => {
    window.location.href =
      config.url_login + '/signIn.html' +
      "?redirect=" +
      window.location.origin +
      "/login-by-token?token=";
  };
  const logout = async () => {
    await AuthApi.logout();
    AuthApi.deleteToken();
  };

  export { goToLogin, logout, requiredAuth };

