<template>
    <span class="contributors">
        <ul>
            <li v-for="(contributor, index) of $page.contributors">
                <img :class="contributor.avatarClass" :src="contributor.avatarUrl" :height="$page.avatarSize"/><span class="name">{{ contributor.name }}</span><span :class="contributor.countClass">{{ contributor.count }}</span>
            </li>
        </ul>
    </span>
</template>

<script>
</script>

<style>
</style>