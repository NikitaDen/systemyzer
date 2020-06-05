<template>
  <Loader v-if="isLoading"></Loader>

  <div v-else class="about">
    <h2>Progress</h2>

    <el-collapse v-model="activeName" accordion>
      <el-collapse-item :title="`Done topics - ${doneTopicsCount}`" name="1">
        <div v-for="(groupTopic, index) in doneTopics" :key="index">
          <div class="done-topic" v-for="topic in groupTopic" :key="topic.id">
            <span>{{topic.title}}</span>
            <el-tag :type="topic.priority === 'High' ? 'danger' : topic.priority === 'Medium' ? 'warning' : 'success'">Priority &mdash; {{topic.priority}}</el-tag>
            <el-tag :type="topic.complexity < 3 ? 'success' : topic.complexity <= 4 ? 'warning' : 'danger'">Complexity &mdash; {{topic.complexity}}</el-tag>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
  import {mapActions, mapGetters} from "vuex";
  import Loader from "../components/Loader";

  export default {
    components: {Loader},
    data() {
      return {
        isLoading: true,
        activeName: []
      }
    },
    methods: {
      ...mapActions(['fetchGroups']),
    },
    computed: {
      ...mapGetters(['groups']),
      doneTopicsCount() {
        return this.groups.map(item => item.topics.filter(key => key.done === true).length).reduce((topicDone, acc) => acc + topicDone, 0);
      },
      doneTopics() {
        return this.groups.map(item => item.topics.filter(key => key.done === true));
      }
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
  }
</script>

<style lang="scss">
  .el-tag {
    /*margin-left: 1rem;*/
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

  .done-topic {
    margin: 1rem 0;
    span {
      display: inline-block;
      min-width: 100px;
    }
  }
</style>
