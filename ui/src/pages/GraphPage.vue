<script setup lang="ts">
import { GraphMaker, GraphMakerProps } from '@milaboratories/graph-maker';
import '@milaboratories/graph-maker/styles';
import { useApp } from '../app';

const app = useApp();

const defaultOptions: GraphMakerProps['defaultOptions'] = [
  {
    inputName: 'y',
    selectedSource: {
      kind: 'PColumn',
      valueType: 'Float',
      name: 'pl7.app/vdj/diversity',
      axesSpec: [
        {
          type: 'String',
          name: 'pl7.app/sampleId'
        },
        {
          type: 'String',
          name: 'pl7.app/vdj/diversityMeasure'
        }
      ]
    }
  },
  {
    inputName: 'facetBy',
    selectedSource: {
      type: 'String',
      name: 'pl7.app/vdj/chain'
    }
  },
  {
    inputName: 'tabBy',
    selectedSource: {
      type: 'String',
      name: 'pl7.app/vdj/diversityMeasure'
    }
  },
  {
    inputName: 'primaryGrouping',
    selectedSource: {
      type: 'String',
      name: 'pl7.app/sampleId'
    }
  }
];
</script>

<template>
  <GraphMaker
    chart-type="discrete"
    :p-frame="app.model.outputs.pf"
    v-model="app.model.ui.graphState"
    :default-options="defaultOptions"
  />
</template>
