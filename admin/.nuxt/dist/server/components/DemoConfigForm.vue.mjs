import "./ui/input/Input.vue.mjs";
import "./ui/textarea/Textarea.vue.mjs";
import "./ui/switch/Switch.vue.mjs";
import "./ui/button/index.mjs";
import { ref, computed, watch, resolveComponent, mergeProps, withCtx, createTextVNode, toDisplayString, unref, createBlock, createCommentVNode, openBlock, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from "vue/server-renderer";
import "firebase/firestore";
import { Loader2 } from "lucide-vue-next";
import { useNuxtApp } from "../node_modules/nuxt/dist/app/nuxt.mjs";
import _sfc_main$1 from "./ui/input/Input.vue2.mjs";
import _sfc_main$2 from "./ui/textarea/Textarea.vue2.mjs";
import _sfc_main$3 from "./ui/switch/Switch.vue2.mjs";
import "./ui/button/Button.vue.mjs";
import _sfc_main$4 from "./ui/button/Button.vue2.mjs";
const _sfc_main = {
  __name: "DemoConfigForm",
  __ssrInlineRender: true,
  props: {
    config: {
      type: Object,
      default: null
    }
  },
  emits: ["saved"],
  setup(__props, { emit: __emit }) {
    const { $firebase } = useNuxtApp();
    $firebase.db;
    const props = __props;
    const emit = __emit;
    const defaultForm = {
      name: "",
      description: "",
      settings: {},
      isActive: true
    };
    const form = ref({ ...defaultForm });
    const settingsJson = ref("{}");
    const jsonError = ref("");
    const saving = ref(false);
    const isEditing = computed(() => !!props.config);
    watch(() => props.config, (newConfig) => {
      if (newConfig) {
        form.value = { ...newConfig };
        settingsJson.value = JSON.stringify(newConfig.settings || {}, null, 2);
      } else {
        resetForm();
      }
    }, { immediate: true });
    function validateJson() {
      try {
        if (settingsJson.value) {
          JSON.parse(settingsJson.value);
          jsonError.value = "";
          return true;
        }
        return true;
      } catch (e) {
        jsonError.value = "Invalid JSON format";
        return false;
      }
    }
    function resetForm() {
      if (isEditing.value) {
        emit("saved");
      } else {
        form.value = { ...defaultForm };
        settingsJson.value = "{}";
        jsonError.value = "";
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Label = resolveComponent("Label");
      const _component_Input = _sfc_main$1;
      const _component_Textarea = _sfc_main$2;
      const _component_Switch = _sfc_main$3;
      const _component_Button = _sfc_main$4;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white rounded-lg shadow-md p-6" }, _attrs))}><h2 class="text-xl font-bold mb-6">${ssrInterpolate(isEditing.value ? "Edit" : "Create")} Demo Configuration</h2><form><div class="space-y-4"><div class="grid grid-cols-1 gap-4"><div class="space-y-2">`);
      _push(ssrRenderComponent(_component_Label, { for: "name" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Name`);
          } else {
            return [
              createTextVNode("Name")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Input, {
        id: "name",
        modelValue: form.value.name,
        "onUpdate:modelValue": ($event) => form.value.name = $event,
        required: "",
        placeholder: "Enter configuration name"
      }, null, _parent));
      _push(`</div><div class="space-y-2">`);
      _push(ssrRenderComponent(_component_Label, { for: "description" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Description`);
          } else {
            return [
              createTextVNode("Description")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Textarea, {
        id: "description",
        modelValue: form.value.description,
        "onUpdate:modelValue": ($event) => form.value.description = $event,
        placeholder: "Enter configuration description",
        rows: "3"
      }, null, _parent));
      _push(`</div><div class="space-y-2">`);
      _push(ssrRenderComponent(_component_Label, { for: "settings" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Settings (JSON)`);
          } else {
            return [
              createTextVNode("Settings (JSON)")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Textarea, {
        id: "settings",
        modelValue: settingsJson.value,
        "onUpdate:modelValue": ($event) => settingsJson.value = $event,
        placeholder: "Enter JSON settings",
        rows: "6",
        class: "font-mono text-sm",
        onBlur: validateJson
      }, null, _parent));
      if (jsonError.value) {
        _push(`<p class="text-red-500 text-sm">${ssrInterpolate(jsonError.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="space-y-2">`);
      _push(ssrRenderComponent(_component_Label, { for: "isActive" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Status`);
          } else {
            return [
              createTextVNode("Status")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex items-center space-x-2">`);
      _push(ssrRenderComponent(_component_Switch, {
        id: "isActive",
        modelValue: form.value.isActive,
        "onUpdate:modelValue": ($event) => form.value.isActive = $event
      }, null, _parent));
      _push(ssrRenderComponent(_component_Label, { for: "isActive" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(form.value.isActive ? "Active" : "Inactive")}`);
          } else {
            return [
              createTextVNode(toDisplayString(form.value.isActive ? "Active" : "Inactive"), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div><div class="flex justify-end space-x-2 pt-4">`);
      _push(ssrRenderComponent(_component_Button, {
        type: "button",
        variant: "outline",
        onClick: resetForm
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(isEditing.value ? "Cancel" : "Reset")}`);
          } else {
            return [
              createTextVNode(toDisplayString(isEditing.value ? "Cancel" : "Reset"), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Button, {
        type: "submit",
        disabled: saving.value
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (saving.value) {
              _push2(ssrRenderComponent(unref(Loader2), { class: "mr-2 h-4 w-4 animate-spin" }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(` ${ssrInterpolate(isEditing.value ? "Update" : "Create")} Config `);
          } else {
            return [
              saving.value ? (openBlock(), createBlock(unref(Loader2), {
                key: 0,
                class: "mr-2 h-4 w-4 animate-spin"
              })) : createCommentVNode("", true),
              createTextVNode(" " + toDisplayString(isEditing.value ? "Update" : "Create") + " Config ", 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></form></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/DemoConfigForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=DemoConfigForm.vue.mjs.map
