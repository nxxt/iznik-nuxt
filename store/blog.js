const Parser = require('rss-parser')
const parser = new Parser()

export const state = () => ({
  posts: []
})

export const mutations = {
  add(state, payload) {
    state.posts = payload.posts
  }
}

export const getters = {
  posts: state => {
    console.log('Get posts', state.posts)
    return state.posts
  }
}

export const actions = {
  async fetch({ commit }, params) {
    const feed = await parser.parseURL(
      'https://www.ilovefreegle.org/medium.php'
    )

    commit('add', {
      posts: feed.items
    })
  }
}
