<template>
  <RouterLink
    v-if="isInternal"
    class="nav-link"
    :to="contributor.userProfileUrl"
    @focusout.native="focusoutAction"
  >
    {{ contributor.name }}
  </RouterLink>
  <a
    v-else
    :href="contributor.userProfileUrl"
    class="nav-link external"
    target="_blank"
    :rel="rel"
    @focusout="focusoutAction"
  >
    {{ contributor.name }}
    <OutboundLink v-if="!isInternal" />
  </a>
</template>

<script>

export default {
  name: 'userProfileLink',

  props: {
    contributor: {
      required: true
    }
  },

  computed: {
    isInternal () {
      return this.contributor.userProfileUrl === '#'
    },
  },

  methods: {
    focusoutAction () {
      this.$emit('focusout')
    }
  }
}
</script>
