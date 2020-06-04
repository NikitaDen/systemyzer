<template>
  <div class="home">
    <h2>Home</h2>
  </div>
</template>

<script>

export default {
  name: 'Home',
  methods: {
  },
  mounted() {
    this.$store.commit('setActivePage', this.$router.history.current.meta.index);
  }
}
</script>
