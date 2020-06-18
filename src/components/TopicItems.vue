<template>
  <div>
    <div class="topic__info">
      <el-tag :type="topic.priority === 'High' ? 'danger' : topic.priority === 'Medium' ? 'warning' : 'success'">
        Priority &mdash; {{topic.priority}}
      </el-tag>

      <el-tag :type="topic.complexity < 3 ? 'success' : topic.complexity <= 4 ? 'warning' : 'danger'">Complexity &mdash;
        {{topic.complexity}}
      </el-tag>

      <div class="topic__buttons">
        <el-button :type="topic.done ? 'success' : ''" icon="el-icon-check"
                   @click="$emit('onTopicDone', {groupId, id: topic.id, done: !topic.done})" size="small" circle
                   :disabled="updatingTopic"></el-button>

        <TopicForm :updating-topic="updatingTopicForm"
                   :group-id="groupId"
                   :creating-topic="creatingTopic"
                   :topic="topic"
                   @onTopicEvent="topicFormHandler({...$event, id: topic.id})"
        ></TopicForm>

        <LinkForm
          :group-id="groupId"
          :topic-id="topic.id"
        ></LinkForm>

        <el-popconfirm
          confirmButtonText='OK'
          cancelButtonText='No, Thanks'
          icon="el-icon-info"
          iconColor="red"
          title="Are you sure to delete this?"
          @onConfirm="$emit('onDeleteTopic', {groupId, id: topic.id})"
        >
          <el-button slot="reference" icon="el-icon-delete" type="danger" size="small" circle></el-button>
        </el-popconfirm>
        <el-button icon="el-icon-star-off" :type="topic.favorite ? 'warning' : ''" size="small"
                   @click="$emit('onTopicToFav', {groupId, id: topic.id, favorite: !topic.favorite})"
                   :disabled="updatingTopic" circle></el-button>
      </div>
    </div>

    <h4>Links</h4>
    <p v-for="(link, index) in topic.links" :key="index">
      <a :href="link.link">{{link.name}}</a>
    </p>

    <h4>{{topic.title}}</h4>
    <p class="main-text" style="white-space: pre-wrap" v-html="topic.text"></p>
  </div>
</template>

<script>
  import TopicForm from "@/components/TopicForm";
  import LinkForm from "@/components/LinkForm";
  import {mapActions} from "vuex";

  export default {
    components: {TopicForm, LinkForm},
    name: 'TopicItems',
    props: ['topic', 'groupId'],
    data() {
      return {
        updatingTopic: false,
        updatingTopicForm: true,
        creatingTopic: false,
      }
    },
    methods: {
      ...mapActions(['updateTopic']),
      topicFormHandler({formName, newTopic, id}) {
        this.updateTopicHandler(formName, {...newTopic, groupId: this.groupId, id})
      },
      updateTopicHandler(formName, newTopic) {
        formName.validate(async (valid) => {
          if (valid) {
            try {
              this.$store.commit('setIsLoading', true);
              await this.updateTopic(newTopic);
              this.$store.commit('setIsLoading', false);
            } catch (e) {
              this.$store.commit('setIsLoading', false);
              console.log(e)
            }
          } else {
            return false;
          }
        });
      },
    }
  }
</script>

<style lang="scss">
  .topic__buttons {
    display: flex;
  }
</style>
