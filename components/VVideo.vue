<template>
  <div class="video">
    <video
      :src="videoSrc()"
      :alt="alt"
      autoplay
      controls
      class="mx-auto shadow-lg"
    />
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      required: true,
    }
  },
  methods: {
    videoSrc() {
      try {
        const { post } = this.$parent;
        return require(`~/content/posts/${post.slug}/${this.src}`);
      } catch (error) {
        return null;
      }
    },
  },
};
</script>