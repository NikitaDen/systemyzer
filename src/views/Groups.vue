<template>
  <Loader v-if="isLoading"></Loader>
  <div class="about" v-else>
    <h2>Groups</h2>

    <el-button @click="isGroupFormOpened = !isGroupFormOpened"
               style="text-align: left; margin: 1rem 0 2rem"
               icon="el-icon-folder-add"
    ></el-button>

<!--    3 components (GroupForm, TopicForm, GroupItems) share one state - that is why the most of methods and data declared in parent component - Groups-->

    <GroupForm :group-form="groupForm"
               :rules="rules"
               :is-group-form-opened="isGroupFormOpened"
               :creating-group="creatingGroup"
               @onGroupEvent="submitGroupForm"
    ></GroupForm>

    <TopicForm :topic-form="topicForm"
               :rules="rules"
               :group-id="groupId"
               :is-topic-form-opened="isTopicFormOpened"
               :creating-topic="creatingTopic"
               @onTopicEvent="topicFormHandler"
    ></TopicForm>

    <GroupItems
      :updating-topic="updatingTopic"
      :groups="groups"
      @onShowTopicForm="showTopicForm"
      @onDeleteGroup="deleteGroupHandler"
      @onTopicDone="setTopicDoneHandler"
      @onUpdateMode="setUpdateTopicMode"
      @onDeleteTopic="deleteTopicHandler"
      @onTopicToFav="addTopicToFavoritesHandler"
    ></GroupItems>

  </div>
</template>

<script>
  import Loader from "../components/Loader";
  import TopicForm from "../components/TopicForm";
  import GroupForm from "../components/GroupForm";
  import GroupItems from "../components/GroupItems";
  import {mapActions, mapGetters} from 'vuex';

  export default {
    data() {
      return {
        groupId: '',
        isGroupFormOpened: false,
        isTopicFormOpened: false,
        updatingTopic: false,
        creatingGroup: false,
        creatingTopic: false,
        isLoading: true,
        groupForm: {
          title: '',
          description: '',
        },
        topicForm: {
          title: '',
          text: '',
          priority: '',
          complexityStarsColors: ['#99A9BF', '#F7BA2A', '#FF9900'],
          complexity: 1,
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
        },
      }
    },
    methods: {
      ...mapActions(['fetchGroups', 'createGroup', 'createTopic','updateTopic', 'deleteGroup', 'deleteTopic', 'addTopicToFavorites', 'setTopicDone']),
      topicFormHandler(formName) {
        if (this.updatingTopic) {
          this.updateTopicHandler(formName)
        } else {
          this.submitTopicForm(formName)
        }
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
              console.log(e);
              this.$message.error('Oops, there is an error on server.');
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
      showTopicForm(id) {
        this.isTopicFormOpened = true;
        this.groupId = id;
      },
      submitTopicForm(formName) {
        formName.validate(async (valid) => {
          if (valid && this.groupId) {
            this.creatingTopic = true;

            const newTopic = {
              title: this.topicForm.title,
              text: this.topicForm.description,
              priority: this.topicForm.priority,
              complexity: this.topicForm.complexity,
              groupId: this.groupId,
              links: [],
              favorite: false
            };

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
              console.log(e);
              this.$message.error('Oops, there is an error on server.');
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
      setUpdateTopicMode({topic, groupId}) {
        this.isTopicFormOpened = true;
        this.groupId = groupId;
        this.updatingTopic = true;
        this.topicForm = {...this.topicForm, title: topic.title, description: topic.text, priority: topic.priority, complexity: topic.complexity, id: topic.id}
      },
      updateTopicHandler(formName) {
        formName.validate(async (valid) => {
          if (valid) {
            this.creatingTopic = true;

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

            this.isTopicFormOpened = false;
            this.creatingTopic = false;
            this.groupId = '';
          } else {
            this.isTopicFormOpened = false;
            return false;
          }
        });
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
            message: 'Topic not done.',
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
    async mounted() {
      try {
        this.$store.commit('setActivePage', this.$router.history.current.meta.index);
        await this.fetchGroups();
        this.isLoading = false;
      } catch (e) {
        console.log(e)
      }
    },
    components: { Loader, TopicForm, GroupForm, GroupItems }
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