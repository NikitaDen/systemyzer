export default {
  async mounted() {
    this.$store.commit('setActivePage', this.$router.history.current.meta.index);
  }
}
