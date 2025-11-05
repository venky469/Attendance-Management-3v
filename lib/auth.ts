
// // // // import type { Staff, Student, Role } from "./types"

// // // // export type User = (Staff | Student) & { role: Role }

// // // // export function getStoredUser(): User | null {
// // // //   if (typeof window === "undefined") return null

// // // //   try {
// // // //     const stored = localStorage.getItem("user")
// // // //     return stored ? JSON.parse(stored) : null
// // // //   } catch {
// // // //     return null
// // // //   }
// // // // }

// // // // export function logout() {
// // // //   if (typeof window !== "undefined") {
// // // //     localStorage.removeItem("user")
// // // //     window.location.href = "/login"
// // // //   }
// // // // }

// // // // export function isAuthenticated(): boolean {
// // // //   return getStoredUser() !== null
// // // // }

// // // // export function hasRole(requiredRoles: Role[]): boolean {
// // // //   const user = getStoredUser()
// // // //   return user ? requiredRoles.includes(user.role) : false
// // // // }

// // // // // Role hierarchy for access control
// // // // export const roleHierarchy: Record<Role, number> = {
// // // //   SuperAdmin: 6,
// // // //   Admin: 5,
// // // //   Manager: 4,
// // // //   Staff: 3,
// // // //   Teacher: 3,
// // // //   Student: 1,
// // // // }

// // // // export function hasMinimumRole(minimumRole: Role): boolean {
// // // //   const user = getStoredUser()
// // // //   if (!user) return false

// // // //   return roleHierarchy[user.role] >= roleHierarchy[minimumRole]
// // // // }





// // // import type { Staff, Student, Role } from "./types"

// // // export type User = (Staff | Student) & { role: Role }

// // // export function getStoredUser(): User | null {
// // //   if (typeof window === "undefined") return null

// // //   try {
// // //     // Check localStorage first (Remember Me enabled)
// // //     const storedLocal = localStorage.getItem("user")
// // //     if (storedLocal) {
// // //       return JSON.parse(storedLocal)
// // //     }

// // //     // Then check sessionStorage (Remember Me disabled)
// // //     const storedSession = sessionStorage.getItem("user")
// // //     if (storedSession) {
// // //       return JSON.parse(storedSession)
// // //     }

// // //     return null
// // //   } catch {
// // //     return null
// // //   }
// // // }

// // // export function logout() {
// // //   if (typeof window !== "undefined") {
// // //     localStorage.removeItem("user")
// // //     sessionStorage.removeItem("user")
// // //     window.location.href = "/login"
// // //   }
// // // }

// // // export function isAuthenticated(): boolean {
// // //   return getStoredUser() !== null
// // // }

// // // export function hasRole(requiredRoles: Role[]): boolean {
// // //   const user = getStoredUser()
// // //   return user ? requiredRoles.includes(user.role) : false
// // // }

// // // // Role hierarchy for access control
// // // export const roleHierarchy: Record<Role, number> = {
// // //   SuperAdmin: 6,
// // //   Admin: 5,
// // //   Manager: 4,
// // //   Staff: 3,
// // //   Teacher: 3,
// // //   Student: 1,
// // // }

// // // export function hasMinimumRole(minimumRole: Role): boolean {
// // //   const user = getStoredUser()
// // //   if (!user) return false

// // //   return roleHierarchy[user.role] >= roleHierarchy[minimumRole]
// // // }




// // import type { Staff, Student, Role } from "./types"
// // import { endSessionTracking } from "./session-tracker"

// // export type User = (Staff | Student) & { role: Role }

// // export function getStoredUser(): User | null {
// //   if (typeof window === "undefined") return null

// //   try {
// //     // Check localStorage first (Remember Me enabled)
// //     const storedLocal = localStorage.getItem("user")
// //     if (storedLocal) {
// //       return JSON.parse(storedLocal)
// //     }

// //     // Then check sessionStorage (Remember Me disabled)
// //     const storedSession = sessionStorage.getItem("user")
// //     if (storedSession) {
// //       return JSON.parse(storedSession)
// //     }

// //     return null
// //   } catch {
// //     return null
// //   }
// // }

// // export async function logout() {
// //   if (typeof window !== "undefined") {
// //     // Track session end before clearing storage
// //     await endSessionTracking()

