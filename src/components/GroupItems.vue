<template>

  <el-collapse v-if="groups.length" v-model="activeNamesForGroups">

    <LinkForm
      :is-link-form-opened="isLinkFormOpened"
      :link-form="linkForm"
      :rules="rules"
      :adding-link="addingLink"
      :group-id="groupId"
      :topic-id="topicId"
      @addLink="addLinkHandler"
    ></LinkForm>

    <el-collapse-item v-for="group of groups" :title="group.title" :key="group.id" :name="group.id">
        <h3>{{group.description}}</h3>
        <div class="group__buttons">
          <el-button type="primary" @click="$emit('onShowTopicForm', group.id)" size="small">New Topic</el-button>
          <el-popconfirm
                  confirmButtonText='OK'
                  cancelButtonText='No, Thanks'
                  icon="el-icon-info"
                  iconColor="red"
                  title="Are you sure to delete this?"
                  @onConfirm="$emit('onDeleteGroup', group.id)"
          >
            <el-button slot="reference" type="danger" size="small">Delete</el-button>
          </el-popconfirm>
        </div>

      <el-tabs v-if="group.topics.length" type="card">
        <el-tab-pane v-for="topic of group.topics" :key="topic.id" :label="`${topic.title} - ${topic.priority === 'High' ? 'H' : topic.priority === 'Medium' ? 'M' : 'L'}${topic.complexity}`">
          <TopicItems
                  @onTopicToFav="$emit('onTopicToFav', $event)"
                  @onTopicDone="$emit('onTopicDone', $event)"
                  @onDeleteTopic="$emit('onDeleteTopic', $event)"
                  @onUpdateMode ="$emit('onUpdateMode', $event)"
                  :topic="topic"
                  :groupId="group.id"
                  @onShowLinkForm="onShowLinkForm"
          ></TopicItems>
        </el-tab-pane>
      </el-tabs>

      <p v-else style="padding-top: 1.5rem;">No topics yet!</p>

      </el-collapse-item>
  </el-collapse>
</template>

<script>
  import {mapActions} from "vuex";
  import TopicItems from "./TopicItems";
  import LinkForm from "./LinkForm";

  export default {
    name: 'GroupItems',
    props: ['groups', 'updatingTopic'],
    components: {TopicItems, LinkForm},
    data() {
      return {
        addingLink: false,
        isLinkFormOpened: false,
        linkForm: {
          link: '',
        },
        rules: {
          name: [
            { required: true, message: 'Please input name of the link', trigger: ['blur', 'change'] },
            { min: 3, message: 'Length should more than 3', trigger: ['blur', 'change'] }
          ],
          link: [
            { required: true, message: 'Please paste the link', trigger: ['blur', 'change'] },
            { min: 4, message: 'Length should more than 4', trigger: ['blur', 'change'] }
          ],
        },
        groupId: '',
        topicId: '',
        activeNamesForGroups: [],
      }
    },
    methods: {
      ...mapActions(['addLink']),
      onShowLinkForm(groupId, topicId) {
        this.groupId = groupId;
        this.topicId = topicId;
        this.isLinkFormOpened = true;
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
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    },
  }
</script>