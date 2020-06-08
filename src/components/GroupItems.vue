<template>
  <el-collapse v-if="groups.length" v-model="activeNamesForGroups">
    <el-collapse-item v-for="group of groups" :title="group.title" :key="group.id" :name="group.id">
      <h3>{{group.description}}</h3>

      <div class="group__buttons">
        <TopicForm :updating-topic="false"
                   :group-id="groupId"
                   :creating-topic="creatingTopic"
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

      <el-tabs v-if="group.topics.length" type="card">
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
        isTopicFormOpened: false,
        updatingTopic: false,
        creatingTopic: false,
        isLoading: true,
        activeNamesForGroups: [],

        topicForm: {
          title: '',
          text: '',
          priority: '',
          complexityStarsColors: ['#99A9BF', '#F7BA2A', '#FF9900'],
          complexity: 1,
        },
        rules: {
          title: [
            {required: true, message: 'Please input title', trigger: 'blur'},
            {min: 2, message: 'Length should more than 2', trigger: 'blur'}
          ],
          description: [
            {required: true, message: 'Please input text', trigger: 'blur'},
            {min: 2, message: 'Length should more than 2', trigger: 'blur'}
          ],
          priority: [
            {required: true, message: 'Please select priority', trigger: 'change'}
          ],
        },
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
      submitGroupForm(formName) {
        formName.validate(async (valid) => {
          if (valid) {
            this.creatingGroup = true;

            const newGroup = {
              title: this.groupForm.title,
              description: this.groupForm.description,
              topics: [],
            };

            try {
              await this.createGroup(newGroup);

              formName.resetFields();

              this.isGroupFormOpened = false;
              this.creatingGroup = false;

              this.$message({
                message: 'New group successfully added.',
                type: 'success',
                duration: 1
              });
            } catch (e) {
              this.isGroupFormOpened = false;
              this.$message.error('Oops, there is an error on server.');
                console.log(e);
            }
          } else {
            return false;
          }
        });
      },
      async deleteGroupHandler(groupId) {
        this.isLoading = true;

        try {
          await this.deleteGroup({groupId});
        } catch (e) {
          console.log(e)
        }

        this.isLoading = false;
      },
      submitTopicForm(formName, newTopic) {
        formName.validate(async (valid) => {
            debugger
          if (valid && this.groupId) {
            this.creatingTopic = true;

            try {
              await this.createTopic(newTopic);

              formName.resetFields();
              this.isTopicFormOpened = false;
              this.creatingTopic = false;
              this.groupId = '';
              this.$message({
                message: 'New topic successfully added.',
                type: 'success'
              });
            } catch (e) {
              this.isTopicFormOpened = false;
              this.$message.error('Oops, there is an error on server.');
                console.log(e);
            }
          } else {
            return false;
          }
        });
      },
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
    },
  }
</script>

<style lang="scss">
  @import "../assets/styles/items";

  .group__buttons {
    display: flex;
  }
</style>