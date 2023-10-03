import { AstBodyType } from "../client/api";

export const diffStr = `--- src/main/resources/sumFlow.yml
+++ src/main/resources/sumFlowNew.yml
@@ -7,6 +7,6 @@
     type: DECIMAL
   val2:
-    required: true
-    type: DECIMAL
+    required: false
+    type: INTEGER`;

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
    }
  ],
  decisions: [
    {
      name: 'decimalTest',
      type: 'DT'
    }
  ]
};