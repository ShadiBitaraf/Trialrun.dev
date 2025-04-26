
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T extends DefineComponent> = T & DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>>
type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = (T & DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }>)
interface _GlobalComponents {
      'DemoConfigForm': typeof import("../components/DemoConfigForm.vue")['default']
    'DemoConfigList': typeof import("../components/DemoConfigList.vue")['default']
    'NuxtWelcome': typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
    'NuxtLayout': typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
    'NuxtErrorBoundary': typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary")['default']
    'ClientOnly': typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
    'DevOnly': typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
    'ServerPlaceholder': typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
    'NuxtLink': typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
    'NuxtLoadingIndicator': typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
    'NuxtRouteAnnouncer': typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
    'NuxtImg': typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
    'NuxtPicture': typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
    'AlertDialog': typeof import("../components/ui/alert-dialog/index")['AlertDialog']
    'AlertDialogAction': typeof import("../components/ui/alert-dialog/index")['AlertDialogAction']
    'AlertDialogCancel': typeof import("../components/ui/alert-dialog/index")['AlertDialogCancel']
    'AlertDialogContent': typeof import("../components/ui/alert-dialog/index")['AlertDialogContent']
    'AlertDialogDescription': typeof import("../components/ui/alert-dialog/index")['AlertDialogDescription']
    'AlertDialogFooter': typeof import("../components/ui/alert-dialog/index")['AlertDialogFooter']
    'AlertDialogHeader': typeof import("../components/ui/alert-dialog/index")['AlertDialogHeader']
    'AlertDialogTitle': typeof import("../components/ui/alert-dialog/index")['AlertDialogTitle']
    'AlertDialogTrigger': typeof import("../components/ui/alert-dialog/index")['AlertDialogTrigger']
    'Button': typeof import("../components/ui/button/index")['Button']
    'Input': typeof import("../components/ui/input/index")['Input']
    'Label': typeof import("../components/ui/label/index")['Label']
    'Switch': typeof import("../components/ui/switch/index")['Switch']
    'Table': typeof import("../components/ui/table/index")['Table']
    'TableBody': typeof import("../components/ui/table/index")['TableBody']
    'TableCaption': typeof import("../components/ui/table/index")['TableCaption']
    'TableCell': typeof import("../components/ui/table/index")['TableCell']
    'TableEmpty': typeof import("../components/ui/table/index")['TableEmpty']
    'TableFooter': typeof import("../components/ui/table/index")['TableFooter']
    'TableHead': typeof import("../components/ui/table/index")['TableHead']
    'TableHeader': typeof import("../components/ui/table/index")['TableHeader']
    'TableRow': typeof import("../components/ui/table/index")['TableRow']
    'Tabs': typeof import("../components/ui/tabs/index")['Tabs']
    'TabsContent': typeof import("../components/ui/tabs/index")['TabsContent']
    'TabsList': typeof import("../components/ui/tabs/index")['TabsList']
    'TabsTrigger': typeof import("../components/ui/tabs/index")['TabsTrigger']
    'Textarea': typeof import("../components/ui/textarea/index")['Textarea']
    'NuxtPage': typeof import("../node_modules/nuxt/dist/pages/runtime/page-placeholder")['default']
    'NoScript': typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
    'Link': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
    'Base': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
    'Title': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
    'Meta': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
    'Style': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
    'Head': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
    'Html': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
    'Body': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
    'NuxtIsland': typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
    'NuxtRouteAnnouncer': IslandComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
      'LazyDemoConfigForm': LazyComponent<typeof import("../components/DemoConfigForm.vue")['default']>
    'LazyDemoConfigList': LazyComponent<typeof import("../components/DemoConfigList.vue")['default']>
    'LazyNuxtWelcome': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
    'LazyNuxtLayout': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
    'LazyNuxtErrorBoundary': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary")['default']>
    'LazyClientOnly': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
    'LazyDevOnly': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
    'LazyServerPlaceholder': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
    'LazyNuxtLink': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
    'LazyNuxtLoadingIndicator': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
    'LazyNuxtImg': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
    'LazyNuxtPicture': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
    'LazyAlertDialog': LazyComponent<typeof import("../components/ui/alert-dialog/index")['AlertDialog']>
    'LazyAlertDialogAction': LazyComponent<typeof import("../components/ui/alert-dialog/index")['AlertDialogAction']>
    'LazyAlertDialogCancel': LazyComponent<typeof import("../components/ui/alert-dialog/index")['AlertDialogCancel']>
    'LazyAlertDialogContent': LazyComponent<typeof import("../components/ui/alert-dialog/index")['AlertDialogContent']>
    'LazyAlertDialogDescription': LazyComponent<typeof import("../components/ui/alert-dialog/index")['AlertDialogDescription']>
    'LazyAlertDialogFooter': LazyComponent<typeof import("../components/ui/alert-dialog/index")['AlertDialogFooter']>
    'LazyAlertDialogHeader': LazyComponent<typeof import("../components/ui/alert-dialog/index")['AlertDialogHeader']>
    'LazyAlertDialogTitle': LazyComponent<typeof import("../components/ui/alert-dialog/index")['AlertDialogTitle']>
    'LazyAlertDialogTrigger': LazyComponent<typeof import("../components/ui/alert-dialog/index")['AlertDialogTrigger']>
    'LazyButton': LazyComponent<typeof import("../components/ui/button/index")['Button']>
    'LazyInput': LazyComponent<typeof import("../components/ui/input/index")['Input']>
    'LazyLabel': LazyComponent<typeof import("../components/ui/label/index")['Label']>
    'LazySwitch': LazyComponent<typeof import("../components/ui/switch/index")['Switch']>
    'LazyTable': LazyComponent<typeof import("../components/ui/table/index")['Table']>
    'LazyTableBody': LazyComponent<typeof import("../components/ui/table/index")['TableBody']>
    'LazyTableCaption': LazyComponent<typeof import("../components/ui/table/index")['TableCaption']>
    'LazyTableCell': LazyComponent<typeof import("../components/ui/table/index")['TableCell']>
    'LazyTableEmpty': LazyComponent<typeof import("../components/ui/table/index")['TableEmpty']>
    'LazyTableFooter': LazyComponent<typeof import("../components/ui/table/index")['TableFooter']>
    'LazyTableHead': LazyComponent<typeof import("../components/ui/table/index")['TableHead']>
    'LazyTableHeader': LazyComponent<typeof import("../components/ui/table/index")['TableHeader']>
    'LazyTableRow': LazyComponent<typeof import("../components/ui/table/index")['TableRow']>
    'LazyTabs': LazyComponent<typeof import("../components/ui/tabs/index")['Tabs']>
    'LazyTabsContent': LazyComponent<typeof import("../components/ui/tabs/index")['TabsContent']>
    'LazyTabsList': LazyComponent<typeof import("../components/ui/tabs/index")['TabsList']>
    'LazyTabsTrigger': LazyComponent<typeof import("../components/ui/tabs/index")['TabsTrigger']>
    'LazyTextarea': LazyComponent<typeof import("../components/ui/textarea/index")['Textarea']>
    'LazyNuxtPage': LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page-placeholder")['default']>
    'LazyNoScript': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
    'LazyLink': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
    'LazyBase': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
    'LazyTitle': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
    'LazyMeta': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
    'LazyStyle': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
    'LazyHead': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
    'LazyHtml': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
    'LazyBody': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
    'LazyNuxtIsland': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<IslandComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export const DemoConfigForm: typeof import("../components/DemoConfigForm.vue")['default']
export const DemoConfigList: typeof import("../components/DemoConfigList.vue")['default']
export const NuxtWelcome: typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
export const NuxtLayout: typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
export const NuxtErrorBoundary: typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary")['default']
export const ClientOnly: typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
export const DevOnly: typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
export const ServerPlaceholder: typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const NuxtLink: typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
export const NuxtLoadingIndicator: typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
export const NuxtImg: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
export const NuxtPicture: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
export const AlertDialog: typeof import("../components/ui/alert-dialog/index")['AlertDialog']
export const AlertDialogAction: typeof import("../components/ui/alert-dialog/index")['AlertDialogAction']
export const AlertDialogCancel: typeof import("../components/ui/alert-dialog/index")['AlertDialogCancel']
export const AlertDialogContent: typeof import("../components/ui/alert-dialog/index")['AlertDialogContent']
export const AlertDialogDescription: typeof import("../components/ui/alert-dialog/index")['AlertDialogDescription']
export const AlertDialogFooter: typeof import("../components/ui/alert-dialog/index")['AlertDialogFooter']
export const AlertDialogHeader: typeof import("../components/ui/alert-dialog/index")['AlertDialogHeader']
export const AlertDialogTitle: typeof import("../components/ui/alert-dialog/index")['AlertDialogTitle']
export const AlertDialogTrigger: typeof import("../components/ui/alert-dialog/index")['AlertDialogTrigger']
export const Button: typeof import("../components/ui/button/index")['Button']
export const Input: typeof import("../components/ui/input/index")['Input']
export const Label: typeof import("../components/ui/label/index")['Label']
export const Switch: typeof import("../components/ui/switch/index")['Switch']
export const Table: typeof import("../components/ui/table/index")['Table']
export const TableBody: typeof import("../components/ui/table/index")['TableBody']
export const TableCaption: typeof import("../components/ui/table/index")['TableCaption']
export const TableCell: typeof import("../components/ui/table/index")['TableCell']
export const TableEmpty: typeof import("../components/ui/table/index")['TableEmpty']
export const TableFooter: typeof import("../components/ui/table/index")['TableFooter']
export const TableHead: typeof import("../components/ui/table/index")['TableHead']
export const TableHeader: typeof import("../components/ui/table/index")['TableHeader']
export const TableRow: typeof import("../components/ui/table/index")['TableRow']
export const Tabs: typeof import("../components/ui/tabs/index")['Tabs']
export const TabsContent: typeof import("../components/ui/tabs/index")['TabsContent']
export const TabsList: typeof import("../components/ui/tabs/index")['TabsList']
export const TabsTrigger: typeof import("../components/ui/tabs/index")['TabsTrigger']
export const Textarea: typeof import("../components/ui/textarea/index")['Textarea']
export const NuxtPage: typeof import("../node_modules/nuxt/dist/pages/runtime/page-placeholder")['default']
export const NoScript: typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
export const Link: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
export const Base: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
export const Title: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
export const Meta: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
export const Style: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
export const Head: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
export const Html: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
export const Body: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
export const NuxtIsland: typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
export const NuxtRouteAnnouncer: IslandComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyDemoConfigForm: LazyComponent<typeof import("../components/DemoConfigForm.vue")['default']>
export const LazyDemoConfigList: LazyComponent<typeof import("../components/DemoConfigList.vue")['default']>
export const LazyNuxtWelcome: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
export const LazyNuxtLayout: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary")['default']>
export const LazyClientOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
export const LazyDevOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
export const LazyServerPlaceholder: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyNuxtLink: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
export const LazyNuxtImg: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
export const LazyNuxtPicture: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
export const LazyAlertDialog: LazyComponent<typeof import("../components/ui/alert-dialog/index")['AlertDialog']>
export const LazyAlertDialogAction: LazyComponent<typeof import("../components/ui/alert-dialog/index")['AlertDialogAction']>
export const LazyAlertDialogCancel: LazyComponent<typeof import("../components/ui/alert-dialog/index")['AlertDialogCancel']>
export const LazyAlertDialogContent: LazyComponent<typeof import("../components/ui/alert-dialog/index")['AlertDialogContent']>
export const LazyAlertDialogDescription: LazyComponent<typeof import("../components/ui/alert-dialog/index")['AlertDialogDescription']>
export const LazyAlertDialogFooter: LazyComponent<typeof import("../components/ui/alert-dialog/index")['AlertDialogFooter']>
export const LazyAlertDialogHeader: LazyComponent<typeof import("../components/ui/alert-dialog/index")['AlertDialogHeader']>
export const LazyAlertDialogTitle: LazyComponent<typeof import("../components/ui/alert-dialog/index")['AlertDialogTitle']>
export const LazyAlertDialogTrigger: LazyComponent<typeof import("../components/ui/alert-dialog/index")['AlertDialogTrigger']>
export const LazyButton: LazyComponent<typeof import("../components/ui/button/index")['Button']>
export const LazyInput: LazyComponent<typeof import("../components/ui/input/index")['Input']>
export const LazyLabel: LazyComponent<typeof import("../components/ui/label/index")['Label']>
export const LazySwitch: LazyComponent<typeof import("../components/ui/switch/index")['Switch']>
export const LazyTable: LazyComponent<typeof import("../components/ui/table/index")['Table']>
export const LazyTableBody: LazyComponent<typeof import("../components/ui/table/index")['TableBody']>
export const LazyTableCaption: LazyComponent<typeof import("../components/ui/table/index")['TableCaption']>
export const LazyTableCell: LazyComponent<typeof import("../components/ui/table/index")['TableCell']>
export const LazyTableEmpty: LazyComponent<typeof import("../components/ui/table/index")['TableEmpty']>
export const LazyTableFooter: LazyComponent<typeof import("../components/ui/table/index")['TableFooter']>
export const LazyTableHead: LazyComponent<typeof import("../components/ui/table/index")['TableHead']>
export const LazyTableHeader: LazyComponent<typeof import("../components/ui/table/index")['TableHeader']>
export const LazyTableRow: LazyComponent<typeof import("../components/ui/table/index")['TableRow']>
export const LazyTabs: LazyComponent<typeof import("../components/ui/tabs/index")['Tabs']>
export const LazyTabsContent: LazyComponent<typeof import("../components/ui/tabs/index")['TabsContent']>
export const LazyTabsList: LazyComponent<typeof import("../components/ui/tabs/index")['TabsList']>
export const LazyTabsTrigger: LazyComponent<typeof import("../components/ui/tabs/index")['TabsTrigger']>
export const LazyTextarea: LazyComponent<typeof import("../components/ui/textarea/index")['Textarea']>
export const LazyNuxtPage: LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page-placeholder")['default']>
export const LazyNoScript: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
export const LazyLink: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
export const LazyBase: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
export const LazyTitle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
export const LazyMeta: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
export const LazyStyle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
export const LazyHead: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
export const LazyHtml: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
export const LazyBody: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
export const LazyNuxtIsland: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<IslandComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>>

export const componentNames: string[]
