import {
  BlockModel,
  createPlDataTable,
  InferOutputsType,
  isPColumnSpec,
  PlDataTableState,
  Ref
} from '@platforma-sdk/model';

type WeightFunction = 'auto' | 'read' | 'umi' | 'cell' | 'none';

type DownsamplingForm = {
  type: 'auto' | 'count' | 'top' | 'cumtop' | 'none';
  tag: 'read' | 'umi' | 'cell';
  countNorm: 'auto' | 'min' | 'fixed';
  countNormValue: number;
  topValue: number;
  cumtopValue: number;
};

/**
 * UI state
 */
export type UiState = {
  tableState?: PlDataTableState;
  weight: WeightFunction;
  downsampling: DownsamplingForm;
};

export type BlockArgs = {
  clnsRef?: Ref;
  onlyProductive: boolean;
  dropOutliers: boolean;
  downsampling?: string;
  weightFunction?: 'read' | 'umi' | 'cell' | 'none';
};

export const model = BlockModel.create<BlockArgs, UiState>()
  .initialArgs({
    onlyProductive: true,
    dropOutliers: false
  })

  .argsValid((ctx) => ctx.args.downsampling !== undefined && ctx.args.weightFunction !== undefined)

  .output('clnsOptions', (ctx) =>
    ctx.resultPool.getOptions((spec) => isPColumnSpec(spec) && spec.name === 'mixcr.com/clns')
  )

  .output('datasetSpec', (ctx) => {
    if (ctx.args.clnsRef) return ctx.resultPool.getSpecByRef(ctx.args.clnsRef);
    else return undefined;
  })

  .output('pt', (ctx) => {
    const pCols = ctx.outputs?.resolve('pf')?.getPColumns();
    if (pCols === undefined) {
      return undefined;
    }

    return createPlDataTable(ctx, pCols, ctx.uiState?.tableState);
  })

  .output('message', (ctx) => ctx.outputs?.resolve('message')?.getDataAsJson())

  .sections([{ type: 'link', href: '/', label: 'Main' }])

  .done();

export type BlockOutputs = InferOutputsType<typeof model>;
