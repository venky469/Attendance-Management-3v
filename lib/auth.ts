
import type { Staff, Student, Role } from "./types"

export type User = (Staff | Student) & { role: Role }

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null

  try {
    const stored = localStorage.getItem("user")
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user")
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
