<template>
    <Loader v-if="isLoading"></Loader>

    <el-form :label-position="'top'" v-else :model="loginForm" status-icon :rules="rules" ref="loginForm" label-width="120px" class="sign-form">
        <el-form-item prop="email" label="Email" :rules="[
              { required: true, message: 'Please input email address', trigger: 'blur' },
              { type: 'email', message: 'Please input correct email address', trigger: ['blur', 'change'] }
            ]"
        >
            <el-input v-model="loginForm.email"></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="password">
            <el-input type="password" v-model="loginForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('loginForm')">Submit</el-button>
            <el-button @click="resetForm('loginForm')">Reset</el-button>
            <router-link class="sign-link" to="/register">
                <el-button>Sign Up</el-button>
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
            const validatePass = (rule, value, callback) => {
                if (value.trim() === '') {
                    callback(new Error('Please input the password'));
                }
                setTimeout(() => {
                    callback();
                }, 1000);
            };
            return {
                isLoading: false,
                loginForm: {
                    email: '',
                    password: '',
                },
                rules: {
                    password: [
                        {validator: validatePass, trigger: 'blur'}
                    ],
                }
            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate(async (valid) => {
                    if (valid) {
                        this.isLoading = true;

                        try {
                            await this.$store.dispatch('login', {
                                email: this.loginForm.email,
                                password: this.loginForm.password
                            });
                            this.isLoading = false;
                            await this.$router.push('/');
                        } catch (e) {
                            this.isLoading = false;
                            this.$message({
                                message: e.message,
                                type: 'warning'
                            })
                        }

                    } else {
                        this.isLoading = false;
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            async loginHandler() {
                try {
                    await this.$store.dispatch('login', {email: this.email, password: this.password});
                } catch (e) {
                    console.log(e)
                }
            }
        }
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
                    margin-top: 1rem;
                    text-align: center;
                    display: flex;
                    justify-content: center;
                }

                &__label {
                    padding: 0;
                }
            }
        }
    }
</style>