<script setup lang="ts">
import { GraphMaker, type GraphMakerSettings} from "@milaboratories/graph-maker";
import "@milaboratories/graph-maker/styles";
import { ref } from 'vue';
import { useApp } from "../app";

const app = useApp();

const settings = ref({
    title: "Diversity Analysis",
    chartType: "discrete",
    template: "box"
} satisfies GraphMakerSettings);
</script>

<template>
    <GraphMaker :pFrame="app.model.outputs.pf" v-model="settings" />
</template>