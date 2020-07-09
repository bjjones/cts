export const description = `
API Validation Tests for RenderPass StoreOp.
`;

import { makeTestGroup } from '../../../../common/framework/test_group.js';

import { ValidationTest } from './../validation_test.js';

export const g = makeTestGroup(ValidationTest);

g.test('depthStoreOp_must_be_store_when_depthReadOnly_is_true').fn(async t => {
  const depthAttachment = t.device.createTexture({
    format: 'depth24plus-stencil8',
    size: { width: 1, height: 1, depth: 1 },
    usage: GPUTextureUsage.COPY_SRC | GPUTextureUsage.OUTPUT_ATTACHMENT,
  });
  const depthAttachmentView = depthAttachment.createView();

  // Create a valid pass for control.
  const validEncoder = t.device.createCommandEncoder();
  const validPass = validEncoder.beginRenderPass({
    colorAttachments: [],
    depthStencilAttachment: {
      attachment: depthAttachmentView,
      depthLoadValue: 'load',
      depthStoreOp: 'clear',
      depthReadOnly: false,
      stencilLoadValue: 'load',
      stencilStoreOp: 'clear',
      stencilReadOnly: false,
    },
  });
  validPass.endPass();

  // A valid pass should succeed.
  t.device.defaultQueue.submit([validEncoder.finish()]);

  // Create an invalid pass with depthReadOnly=true and depthStoreOp='clear'.
  const invalidEncoder = t.device.createCommandEncoder();
  const invalidPass = invalidEncoder.beginRenderPass({
    colorAttachments: [],
    depthStencilAttachment: {
      attachment: depthAttachmentView,
      depthLoadValue: 'load',
      depthStoreOp: 'clear',
      depthReadOnly: true,
      stencilLoadValue: 'load',
      stencilStoreOp: 'clear',
      stencilReadOnly: false,
    },
  });
  invalidPass.endPass();

  // Using depthReadOnly=true and depthStoreOp='clear' should cause a validation error.
  t.expectValidationError(() => {
    t.device.defaultQueue.submit([invalidEncoder.finish()]);
  });
});

g.test('stencilStoreOp_must_be_store_when_stencilReadOnly_is_true').fn(async t => {
  const depthAttachment = t.device.createTexture({
    format: 'depth24plus-stencil8',
    size: { width: 1, height: 1, depth: 1 },
    usage: GPUTextureUsage.COPY_SRC | GPUTextureUsage.OUTPUT_ATTACHMENT,
  });
  const depthAttachmentView = depthAttachment.createView();

  // Create valid pass for control.
  const validEncoder = t.device.createCommandEncoder();
  const validPass = validEncoder.beginRenderPass({
    colorAttachments: [],
    depthStencilAttachment: {
      attachment: depthAttachmentView,
      depthLoadValue: 'load',
      depthStoreOp: 'clear',
      depthReadOnly: false,
      stencilLoadValue: 'load',
      stencilStoreOp: 'clear',
      stencilReadOnly: false,
    },
  });
  validPass.endPass();

  // A valid pass should succeed.
  t.device.defaultQueue.submit([validEncoder.finish()]);

  // Create an invalid pass with stencilReadOnly=true and stencilStoreOp='clear'.
  const invalidEncoder = t.device.createCommandEncoder();
  const invalidPass = invalidEncoder.beginRenderPass({
    colorAttachments: [],
    depthStencilAttachment: {
      attachment: depthAttachmentView,
      depthLoadValue: 'load',
      depthStoreOp: 'clear',
      depthReadOnly: false,
      stencilLoadValue: 'load',
      stencilStoreOp: 'clear',
      stencilReadOnly: true,
    },
  });
  invalidPass.endPass();

  // Using stencilReadOnly=true and stencilStoreOp='clear' should cause a validation error.
  t.expectValidationError(() => {
    t.device.defaultQueue.submit([invalidEncoder.finish()]);
  });
});

g.test('depthReadOnly_must_be_the_same_as_stencilReadOnly').fn(async t => {
  const depthAttachment = t.device.createTexture({
    format: 'depth24plus-stencil8',
    size: { width: 1, height: 1, depth: 1 },
    usage: GPUTextureUsage.COPY_SRC | GPUTextureUsage.OUTPUT_ATTACHMENT,
  });
  const depthAttachmentView = depthAttachment.createView();

  // Create valid read-only pass for control.
  const validEncoder = t.device.createCommandEncoder();
  const validPass = validEncoder.beginRenderPass({
    colorAttachments: [],
    depthStencilAttachment: {
      attachment: depthAttachmentView,
      depthLoadValue: 'load',
      depthStoreOp: 'store',
      depthReadOnly: false,
      stencilLoadValue: 'load',
      stencilStoreOp: 'store',
      stencilReadOnly: false,
    },
  });
  validPass.endPass();

  // Valid pass should succeed.
  t.device.defaultQueue.submit([validEncoder.finish()]);

  // Create an invalid pass that is read-only, but with mismatched depthReadOnly and stencilReadOnly values.
  const invalidEncoder = t.device.createCommandEncoder();
  const invalidPass = invalidEncoder.beginRenderPass({
    colorAttachments: [],
    depthStencilAttachment: {
      attachment: depthAttachmentView,
      depthLoadValue: 'load',
      depthStoreOp: 'store',
      depthReadOnly: false,
      stencilLoadValue: 'load',
      stencilStoreOp: 'store',
      stencilReadOnly: true,
    },
  });
  invalidPass.endPass();

  // Mismatched depthReadOnly and stencilReadOnly values should cause a validation error.
  t.expectValidationError(() => {
    t.device.defaultQueue.submit([invalidEncoder.finish()]);
  });
});
