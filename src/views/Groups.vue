<template>
  <Loader v-if="isLoading"></Loader>
  <div class="about" v-else>
    <h2>Groups</h2>
    <el-button @click="isGroupFormOpened = !isGroupFormOpened" style="text-align: left; margin: 1rem 0 2rem" icon="el-icon-folder-add"></el-button>

    <el-dialog class="group-dialog" title="New Group" :visible.sync="isGroupFormOpened">
      <el-form v-if="isGroupFormOpened" :model="groupForm" status-icon :rules="rules" ref="groupForm" class="group-form">
        <el-form-item label="Title" prop="title">
          <el-input type="text" v-model="groupForm.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Description" prop="description">
          <el-input type="text" v-model="groupForm.description" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitGroupForm('groupForm')" :disabled="creatingGroup">Submit</el-button>
          <el-button @click="resetForm('groupForm')">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog class="group-dialog" title="New Topic" :visible.sync="isTopicFormOpened">
      <el-form v-if="isTopicFormOpened" :model="topicForm" status-icon :rules="rules" ref="topicForm" class="group-form">
        <el-form-item label="Title" prop="title">
          <el-input type="text" v-model="topicForm.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Text" prop="description">
          <el-input type="textarea" v-model="topicForm.description" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Priority" prop="priority">
          <el-select v-model="topicForm.priority" placeholder="Select priority">
            <el-option label="High" value="High"></el-option>
            <el-option label="Medium" value="Medium"></el-option>
            <el-option label="Low" value="Low"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Complexity" prop="complexity">
          <el-rate v-model="topicForm.complexity" :colors="topicForm.complexityStarsColors"></el-rate>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updatingTopic ? updateTopicHandler('topicForm') : submitTopicForm('topicForm')" :disabled="creatingTopic">Submit</el-button>
          <el-button @click="resetForm('topicForm')">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-collapse v-if="groups.length" v-model="activeNamesForGroups" @change="handleChange">
      <el-collapse-item v-for="group of groups" :title="group.title" :key="group.id" :name="group.id">
        <h3>{{group.description}}</h3>
        <div class="group__buttons">
          <el-button type="primary" @click="showTopicForm(group.id)" size="small">New Topic</el-button>
          <el-popconfirm
                  confirmButtonText='OK'
                  cancelButtonText='No, Thanks'
                  icon="el-icon-info"
                  iconColor="red"
                  title="Are you sure to delete this?"
                  @onConfirm="deleteGroupHandler(group.id)"
          >
            <el-button slot="reference" type="danger" size="small">Delete</el-button>
          </el-popconfirm>
        </div>

        <el-tabs v-if="group.topics.length" type="card">
          <el-tab-pane v-for="topic of group.topics" :key="topic.id" :label="`${topic.title} - ${topic.priority === 'High' ? 'H' : topic.priority === 'Medium' ? 'M' : 'L'}${topic.complexity}`">
            <div class="topic__info">
              <el-tag :type="topic.priority === 'High' ? 'danger' : topic.priority === 'Medium' ? 'warning' : 'success'">Priority &mdash; {{topic.priority}}</el-tag>
              <el-tag :type="topic.complexity < 3 ? 'success' : topic.complexity <= 4 ? 'warning' : 'danger'">Complexity &mdash; {{topic.complexity}}</el-tag>
              <div class="topic__buttons">
                <el-button :type="topic.done ? 'success' : ''" icon="el-icon-check" @click="setTopicDoneHandler(group.id, topic.id, !topic.done)" size="small" circle :disabled="updatingTopic"></el-button>
                <el-button type="primary" icon="el-icon-edit" @click="setUpdateTopicMode(topic, group.id)" size="small" circle></el-button>
                <el-popconfirm
                        confirmButtonText='OK'
                        cancelButtonText='No, Thanks'
                        icon="el-icon-info"
                        iconColor="red"
                        title="Are you sure to delete this?"
                        @onConfirm="deleteTopicHandler(group.id, topic.id)"
                >
                  <el-button slot="reference" icon="el-icon-delete" type="danger" size="small" circle></el-button>
                </el-popconfirm>
                <el-button icon="el-icon-star-off" :type="topic.favorite ? 'warning' : ''" size="small" @click="addTopicToFavoritesHandler(group.id, topic.id, !topic.favorite)" :disabled="updatingTopic" circle></el-button>
              </div>
            </div>

            <h4>{{topic.title}}</h4>
            <p>{{topic.text}}</p>
          </el-tab-pane>
        </el-tabs>
        <p v-else style="padding-top: 1.5rem;">No topics yet!</p>
      </el-collapse-item>
    </el-collapse>

  </div>
</template>

<script>
  import Loader from "../components/Loader";
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
        activeNamesForGroups: [],
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
      handleChange(val) {
        console.log(val);
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
      setUpdateTopicMode(topic, groupId) {
        this.isTopicFormOpened = true;
        this.groupId = groupId;
        this.updatingTopic = true;
        this.topicForm = {...this.topicForm, title: topic.title, description: topic.text, priority: topic.priority, complexity: topic.complexity, id: topic.id}
      },
      submitGroupForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            this.creatingGroup = true;

            const newGroup = {
              title: this.groupForm.title,
              description: this.groupForm.description,
              topics: [],
            };

            try {
              await this.createGroup(newGroup);

              this.resetForm('groupForm');

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
            }
          } else {
            return false;
          }
        });
      },
      showTopicForm(id) {
        this.isTopicFormOpened = true;
        this.groupId = id;
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
      async deleteTopicHandler(groupId, topicId) {
        this.isLoading = true;

        try {
          await this.deleteTopic({groupId, topicId});
        } catch (e) {
          console.log(e)
        }
        this.isLoading = false;
      },
      submitTopicForm(formName) {
        this.$refs[formName].validate(async (valid) => {
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

              this.resetForm('topicForm');
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
            }
          } else {
            return false;
          }
        });
      },
      updateTopicHandler(formName) {
        this.$refs[formName].validate(async (valid) => {
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

            await this.updateTopic(updatedTopic);

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
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    },
    computed: {
      ...mapGetters(['groups']),
    },
    async mounted() {
      this.$store.commit('setActivePage', this.$router.history.current.meta.index);

      await this.fetchGroups();
      this.isLoading = false;
    },
    components: {
      Loader
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
        &+.el-tag {
          margin-left: 1rem;
        }
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
    margin: 0 auto;
    text-align: left;

    &-item__header {
      font-size: 1.15rem;
      font-weight: bold;
    }
  }
</style>