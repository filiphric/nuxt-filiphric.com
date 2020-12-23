// States
export const state = () =>({

    toggleMenu: false

})

// mutations
export const mutations = {

    TOGGLE_MENU(state) {
        state.toggleMenu = !state.toggleMenu
    }

}

// actions
export const actions = {

    toggleMenu({ commit }) {
       commit('TOGGLE_MENU')
    }

}

// Getters
export const getters = {

    toggleMenu: state => state.toggleMenu,

}