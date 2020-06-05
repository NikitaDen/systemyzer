<template>
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
                <el-button type="primary" @click="$emit('onTopicEvent', $refs.topicForm)" :disabled="creatingTopic">Submit</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
    export default {
        name: 'TopicForm',
        props: ['topicForm', 'rules', 'isTopicFormOpened', 'creatingTopic', 'groupId'],
        data() {
          return {
          }
        },
    }
</script>