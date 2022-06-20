<template>
    <el-container class="base-layout">
        <el-header class="header">
            <router-link class="logo" to="/">面壁计划</router-link>
            <el-menu router class="nav" mode="horizontal" :ellipsis="false">
                <el-badge :value="10">
                    <el-menu-item index="/messages">消息</el-menu-item>
                </el-badge>
                <el-sub-menu index="user" :show-timeout="0">
                    <template #title>
                        <el-avatar class="avatar" :size="24" :src="avatar"></el-avatar>
                        张三
                    </template>
                    <el-menu-item index="/users/10">个人主页</el-menu-item>
                    <el-menu-item index="/settings">设置</el-menu-item>
                    <el-menu-item @click="logout" index="#logout">退出</el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-header>
        <el-container>
            <el-aside width="210px">
                <el-menu class="menu" router :default-active="menuActive">
                    <el-menu-item index="/">首页</el-menu-item>
                    <el-sub-menu index="user">
                        <template #title>
                            面壁者
                        </template>
                        <el-menu-item index="/users">面壁者列表</el-menu-item>
                        <el-menu-item index="/male-users" :route="{ name: 'User', query: { sex: 1 } }">
                            男性面壁者
                        </el-menu-item>
                    </el-sub-menu>
                    <el-sub-menu index="tools">
                        <template #title>
                            教学工具
                        </template>
                        <el-menu-item index="/whiteboards">白板</el-menu-item>
                        <el-menu-item index="/notes">笔记</el-menu-item>
                    </el-sub-menu>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import avatar from '@/assets/img/avatar.jpg'

export default {
    data() {
        return {
            avatar,
        }
    },
    computed: {
        menuActive() {
            const { name, query, path } = this.$route
            if (name === 'User' && query.sex) {
                return `/male-users`
            }
            if (path.startsWith('/notes')) {
                return '/notes'
            }
            return this.$route.path
        }
    },
    methods: {
        logout() {
            this.$router.replace('/login')
        }
    },
}
</script>

<style scoped>
.base-layout {
    min-height: 100vh;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #151515;
}

.logo {
    font-family: TsangerYuYangT;
    color: #fff;
    text-decoration: none;
    font-size: var(--el-font-size-extra-large);
}

.nav {
    --el-menu-bg-color: transparent;
    --el-menu-hover-bg-color: #333;
    --el-bg-color-overlay: #333;
    --el-menu-text-color: #fff;
    --el-menu-hover-text-color: #fff;
    --el-menu-active-color: #fff;
    --el-menu-item-height: var(--el-header-height);
    height: var(--el-header-height);
}

.header :deep(.el-menu--horizontal),
.header :deep(.el-menu--horizontal > .el-menu-item),
.header :deep(.el-menu--horizontal > .el-sub-menu .el-sub-menu__title) {
    border-bottom: 0;
}

.nav :deep(.el-badge__content.is-fixed) {
    transform: translate(calc(100% - 16px), calc(-50% + 20px));
}

.avatar {
    margin-right: 8px;
}

.menu {
    height: 100%;
}
</style>
