import moduleManager from 'service/module/manager.js'

const state = {
  layout: {},
  defaultLayout: {
    type: "horizontal-navigation"
  }
};

const mutations = {
  updateLayout (state, layout) {
    state.layout = layout || state.defaultLayout;
  }
};

const module = {
  module:{
    name: "layoutStore" ,
    state,
    mutations
  } ,
  getters: {
    layout: (state) => {
      return state.layoutStore.layout
    }
  },
  actions: {
    updateLayout({commit, state}, layout) {
      commit('updateLayout', layout);
    }
  }
};
moduleManager.addStore(module , 'layoutStore');

export default module




