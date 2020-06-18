<template>
  <el-collapse v-if="groups.length || null" v-model="activeNamesForGroups">
    <el-collapse-item v-for="group of groups" :title="group.title" :key="group.id" :name="group.id">
      <h3>{{group.description}}</h3>

      <div class="group__buttons">
        <TopicForm :updating-topic="false"
                   :group-id="groupId"
                   @onTopicEvent="topicFormHandler({...$event, groupId})"
                   @onShowTopicForm="showTopicForm(group.id)"
        ></TopicForm>

        <el-popconfirm
          confirmButtonText='OK'
          cancelButtonText='No, Thanks'
          icon="el-icon-info"
          iconColor="red"
          title="Are you sure to delete this group?"
          @onConfirm="deleteGroupHandler(group.id)"
        >
          <el-button slot="reference" type="danger" size="small">Delete</el-button>
        </el-popconfirm>
      </div>

      <el-tabs v-if="group.topics ? group.topics.length : null" type="card">
        <el-tab-pane v-for="topic of group.topics" :key="topic.id"
                     :label="`${topic.title} - ${topic.priority === 'High' ? 'H' : topic.priority === 'Medium' ? 'M' : 'L'}${topic.complexity}`">
          <TopicItems
            @onTopicToFav="addTopicToFavoritesHandler($event)"
            @onTopicDone="setTopicDoneHandler($event)"
            @onDeleteTopic="deleteTopicHandler($event)"
            :topic="topic"
            :groupId="group.id"
          ></TopicItems>
        </el-tab-pane>
      </el-tabs>

      <p v-else style="padding-top: 1.5rem;">No topics yet!</p>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
  import {mapActions, mapGetters} from "vuex";
  import TopicItems from "./TopicItems";
  import TopicForm from "./TopicForm";

  export default {
    name: 'GroupItems',
    components: {TopicItems, TopicForm},
    data() {
      return {
        groupId: '',
        activeNamesForGroups: [],
      }
    },
    methods: {
      ...mapActions(['fetchGroups', 'deleteGroup', 'deleteTopic', 'createTopic', 'addTopicToFavorites', 'setTopicDone']),
      showTopicForm(id) {
        this.groupId = id;
      },
      topicFormHandler({formName, groupId, newTopic}) {
        this.submitTopicForm(formName, {...newTopic, groupId})
      },
      async deleteGroupHandler(groupId) {
        try {
          this.$store.commit('setIsLoading', true);
          await this.deleteGroup({groupId});
          this.$store.commit('setIsLoading', false);
        } catch (e) {
          this.$store.commit('setIsLoading', false);
          console.log(e)
        }
      },
      submitTopicForm(formName, newTopic) {
        formName.validate(async (valid) => {
          if (valid && this.groupId) {
            formName.resetFields();

            try {
              this.$store.commit('setIsLoading', true);
              await this.createTopic(newTopic);
              this.$store.commit('setIsLoading', false);

              this.groupId = '';
              this.$message({
                message: 'New topic successfully added.',
                type: 'success'
              });
            } catch (e) {
              this.$message.error('Oops, there is an error on server.');
                console.log(e);
            }
          } else {
            return false;
          }
        });
      },
      async deleteTopicHandler({groupId, id}) {
        try {
          this.$store.commit('setIsLoading', true);
          await this.deleteTopic({groupId, id});
          this.$store.commit('setIsLoading', false);
        } catch (e) {
          this.$store.commit('setIsLoading', false);
          console.log(e)
        }
        this.isLoading = false;
      },
      async setTopicDoneHandler({groupId, id, done}) {
        try {
          this.setTopicDone({groupId, id, done});

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
          this.addTopicToFavorites({groupId, id, favorite});

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
    },
  }
</script>

<style lang="scss">
  @import "../assets/styles/items";

  .group__buttons {
    display: flex;
  }
</style>