import { defineComponent, createVNode } from 'file:///home/terashima/openai-api-test/node_modules/vue/index.mjs';
import { c as createError } from '../server.mjs';
import 'file:///home/terashima/openai-api-test/node_modules/ofetch/dist/node.mjs';
import 'file:///home/terashima/openai-api-test/node_modules/hookable/dist/index.mjs';
import 'file:///home/terashima/openai-api-test/node_modules/unctx/dist/index.mjs';
import 'file:///home/terashima/openai-api-test/node_modules/@unhead/ssr/dist/index.mjs';
import 'file:///home/terashima/openai-api-test/node_modules/unhead/dist/index.mjs';
import 'file:///home/terashima/openai-api-test/node_modules/@unhead/shared/dist/index.mjs';
import 'file:///home/terashima/openai-api-test/node_modules/ufo/dist/index.mjs';
import 'file:///home/terashima/openai-api-test/node_modules/h3/dist/index.mjs';
import 'file:///home/terashima/openai-api-test/node_modules/openai/dist/index.js';
import 'file:///home/terashima/openai-api-test/node_modules/vue/server-renderer/index.mjs';
import '../../nitro/nitro-prerenderer.mjs';
import 'file:///home/terashima/openai-api-test/node_modules/node-fetch-native/dist/polyfill.mjs';
import 'file:///home/terashima/openai-api-test/node_modules/destr/dist/index.mjs';
import 'file:///home/terashima/openai-api-test/node_modules/unenv/runtime/fetch/index.mjs';
import 'file:///home/terashima/openai-api-test/node_modules/scule/dist/index.mjs';
import 'file:///home/terashima/openai-api-test/node_modules/defu/dist/defu.mjs';
import 'file:///home/terashima/openai-api-test/node_modules/ohash/dist/index.mjs';
import 'file:///home/terashima/openai-api-test/node_modules/unstorage/dist/index.mjs';
import 'file:///home/terashima/openai-api-test/node_modules/unstorage/drivers/fs.mjs';
import 'file:///home/terashima/openai-api-test/node_modules/radix3/dist/index.mjs';

const components_islands = {};
const islandComponents = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  default: components_islands
});
const islandRenderer = /* @__PURE__ */ defineComponent({
  props: {
    context: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const component = islandComponents[props.context.name];
    if (!component) {
      throw createError({
        statusCode: 404,
        statusMessage: `Island component not found: ${JSON.stringify(component)}`
      });
    }
    return () => createVNode(component || "span", props.context.props);
  }
});

export { islandRenderer as default };
//# sourceMappingURL=island-renderer-61ca116a.mjs.map
