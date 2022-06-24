<template>
    <div class="login">
        <div class="pic"></div>
        <el-form ref="form" :model="user" :rules="rules" label-width="auto" @keyup.enter="login" hide-required-asterisk>
            <el-form-item>
                <h1 class="title">面壁计划</h1>
            </el-form-item>
            <el-form-item label="面壁者代号" prop="username">
                <el-input v-model="user.username" autofocus></el-input>
            </el-form-item>
            <el-form-item label="接头暗号" prop="password">
                <el-input v-model="user.password" type="password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="login" :disabled="disabled">进入</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { login } from "@/api/user";
import { ElMessage } from "element-plus";
import 'element-plus/es/components/message/style/css'

export default {
    data() {
        return {
            user: {
                username: '',
                password: '',
            },
            rules: {
                username: [
                    { required: true, message: '请填入面壁者代号', trigger: 'blur' },
                ],
                password: [
                    { required: true, message: '请填入接头暗号', trigger: 'blur' },
                ],
            },
        }
    },
    computed: {
        disabled() {
            const { user, rules } = this
            for (const key in user) {
                const value = user[key]
                for (const rule of rules[key]) {
                    if (rule.required && value === '') {
                        return true
                    }
                }
            }
            return false
        },
    },
    methods: {
        login() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    login(this.user)
                        .then(res => {
                            const { token } = res.data
                            localStorage.setItem('token', token)
                            this.$router.replace('/')
                        })
                        .catch(err => {
                            ElMessage.error(err.response.data.message)
                        })
                }
            })
        }
    },
}
</script>

<style scoped>
.login {
    display: flex;
    align-items: center;
}

.pic {
    margin-right: 80px;
    width: 60vw;
    min-height: 100vh;
    background-image: url('@/assets/img/login.jpeg');
    background-size: cover;
    background-position: center;
}

.title {
    margin: 0;
    font-family: TsangerYuYangT;
    font-size: var(--el-font-size-extra-large);
    line-height: 1;
}
</style>
