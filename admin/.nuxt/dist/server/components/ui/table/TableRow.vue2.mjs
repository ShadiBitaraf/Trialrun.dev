import { defineComponent, mergeProps, unref } from "vue";
import { ssrRenderAttrs, ssrRenderSlot } from "vue/server-renderer";
import { cn } from "../../../.nuxt/shadcn-nuxt/utils.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "TableRow",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<tr${ssrRenderAttrs(mergeProps({
        "data-slot": "table-row",
        class: unref(cn)("hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</tr>`);
    };
  }
});
export {
  _sfc_main as default
};
//# sourceMappingURL=TableRow.vue2.mjs.map
