import { applyCodeRefSymbol } from '@console/dynamic-plugin-sdk/src/coderefs/coderef-resolver';
import { Plugin } from '@console/plugin-sdk';
import {
  TopologyDecoratorProvider,
  TopologyDataModelFactory,
} from '@console/topology/src/extensions/topology';
import { TopologyDecoratorQuadrant } from '@console/topology/src/topology-types';
import { FLAG_OPENSHIFT_PIPELINE } from '../const';
import { tknPipelineAndPipelineRunsWatchResources } from '../utils/pipeline-plugin-utils';
import { getPipelineRunDecorator } from './build-decorators';

const getDataModelReconciler = () =>
  import(
    './getPipelinesDataModelReconciler' /* webpackChunkName: "operators-topology-components" */
  ).then((m) => m.getPipelinesDataModelReconciler);

export type PipelineTopologyConsumedExtensions =
  | TopologyDecoratorProvider
  | TopologyDataModelFactory;

export const pipelinesTopologyPlugin: Plugin<PipelineTopologyConsumedExtensions> = [
  {
    type: 'Topology/DataModelFactory',
    properties: {
      id: 'pipeline-topology-model-factory',
      priority: 800,
      resources: tknPipelineAndPipelineRunsWatchResources,
      getDataModelReconciler: applyCodeRefSymbol(getDataModelReconciler),
    },
    flags: {
      required: [FLAG_OPENSHIFT_PIPELINE],
    },
  },
  {
    type: 'Topology/Decorator',
    properties: {
      id: 'pipeline-run-decorator',
      priority: 100,
      quadrant: TopologyDecoratorQuadrant.lowerLeft,
      decorator: applyCodeRefSymbol(getPipelineRunDecorator),
    },
    flags: {
      required: [FLAG_OPENSHIFT_PIPELINE],
    },
  },
];
