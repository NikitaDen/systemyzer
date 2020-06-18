<template>
  <Loader v-if="isLoading"></Loader>
  <div class="about" v-else>
    <h2>Groups</h2>

    <GroupForm></GroupForm>

    <GroupItems></GroupItems>
  </div>
</template>

<script>
  import Loader from "../components/Loader";
  import GroupForm from "../components/GroupForm";
  import GroupItems from "../components/GroupItems";
  import {mapActions, mapGetters} from 'vuex';

  export default {
    components: {Loader, GroupForm, GroupItems},
    methods: {
      ...mapActions(['fetchGroups']),
    },
    computed: {
      ...mapGetters(['isLoading'])
    },
    async mounted() {
      try {
        this.$store.commit('setActivePage', this.$router.history.current.meta.index);
        await this.fetchGroups();
        this.$store.commit('setIsLoading', false);
      } catch (e) {
        console.log(e)
      }
    },
  }
</script>

<style lang="scss">
  @import "../assets/styles/items";

  .group-dialog {
    margin: 0 auto;
  }
</style>