<template>
  <article class="post container max-w-screen-md px-4">
    <h1
      class="text-4xl font-mono font-extrabold text-black text-center pt-16 pb-4 ms:text-5xl md:text-6xl lg:-mx-8"
      data-cy="blog-title"
    >
      {{ post.title }}
    </h1>
    <p
      class="text-center font-mono"
      data-cy="blog-author"
    >
      by {{ post.author || 'Filip Hric' }}, {{ new Date(post.date).toLocaleDateString('en-gb', { year: 'numeric', month: 'long', day: 'numeric' }) }}
    </p>
    <p
      class="font-mono text-sm text-center"
      data-cy="blog-readingTime"
    >
      {{ post.readingTime }}
    </p>
    <hr class="my-8 border-black w-1/5 m-auto">
    <nuxt-content
      :document="post"
      class="text-base sm:text-lg font-light"
      data-cy="blog-content"
    />
    <div class="relative mx-2">
      <hr class="my-8 border-black w-1/5 m-auto">
      <div class="grid mb-16 justify-items-stretch grid-flow-col">
        <div
          v-if="prev"
          class="mr-auto self-center w-4/5 prevNext"
        >
          <p>
            Previous post:
          </p>
          <NuxtLink
            class="font-mono font-semibold text-lg block"
            :to="`/${prev.slug}`"
          >
            {{ prev.title }}
          </NuxtLink>
        </div>
        <div
          v-if="next"
          class="ml-auto self-center w-4/5 text-right prevNext"
        >
          <p>
            Next post:
          </p>
          <NuxtLink
            class="font-mono font-semibold text-lg block"
            :to="`/${next.slug}`"
          >
            {{ next.title }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </article>
</template>
<script>
import Prism from "~/plugins/prism";
import VImg from "~/components/VImg";
import VVideo from "~/components/VVideo";
export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
    VImg, VVideo
  },
  layout: 'post',
  async asyncData({ params, error, $content }) {
    try {
      const postPath = `/posts/${params.slug}`;
      const [ post ] = await $content("posts", { deep: true })
        .where({ dir: postPath })
        .fetch();

      const [next, prev] = await $content('posts', {deep: true})
        .only(['title', 'slug'])
        .sortBy('date', 'desc')
        .surround(post.slug)
        .fetch();

      return { post, next, prev };
    } catch (err) {
      error({
        statusCode: 404,
        message: "Page could not be found",
      });
    }
  },
  head() {
    return {
      title: this.post.title,
      meta: [
        {
          hid: "description",
          name: "description",
          content: "Filip Hric personal blog and Cypress.io courses and workshops",
        },
        {
          name: "keywords",
          content: "cypress, cypress.io, Filip Hric, course, workshop",
        },
        {
          name: 'image',
          content: `https://og-image-vercel.vercel.app/${encodeURIComponent(this.post.title)}.png`,
        },
        {
          property: 'og:url',
          content: `https://filiphric.com/${this.post.slug}`,
        },
        {
          property: 'og:type',
          content: 'article',
        },
        {
          property: 'og:title',
          content: this.post.title,
        },
        {
          property: 'og:description',
          content: this.post.description,
        },
        {
          property: 'og:image',
          content: `https://og-image-vercel.vercel.app/${encodeURIComponent(this.post.title)}.png`,
        },
        {
          property: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          property: 'twitter:creator',
          content: '@filip_hric',
        },
        {
          property: 'twitter:title',
          content: this.post.title,
        },
        {
          property: 'twitter:description',
          content: this.post.description,
        },
        {
          property: 'twitter:image',
          content: `https://og-image-vercel.vercel.app/${encodeURIComponent(this.post.title)}.png`,
        },
      ],
    };
  },
  mounted() {
    Prism.highlightAll();
  }
};
</script>

<style lang="postcss" scoped>
  .nuxt-content-highlight code, .line-numbers {
    @apply text-xs sm:text-sm md:text-base;
  }

  .nuxt-content-highlight {
    @apply pr-1 bg-black pb-1 my-4 lg:-mx-8;
    background: linear-gradient(
      90deg,
      #9cd1bb,
      #c39ac9,
      #ff657a,
      #ff9b5e,
      #ffd76d,
      #bad761
    );
  }

  h2  {
    @apply font-mono text-2xl text-black font-bold mt-8 mb-2;
  }

  p > code {
    @apply text-gray-600 text-base bg-gray-100 px-1 rounded-md border-gray-200 border-2;
  }

  p > a, .prevNext > p {
    @apply inline-block relative font-semibold;
  }

  p {
    @apply mb-2 mt-2;
  }

  p > a:after, .prevNext > p:after {
    @apply absolute w-0 bg-none bg-repeat bg-scroll bg-transparent bg-red bottom-0 block h-1 left-1/2;
    content: "";
    transition: width 0.3s ease 0s, left 0.3s ease 0s;
  }

  p > a:hover:after, .prevNext:hover > p:after {
    @apply w-full left-0;
  }

</style>

