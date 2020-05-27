<template>
    <div class="contributors">
        <div v-for="(contributor, index) of $page.contributors" :key="index" class="contributor">
            <img :style="$page.avatarSizeStyle" :class="[contributor.avatarClass, $page.avatarStyle]" :src="contributor.avatarUrls.normalRes" :srcset="[contributor.avatarUrls.retina, contributor.avatarUrls.uhd]"/>
            <a :target="contributor.userProfileUrl === '#' ? '_self' : '_blank'" :href="contributor.userProfileUrl === '#' ? 'javascript:void(0);' : contributor.userProfileUrl"><span class="name">{{ contributor.name }}</span></a>
            <span :class="contributor.countClass">{{ contributor.count }}</span>
        </div>
    </div>
</template>

<script>
</script>

<style>
</style>