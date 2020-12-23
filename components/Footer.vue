<template>
  <div class="gradient pt-2 mt-12 sm:mt-32">
    <footer class="min-h-400 bg-black-dark text-white">
      <div class="mx-auto md:max-w-screen-md">
        <div class="grid justify-center md:grid-cols-2 md:gap-4 md:mx-8 lg:mx-0">
          <subscribe-form />
          <div
            class="text-center flex flex-col md:mr-0"
          >
            <h2 class="font-mono text-2xl font-bold mb-4 md:text-right md:mt-6 ">
              Let’s stay in touch!
            </h2>
            <Socials :rss="true" />
            <p class="text-white font-mono text-sm mt-8 mb-12 md:text-right md:mt-6">
              ...brought to you with all my love ❤️ Filip Hric
            </p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>


