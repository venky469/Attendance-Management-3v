// import crypto from "crypto"


// function getKey(): Buffer {
//   const keyB64 = process.env.TENANT_ENCRYPTION_KEY || process.env.ENCRYPTION_KEY
//   if (!keyB64) {
//     throw new Error("Missing TENANT_ENCRYPTION_KEY (or ENCRYPTION_KEY) for tenant secret encryption")
//   }
//   // Support base64 or hex; default to base64
//   try {
//     return Buffer.from(keyB64, "base64")
//   } catch {
//     return Buffer.from(keyB64, "hex")
//   }
// }

// export function encryptSecret(plain: string): string {
//   const key = getKey()
//   if (key.length !== 32) {
//     throw new Error("TENANT_ENCRYPTION_KEY must be 32 bytes (supply base64 or hex of 32 bytes)")
//   }
//   const iv = crypto.randomBytes(12)
//   const cipher = crypto.createCipheriv("aes-256-gcm", key, iv)
//   const encrypted = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()])
//   const tag = cipher.getAuthTag()
//   return Buffer.concat([iv, tag, encrypted]).toString("base64")
// }

// export function decryptSecret(enc: string): string {
//   const key = getKey()
//   const buf = Buffer.from(enc, "base64")
//   const iv = buf.subarray(0, 12)
//   const tag = buf.subarray(12, 28)
//   const data = buf.subarray(28)
//   const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv)
//   decipher.setAuthTag(tag)
//   const decrypted = Buffer.concat([decipher.update(data), decipher.final()])
//   return decrypted.toString("utf8")
// }
