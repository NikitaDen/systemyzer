<template>
    <el-dialog class="group-dialog" title="New Group" :visible.sync="isGroupFormOpened">
        <el-form v-if="isGroupFormOpened" :model="groupForm" status-icon :rules="rules" ref="groupForm" class="group-form">
            <el-form-item label="Title" prop="title">
                <el-input type="text" v-model="groupForm.title" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="Description" prop="description">
                <el-input type="text" v-model="groupForm.description" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="$emit('onGroupEvent', $refs.groupForm)" :disabled="creatingGroup">Submit</el-button>
                <el-button @click="resetForm('groupForm')">Reset</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
    export default {
        name: 'GroupForm',
        props: ['groupForm', 'rules', 'isGroupFormOpened', 'creatingGroup', 'submitGroupForm'],
        data() {
          return {
              topicInfo: this.$refs.topicForm
          }
        },
        methods: {
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
        },
    }
</script>