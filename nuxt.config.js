export default {
  // Target (https://go.nuxtjs.dev/config-target)
  target: "static",
  extractCSS: true,

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: "filiphric.com",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    "@/assets/css/fonts.css",
    "@/assets/css/main.css",
    "@/assets/css/prism.css",

  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [{ src: "~/plugins/prism" }],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/tailwindcss
    "@nuxtjs/tailwindcss", '@nuxtjs/google-analytics'
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: ["@nuxt/content", '@nuxtjs/feed'],

  // markdown files processing
  content: {
    liveEdit: false,
    markdown: {
      prism: {
        theme: false,
      },
    },
    rehypePlugins: ['rehype-sanitize'],
  },
  // rss feed
  feed () {
    const baseUrlArticles = 'https://filiphric.com/'
    const baseLinkFeedArticles = '/feed/'
    const feedFormats = {
      rss: { type: 'rss2', file: 'rss.xml' }
    }
    const { $content } = require('@nuxt/content')

    const createFeedArticles = async function (feed) {
      feed.options = {
        title: 'Filip Hric',
        description: 'I write about technology',
        link: baseUrlArticles,
      }
      const articles = await $content('posts').fetch()

      articles.forEach((article) => {
        const url = `${baseUrlArticles}/${article.slug}`

        feed.addItem({
          title: article.title,
          id: url,
          link: url,
          date: article.published,
          description: article.summary,
          content: article.summary,
          author: article.authors,
        })
      })
    }

    return Object.values(feedFormats).map(({ file, type }) => ({
      path: `${baseLinkFeedArticles}/${file}`,
      type: type,
      create: createFeedArticles,
    }))
  },

  // reading time info into the blog info
  hooks: {
    'content:file:beforeInsert': (document) => {
      if (document.extension === '.md') {
        const { text } = require('reading-time')(document.text)

        document.readingTime = text
      }
    }
  },

  googleAnalytics: {
    id: 'UA-178636938-1'
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},
};
