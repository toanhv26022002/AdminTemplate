export function initStore(store) {
    function getDefaultOptions() {
      return {
        message: "",
        border: "left",
        elevation: "6",
        color: undefined,
        icon: undefined,
        type: undefined,
        width: "480px"
      };
    }
  
    store.registerModule("notification", {
      state: () => ({
        notifications: []
      }),
  
      mutations: {
        ADD_NOTIFICATION(state, notification) {
          state.notifications.push(notification);
        },
  
        DELETE_NOTIFICATION(state, notification) {
          state.notifications.splice(
            state.notifications.indexOf(notification),
            1
          );
        }
      },
  
      actions: {
        /**
         *
         * @param {*} param0
         * @param {Object} options
         * @param {string} [options.message]
         * @param {string} [options.type] success|error|warning|info
         * @param {string} [options.icon]
         * @param {string} [options.width='480px']
         * @param {boolean} [options.dismissible=false]
         * @param {number} [options.timeout=3000]
         */
        notify({ commit }, options) {
          const notification = Object.assign(getDefaultOptions(), options);
  
          commit("ADD_NOTIFICATION", notification);
  
          setTimeout(() => {
            commit("DELETE_NOTIFICATION", notification);
          }, options.timeout || 3000);
        }
      }
    });
  }
  