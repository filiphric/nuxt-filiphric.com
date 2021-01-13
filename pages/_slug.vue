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
      class="text-base sm:text-lg font-light gradient-link"
      data-cy="blog-content"
    />
    <div class="relative mx-2">
      <hr class="my-8 border-black w-1/5 m-auto">
      <div class="grid mb-16 justify-items-stretch grid-flow-col gradient-link">
        <div
          v-if="prev"
          class="mr-auto self-center w-4/5 prevNext"
        >
          <p>
            Previous post:
          </p>
          <NuxtLink
            class="relative font-mono font-semibold text-lg pb-1"
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
            class="relative font-mono font-semibold text-lg pb-1"
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
import { Tweet } from 'vue-tweet-embed'
export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
    VImg, VVideo, Tweet
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
        .where({published: { $eq: true}})
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
          content: this.post.description,
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
      link: [
        {
          rel: "canonical",
          href: `https://filiphric.com/${this.post.slug}`,
        },
      ]
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

  .video {
    @apply my-4;
  }

  h2  {
    @apply font-mono text-2xl text-black font-bold mt-8 mb-2;
  }

  p > code, li > code {
    @apply text-gray-600 text-base bg-gray-100 px-1 rounded-md border-gray-200 border-2;
  }

  p > a {
    @apply relative font-semibold pb-1;
  }

  .nuxt-content p {
    @apply my-8;
  }

  @media (hover: none) {
  .nuxt-content p > a {
      background-size: 100% 3px;
      transition: none;
    }
  }

  blockquote {
    @apply border-l-4 border-gray-500 pl-4 mb-4 italic;
  }

  ol {
    @apply list-decimal list-inside	my-8;
  }

</style>

