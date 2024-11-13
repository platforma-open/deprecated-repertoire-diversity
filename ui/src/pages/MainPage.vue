<script setup lang="ts">
import { GraphMakerSettings } from '@milaboratories/graph-maker';
import { PlAgDataTable, PlBlockPage, PlBtnGhost, PlDataTableSettings, PlMaskIcon24 } from '@platforma-sdk/ui-vue';
import { computed, ref } from 'vue';
import { useApp } from '../app';
import SettingsModal from './SettingsModal.vue';

const app = useApp();

// @TODO move to defaultUi when implemented in the model
if (app.ui === undefined) {
  app.model.ui = {
    weight: 'auto',
    tableState: {
      gridState: {},
      pTableParams: {
        sorting: [],
        filters: []
      }
    },
    downsampling: {
      type: 'auto',
      tag: 'read',
      countNorm: 'auto',
      countNormValue: 1000,
      topValue: 1000,
      cumtopValue: 80
    },
    graphState: {
      title: "Diversity Analysis",
      chartType: "discrete",
      template: "box",
      defaultOptions: [
        {
          inputName: "y",
          selectedSource: {
            kind: "PColumn",
            valueType: "Float",
            name: "pl7.app/vdj/diversity",
            axesSpec: [
              {
                type: "String",
                name: "pl7.app/sampleId"
              },
              {
                type: "String",
                name: "pl7.app/vdj/diversityMeasure"
              }
            ]
          }
        }
      ]
    } satisfies GraphMakerSettings
  }
};

const tableSettings = computed<PlDataTableSettings>(() => ({
  sourceType: "ptable",

  pTable: app.model.outputs.pt,

  sheets: [
    {
      axis: {
        name: "pl7.app/vdj/chain",
        type: "String",
      },
      options: [
        { text: "TRA", value: "TRA" },
        { text: "TRB", value: "TRB" },
        { text: "IGH", value: "IGH" },
        { text: "IGK", value: "IGK" },
        { text: "IGL", value: "IGL" },
      ],
      defaultValue: "IGH",
    },
  ],
} satisfies PlDataTableSettings));

const settingsAreShown = ref(app.model.outputs.pt === undefined)
const showSettings = () => { settingsAreShown.value = true }
</script>

<template>
  <PlBlockPage>
    <template #title>Repertoire Diversity Analysis</template>
    <template #append>
      <PlBtnGhost @click.stop="showSettings">Settings
        <template #append>
          <PlMaskIcon24 name="settings" />
        </template>
      </PlBtnGhost>
    </template>
    <PlAgDataTable v-if="app.model.ui" :settings="tableSettings" v-model="app.model.ui.tableState" />
  </PlBlockPage>

  <SettingsModal v-model="settingsAreShown" />

</template>