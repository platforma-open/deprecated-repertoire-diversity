<script setup lang="ts">
import { GraphMaker, GraphMakerSettings } from "@milaboratories/graph-maker";
import '@milaboratories/graph-maker/styles';
import { useApp } from "../app";

const app = useApp();

// @TODO move to defaultUi when implemented in the model
if (app.ui.graphState === undefined) {
    app.model.ui.graphState = {
        title: "Diversity Analysis",
        chartType: "discrete",
        template: "box"
    } satisfies GraphMakerSettings
};
</script>

<template>
    <GraphMaker :pFrame="app.model.outputs.pf" v-model="app.model.ui.graphState" />
</template>