<template>
  <Loader v-if="isLoading"></Loader>

  <div class="home" v-else>
    <h2>Favorites</h2>

    <TopicForm :topic-form="topicForm"
               :rules="rules"
               :group-id="groupId"
               :is-topic-form-opened="isTopicFormOpened"
               :creating-topic="updatingTopic"
               @onTopicEvent="updateTopicHandler"
    ></TopicForm>
    <LinkForm
            :is-link-form-opened="isLinkFormOpened"
            :link-form="linkForm"
            :rules="rules"
            :adding-link="addingLink"
            :group-id="groupId"
            :topic-id="topicId"
            @addLink="addLinkHandler"
    ></LinkForm>
    <el-collapse v-if="favoriteTopics.length" v-model="activeNamesForFavorites">
      <el-collapse-item v-for="topic of favoriteTopics" :title="`${topic.title} — ${topic.groupTitle}`" :key="topic.id" :name="topic.id">

        <TopicItems
                @onTopicToFav="$emit('onTopicToFav', $event)"
                @onTopicDone="$emit('onTopicDone', $event)"
                @onDeleteTopic="$emit('onDeleteTopic', $event)"
                @onUpdateMode ="$emit('onUpdateMode', $event)"
                :topic="topic"
                :groupId="topic.groupId"
                @onShowLinkForm="onShowLinkForm"
        ></TopicItems>
      </el-collapse-item>
    </el-collapse>

  </div>
</template>

<script>
  import Loader from "../components/Loader";
  import TopicForm from "../components/TopicForm";
  import TopicItems from "../components/TopicItems";
  import LinkForm from "../components/LinkForm";

  import {mapActions, mapGetters} from "vuex";

