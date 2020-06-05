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
            <router-link to="/groups">Groups</router-link>
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

@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-size: 1em;
}

body {
  box-sizing: inherit;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
}

a {
  text-decoration: none;
  display: inline-block;
  height: 100%;
}


main {
  width: 70%;
  margin: 1rem auto;
}

h2 {
  text-align: left;
  font-size: 2rem;
}

#app {
  /*text-align: center;*/
  color: #2c3e50;
}

header {
  width: 100%;

  nav {
    .el-menu-demo {
      background-color: #6e9cff;
      display: flex;

      .el-menu-item {
        padding: 0;

        a {
          padding: 0 1.25rem;
        }

        &:nth-child(2) {
          margin-left: auto;
        }
        &:hover a {
          color: #2c3e50;
        }

        &.logo, &.login {
          p {
            font-size: 1.25rem;
            font-weight: bold;
          }
          &:hover, &:focus, &:active {
            p {
              color: #2c3e50;
            }
            background-color: #6e9cff;
          }
        }
        &.login {
          margin-right: 1rem;
          margin-left: 2rem;
        }
      }
    }
  }
}

</style>
