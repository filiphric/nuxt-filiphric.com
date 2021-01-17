<template>
<div class="min-w-screen-md">
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
        <div class="my-2 ">
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
  <ul v-else class="mt-8">
    <li
      class="grid grid-cols-12 my-8"
    >
      <p class="font-sans font-thin text-base block pt-2 col-span-12">
        No posts were found.
      </p>
    </li>
  </ul>
  </div>
</template>

<script>

export default {
  props: {
    posts: {
      type: Array,
      required: true
    },
    // tags: {
    //   type: Array,
    //   required: false
    // }
  },
  // data() {
  //   return {
  //   tags() {
  //     console.log('I’m actually doing something')
  //     console.log(this.posts)
  //     const allTags = this.posts
  //       .map(p => { return p.tags }) // collect tags from all blogs
  //       .filter(Boolean)
  //       .flat(); // remove undefined
  //     // assign color 1 - 6
  //     const getColor = (i) => {
  //       if ((i - 6) <= 0) {
  //         return i;
  //       } else {
  //         return getColor(i - 6);
  //       }
  //     }

  //     const flatTags = [...new Set(allTags)]; // remove duplicates
  //     // assign colors
  //       const tags = flatTags.map( (tag, index) => {
  //       const color = getColor(index + 1)
  //       return { tag, color }
  //     })
  //   },
  //   }
  // },
  computed: {
    allTags() {
      const allTags = this.posts
        .map(p => { return p.tags }) // collect tags from all blogs
        .filter(Boolean)
        .flat();

      const flatTags = [...new Set(allTags)]; // remove duplicates

      return flatTags
    },
    tags() {
      const getColor = (i) => {
        if ((i - 6) <= 0) {
          return i;
        } else {
          return getColor(i - 6);
        }
      }

      const tags = this.allTags.map( (tag, index) => {
        const color = getColor(index + 1);
        return { tag, color }
      })

      return tags
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

<style>

</style>