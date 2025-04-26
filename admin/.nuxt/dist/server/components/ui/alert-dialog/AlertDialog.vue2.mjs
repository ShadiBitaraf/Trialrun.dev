import { defineComponent, unref, mergeProps, withCtx, renderSlot } from "vue";
import { ssrRenderComponent, ssrRenderSlot } from "vue/server-renderer";
import { useForwardPropsEmits, AlertDialogRoot } from "reka-ui";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AlertDialog",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    defaultOpen: { type: Boolean }
  },
  emits: ["update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const forwarded = useForwardPropsEmits(props, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(AlertDialogRoot), mergeProps({ "data-slot": "alert-dialog" }, unref(forwarded), _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
export {
  _sfc_main as default
};
//# sourceMappingURL=AlertDialog.vue2.mjs.map
