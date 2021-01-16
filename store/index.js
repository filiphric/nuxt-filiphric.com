export const state = () => ({
  searching: false
})

export const mutations = {
  searchToggle (state, flag) {
    state.searching = flag
  }
}