import { AstBodyType } from "../client/api";

interface ReleaseAsset<T extends AstBodyType> {
  name: string,
  type: T
}

export interface ReleasePreview {
  flows: ReleaseAsset<'FLOW'>[],
  services: ReleaseAsset<'FLOW_TASK'>[],
  decisions: ReleaseAsset<'DT'>[],
}

export const releasePreviewBase: ReleasePreview = {
  flows: [
    {
      name: 'sumFlow',
      type: 'FLOW'
    }
  ],
  services: [
    {
      name: 'SumTask',
      type: 'FLOW_TASK'
    }
  ],
  decisions: [
    {
      name: 'decimalTest',
      type: 'DT'
    },
    {
      name: 'testDt',
      type: 'DT'
    }
  ]
};

export const releasePreviewTarget: ReleasePreview = {
  flows: [
    {
      name: 'sumFlowNew',
      type: 'FLOW'
    }
  ],
  services: [
    {
      name: 'SumTask',
      type: 'FLOW_TASK'
    },
    {
      name: 'FlowTask',
      type: 'FLOW_TASK'
    }
  ],
  decisions: [
    {
      name: 'decimalTest',
      type: 'DT'
    }
  ]
};