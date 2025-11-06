// "use client"

// import dynamic from "next/dynamic"

// const PWAManager = dynamic(() => import("@/components/pwa-manager").then((mod) => ({ default: mod.PWAManager })), {
//   ssr: false,
//   loading: () => null,
// })

// const MaintenanceAlert = dynamic(
//   () => import("@/components/maintenance-alert").then((mod) => ({ default: mod.MaintenanceAlert })),
//   {
//     ssr: false,
//     loading: () => null,
//   },
// )

// const MaintenanceSpacer = dynamic(
//   () => import("@/components/maintenance-spacer").then((mod) => ({ default: mod.MaintenanceSpacer })),
//   {
//     ssr: false,
//     loading: () => null,
//   },
// )

// const NotificationSoundPlayer = dynamic(
//   () => import("@/components/notification-sound-player").then((mod) => ({ default: mod.NotificationSoundPlayer })),
//   {
//     ssr: false,
//     loading: () => null,
//   },
// )

// const InAppNotificationToast = dynamic(
//   () => import("@/components/in-app-notification-toast").then((mod) => ({ default: mod.InAppNotificationToast })),
//   {
//     ssr: false,
//     loading: () => null,
//   },
// )

// export function ClientProviders() {
//   return (
//     <>
//       <PWAManager />
//       <MaintenanceAlert />
//       <MaintenanceSpacer />
//       <NotificationSoundPlayer />
//       <InAppNotificationToast />
//     </>
//   )
// }


"use client"

import dynamic from "next/dynamic"
import { SWRProvider } from "@/components/swr-provider"

const PWAManager = dynamic(() => import("@/components/pwa-manager").then((mod) => ({ default: mod.PWAManager })), {
  ssr: false,
  loading: () => null,
})

const MaintenanceAlert = dynamic(
  () => import("@/components/maintenance-alert").then((mod) => ({ default: mod.MaintenanceAlert })),
  {
    ssr: false,
    loading: () => null,
  },
)

const MaintenanceSpacer = dynamic(
  () => import("@/components/maintenance-spacer").then((mod) => ({ default: mod.MaintenanceSpacer })),
  {
    ssr: false,
    loading: () => null,
  },
)

const NotificationSoundPlayer = dynamic(
  () => import("@/components/notification-sound-player").then((mod) => ({ default: mod.NotificationSoundPlayer })),
  {
    ssr: false,
    loading: () => null,
  },
)

const InAppNotificationToast = dynamic(
  () => import("@/components/in-app-notification-toast").then((mod) => ({ default: mod.InAppNotificationToast })),
  {
    ssr: false,
    loading: () => null,
  },
)

export function ClientProviders() {
  return (
    <SWRProvider>
      <PWAManager />
      <MaintenanceAlert />
      <MaintenanceSpacer />
      <NotificationSoundPlayer />
      <InAppNotificationToast />
    </SWRProvider>
  )
}
