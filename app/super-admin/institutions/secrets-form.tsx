// "use client"

// import { useState } from "react"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Button } from "@/components/ui/button"

// type SecretsPayload = {
//   mongodbUri?: string
//   dbName?: string
//   cloudName?: string
//   apiKey?: string
//   apiSecret?: string
//   folder?: string
// }

// export default function SecretsForm({
//   onSave,
//   disabled,
// }: {
//   onSave: (payload: SecretsPayload) => void
//   disabled?: boolean
// }) {
//   const [mongodbUri, setMongodbUri] = useState("")
//   const [dbName, setDbName] = useState("")
//   const [cloudName, setCloudName] = useState("")
//   const [apiKey, setApiKey] = useState("")
//   const [apiSecret, setApiSecret] = useState("")
//   const [folder, setFolder] = useState("")

//   function handleSave() {
//     // build payload with only non-empty values
//     const payload: SecretsPayload = {}
//     if (mongodbUri.trim()) payload.mongodbUri = mongodbUri.trim()
//     if (dbName.trim()) payload.dbName = dbName.trim()
//     if (cloudName.trim()) payload.cloudName = cloudName.trim()
//     if (apiKey.trim()) payload.apiKey = apiKey.trim()
//     if (apiSecret.trim()) payload.apiSecret = apiSecret.trim()
//     if (folder.trim()) payload.folder = folder.trim()
//     if (Object.keys(payload).length === 0) {
//       alert("Please fill at least one field to save.")
//       return
//     }
//     onSave(payload)
//   }

//   return (
//     <div className="space-y-3">
//       <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
//         <div>
//           <Label>MongoDB URI</Label>
//           <Input
//             value={mongodbUri}
//             onChange={(e) => setMongodbUri(e.target.value)}
//             placeholder="mongodb+srv://username:pass@cluster.example/multi-tenant"
//             disabled={disabled}
//           />
//         </div>
//         <div>
//           <Label>Database Name</Label>
//           <Input
//             value={dbName}
//             onChange={(e) => setDbName(e.target.value)}
//             placeholder="college_db_name"
//             disabled={disabled}
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
//         <div>
//           <Label>Cloudinary Cloud Name</Label>
//           <Input
//             value={cloudName}
//             onChange={(e) => setCloudName(e.target.value)}
//             placeholder="your-cloud-name"
//             disabled={disabled}
//           />
//         </div>
//         <div>
//           <Label>Cloudinary API Key</Label>
//           <Input
//             value={apiKey}
//             onChange={(e) => setApiKey(e.target.value)}
//             placeholder="1234567890"
//             disabled={disabled}
//           />
//         </div>
//         <div>
//           <Label>Cloudinary API Secret</Label>
//           <Input
//             type="password"
//             value={apiSecret}
//             onChange={(e) => setApiSecret(e.target.value)}
//             placeholder="********"
//             disabled={disabled}
//           />
//         </div>
//       </div>

//       <div>
//         <Label>Folder (optional)</Label>
//         <Input
//           value={folder}
//           onChange={(e) => setFolder(e.target.value)}
//           placeholder="college-slug/faces"
//           disabled={disabled}
//         />
//       </div>

//       <div className="pt-2">
//         <Button onClick={handleSave} disabled={disabled} className="bg-teal-600 text-white hover:bg-teal-700">
//           Save Secrets
//         </Button>
//       </div>

//       <p className="text-xs text-muted-foreground">
//         Secrets are encrypted at rest. Provide only the fields you want to set or update.
//       </p>
//     </div>
//   )
// }
