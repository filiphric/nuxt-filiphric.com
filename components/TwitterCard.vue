<template>
  <div class="min-w-screen min-h-screen bg-gray-200 flex items-center justify-center px-5 py-5">
    <div
      class="w-full mx-auto rounded-lg bg-white shadow p-5 text-gray-800"
      style="max-width: 400px"
    >
      <div class="w-full flex mb-4">
        <div class="overflow-hidden rounded-full w-12 h-12">
          <img
            src="https://uifaces.co/our-content/donated/1H_7AxP0.jpg"
            alt=""
          >
        </div>
        <div class="flex-grow pl-3">
          <h6 class="font-bold text-md">
            Joe Blow
          </h6>
          <p class="text-xs text-gray-600">
            @joe.blow
          </p>
        </div>
        <div class="w-12 text-right">
          <i class="mdi mdi-twitter text-blue-400 text-3xl" />
        </div>
      </div>
      <div class="w-full mb-4">
        <p class="text-sm">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nam obcaecati laudantium recusandae, debitis eum voluptatem ad, illo voluptatibus temporibus odio provident. Laboriosam accusamus necessitatibus tenetur praesentium ullam voluptates nulla reprehenderit? 🤣
        </p>
      </div>
      <div class="w-full">
        <p class="text-xs text-gray-500 text-right">
          Oct 15th 8:33pm
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TwitterCard'
}
</script>

<style>
@import url(https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/5.3.45/css/materialdesignicons.min.css);
</style>