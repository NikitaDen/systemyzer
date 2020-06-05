<template>
    <el-dialog class="group-dialog" title="New Link" :visible.sync="isLinkFormOpened">
      <el-form v-if="isLinkFormOpened" :model="linkForm" status-icon :rules="rules" ref="linkForm" class="group-form">
        <el-form-item label="Name" prop="name">
          <el-input type="text" v-model="linkForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Link" prop="link">
          <el-input type="text" v-model="linkForm.link" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="$emit('addLink', {groupId, id: topicId, formName: $refs.linkForm})" :disabled="addingLink">Submit</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
</template>

<script>
  export default {
    name: 'GroupItems',
    props: ['isLinkFormOpened', 'linkForm', 'rules', 'addingLink', 'groupId', 'topicId'],
  }
</script>