<template>
  <div class="px-4 md:max-w-screen-md md:mx-auto">
    <h1 class="text-4xl font-mono font-bold mt-8 text-black">
      Blog
    </h1>
    <div class="mt-8 grid">
      <input
        v-model="query"
        type="search"
        placeholder="Search posts"
        autocomplete="off"
        class="search w-full h-10 inline-block mx-auto shadow-md p-2 font-mono font-semibold focus:outline-none place-self-start"
      >
    </div>
    <div class="h-full">
      <ul
        v-if="posts.length"
        class="mt-8"
      >
        <li
          v-for="(post, index) of posts"
          :key="post.slug"
          class="grid grid-cols-12 my-8"
        >
          <p class="hidden sm:block text-sm font-normal col-span-2 self-start justify-self-center p-2 mr-2 text-gray-400">
            {{ dateToYMD(new Date(post.date)) }}
          </p>
          <div
            class="col-span-12 sm:col-span-10 self-center relative"
          >
            <nuxt-link
              :to="`/${post.slug}`"
              :class="`font-mono text-2xl font-semibold pt-1 pb-1 relative w-full linkColor${getColor(index+1)}`"
            >
              {{ post.title }}
            </nuxt-link>
            <p class="font-sans font-thin text-base block pt-2">
              {{ post.description }}
            </p>
            <div class="my-2">
              <div
                v-for="tag in post.tags"
                :key="tag"
                :class="`text-xs font-normal px-3 py-1 inline-block mr-1 rounded-xl text-white text-center color${searchTag(tag)}`"
              >
                #{{ tag }}
              </div>
            </div>
          </div>
        </li>
      </ul>
      <div
        v-else
        class="h-full mt-4 ml-2 text-gray-500"
      >
        No posts were found.
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'blog',
  async asyncData({ params, error, $content }) {
    try {
      const posts = await $content("posts", {deep: true})
      .only(['title', 'description', 'tags', 'slug', 'date'])
      .without(['path', 'extenstion'])
      .where({published: { $eq: true}})
      .sortBy('date', 'desc')
      .fetch();
      const allTags = posts
        .map(p => { return p.tags }) // collect tags from all blogs
        .filter(Boolean)
        .flat(); // remove undefined

      // assign color 1 - 6
      const getColor = (i) => {
        if ((i - 6) <= 0) {
          return i;
        } else {
          return getColor(i - 6);
        }
      }

      const flatTags = [...new Set(allTags)]; // remove duplicates
      // assign colors
       const tags = flatTags.map( (tag, index) => {
        const color = getColor(index + 1)
        return { tag, color }
      })
      return { posts, tags };
    } catch (err) {
      error({
        statusCode: 404,
        message: "Page could not be found",
      });
    }
  },
  data () {
    return {
      query: '',
      posts: []
    }
  },
  head() {
    return {
      title: 'Blog'
    }
  },
  watch: {
    async query (query) {
      this.posts = await this.$content('posts', {deep: true})
        .only(['title', 'description', 'tags', 'slug', 'date'])
        .without(['path', 'extenstion'])
        .where({published: { $eq: true}})
        .sortBy('createdAt', 'asc')
        .search(query)
        .fetch()
    }
  },
  methods: {
    dateToYMD(date) {
      var strArray=['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      var d = date.getDate();
      var m = strArray[date.getMonth()];
      var y = date.getFullYear();
      return '' + (d <= 9 ? '0' + d : d) + ' ' + m + '\n' + y;
    },
    getColor(i) {
      if ((i - 6) <= 0) {
        return i;
      } else {
        return this.getColor(i - 6);
      }
    },
    searchTag(tagName) {
      return this.tags.find(t => t.tag === tagName).color
    }
  }
}
</script>

<style lang="postcss" scoped>

.search {
    @apply bg-gradient-to-t from-red to-red;
    text-decoration: none;
    background-position: 0% 100%;
    background-repeat: no-repeat;
    background-size: 0% 4px;
    transition: background-size .3s;
}

.search:focus {
  background-size: 100% 4px;
}
</style>