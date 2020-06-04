<template>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="120px" class="sign-form">
        <el-form-item label="Name" prop="name">
            <el-input type="text" v-model="ruleForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Surname" prop="surname">
            <el-input type="text" v-model="ruleForm.surname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="Email" :rules="[
              { required: true, message: 'Please input email address', trigger: 'blur' },
              { type: 'email', message: 'Please input correct email address', trigger: ['blur', 'change'] }
            ]"
        >
            <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="password">
            <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Confirm" prop="checkPass">
            <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">Submit</el-button>
            <el-button @click="resetForm('ruleForm')">Reset</el-button>
            <router-link to="/login">
                <el-button>Sign In</el-button>
            </router-link>
        </el-form-item>
    </el-form>
</template>

<script>
    export default {
        name: "Login",
        data() {
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('Please input the password'));
                }
                setTimeout(() => {
                    if (this.ruleForm.checkPass !== '') {
                        this.$refs.ruleForm.validateField('checkPass');
                    }
                    callback();
                }, 1000);
            };
            const validateName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('Please input the name'));
                }
                setTimeout(() => {
                    if (this.ruleForm.name !== '') {
                        this.$refs.ruleForm.validateField('name');
                    }
                    callback();
                }, 1000);
            };
            const validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('Please input the password again'));
                }
                setTimeout(() => {
                    if (value !== this.ruleForm.password) {
                        callback(new Error('Two inputs don\'t match!'));
                    } else {
                        callback();
                    }
                }, 1000)
            };

            return {
                ruleForm: {
                    name: '',
                    surname: '',
                    email: '',
                    password: '',
                    checkPass: '',
                },
                rules: {
                    name: [
                        {validator: validateName, trigger: 'blur'}
                    ],
                    surname: [
                        {validator: validateName, trigger: 'blur'}
                    ],
                    password: [
                        {validator: validatePass, trigger: 'blur'}
                    ],
                    checkPass: [
                        {validator: validatePass2, trigger: 'blur'}
                    ],
                }
            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate(async (valid) => {
                    if (valid) {
                        await this.$store.dispatch('register', {
                            name: this.ruleForm.name,
                            surname: this.ruleForm.surname,
                            email: this.ruleForm.email,
                            password: this.ruleForm.password
                        });
                        this.resetForm('ruleForm');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
        },
    }
</script>

<style lang="scss">
    .sign-form {
        margin: 0 auto;
        width: 30%;
        min-width: 300px;

        .el-form-item__label {
            padding-right: 2rem;
        }
    }
</style>