<template>
  <div class="bg-black mb-8 grid shadow-2xl justify-self-start h-450 w-full sm:w-9/12 sm:mx-auto sm:-mt-24 md:w-350 lg:mx-0">
    <div
      class="bg-transparent h-1 m-0"
      role="progressbar"
      :aria-valuenow="progressBarWidth"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div
        class="bg-red h-1 text-center"
        :style="`width: ${progressBarWidth}%; transition: width ${progressBarDuration}s linear;`"
      />
    </div>
    <transition
      name="subscription-form"
      mode="out-in"
    >
      <!-- signup form, first step -->
      <div
        v-if="firstStep"
        key="form"
        class="grid place-content-start p-8 h-full"
      >
        <form
          :action="`https://app.convertkit.com/forms/${convertKitId}/subscriptions`"
          @submit.prevent="submit"
        >
          <h3 class="font-mono font-bold text-xl md:text-2xl mb-8 sm:text-center md:text-left">
            More articles are coming! Get them into your inbox 📨
          </h3>
          <input
            v-model="first_name"
            type="text"
            placeholder="Jane Doe"
            class=" text-black font-mono block mt-4 h-10 px-3 w-4/6 sm:mx-auto sm:w-5/6 md:mx-0 md:w-full focus:outline-red"
          >
          <input
            v-model="email_address"
            type="email"
            placeholder="jane@doe.com"
            class=" text-black font-mono block mt-4 h-10 px-3 w-4/6 sm:mx-auto sm:w-5/6 md:mx-0 md:w-full focus:outline-red"
          >
          <div class="absolute sm:left-1/2 md:left-auto">
            <p
              v-if="errors.length"
              class="error text-xs text-red relative pt-1 sm:-left-1/2 md:left-0"
            >
              {{ errors.join('and ') }} {{ errors.length > 1 ? 'are' : 'is' }} required
            </p>
          </div>
          <button
            on:click="submit"
            class="bg-red h-12 mt-8 block px-4 py-2 font-mono font-bold sm:mx-auto md:mx-0 hover:bg-red-dark transition ease-in-out focus:outline-none"
          >
            Subscribe
          </button>
          <p class=" text-xs mt-6 sm:text-center md:text-left">
            I treat your email address like I would my own. That means no ads. Just notifications of when I do cool stuff. Unsubscribe anytime.
          </p>
        </form>
      </div>

      <!-- successful subscribe -->
      <div
        v-if="success && !firstStep && !loading"
        key="sucess"
        class="grid place-content-start p-8 h-full"
      >
        <h3
          class="font-mono font-bold text-2xl mb-8 block"
        >
          Alright! 🎉<br>You’re almost there!
        </h3>
        <p>There’s a confirmation email in your inbox now. Please click the link inside and you’re good to go!</p>
      </div>

      <!-- error state -->
      <div
        v-if="!success && !firstStep && !loading"
        key="error"
        class="grid place-content-center p-8 h-full row-span-6"
      >
        <h3
          class="font-mono font-bold text-2xl mb-8 block"
        >
          Oh no! 💩<br>Something didn’t go right.
        </h3>
        <p class="font-thin">
          If you think this might be my fault, let me know <a
            class=" font-bold"
            href="https://twitter.com/filip_hric/"
          >via Twitter</a>
        </p>
      </div>

      <!-- loading animation -->
      <div
        v-if="loading"
        key="loading"
        class="grid place-self-center p-8 h-full"
      >
        <img
          src="~/assets/icons/loading.svg"
        >
      </div>
    </transition>
  </div>
</template>

<script>
import axios from 'axios';
const qs = require('qs');

export default {
  props: {
    convertKitId: {
      type: Number,
      default: 1673359
      }
  },
  data() {
    return {
      errors: [],
      email_address: '',
      first_name: '',
      firstStep: true,
      loading: false,
      success: false,
      progressBarWidth: 0,
      progressBarDuration: 10
    }
  },
  methods: {
    submit({target: { action }}) {
      if (this.email_address && this.first_name) {
        this.sendSubscription(action);
      }

      this.errors = []

      if (!this.email_address) {
        this.errors.push('email ');
      }
      if (!this.first_name) {
        this.errors.push('name ');
      }
    },
    sendSubscription(action) {
      this.progressBarDuration = 10
      this.loading = true
      this.firstStep = false
      axios.post(action, qs.stringify({
        id: this.convertKitId,
        email_address: this.email_address,
        first_name: this.first_name
      })).then( () => {
        this.progressBarWidth = 100
        this.loading = false
        this.success = true
        setTimeout( () => {
          this.firstStep = true
          this.progressBarDuration = 0
          this.progressBarWidth = 0
        }, 10000);
      }).catch( () => {
        this.progressBarWidth = 100
        this.loading = false
        this.success = false
        setTimeout( () => {
          this.firstStep = true
          this.progressBarDuration = 0
          this.progressBarWidth = 0
        }, 10000);
      })
    },
  }
}
</script>

<style scoped lang="postcss">

.subscription-form-enter-active,
.subscription-form-leave-active {
  transition: opacity .2s;
}

.subscription-form-enter,
.subscription-form-leave-active
 {
  opacity: 0
}

  p > a {
    @apply font-bold inline-block relative;
  }

  p > a:after {
    @apply absolute w-0 bg-none bg-repeat bg-scroll bg-transparent bg-red bottom-0 block h-1 left-1/2;
    content: "";
    transition: width 0.3s ease 0s, left 0.3s ease 0s;
  }

  p > a:hover:after {
    @apply w-full left-0;
  }

  .error::first-letter {
    @apply capitalize;
  }

</style>