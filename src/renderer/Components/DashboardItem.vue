<template>
    <v-card>
        <v-card-title class="secondary darken-2">
            <h3>{{ title }}</h3>
        </v-card-title>
        <v-card-text>
            <slot></slot>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    props: ["title"]
}
</script>

<style>

</style>
