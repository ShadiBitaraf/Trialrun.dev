import "./components/ui/tabs/Tabs.vue.mjs";
import "./components/ui/tabs/TabsContent.vue.mjs";
import "./components/ui/tabs/TabsList.vue.mjs";
import "./components/ui/tabs/TabsTrigger.vue.mjs";
import _sfc_main$5 from "./components/DemoConfigList.vue.mjs";
import _sfc_main$6 from "./components/DemoConfigForm.vue.mjs";
import { ref, mergeProps, withCtx, createTextVNode, createVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { useAppConfig } from "./node_modules/nuxt/dist/app/config.mjs";
import _sfc_main$1 from "./components/ui/tabs/Tabs.vue2.mjs";
import _sfc_main$2 from "./components/ui/tabs/TabsList.vue2.mjs";
import _sfc_main$3 from "./components/ui/tabs/TabsTrigger.vue2.mjs";
import _sfc_main$4 from "./components/ui/tabs/TabsContent.vue2.mjs";
const _sfc_main = {
  __name: "app",
  __ssrInlineRender: true,
  setup(__props) {
    const appConfig = useAppConfig();
    appConfig.ui = appConfig.ui || {};
    appConfig.ui.primary = "#FF8A3D";
    const currentConfig = ref(null);
    const activeTab = ref("list");
    function createNewConfig() {
      currentConfig.value = null;
      activeTab.value = "create";
    }
    function editConfig(config) {
      currentConfig.value = config;
      activeTab.value = "create";
    }
    function handleSaved() {
      currentConfig.value = null;
      activeTab.value = "list";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Tabs = _sfc_main$1;
      const _component_TabsList = _sfc_main$2;
      const _component_TabsTrigger = _sfc_main$3;
      const _component_TabsContent = _sfc_main$4;
      const _component_DemoConfigList = _sfc_main$5;
      const _component_DemoConfigForm = _sfc_main$6;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))}><header class="bg-primary shadow-md"><div class="container mx-auto px-4 py-3"><h1 class="text-white text-xl font-bold">Demo Config Admin Dashboard</h1></div></header><main class="container mx-auto p-4">`);
      _push(ssrRenderComponent(_component_Tabs, {
        modelValue: activeTab.value,
        "onUpdate:modelValue": ($event) => activeTab.value = $event,
        class: "w-full"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_TabsList, { class: "mb-4" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_TabsTrigger, { value: "list" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Demo Configs List`);
                      } else {
                        return [
                          createTextVNode("Demo Configs List")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_TabsTrigger, { value: "create" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Create/Edit Demo Config`);
                      } else {
                        return [
                          createTextVNode("Create/Edit Demo Config")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_TabsTrigger, { value: "list" }, {
                      default: withCtx(() => [
                        createTextVNode("Demo Configs List")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_TabsTrigger, { value: "create" }, {
                      default: withCtx(() => [
                        createTextVNode("Create/Edit Demo Config")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_TabsContent, { value: "list" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="mb-4"${_scopeId2}><button class="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90"${_scopeId2}> Create New Demo Config </button></div>`);
                  _push3(ssrRenderComponent(_component_DemoConfigList, { onEdit: editConfig }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode("div", { class: "mb-4" }, [
                      createVNode("button", {
                        onClick: createNewConfig,
                        class: "px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90"
                      }, " Create New Demo Config ")
                    ]),
                    createVNode(_component_DemoConfigList, { onEdit: editConfig })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_TabsContent, { value: "create" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_DemoConfigForm, {
                    config: currentConfig.value,
                    onSaved: handleSaved
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_DemoConfigForm, {
                      config: currentConfig.value,
                      onSaved: handleSaved
                    }, null, 8, ["config"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_TabsList, { class: "mb-4" }, {
                default: withCtx(() => [
                  createVNode(_component_TabsTrigger, { value: "list" }, {
                    default: withCtx(() => [
                      createTextVNode("Demo Configs List")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_TabsTrigger, { value: "create" }, {
                    default: withCtx(() => [
                      createTextVNode("Create/Edit Demo Config")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(_component_TabsContent, { value: "list" }, {
                default: withCtx(() => [
                  createVNode("div", { class: "mb-4" }, [
                    createVNode("button", {
                      onClick: createNewConfig,
                      class: "px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90"
                    }, " Create New Demo Config ")
                  ]),
                  createVNode(_component_DemoConfigList, { onEdit: editConfig })
                ]),
                _: 1
              }),
              createVNode(_component_TabsContent, { value: "create" }, {
                default: withCtx(() => [
                  createVNode(_component_DemoConfigForm, {
                    config: currentConfig.value,
                    onSaved: handleSaved
                  }, null, 8, ["config"])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</main></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=app.vue.mjs.map
