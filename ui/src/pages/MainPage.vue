<script setup lang="ts">
import { PTableColumnSpec } from '@platforma-sdk/model';
import { PlAgDataTable, PlAgDataTableToolsPanel, PlBlockPage, PlBtnGhost, PlDataTableSettings, PlEditableTitle, PlMaskIcon24 } from '@platforma-sdk/ui-vue';
import { computed, ref } from 'vue';
import { useApp } from '../app';
import SettingsModal from './SettingsModal.vue';

const app = useApp();

const tableSettings = computed<PlDataTableSettings>(() => ({
  sourceType: "ptable",
  pTable: app.model.outputs.pt?.table,
  sheets: app.model.outputs.pt?.sheets,
}));

const settingsAreShown = ref(app.model.outputs.pt === undefined)
const showSettings = () => { settingsAreShown.value = true }
const columns = ref<PTableColumnSpec[]>([]);
</script>

<template>
  <PlBlockPage>
    <template #title>
      <PlEditableTitle max-width="600px" :max-length="40" v-model="app.model.ui.blockTitle" />
    </template>
    <template #append>
      <PlAgDataTableToolsPanel />

      <PlBtnGhost @click.stop="showSettings">Settings
        <template #append>
          <PlMaskIcon24 name="settings" />
        </template>
      </PlBtnGhost>
    </template>
    <PlAgDataTable v-if="app.model.ui" :settings="tableSettings" v-model="app.model.ui.tableState" show-columns-panel
      show-export-button ref="tableInstance" @columns-changed="(newColumns) => (columns = newColumns)" />
  </PlBlockPage>

  <SettingsModal v-model="settingsAreShown" />

</template>