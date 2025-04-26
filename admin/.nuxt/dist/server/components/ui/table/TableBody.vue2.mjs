import { defineComponent, mergeProps, unref } from "vue";
import { ssrRenderAttrs, ssrRenderSlot } from "vue/server-renderer";
import { cn } from "../../../.nuxt/shadcn-nuxt/utils.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "TableBody",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<tbody${ssrRenderAttrs(mergeProps({
        "data-slot": "table-body",
        class: unref(cn)("[&_tr:last-child]:border-0", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</tbody>`);
    };
  }
});
export {
  _sfc_main as default
};
//# sourceMappingURL=TableBody.vue2.mjs.map
