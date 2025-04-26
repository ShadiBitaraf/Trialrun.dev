import { defineComponent, mergeProps, unref } from "vue";
import { ssrRenderAttrs, ssrRenderSlot } from "vue/server-renderer";
import { cn } from "../../../.nuxt/shadcn-nuxt/utils.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AlertDialogHeader",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        "data-slot": "alert-dialog-header",
        class: unref(cn)("flex flex-col gap-2 text-center sm:text-left", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
export {
  _sfc_main as default
};
//# sourceMappingURL=AlertDialogHeader.vue2.mjs.map
