import getRoutes from "./utils/getRoutes";

const hostname = process.env.NODE_ENV === 'production' ? 'https://filiphric.com' : 'http://localhost:3000'

let posts = [];

const constructFeedItem = async (post, hostname) => {
  const url = `${hostname}/${post.slug}`;
  return {
    title: post.title,
    id: url,
    link: url,
    description: post.description,
  }
}

const create = async (feed, args) => {
  const [filePath, ext] = args;
  feed.options = {
    title: "Filip Hric's Blog",
    description: "Cypress tips by filip Hric",
    link: `${hostname}/rss.${ext}`
  }
  const { $content } = require('@nuxt/content')
  if (posts === null || posts.length === 0)
    posts = await $content(filePath, {deep: true}).where({published: { $eq: true}}).fetch();

    for (const post of posts) {
      const feedItem = await constructFeedItem(post, hostname);
      feed.addItem(feedItem);
  }
  return feed;
}

export default {
  // Target (https://go.nuxtjs.dev/config-target)
  target: "static",
  extractCSS: true,

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    htmlAttrs: {
      lang: 'en'
    },
    titleTemplate: '%s - ' + 'Filip Hric',
    title: 'Filip Hric' || '',
    meta: [
      {
        charset: 'utf-8'
      },
      {
        name: 'viewport', content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
      {
        hid: "description",
        name: "description",
        content: "Filip Hric personal blog and Cypress.io courses and workshops",
      },
      {
        name: "keywords",
        content: "cypress, cypress.io, Filip Hric, course, workshop, how to, tutorial",
      },
    ],
    link: [
      {
        rel: "canonical",
        href: "https://filiphric.com",
      },
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      },
      {
        rel: 'apple-touch-icon',
        sizes: '192x192',
        href: '/android-chrome-192x192.png'
      },
      {
        rel: 'apple-touch-icon',
        sizes: '512x512',
        href: '/android-chrome-512x512.png'
      },
      {
        rel: 'alternate',
        type: 'application/rss+xml',
        title: 'Blog RSS Feed',
        href: '/rss.xml'
      }
    ],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    "@/assets/css/fonts.css",
    "@/assets/css/main.css",
    "@/assets/css/prism.css"
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
  modules: ["@nuxt/content", '@nuxtjs/feed', '@nuxtjs/sitemap'],

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

  // reading time info into the blog info
  hooks: {
    'content:file:beforeInsert': (document) => {
      if (document.extension === '.md') {
        const { text } = require('reading-time')(document.text)
        document.readingTime = text
      }
    }
  },

  feed: [
    {
      path: '/rss.xml',
      create,
      cacheTime: 1000 * 60 * 15,
      type: 'rss2',
      data: [ 'posts', 'xml' ]
    }
  ],

  googleAnalytics: {
    id: 'UA-178636938-1'
  },

  sitemap: {
      hostname,
      routes() {
        return getRoutes();
      }
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},
};
