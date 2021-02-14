<template>
  <ais-instant-search
    :search-client="searchClient"
    index-name="blog"
  >
    <ais-configure
      :hitsPerPage="1000"
      :attributesToSnippet="['bodyPlainText']"
    >
      <ais-autocomplete>
        <div slot-scope="{ currentRefinement, indices, refine }">
          <input
            type="search"
            ref="searchInput"
            :placeholder="searchPlaceholder"
            class="search w-full h-10 inline-block mx-auto shadow-md p-2 font-mono font-semibold focus:outline-none place-self-start min-w-screen-md"
            :value="currentRefinement"
            @input="refine($event.currentTarget.value), toggleSearch(Boolean($event.currentTarget.value))"
            autocomplete="off"
            @focus="showResults = true"
            @keydown.enter="goToDoc(indices)"
          >
          <SearchResults :posts=indices[0].hits />
        </div>
      </ais-autocomplete>
    </ais-configure>
  </ais-instant-search>

</template>

<script>
import algoliasearch from 'algoliasearch/lite';
import { mapMutations } from 'vuex'
export default {
  data() {
    return {
      searchClient: algoliasearch('DESAPEUM30', 'd555dbd8f044d5fffed00bb29d7d2a60')
    }
  },
  mounted: function () {
    this.toggleSearch(false)
    this.$nextTick(function () {
      window.addEventListener('keydown', event => {
        if(event.metaKey && event.key === 'k') {
          this.$refs.searchInput.focus()
          event.preventDefault()
        }
      })
    })
  },
  watch: {
    '$route' () {
      this.toggleSearch(false)
      this.showResults = false
      this.$refs.searchInput.blur()
    }
  },
  computed: {
    searchPlaceholder () {
      if (navigator.appVersion.indexOf('Mac') !== -1 ) {
        return 'Search for anything - ⌘K to focus'
      }
      else if (navigator.appVersion.indexOf('Win') !== -1 ) {
        return 'Search for anything - Win + k to focus'
      } else {
        return 'Search'
      }
    },
    searching () {
      return this.$store.state.searching
    }
  },
  methods: {
    ...mapMutations({
      toggleSearch: 'searchToggle'
    }),
    highlightPrevious () {
      if (this.highlightedIndex > 0 ){
        this.highlightedIndex -= 1
      }
    },
    highlightNext (resultsCount) {
      if (this.highlightedIndex < resultsCount - 1) {
        this.highlightedIndex += 1
      }
    },
    isCurrentIndex (index) {
      return index === this.highlightedIndex
    },
    goToDoc (indices) {
      this.$nuxt.$router.push(indices[0].hits[0].objectID)
    }
  }
}
</script>

<style lang="postcss" scoped>

.search {
    @apply bg-gradient-to-t from-red to-red;
    text-decoration: none;
    background-position: 0% 100%;
    background-repeat: no-repeat;
    background-size: 0% 4px;
    transition: background-size .3s;
}

.search:focus {
  background-size: 100% 4px;
}
</style>