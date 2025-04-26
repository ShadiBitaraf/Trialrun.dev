import { defineComponent, computed, unref, mergeProps, withCtx, renderSlot } from "vue";
import { ssrRenderComponent, ssrRenderSlot } from "vue/server-renderer";
import { cn } from "../../../.nuxt/shadcn-nuxt/utils.mjs";
import { buttonVariants } from "../button/index.mjs";
import { AlertDialogAction } from "reka-ui";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AlertDialogAction",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(AlertDialogAction), mergeProps(delegatedProps.value, {
        class: unref(cn)(unref(buttonVariants)(), props.class)
      }, _attrs), {
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
//# sourceMappingURL=AlertDialogAction.vue2.mjs.map
