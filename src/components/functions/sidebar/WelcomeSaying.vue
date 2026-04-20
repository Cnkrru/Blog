<script setup>
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()

const navigateToChangelog = () => {
  router.push('/changelog')
}
</script>

<template>
  <div class="welcome-saying-card">
    <p @click="navigateToChangelog" class="welcome-link">{{ t('welcome') }}</p>
  </div>
</template>

<style scoped>
/*==========欢迎语样式==========*/
.welcome-saying-card {
    width: 90%;
    height: fit-content;
    margin: 4px auto;
    text-align: center;
}

.welcome-saying-card p {
    font-size: 14px;
    font-style: italic;
    font-family: "Microsoft YaHei", sans-serif;
    line-height: normal;
}

.welcome-link {
    cursor: pointer;
    user-select: none;
}

.welcome-link:active {
    transform: none;
}

</style>
