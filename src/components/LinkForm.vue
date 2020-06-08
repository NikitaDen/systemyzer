<template>
  <div>
    <el-button type="primary" icon="el-icon-share" size="small" @click="onShowLinkForm" circle></el-button>

    <el-dialog class="group-dialog" title="New Link" :visible.sync="isLinkFormOpened">
      <el-form v-if="isLinkFormOpened" :model="linkForm" status-icon :rules="rules" ref="linkForm" class="group-form">
        <el-form-item label="Name" prop="name">
          <el-input type="text" v-model="linkForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Link" prop="link">
          <el-input type="text" v-model="linkForm.link" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addLinkHandler({groupId, id: topicId, formName: $refs.linkForm})" :disabled="addingLink">Submit</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {mapActions} from "vuex";

  export default {
    name: 'GroupItems',
    props: ['groupId', 'topicId'],
    data() {
      return {
        isLinkFormOpened: false,
        addingLink: false,
        linkForm: {
          name: '',
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
      }
    },
    methods: {
      ...mapActions(['addLink']),

      onShowLinkForm() {
        this.isLinkFormOpened = true;
      },
      addLinkHandler({groupId, id, formName}) {
        formName.validate(async (valid) => {
          if (valid && this.groupId) {
            debugger

            try {
              const link = this.linkForm.link;
              const name = this.linkForm.name;

              this.addingLink = true;
              await this.addLink({groupId, id, link, name});
              this.addingLink = false;

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
    }
  }
</script>