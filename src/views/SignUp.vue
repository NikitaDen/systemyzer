<template>
    <Loader v-if="isLoading"></Loader>

    <el-form :label-position="'top'" v-else :model="ruleForm" status-icon :rules="rules" ref="ruleForm"
             label-width="120px" class="sign-form">
        <el-form-item label="Name" prop="name">
            <el-input type="text" v-model="ruleForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Surname" prop="surname">
            <el-input type="text" v-model="ruleForm.surname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
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
            <router-link class="sign-link" to="/login">
                <el-button>Sign In</el-button>
            </router-link>
        </el-form-item>
    </el-form>
</template>

<script>
    import Loader from "../components/Loader";

    export default {
        name: "Login",
        components: {
            Loader
        },
        data() {
            return {
                ruleForm: {
                    name: '',
                    surname: '',
                    email: '',
                    password: '',
                    checkPass: '',
                },
                isLoading: false,
                rules: {
                    name: [
                        {required: true, message: 'Please input name', trigger: 'blur'},
                        {min: 1, message: 'Length should more than 1', trigger: 'blur'}
                    ],
                    surname: [
                        {required: true, message: 'Please input text', trigger: 'blur'},
                        {min: 1, message: 'Length should more than 1', trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: 'Please input email', trigger: 'blur'},
                        {min: 5, message: 'Length should more than 5', trigger: 'blur'}
                    ],
                    password: [
                        {validator: this.validatePass, trigger: 'blur'}
                    ],
                    checkPass: [
                        {validator: this.validatePass2, trigger: ['blur', 'change']}
                    ],
                },
            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate(async (valid) => {
                    if (valid) {
                        this.isLoading = true;
                        try {
                            await this.$store.dispatch('register', {
                                name: this.ruleForm.name,
                                surname: this.ruleForm.surname,
                                email: this.ruleForm.email,
                                password: this.ruleForm.password
                            });
                            this.isLoading = false;
                            await this.$router.push('/login');
                        } catch (e) {
                            this.isLoading = false;
                            this.$message({
                                message: e.message,
                                type: 'danger'
                            })
                        }
                    } else {
                        this.isLoading = false;
                        return false;
                    }
                });
            },
            validatePass(rule, value, callback) {
                if (value === '') {
                    callback(new Error('Please input the password'));
                }
                setTimeout(() => {
                    if (this.ruleForm.checkPass !== '') {
                        this.$refs.ruleForm.validateField('checkPass');
                    }
                    callback();
                }, 1000);
            },
            validatePass2(rule, value, callback) {
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
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
        },
    }
</script>

<style lang="scss">
    .sign-form {
        margin: 2rem auto;
        width: 30%;
        min-width: 300px;
        text-align: left;

        .sign-link {
            margin-left: 10px;
        }

        .el-form {
            &-item {
                &__content {
                    text-align: center;
                    display: flex;
                    justify-content: center;
                }

                &__label {
                    padding: 0;
                    line-height: 16px;
                }
            }
        }
    }
</style>