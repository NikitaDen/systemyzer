<template>
  <div>
    <el-button @click="isGroupFormOpened = true"
               style="text-align: left; margin: 1rem 0 2rem"
               icon="el-icon-folder-add"
    ></el-button>
    <el-dialog class="group-dialog" title="New Group" style="margin: 0 auto;" :visible.sync="isGroupFormOpened">
      <el-form v-if="isGroupFormOpened" :model="groupForm" status-icon :rules="rules" ref="groupForm"
               class="group-form">
        <el-form-item label="Title" prop="title">
          <el-input type="text" v-model="groupForm.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Description" prop="description">
          <el-input type="text" v-model="groupForm.description" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitGroupForm('groupForm')">Submit</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {mapActions} from "vuex";

  export default {
    name: 'GroupForm',
    data() {
      return {
        isGroupFormOpened: false,
        groupForm: {
          title: '',
          description: '',
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
      ...mapActions(['createGroup']),

      submitGroupForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          const newGroup = {
            title: this.groupForm.title,
            description: this.groupForm.description,
            topics: [],
          };
          this.$refs[formName].resetFields();


          if (valid) {
            this.$store.commit('setIsLoading', true);

            try {
              await this.createGroup(newGroup);
              this.$store.commit('setIsLoading', false);


              this.isGroupFormOpened = false;
              this.$message({
                message: 'New group successfully added.',
                type: 'success',
                duration: 1
              });
            } catch (e) {
              this.$store.commit('setIsLoading', false);
              this.isGroupFormOpened = false;
              this.$message.error('Oops, there is an error on server.');
              console.log(e);
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
  .group-dialog {
    margin: 0 auto;
  }

  .el-dialog {
    width: 40%;
    min-width: 320px;
  }
</style>