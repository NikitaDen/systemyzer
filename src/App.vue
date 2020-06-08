<template>
  <div id="app">
    <header>
      <nav>
        <el-menu
              :default-active="activePage"
              class="el-menu-demo"
              mode="horizontal"
              text-color="#fff"
              active-text-color="#2c3e50">
          <el-menu-item class="logo" index="6">
              <router-link to="/">
                <p class="logo">Systemyzer.</p>
              </router-link>
          </el-menu-item>
          <el-menu-item index="2">
            <router-link to="/">Groups</router-link>
          </el-menu-item>
          <el-menu-item index="3">
            <router-link to="/favorites">Favorites</router-link>
          </el-menu-item>
          <el-menu-item index="4">
            <router-link to="/progress">Progress</router-link>
          </el-menu-item>
          <el-menu-item v-if="info.name || name" @click="logoutHandler" class="login">
            <el-button>Log Out</el-button>
          </el-menu-item>
        </el-menu>
      </nav>
    </header>
    <main>
      <router-view/>
    </main>
  </div>
</template>


<script>
  import {mapGetters} from 'vuex';

  export default {
    data() {
      return {
        name: ''
      }
    },
    methods: {
      async logoutHandler() {
        try {
          await this.$store.dispatch('logout');
          this.$store.commit('clearInfo');
          this.name = '';
          localStorage.setItem('name', '');
          await this.$router.push('/login');
        } catch (e) {
          console.log(e)
        }
      }
    },
    computed: {
      ...mapGetters(['activePage', 'info']),
    },
    mounted() {
      this.name = localStorage.getItem('name');
    }
  }
</script>

<style lang="scss">
  @import "assets/styles/styles";
</style>
