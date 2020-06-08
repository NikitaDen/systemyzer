<template>
  <Loader v-if="isLoading"></Loader>

  <div class="home" v-else>
    <h2>Favorites</h2>

    <el-collapse v-if="favoriteTopics.length" v-model="activeNamesForFavorites">
      <el-collapse-item v-for="topic of favoriteTopics" :title="`${topic.title} — ${topic.groupTitle}`" :key="topic.id"
                        :name="topic.id">
        <TopicItems
          @onTopicToFav="addTopicToFavoritesHandler($event)"
          @onTopicDone="setTopicDoneHandler($event)"
          @onDeleteTopic="deleteTopicHandler($event)"
          :topic="topic"
          :groupId="topic.groupId"
        ></TopicItems>

      </el-collapse-item>
    </el-collapse>

  </div>
</template>

<script>
  import Loader from "../components/Loader";
  import TopicItems from "../components/TopicItems";
  import {mapActions, mapGetters} from "vuex";

  export default {
    name: 'Favorites',
    components: {Loader, TopicItems},

    data() {
      return {
        activeNamesForFavorites: [],
        isLoading: true,
        addingLink: false,
      }
    },
    methods: {
      ...mapActions(['fetchGroups', 'deleteTopic', 'createTopic', 'addTopicToFavorites', 'setTopicDone']),
      async deleteTopicHandler({groupId, id}) {
        this.isLoading = true;
        try {
          await this.deleteTopic({groupId, id});
        } catch (e) {
          console.log(e)
        }
        this.isLoading = false;
      },
      async setTopicDoneHandler({groupId, id, done}) {
        try {
          this.updatingTopic = true;
          await this.setTopicDone({groupId, id, done});
          this.updatingTopic = false;

          done ? this.$message({
            message: 'Topic done.',
            type: 'success'
          }) : this.$message({
            message: 'Topic is not done.',
            type: 'warning'
          });
        } catch (e) {
          console.log(e)
        }
      },
      async addTopicToFavoritesHandler({groupId, id, favorite}) {
        try {
          this.updatingTopic = true;
          await this.addTopicToFavorites({groupId, id, favorite});
          this.updatingTopic = false;

          favorite ? this.$message({
            message: 'Topic added to favorites.',
            type: 'success'
          }) : this.$message({
            message: 'Topic removed from favorites.',
            type: 'warning'
          });

        } catch (e) {
          console.log(e)
        }
      },
    },
    computed: {
      ...mapGetters(['groups']),

      favoriteTopics() {
        let favoriteTopic = [];
        this.groups.forEach(item => {
          const favoriteTopics = [...item.topics].filter(topic => topic.favorite === true).map(key => ({
            ...key,
            groupTitle: item.title
          }));
          favoriteTopic = [...favoriteTopic, ...favoriteTopics]
        });
        return favoriteTopic
      }
    },
    async mounted() {
      this.$store.commit('setActivePage', this.$router.history.current.meta.index);
      await this.fetchGroups();
      this.isLoading = false
    },
  }
</script>

<style scoped lang="scss">
  @import "./../assets/styles/items";
</style>