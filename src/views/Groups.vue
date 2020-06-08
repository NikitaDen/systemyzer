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
  import {mapActions} from 'vuex';

  export default {
    components: {Loader, GroupForm, GroupItems},
    data() {
      return {
        isLoading: true,
      }
    },
    methods: {
      ...mapActions(['fetchGroups']),
    },
    computed: {
    },
    async mounted() {
      try {
        this.$store.commit('setActivePage', this.$router.history.current.meta.index);
        await this.fetchGroups();
        this.isLoading = false;
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