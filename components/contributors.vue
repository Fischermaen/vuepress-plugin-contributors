<template>
    <div class="contributors">
        <ul>
            <li v-for="(contributor, index) of $page.contributors">
                {{ contributor.name}}
            </li>
        </ul>
    </div>
</template>

<script>
</script>

<style>
</style>