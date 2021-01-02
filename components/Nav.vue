<template>
  <div class="gradient pb-1">
    <MobileMenu />
    <header class="grid bg-black-dark w-screen font-semibold font-mono h-16 text-lg text-gray-50">
      <nav
        class="grid grid-flow-col justify-between content-center container max-w-screen-md px-4 lg:px-0"
      >
        <div class="gradient-link text-left">
          <NuxtLink
            to="/"
            class="pb-1"
          >
            filiphric.com
          </NuxtLink>
        </div>
        <MenuItems class="gradient-link hidden md:block" />
        <button
          class="md:hidden focus:outline-none"
          @click="$store.dispatch('mobileMenu/toggleMenu')"
        >
          <img
            src="~/assets/icons/menu.svg"
            class="w-8"
            alt="menu"
          >
        </button>
      </nav>
    </header>
  </div>
</template>

<style lang="postcss" scoped>

  a {
    @apply self-center font-bold inline-block relative;
  }

</style>
