<template>
    <div class="contributors">
        <div v-for="(contributor, index) of $page.contributors" :key="index" class="contributor">
            <img :style="$page.avatarSize" :class="[contributor.avatarClass, $page.avatarStyle]" :src="contributor.avatarUrl"/>
            <span class="name">{{ contributor.name }}</span>
            <span :class="contributor.countClass">{{ contributor.count }}</span>
        </div>
    </div>
</template>

<script>
</script>

<style>
</style>