// //     localStorage.removeItem("user")
// //     sessionStorage.removeItem("user")
// //     window.location.href = "/login"
// //   }
// // }

// // export function isAuthenticated(): boolean {
// //   return getStoredUser() !== null
// // }

// // export function hasRole(requiredRoles: Role[]): boolean {
// //   const user = getStoredUser()
// //   return user ? requiredRoles.includes(user.role) : false
// // }

// // // Role hierarchy for access control
// // export const roleHierarchy: Record<Role, number> = {
// //   SuperAdmin: 6,
// //   Admin: 5,
// //   Manager: 4,
// //   Staff: 3,
// //   Teacher: 3,
// //   Student: 1,
// // }

// // export function hasMinimumRole(minimumRole: Role): boolean {
// //   const user = getStoredUser()
// //   if (!user) return false

// //   return roleHierarchy[user.role] >= roleHierarchy[minimumRole]
// // }



// import type { Staff, Student, Role } from "./types"
// import { endSessionTracking } from "./session-tracker"

// export type User = (Staff | Student) & { role: Role }

// export function getStoredUser(): User | null {
//   if (typeof window === "undefined") return null

//   try {
//     const storedLocal = localStorage.getItem("user")
//     if (storedLocal) {
//       return JSON.parse(storedLocal)
//     }

//     return null
//   } catch {
//     return null
//   }
// }

// export async function logout() {
//   if (typeof window !== "undefined") {
//     // Track session end before clearing storage
//     await endSessionTracking()

//     localStorage.removeItem("user")
//     localStorage.removeItem("session_tracker")
//     sessionStorage.removeItem("user")
//     sessionStorage.removeItem("session_tracker")
//     window.location.href = "/login"
//   }
// }

// export function isAuthenticated(): boolean {
//   return getStoredUser() !== null
// }

// export function hasRole(requiredRoles: Role[]): boolean {
//   const user = getStoredUser()
//   return user ? requiredRoles.includes(user.role) : false
// }

// // Role hierarchy for access control
// export const roleHierarchy: Record<Role, number> = {
//   SuperAdmin: 6,
//   Admin: 5,
//   Manager: 4,
//   Staff: 3,
//   Teacher: 3,
//   Student: 1,
// }

// export function hasMinimumRole(minimumRole: Role): boolean {
//   const user = getStoredUser()
//   if (!user) return false

//   return roleHierarchy[user.role] >= roleHierarchy[minimumRole]
// }




import type { Staff, Student, Role } from "./types"
import { endSessionTracking } from "./session-tracker"
// import { cookies } from "next/headers"

export type User = (Staff | Student) & { role: Role }

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null

  try {
    const storedLocal = localStorage.getItem("user")
    if (storedLocal) {
      return JSON.parse(storedLocal)
    }

    return null
  } catch {
    return null
  }
}

// export async function getUserFromAuth(): Promise<User | null> {
//   if (typeof window !== "undefined") {
//     // Client-side: use localStorage
//     return getStoredUser()
//   }

//   // Server-side: read from cookies
//   try {
//     const cookieStore = await cookies()
//     const userCookie = cookieStore.get("user")

//     if (userCookie?.value) {
//       return JSON.parse(userCookie.value)
//     }

//     return null
//   } catch (error) {
//     console.error("[v0] Error getting user from auth:", error)
//     return null
//   }
// }

export async function logout() {
  if (typeof window !== "undefined") {
    // Track session end before clearing storage
    await endSessionTracking()

    localStorage.removeItem("user")
    localStorage.removeItem("session_tracker")
    sessionStorage.removeItem("user")
    sessionStorage.removeItem("session_tracker")
    window.location.href = "/login"
  }
}

export function isAuthenticated(): boolean {
  return getStoredUser() !== null
}

export function hasRole(requiredRoles: Role[]): boolean {
  const user = getStoredUser()
  return user ? requiredRoles.includes(user.role) : false
}

// Role hierarchy for access control
export const roleHierarchy: Record<Role, number> = {
  SuperAdmin: 6,
  Admin: 5,
  Manager: 4,
  Staff: 3,
  Teacher: 3,
  Student: 1,
}

export function hasMinimumRole(minimumRole: Role): boolean {
  const user = getStoredUser()
  if (!user) return false

  return roleHierarchy[user.role] >= roleHierarchy[minimumRole]
}
