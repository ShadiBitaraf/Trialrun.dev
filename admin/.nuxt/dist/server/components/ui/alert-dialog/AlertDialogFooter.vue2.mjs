import { defineComponent, mergeProps, unref } from "vue";
import { ssrRenderAttrs, ssrRenderSlot } from "vue/server-renderer";
import { cn } from "../../../.nuxt/shadcn-nuxt/utils.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AlertDialogFooter",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        "data-slot": "alert-dialog-footer",
        class: unref(cn)(
          "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
          props.class
        )
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
export {
  _sfc_main as default
};
//# sourceMappingURL=AlertDialogFooter.vue2.mjs.map
