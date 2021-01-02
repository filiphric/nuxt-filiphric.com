export default {
  // Target (https://go.nuxtjs.dev/config-target)
  target: "static",
  extractCSS: true,

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
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
        content: "cypress, cypress.io, Filip Hric, course, workshop",
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
  modules: ["@nuxt/content", '@nuxtjs/feed', '@nuxtjs/markdownit', '@nuxtjs/sitemap'],

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
  feed: [
    {
      // this sets up where to find your rss feed - mine will be called feed.xml, and located in the root of my project
      path: '/feed.xml',
      // this function will be what sets the data that goes into feed.xml
      async create(feed) {
        // the main options of what the page is called, desc, and where to find it as a full path
        feed.options = {
          title: 'Filip Hric',
          description: 'Cypress tips by Filip Hric',
          link: 'https://www.filiphric.com/feed.xml',
        };

        // we're going to require the content module so we have access to $content, then we're going to fetch all of our posts. If you're using eslint in your project, you might need to ignore this line because it's requiring something inside a function. Will work just fine, it might yell at you though. :)

        // eslint-disable-next-line global-require
        const { $content } = require('@nuxt/content');

        // get all the posts we have
        const posts = await $content('posts').fetch();

        // then, we'll loop over each post and grab the data fields we want to show in our feed. The name of your fields might be different than mine - that depends on how your data is set up in your Content settings.
        posts.forEach((post) => {
          // the url of the post is set first
          const url = `https://www.filiphric.com/${post.slug}`;
          // then we do addItem, and give it all the details we want. You'll often see a date field here too - I don't have one because I don't post my dates on my posts.
          feed.addItem({
            title: post.title,
            id: url,
            link: url,
            description: post.blurb,
            // this is what we did in part two! Accessing that body text, that we converted into HTML
            content: post.bodyText,
          });
        });
      }, // this is the end of the create function

      // cacheTime sets how long the feed is cached - this is what they had in the feed-module example, and I've left it as is for now. Type sets what kind of feed it is - you can do atom or json as well.
      cacheTime: 1000 * 60 * 15,
      type: 'rss2',
    },
  ],

  // reading time info into the blog info
  hooks: {
    'content:file:beforeInsert': (document) => {
      if (document.extension === '.md') {
        const { text } = require('reading-time')(document.text)
        document.readingTime = text
      }

      const md = require('markdown-it')();
      if (document.extension === '.md') {
        // ignoring eslint again :) same warning as earlier
        // eslint-disable-next-line global-require
        const { text } = require('reading-time')(document.text);
        document.readingTime = text;
        // Now we pass our post's plain text into the md.render file, which will convert it into HTML
        // Then we store that value in our bodyText variable on our post
        const mdToHtml = md.render(document.text);
        document.bodyText = mdToHtml;
      }

    }
  },

  markdownit: {
    preset: 'default',
    linkify: true,
    breaks: true,
    use: ['markdown-it-div', 'markdown-it-attrs'],
  },

  googleAnalytics: {
    id: 'UA-178636938-1'
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},
};
