<template>
  <div class="about">
    <h2>Settings</h2>
  </div>
</template>

<script>
  export default {
    mounted() {
      this.$store.commit('setActivePage', this.$router.history.current.meta.index);
    }
  }
</script>

<style scoped>

</style>
