<template>
  <div>
    <NuxtLink v-if="showMenu && this.$route.path !== '/'" to="/">
      filiphric.com
    </NuxtLink>
    <NuxtLink to="/blog"> Blog </NuxtLink>
    <NuxtLink to="/courses"> Courses </NuxtLink>
    <a href="https://bit.ly/cy-discord">Discord</a>
    <a href="https://twitch.tv/filip_hric">Twitch</a>
  </div>
</template>

<style lang="postcss" scoped>
  a {
    @apply pb-1 ml-2 inline-block;
  }
</style>

<script>
export default {
  computed: {
    showMenu() {
      return this.$store.getters["mobileMenu/toggleMenu"];
    },
  },
};
</script>