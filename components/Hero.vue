<template>
  <div
    class="gradient pb-2 -mt-1 mb-16"
    data-cy="hero"
  >
    <section class="min-h-96 text-white bg-black-dark">
      <div class="h-full grid relative mx-8 pb-4 md:px-8 md:max-w-screen-md md:grid-cols-2 md:mx-auto lg:px-0">
        <div class="bg" />
        <div class="blob" />
        <div class="self-center z-10">
          <h1 class="font-mono font-bold text-4xl">
            Hi, I’m Filip. I&nbsp;share my learnings on this blog.
          </h1>
          <p class="mt-8">
            Also, I create courses on Cypress.io, do livestream coding sessions and talk about testing and front-end development.
          </p>
        </div>
        <div class="my-8 z-10 place-items-center text-center md:text-right">
          <h1 class="text-xl font-mono font-bold">
            Follow me on:
          </h1>
          <Socials />
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="postcss" scoped>
  .bg, .blob {
    @apply absolute bg-cover bg-center z-0 h-60 w-60;
  }
  .bg {
    @apply md:-left-16 md:top-0 opacity-60;
    background: url('~assets/images/bg.svg');
    background-size: 15rem;
  }
  .blob {
    @apply right-0 -bottom-10 z-0 opacity-80 md:right-12 md:-bottom-2;
    background: url('~assets/images/blob.svg');
    background-size: 15rem;
  }
</style>