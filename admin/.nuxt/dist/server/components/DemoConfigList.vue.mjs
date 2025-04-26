import "./ui/button/index.mjs";
import "./ui/table/Table.vue.mjs";
import "./ui/table/TableBody.vue.mjs";
import "./ui/table/TableCell.vue.mjs";
import "./ui/table/TableHead.vue.mjs";
import "./ui/table/TableHeader.vue.mjs";
import "./ui/table/TableRow.vue.mjs";
import "./ui/alert-dialog/AlertDialog.vue.mjs";
import "./ui/alert-dialog/AlertDialogAction.vue.mjs";
import "./ui/alert-dialog/AlertDialogCancel.vue.mjs";
import "./ui/alert-dialog/AlertDialogContent.vue.mjs";
import "./ui/alert-dialog/AlertDialogDescription.vue.mjs";
import "./ui/alert-dialog/AlertDialogFooter.vue.mjs";
import "./ui/alert-dialog/AlertDialogHeader.vue.mjs";
import "./ui/alert-dialog/AlertDialogTitle.vue.mjs";
import { ref, mergeProps, withCtx, unref, createVNode, createTextVNode, toDisplayString, createBlock, openBlock, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from "vue/server-renderer";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { RefreshCcw, Edit, Trash } from "lucide-vue-next";
import { useNuxtApp } from "../node_modules/nuxt/dist/app/nuxt.mjs";
import "./ui/button/Button.vue.mjs";
import _sfc_main$1 from "./ui/button/Button.vue2.mjs";
import _sfc_main$2 from "./ui/table/Table.vue2.mjs";
import _sfc_main$3 from "./ui/table/TableHeader.vue2.mjs";
import _sfc_main$4 from "./ui/table/TableRow.vue2.mjs";
import _sfc_main$5 from "./ui/table/TableHead.vue2.mjs";
import _sfc_main$6 from "./ui/table/TableBody.vue2.mjs";
import _sfc_main$7 from "./ui/table/TableCell.vue2.mjs";
import _sfc_main$8 from "./ui/alert-dialog/AlertDialog.vue2.mjs";
import _sfc_main$9 from "./ui/alert-dialog/AlertDialogContent.vue2.mjs";
import _sfc_main$a from "./ui/alert-dialog/AlertDialogHeader.vue2.mjs";
import _sfc_main$b from "./ui/alert-dialog/AlertDialogTitle.vue2.mjs";
import _sfc_main$c from "./ui/alert-dialog/AlertDialogDescription.vue2.mjs";
import _sfc_main$d from "./ui/alert-dialog/AlertDialogFooter.vue2.mjs";
import _sfc_main$e from "./ui/alert-dialog/AlertDialogCancel.vue2.mjs";
import _sfc_main$f from "./ui/alert-dialog/AlertDialogAction.vue2.mjs";
const _sfc_main = {
  __name: "DemoConfigList",
  __ssrInlineRender: true,
  emits: ["edit"],
  setup(__props, { emit: __emit }) {
    const { $firebase } = useNuxtApp();
    const db = $firebase.db;
    const configs = ref([]);
    const loading = ref(true);
    const showDeleteDialog = ref(false);
    const configToDelete = ref(null);
    const emit = __emit;
    async function refreshConfigs() {
      loading.value = true;
      try {
        const querySnapshot = await getDocs(collection(db, "demoConfigs"));
        configs.value = querySnapshot.docs.map((doc2) => {
          var _a;
          return {
            id: doc2.id,
            ...doc2.data(),
            createdAt: ((_a = doc2.data().createdAt) == null ? void 0 : _a.toDate()) || /* @__PURE__ */ new Date()
          };
        });
      } catch (error) {
        console.error("Error fetching demo configs:", error);
        alert("Failed to load demo configurations");
      } finally {
        loading.value = false;
      }
    }
    function editConfig(config) {
      emit("edit", config);
    }
    function confirmDelete(config) {
      configToDelete.value = config;
      showDeleteDialog.value = true;
    }
    async function deleteConfig() {
      if (!configToDelete.value) return;
      try {
        await deleteDoc(doc(db, "demoConfigs", configToDelete.value.id));
        await refreshConfigs();
        showDeleteDialog.value = false;
        configToDelete.value = null;
      } catch (error) {
        console.error("Error deleting demo config:", error);
        alert("Failed to delete demo configuration");
      }
    }
    function formatDate(date) {
      if (!date) return "N/A";
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Button = _sfc_main$1;
      const _component_Table = _sfc_main$2;
      const _component_TableHeader = _sfc_main$3;
      const _component_TableRow = _sfc_main$4;
      const _component_TableHead = _sfc_main$5;
      const _component_TableBody = _sfc_main$6;
      const _component_TableCell = _sfc_main$7;
      const _component_AlertDialog = _sfc_main$8;
      const _component_AlertDialogContent = _sfc_main$9;
      const _component_AlertDialogHeader = _sfc_main$a;
      const _component_AlertDialogTitle = _sfc_main$b;
      const _component_AlertDialogDescription = _sfc_main$c;
      const _component_AlertDialogFooter = _sfc_main$d;
      const _component_AlertDialogCancel = _sfc_main$e;
      const _component_AlertDialogAction = _sfc_main$f;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white rounded-lg shadow-md p-4" }, _attrs))}><div class="flex justify-between items-center mb-4"><h2 class="text-xl font-bold">Demo Configurations</h2>`);
      _push(ssrRenderComponent(_component_Button, { onClick: refreshConfigs }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(RefreshCcw), { class: "h-4 w-4 mr-2" }, null, _parent2, _scopeId));
            _push2(` Refresh `);
          } else {
            return [
              createVNode(unref(RefreshCcw), { class: "h-4 w-4 mr-2" }),
              createTextVNode(" Refresh ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (loading.value) {
        _push(`<div class="flex justify-center p-8"></div>`);
      } else if (configs.value.length === 0) {
        _push(`<div class="text-center p-8 text-gray-500"> No demo configurations found. Create one to get started. </div>`);
      } else {
        _push(ssrRenderComponent(_component_Table, null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_TableHeader, null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_TableRow, null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_TableHead, null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`Name`);
                              } else {
                                return [
                                  createTextVNode("Name")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_component_TableHead, null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`Description`);
                              } else {
                                return [
                                  createTextVNode("Description")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_component_TableHead, null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`Created At`);
                              } else {
                                return [
                                  createTextVNode("Created At")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_component_TableHead, null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`Actions`);
                              } else {
                                return [
                                  createTextVNode("Actions")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_TableHead, null, {
                              default: withCtx(() => [
                                createTextVNode("Name")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_TableHead, null, {
                              default: withCtx(() => [
                                createTextVNode("Description")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_TableHead, null, {
                              default: withCtx(() => [
                                createTextVNode("Created At")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_TableHead, null, {
                              default: withCtx(() => [
                                createTextVNode("Actions")
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_TableRow, null, {
                        default: withCtx(() => [
                          createVNode(_component_TableHead, null, {
                            default: withCtx(() => [
                              createTextVNode("Name")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_TableHead, null, {
                            default: withCtx(() => [
                              createTextVNode("Description")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_TableHead, null, {
                            default: withCtx(() => [
                              createTextVNode("Created At")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_TableHead, null, {
                            default: withCtx(() => [
                              createTextVNode("Actions")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_TableBody, null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<!--[-->`);
                    ssrRenderList(configs.value, (config) => {
                      _push3(ssrRenderComponent(_component_TableRow, {
                        key: config.id
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(_component_TableCell, null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`${ssrInterpolate(config.name)}`);
                                } else {
                                  return [
                                    createTextVNode(toDisplayString(config.name), 1)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(_component_TableCell, null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`${ssrInterpolate(config.description)}`);
                                } else {
                                  return [
                                    createTextVNode(toDisplayString(config.description), 1)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(_component_TableCell, null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`${ssrInterpolate(formatDate(config.createdAt))}`);
                                } else {
                                  return [
                                    createTextVNode(toDisplayString(formatDate(config.createdAt)), 1)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(_component_TableCell, null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`<div class="flex space-x-2"${_scopeId4}>`);
                                  _push5(ssrRenderComponent(_component_Button, {
                                    variant: "outline",
                                    size: "sm",
                                    onClick: ($event) => editConfig(config)
                                  }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(ssrRenderComponent(unref(Edit), { class: "h-4 w-4 mr-1" }, null, _parent6, _scopeId5));
                                        _push6(` Edit `);
                                      } else {
                                        return [
                                          createVNode(unref(Edit), { class: "h-4 w-4 mr-1" }),
                                          createTextVNode(" Edit ")
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                  _push5(ssrRenderComponent(_component_Button, {
                                    variant: "destructive",
                                    size: "sm",
                                    onClick: ($event) => confirmDelete(config)
                                  }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(ssrRenderComponent(unref(Trash), { class: "h-4 w-4 mr-1" }, null, _parent6, _scopeId5));
                                        _push6(` Delete `);
                                      } else {
                                        return [
                                          createVNode(unref(Trash), { class: "h-4 w-4 mr-1" }),
                                          createTextVNode(" Delete ")
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                  _push5(`</div>`);
                                } else {
                                  return [
                                    createVNode("div", { class: "flex space-x-2" }, [
                                      createVNode(_component_Button, {
                                        variant: "outline",
                                        size: "sm",
                                        onClick: ($event) => editConfig(config)
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(Edit), { class: "h-4 w-4 mr-1" }),
                                          createTextVNode(" Edit ")
                                        ]),
                                        _: 2
                                      }, 1032, ["onClick"]),
                                      createVNode(_component_Button, {
                                        variant: "destructive",
                                        size: "sm",
                                        onClick: ($event) => confirmDelete(config)
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(Trash), { class: "h-4 w-4 mr-1" }),
                                          createTextVNode(" Delete ")
                                        ]),
                                        _: 2
                                      }, 1032, ["onClick"])
                                    ])
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          } else {
                            return [
                              createVNode(_component_TableCell, null, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(config.name), 1)
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(_component_TableCell, null, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(config.description), 1)
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(_component_TableCell, null, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(formatDate(config.createdAt)), 1)
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(_component_TableCell, null, {
                                default: withCtx(() => [
                                  createVNode("div", { class: "flex space-x-2" }, [
                                    createVNode(_component_Button, {
                                      variant: "outline",
                                      size: "sm",
                                      onClick: ($event) => editConfig(config)
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(Edit), { class: "h-4 w-4 mr-1" }),
                                        createTextVNode(" Edit ")
                                      ]),
                                      _: 2
                                    }, 1032, ["onClick"]),
                                    createVNode(_component_Button, {
                                      variant: "destructive",
                                      size: "sm",
                                      onClick: ($event) => confirmDelete(config)
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(Trash), { class: "h-4 w-4 mr-1" }),
                                        createTextVNode(" Delete ")
                                      ]),
                                      _: 2
                                    }, 1032, ["onClick"])
                                  ])
                                ]),
                                _: 2
                              }, 1024)
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    });
                    _push3(`<!--]-->`);
                  } else {
                    return [
                      (openBlock(true), createBlock(Fragment, null, renderList(configs.value, (config) => {
                        return openBlock(), createBlock(_component_TableRow, {
                          key: config.id
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_TableCell, null, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(config.name), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(_component_TableCell, null, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(config.description), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(_component_TableCell, null, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(formatDate(config.createdAt)), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(_component_TableCell, null, {
                              default: withCtx(() => [
                                createVNode("div", { class: "flex space-x-2" }, [
                                  createVNode(_component_Button, {
                                    variant: "outline",
                                    size: "sm",
                                    onClick: ($event) => editConfig(config)
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(Edit), { class: "h-4 w-4 mr-1" }),
                                      createTextVNode(" Edit ")
                                    ]),
                                    _: 2
                                  }, 1032, ["onClick"]),
                                  createVNode(_component_Button, {
                                    variant: "destructive",
                                    size: "sm",
                                    onClick: ($event) => confirmDelete(config)
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(Trash), { class: "h-4 w-4 mr-1" }),
                                      createTextVNode(" Delete ")
                                    ]),
                                    _: 2
                                  }, 1032, ["onClick"])
                                ])
                              ]),
                              _: 2
                            }, 1024)
                          ]),
                          _: 2
                        }, 1024);
                      }), 128))
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_TableHeader, null, {
                  default: withCtx(() => [
                    createVNode(_component_TableRow, null, {
                      default: withCtx(() => [
                        createVNode(_component_TableHead, null, {
                          default: withCtx(() => [
                            createTextVNode("Name")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_TableHead, null, {
                          default: withCtx(() => [
                            createTextVNode("Description")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_TableHead, null, {
                          default: withCtx(() => [
                            createTextVNode("Created At")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_TableHead, null, {
                          default: withCtx(() => [
                            createTextVNode("Actions")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                createVNode(_component_TableBody, null, {
                  default: withCtx(() => [
                    (openBlock(true), createBlock(Fragment, null, renderList(configs.value, (config) => {
                      return openBlock(), createBlock(_component_TableRow, {
                        key: config.id
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_TableCell, null, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(config.name), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(_component_TableCell, null, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(config.description), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(_component_TableCell, null, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(formatDate(config.createdAt)), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(_component_TableCell, null, {
                            default: withCtx(() => [
                              createVNode("div", { class: "flex space-x-2" }, [
                                createVNode(_component_Button, {
                                  variant: "outline",
                                  size: "sm",
                                  onClick: ($event) => editConfig(config)
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(Edit), { class: "h-4 w-4 mr-1" }),
                                    createTextVNode(" Edit ")
                                  ]),
                                  _: 2
                                }, 1032, ["onClick"]),
                                createVNode(_component_Button, {
                                  variant: "destructive",
                                  size: "sm",
                                  onClick: ($event) => confirmDelete(config)
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(Trash), { class: "h-4 w-4 mr-1" }),
                                    createTextVNode(" Delete ")
                                  ]),
                                  _: 2
                                }, 1032, ["onClick"])
                              ])
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1024);
                    }), 128))
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(ssrRenderComponent(_component_AlertDialog, {
        open: showDeleteDialog.value,
        "onUpdate:open": ($event) => showDeleteDialog.value = $event
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_AlertDialogContent, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_AlertDialogHeader, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_AlertDialogTitle, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Are you sure?`);
                            } else {
                              return [
                                createTextVNode("Are you sure?")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_AlertDialogDescription, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            var _a, _b;
                            if (_push5) {
                              _push5(` This will permanently delete the demo configuration &quot;${ssrInterpolate((_a = configToDelete.value) == null ? void 0 : _a.name)}&quot;. This action cannot be undone. `);
                            } else {
                              return [
                                createTextVNode(' This will permanently delete the demo configuration "' + toDisplayString((_b = configToDelete.value) == null ? void 0 : _b.name) + '". This action cannot be undone. ', 1)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_AlertDialogTitle, null, {
                            default: withCtx(() => [
                              createTextVNode("Are you sure?")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_AlertDialogDescription, null, {
                            default: withCtx(() => {
                              var _a;
                              return [
                                createTextVNode(' This will permanently delete the demo configuration "' + toDisplayString((_a = configToDelete.value) == null ? void 0 : _a.name) + '". This action cannot be undone. ', 1)
                              ];
                            }),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_AlertDialogFooter, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_AlertDialogCancel, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Cancel`);
                            } else {
                              return [
                                createTextVNode("Cancel")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_AlertDialogAction, { onClick: deleteConfig }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Delete`);
                            } else {
                              return [
                                createTextVNode("Delete")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_AlertDialogCancel, null, {
                            default: withCtx(() => [
                              createTextVNode("Cancel")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_AlertDialogAction, { onClick: deleteConfig }, {
                            default: withCtx(() => [
                              createTextVNode("Delete")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_AlertDialogHeader, null, {
                      default: withCtx(() => [
                        createVNode(_component_AlertDialogTitle, null, {
                          default: withCtx(() => [
                            createTextVNode("Are you sure?")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_AlertDialogDescription, null, {
                          default: withCtx(() => {
                            var _a;
                            return [
                              createTextVNode(' This will permanently delete the demo configuration "' + toDisplayString((_a = configToDelete.value) == null ? void 0 : _a.name) + '". This action cannot be undone. ', 1)
                            ];
                          }),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_component_AlertDialogFooter, null, {
                      default: withCtx(() => [
                        createVNode(_component_AlertDialogCancel, null, {
                          default: withCtx(() => [
                            createTextVNode("Cancel")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_AlertDialogAction, { onClick: deleteConfig }, {
                          default: withCtx(() => [
                            createTextVNode("Delete")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_AlertDialogContent, null, {
                default: withCtx(() => [
                  createVNode(_component_AlertDialogHeader, null, {
                    default: withCtx(() => [
                      createVNode(_component_AlertDialogTitle, null, {
                        default: withCtx(() => [
                          createTextVNode("Are you sure?")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_AlertDialogDescription, null, {
                        default: withCtx(() => {
                          var _a;
                          return [
                            createTextVNode(' This will permanently delete the demo configuration "' + toDisplayString((_a = configToDelete.value) == null ? void 0 : _a.name) + '". This action cannot be undone. ', 1)
                          ];
                        }),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(_component_AlertDialogFooter, null, {
                    default: withCtx(() => [
                      createVNode(_component_AlertDialogCancel, null, {
                        default: withCtx(() => [
                          createTextVNode("Cancel")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_AlertDialogAction, { onClick: deleteConfig }, {
                        default: withCtx(() => [
                          createTextVNode("Delete")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/DemoConfigList.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=DemoConfigList.vue.mjs.map