export default {
  name: 'Favorites',
  data() {
    return {
      activeNamesForFavorites: [],
      groupId: '',
      topicId: '',
      isLinkFormOpened: false,
      isTopicFormOpened: false,
      updatingTopic: false,
      isLoading: true,
      addingLink: false,
      topicForm: {
        title: '',
        text: '',
        priority: '',
        complexityStarsColors: ['#99A9BF', '#F7BA2A', '#FF9900'],
        complexity: 1,
      },
      linkForm: {
        link: '',
      },
      rules: {
        title: [
          { required: true, message: 'Please input title', trigger: 'blur' },
          { min: 2, message: 'Length should more than 2', trigger: 'blur' }
        ],
        description: [
          { required: true, message: 'Please input text', trigger: 'blur' },
          { min: 2, message: 'Length should more than 2', trigger: 'blur' }
        ],
        priority: [
          { required: true, message: 'Please select priority', trigger: 'change' }
        ],
        name: [
          { required: true, message: 'Please input name of the link', trigger: ['blur', 'change'] },
          { min: 3, message: 'Length should more than 3', trigger: ['blur', 'change'] }
        ],
        link: [
          { required: true, message: 'Please paste the link', trigger: ['blur', 'change'] },
          { min: 4, message: 'Length should more than 4', trigger: ['blur', 'change'] }
        ],
      },
    }
  },
  methods: {
    ...mapActions(['fetchGroups', 'createTopic','updateTopic', 'deleteTopic', 'addTopicToFavorites', 'setTopicDone', 'addLink']),
    onShowLinkForm(groupId, topicId) {
      this.groupId = groupId;
      this.topicId = topicId;
      this.isLinkFormOpened = true;
    },
    async setTopicDoneHandler(groupId, id, done) {
      try {
        this.updatingTopic = true;
        await this.setTopicDone({groupId, id, done});
        this.updatingTopic = false;
        done ? this.$message({
          message: 'Topic done.',
          type: 'success'
        }) : this.$message({
          message: 'Topic not done.',
          type: 'warning'
        });

      } catch (e) {
        console.log(e)
      }
    },
    async addTopicToFavoritesHandler(groupId, id, favorite) {
      try {
        this.updatingTopic = true;
        try {
          await this.addTopicToFavorites({groupId, id, favorite});
        } catch (e) {
          console.log(e)
        }
        this.updatingTopic = false;
        favorite ? this.$message({
          message: 'Topic added to favorites.',
          type: 'success',
        }) : this.$message({
          message: 'Topic removed from favorites.',
          type: 'success',
        });
      } catch (e) {
        console.log(e)
      }
    },
    addLinkHandler({groupId, id, formName}) {
      formName.validate(async (valid) => {
        if (valid && this.groupId) {
          try {
            const link = this.linkForm.link;
            const name = this.linkForm.name;
            this.addingLink = true;
            await this.addLink({groupId, id, link, name});
            this.addingLink = false;

            this.groupId = '';
            this.topicId = '';
            this.isLinkFormOpened = false;

            this.$message({
              message: 'Link added to the topic.',
              type: 'success'
            })
          } catch (e) {
            console.log(e)
          }
        } else {
          return false;
        }
      })
    },
    setUpdateTopicMode(topic, groupId) {
      this.isTopicFormOpened = true;
      this.groupId = groupId;
      this.topicForm = {...this.topicForm, title: topic.title, description: topic.text, priority: topic.priority, complexity: topic.complexity, id: topic.id}
    },
    showTopicForm(id) {
      this.isTopicFormOpened = true;
      this.groupId = id;
    },
    updateTopicHandler(formName) {
      formName.validate(async (valid) => {
        if (valid) {
          this.updatingTopic = true;

          const updatedTopic = {
            title: this.topicForm.title,
            text: this.topicForm.description,
            priority: this.topicForm.priority,
            complexity: this.topicForm.complexity,
            groupId: this.groupId,
            id: this.topicForm.id,
          };

          try {
            await this.updateTopic(updatedTopic);
          } catch (e) {
            console.log(e)
          }

          this.topicForm.title = '';
          this.topicForm.description = '';
          this.topicForm.priority = '';
          this.topicForm.complexity = 1;
          this.updatingTopic = false;
          this.isTopicFormOpened = false;
          this.groupId = '';
        } else {
          this.isTopicFormOpened = false;
          this.updatingTopic = false;
          return false;
        }
      });
    },
    async deleteTopicHandler(groupId, topicId) {
      this.isLoading = true;

      try {
        await this.deleteTopic({groupId, topicId});
      } catch (e) {
        console.log(e)
      }
      this.isLoading = false;
    },
  },
  computed: {
    ...mapGetters(['groups']),
    favoriteTopics() {
      let favoriteTopic = [];
      this.groups.forEach(item => {
        const favoriteTopics = [...item.topics].filter(topic => topic.favorite === true).map(key => ({...key, groupTitle: item.title}));
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
  components: {
    Loader, TopicForm, TopicItems, LinkForm
  }
}
</script>

<style lang="scss">
  h3 {
    font-size: 1.15rem;
    font-weight: normal;
  }

  h4 {
    font-size: 1rem;
    padding: .85rem 0;
  }

  .group {
    &-dialog {
      width: 70%;
      margin: 0 auto;

      .el-dialog__body {
        padding: 0 1rem .5rem;
      }
    }
    &-form {
      margin: 0 auto;
      padding: 0 1rem;
    }
    &__buttons {
      .el-button {
        margin-top: 1rem;
        margin-right: 1rem;
      }
    }
  }

  .high {
    background-color: rebeccapurple;
  }

  .topic {
    &__info {
      display: flex;
      margin-bottom: 1rem;

      .el-tag {
        margin-right: 1rem;
      }
    }

    &__buttons {
      margin-left: auto;
      .el-button {
        margin-left: .75rem;
      }
    }
  }

  .el-popconfirm {
    padding: .25rem .5rem;
    &__action {
      padding: 1rem 0 0 0;
    }
  }

  .el-tabs {
    margin-top: 1.25rem;
  }

  .el-collapse {
    width: 100%;
    margin: 1rem auto;
    text-align: left;

    &-item__header {
      font-size: 1.15rem;
      font-weight: bold;
    }
  }

  .el-rate {
    margin: .75rem 0;
  }
</style>