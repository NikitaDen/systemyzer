<template>
  <div class="home">
    <h3>Home</h3>
  </div>
</template>

<script>

export default {
  name: 'Home',
  methods: {
  },
  async mounted() {
    const id = this.$route.params.id;
  }
}
</script>
