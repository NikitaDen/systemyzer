<template>
  <div>
    <el-button v-if="!updatingTopic" type="primary" @click="onShowTopicForm" size="small">New Topic</el-button>
    <el-button v-else type="primary" icon="el-icon-edit" @click="onShowUpdateTopicForm" size="small" circle></el-button>

    <el-dialog class="group-dialog" title="New Topic" :visible.sync="isTopicFormOpened"
               :close-on-click-modal="false"
               :modal-append-to-body="false">
      <el-form v-if="isTopicFormOpened" :model="topicForm" status-icon :rules="rules" ref="topicForm"
               class="group-form">
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
          <el-button v-if="updatingTopic" type="primary" @click="onTopicEvent">Update
          </el-button>
          <el-button v-else type="primary" @click="onTopicEvent">Submit</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>

</template>

<script>
  export default {
    name: 'TopicForm',
    props: ['groupId', 'isUpdatingForm', 'updatingTopic', 'topic'],
    data() {
      return {
        isTopicFormOpened: false,
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
          name: [
            {required: true, message: 'Please input name of the link', trigger: ['blur', 'change']},
            {min: 3, message: 'Length should more than 3', trigger: ['blur', 'change']}
          ],
          link: [
            {required: true, message: 'Please paste the link', trigger: ['blur', 'change']},
            {min: 4, message: 'Length should more than 4', trigger: ['blur', 'change']}
          ],
        },
      }
    },
    methods: {
      onShowTopicForm() {
        this.isTopicFormOpened = true;
        this.$emit('onShowTopicForm')
      },
      onShowUpdateTopicForm() {
        this.topicForm = {
          ...this.topicForm,
          title: this.topic.title,
          description: this.topic.text,
          priority: this.topic.priority,
          complexity: this.topic.complexity,
          id: this.topic.id
        };
        this.isTopicFormOpened = true;
      },
      onTopicEvent() {
        this.$refs.topicForm.validate(async (valid) => {
          if (valid) {
            try {
              this.isTopicFormOpened = false;
              this.$emit('onTopicEvent', {
                newTopic: {
                  title: this.topicForm.title,
                  text: this.topicForm.description,
                  priority: this.topicForm.priority,
                  complexity: this.topicForm.complexity,
                  links: [],
                  favorite: false
                },
                formName: this.$refs.topicForm,
              });
              this.topicForm.title = '';
              this.topicForm.description = '';
              this.topicForm.priority = '';
              this.topicForm.complexity = 1;
            } catch (e) {
              console.log(e)
            }
          } else {
            return false;
          }
        });
      },
    },
  }
</script>

<style lang="scss">
  textarea {
    white-space: pre-wrap;
  }
</style>