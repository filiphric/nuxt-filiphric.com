<template>
  <div class="px-4 md:max-w-screen-md md:mx-auto">
    <h1 class="text-4xl font-mono font-bold mt-8 text-black">
      Blog
    </h1>
    <div class="mt-8 grid">
      <Search/>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'blog',
  head() {
    return {
      title: 'Blog',
      link: [
        {
          rel: "canonical",
          href: `https://filiphric.com/blog`,
        },
      ]
    }
  },
  methods: {
    getColor(i) {
      if ((i - 6) <= 0) {
        return i;
      } else {
        return this.getColor(i - 6);
      }
    },
    searching () {
      return this.$store.state.searching
    }
  }
}
</script>