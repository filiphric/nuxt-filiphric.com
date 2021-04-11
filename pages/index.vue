<template>
  <div>
    <div class="posts px-4 md:max-w-screen-md md:mx-auto">
      <h2 class="text-3xl font-mono font-extrabold">Newest on my blog:</h2>
      <p class="mt-2 font-light">
        Checkout latest posts or
        <nuxt-link to="/blog" class="linkColor6 font-semibold">
          search the whole blog page </nuxt-link
        >.
      </p>
      <div
        v-for="(post, index) in posts"
        :key="post.slug"
        data-cy="post"
        class="font-extrabold text-2xl text-black my-4"
      >
        <nuxt-link
          :to="`/${post.slug}`"
          :class="`font-mono pb-1 linkColor${index + 1}`"
          data-cy="home-blogTitle"
        >
          {{ post.title }}
        </nuxt-link>
        <p class="text-base my-2 font-light">
          {{ post.description }}
          <nuxt-link
            :to="`/${post.slug}`"
            :class="`font-semibold linkColor${index + 1}`"
          >
            Read more
          </nuxt-link>
        </p>
        <p class="text-sm font-normal">
          {{
            new Date(post.date).toLocaleDateString("en-gb", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          }}
          | {{ post.readingTime }}
        </p>
      </div>
      <div class="text-right mt-12 mb-4">
        <nuxt-link
          class="linkColor6 pb-1 text-xl font-semibold font-mono inline–block"
          to="/blog"
        >
          ...and there’s more. Click to continue reading.
        </nuxt-link>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  layout: "index",
  async asyncData({ params, error, $content }) {
    try {
      const posts = await $content("posts", { deep: true })
        .only(["title", "description", "tags", "slug", "date", "readingTime"])
        .without(["path", "extenstion"])
        .where({ published: { $eq: true } })
        .limit(5)
        .sortBy("date", "desc")
        .fetch();
      return { posts };
    } catch (err) {
      error({
        statusCode: 404,
        message: "Page could not be found",
      });
    }
  },
  head() {
    return {
      title: "Cypress.io tips",
    };
  },
  methods: {
    getColor(i) {
      if (i - 6 <= 0) {
        return i;
      } else {
        return this.getColor(i - 6);
      }
    },
  },
};
</script>