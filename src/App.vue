<template>
  <div id="app">
    <header>
      <nav>
        <el-menu
              :default-active="activeIndex"
              class="el-menu-demo"
              mode="horizontal"
              @select="handleSelect"
              text-color="#fff"
              active-text-color="#fff">
          <el-menu-item class="logo">
              <router-link to="/">
                <p class="logo">Learner.</p>
              </router-link>
          </el-menu-item>
          <el-menu-item index="1">
            <router-link to="/">Home</router-link>
          </el-menu-item>
          <el-menu-item index="2">
            <router-link to="/groups">Groups</router-link>
          </el-menu-item>
          <el-menu-item index="3">
            <router-link to="/progress">Progress</router-link>
          </el-menu-item>
          <el-menu-item index="4">
            <router-link to="/settings">Settings</router-link>
          </el-menu-item>
          <el-menu-item @click="logoutHandler" class="logo">
            <el-button>Log Out</el-button>
          </el-menu-item>
        </el-menu>
      </nav>
    </header>
    <router-view/>
  </div>
</template>


<script>
  export default {
    data() {
      return {
        activeIndex: '1',
      }
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
      async logoutHandler() {
        try {
          await this.$store.dispatch('logout');
          await this.$router.push('/login');
        } catch (e) {
          console.log(e)
        }
      }
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
  width: 100%;
}
#app {
  text-align: center;
  color: #2c3e50;
}

header {
  width: 100%;

  nav {
    .el-menu-demo {
      background-color: #6e9cff;
      display: flex;

      .el-menu-item {
        &:nth-child(2) {
          margin-left: auto;
        }
        &:hover a {
          color: #2c3e50;
        }

        &.logo {
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
      }
    }
  }
}

</style>
