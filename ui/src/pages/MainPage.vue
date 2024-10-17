<script setup lang="ts">
import { PlAgDataTable, PlBlockPage, PlBtnGroup, PlBtnPrimary, PlCheckbox, PlDataTableSettings, PlDropdownRef, PlNumberField, PlSlideModal, PlTooltip } from '@platforma-sdk/ui-vue';
import { computed, ref, watch } from 'vue';
import { useApp } from '../app';

const app = useApp();

// @TODO move to defaultUi when implemented in the model
if (app.ui === undefined) {
  app.model.ui = {
    weight: 'auto',
    downsampling: {
      type: 'auto',
      tag: 'read',
      countNorm: 'auto',
      countNormValue: 1000,
      topValue: 1000,
      cumtopValue: 50
    }
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

// const splitBy = 
const settingsAreShown = ref(app.model.outputs.pt === undefined)
const showSettings = () => { settingsAreShown.value = true }

const parseTags = (str: string) => {
  if (str === '') return [];
  return str.split(',');
}
const cellTags = computed(() => parseTags(app.model.outputs.datasetSpec?.annotations?.['mixcr.com/cellTags'] ?? ''))
const umiTags = computed(() => parseTags(app.model.outputs.datasetSpec?.annotations?.['mixcr.com/umiTags'] ?? ''))

const hasCellTags = computed(() => cellTags.value.length !== 0);
const hasUmiTags = computed(() => umiTags.value.length !== 0)

const tagOptions = computed(() => {
  const options = [
    {
      label: "Read",
      value: "read"
    }]
  if (hasUmiTags.value) {
    options.push({
      label: "UMI",
      value: "umi"
    })
  }
  if (hasCellTags.value) {
    options.push({
      label: "Cell",
      value: "cell"
    })
  }
  return options.map((o) => ({ text: o.label, value: o.value }));
});

const weightOptions = computed(() => {

  const options = [{
    label: "Auto",
    value: "auto"
  },
  ...tagOptions.value.map((o) => ({ label: o.text, value: o.value })), // @TODO (:
  {
    label: "None",
    value: "none"
  }]
  return options.map((o) => ({ text: o.label, value: o.value }));
});

const downsamplingType = [
  {
    label: 'Auto',
    value: 'auto'
  },
  {
    label: 'Count',
    value: 'count'
  },
  {
    label: 'Top',
    value: 'top'
  },
  {
    label: 'Cumtop',
    value: 'cumtop'
  },
  {
    label: 'None',
    value: 'none'
  }
].map((o) => ({ text: o.label, value: o.value }));

const countNormOptions = [
  {
    label: 'Auto',
    value: 'auto'
  },
  {
    label: 'Min',
    value: 'min'
  },
  {
    label: 'Fixed',
    value: 'fixed'
  }
].map((o) => ({ text: o.label, value: o.value }));


const defaultWt = computed<'read' | 'umi' | 'cell'>(() => {
  if (hasCellTags.value) {
    return 'cell';
  } else if (hasUmiTags.value) {
    return 'umi';
  } else {
    return 'read'
  }
})

watch(() => app.model.ui.downsampling, (downsampling) => {

  console.log("form changed", app.model.args.downsampling);

  switch (downsampling.type) {
    case 'auto':
      app.model.args.downsampling = 'count-' + defaultWt.value + '-auto';
      break;

    case 'count':
      let r = 'count-' + downsampling.tag + '-' + downsampling.countNorm;
      if (downsampling.countNorm === 'fixed') {
        r = r + '-' + downsampling.countNormValue;
      }
      app.model.args.downsampling = r;
      break;

    case 'top':
      app.model.args.downsampling = 'top-' + downsampling.tag + '-' + downsampling.topValue;
      break;

    case 'cumtop':
      app.model.args.downsampling = 'cumtop-' + downsampling.tag + '-' + downsampling.cumtopValue;
      break;

    case 'none':
      app.model.args.downsampling = 'none';
      break;
  }
  console.log("after switch", JSON.stringify(app.model.args));
}, { immediate: true });

watch(() => app.model.ui.weight, (weight) => {
  if (weight === 'auto') {
    app.model.args.weightFunction = defaultWt.value;
  } else {
    app.model.args.weightFunction = weight;
  }
}, { immediate: true })

</script>

<template>
  <PlBlockPage>
    <template #title>Repertoire Diversity Analysis</template>
    <template #append>
      <PlBtnPrimary :icon="'settings-2'" @click.stop="showSettings">Settings</PlBtnPrimary>
    </template>

    <PlSlideModal v-model="settingsAreShown">
      <template #title>Settings</template>
      <PlDropdownRef v-model="app.model.args.clnsRef" :options="app.model.outputs.clnsOptions ?? []"
        label="Select dataset" />

      <PlCheckbox v-model="app.model.args.onlyProductive">
        <template #tooltip>Filter out-of-frame sequences and sequences with stop-codons.</template>
        Only productive
      </PlCheckbox>
      <PlCheckbox v-model="app.model.args.dropOutliers">
        <div style="display: flex; gap: 6px">
          Drop outliers <PlTooltip class="info" position="top">
            <template #tooltip>
              Drop samples which are below downsampling value as computed according to specified default downsampling
              option.
            </template>
          </PlTooltip>
        </div>
      </PlCheckbox>

      <PlBtnGroup v-model="app.model.ui.weight" :options="weightOptions" label="Weight function">
        <template #tooltip>How to calculate weight of each clonotype</template>
      </PlBtnGroup>

      <PlBtnGroup v-model="app.model.ui.downsampling.type" :options="downsamplingType" label="Downsampling">
        <template #tooltip>Downsampling is a required procedure without which it is not possible to make a statistical
          comparisons between datasets.</template>
      </PlBtnGroup>

      <PlBtnGroup
        v-if="app.model.ui.downsampling.type !== 'auto' && app.model.ui.downsampling.type !== 'none' && tagOptions.length > 1"
        v-model="app.model.ui.downsampling.tag" :options="tagOptions" label="Tag type">
        <template #tooltip>Downsample by specified tag</template>
      </PlBtnGroup>

      <template v-if="app.model.ui.downsampling.type === 'count'">
        <PlBtnGroup v-model="app.model.ui.downsampling.countNorm" :options="countNormOptions"
          label="Normalization type">
        </PlBtnGroup>

        <PlNumberField v-if="app.model.ui.downsampling.countNorm === 'fixed'"
          v-model="app.model.ui.downsampling.countNormValue" label="Downsampling value" />

      </template>
      <template v-if="app.model.ui.downsampling.type === 'top'">
        <PlNumberField v-model="app.model.ui.downsampling.topValue" label="Choose top" :minValue="0" />
      </template>
      <template v-if="app.model.ui.downsampling.type === 'cumtop'">
        <PlNumberField v-model="app.model.ui.downsampling.cumtopValue" label="Choose top percent" :minValue="0"
          :maxValue="100" />
      </template>
    </PlSlideModal>

    <PlAgDataTable :settings="tableSettings" v-model="app.model.ui.tableState" />

  </PlBlockPage>
</template>
