<template>
  <div class="font-bold gradient-link flex flex-row flex-wrap place-content-center gap-2 px-8 md:flex-col md:gap-0 md:place-content-end md:px-0 md:flex-nowrap">
    <a
      href="https://twitter.com/filip_hric/"
    >
      Twitter
      <img
        src="~/assets/icons/twitter.svg"
      >
    </a>
    <a
      href="https://github.com/filiphric/"
    >
      GitHub
      <img
        src="~/assets/icons/github.svg"
      >
    </a>
    <a
      href="https://www.linkedin.com/in/filip-hric-11a5b1126/"
    >
      LinkedIn
      <img
        src="~/assets/icons/linkedin.svg"
      >
    </a>
    <a
      href="https://bit.ly/cy-discord"
    >
      Discord
      <img
        src="~/assets/icons/discord.svg"
      >
    </a>
    <a
      href="https://twitch.tv/filip_hric"
    >
      Twitch
      <img
        src="~/assets/icons/twitch.svg"
      >
    </a>
    <a
      href="https://www.youtube.com/channel/UCDOCAVIhSh5VpJMEfdak1OA"
    >
      YouTube
      <img
        src="~/assets/icons/youtube.svg"
      >
    </a>
    <a
      v-if="rss"
      href="https://filiphric.com/rss.xml"
    >
      RSS Feed
      <img
        src="~/assets/icons/rss.svg"
      >
    </a>
  </div>
</template>

<script>
export default {
  props: {
      rss: {
        type: Boolean,
        required: false
      }
    }
}
</script>

<style lang="postcss" scoped>
  img {
    @apply block mx-auto mt-2 md:inline-block md:pl-2 md:mt-0 md:mx-0;
  }

  a {
    @apply py-2 mx-3 font-semibold block md:text-right md:px-0 md:ml-auto md:mr-0 md:py-1 md:inline-block md:justify-self-end;
  }

</style>