
// import { createTransporter } from "./transporter"

// export async function sendWelcomeEmail({
//   to,
//   subject,
//   name,
//   code,
//   shift,
//   password,
//   type,
//   institutionName,
// }: {
//   to: string
//   subject: string
//   name: string
//   code: string
//   shift: string
//   password: string
//   type: "staff" | "student"
//   institutionName?: string
// }) {
//   try {
//     const transporter = createTransporter()

//     const htmlContent = `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="utf-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Welcome to Liveattendece</title>
//     </head>
//     <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
//       <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
//         <div style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border-radius: 20px; padding: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); border: 1px solid rgba(255,255,255,0.2);">
          
//           <!-- Header -->
//           <div style="text-align: center; margin-bottom: 30px;">
//             <div style="background: linear-gradient(135deg, #0ea5e9, #06b6d4); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 30px rgba(14, 165, 233, 0.3);">
//               <span style="color: white; font-size: 32px; font-weight: bold;">🎉</span>
//             </div>
//             <h1 style="color: #1e293b; margin: 0; font-size: 28px; font-weight: 700;">Welcome to Liveattendece!</h1>
//             <p style="color: #64748b; margin: 10px 0 0; font-size: 16px;">Your account has been successfully created</p>
//           </div>

//           <!-- Greeting -->
//           <div style="margin-bottom: 30px;">
//             <p style="color: #334155; font-size: 18px; margin: 0;">Hello <strong>${name}</strong>,</p>
//             <p style="color: #64748b; font-size: 16px; margin: 10px 0 0; line-height: 1.6;">Welcome to Liveattendece! Your ${type} account has been created successfully. Here are your login credentials:</p>
//           </div>

//           <!-- Account Details -->
//           <div style="background: linear-gradient(135deg, #f8fafc, #e2e8f0); border-radius: 15px; padding: 25px; margin-bottom: 25px; border-left: 4px solid #0ea5e9;">
//             <h3 style="color: #1e293b; margin: 0 0 15px; font-size: 18px; font-weight: 600;">📋 Your Account Details</h3>
//             <div style="display: grid; gap: 10px;">
//               <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(148, 163, 184, 0.2);">
//                 <span style="color: #64748b; font-weight: 500;">Name:</span>
//                 <span style="color: #1e293b; font-weight: 600;">${name}</span>
//               </div>
//               ${
//                 institutionName
//                   ? `
//               <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(148, 163, 184, 0.2);">
//                 <span style="color: #64748b; font-weight: 500;">Institution:</span>
//                 <span style="color: #1e293b; font-weight: 600;">${institutionName}</span>
//               </div>`
//                   : ``
//               }
//               <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(148, 163, 184, 0.2);">
//                 <span style="color: #64748b; font-weight: 500;">${type === "staff" ? "Employee Code:" : "Roll Number:"}</span>
//                 <span style="color: #1e293b; font-weight: 600;">${code}</span>
//               </div>
//               <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(148, 163, 184, 0.2);">
//                 <span style="color: #64748b; font-weight: 500;">Email:</span>
//                 <span style="color: #1e293b; font-weight: 600;">${to}</span>
//               </div>
//               <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(148, 163, 184, 0.2);">
//                 <span style="color: #64748b; font-weight: 500;">Shift:</span>
//                 <span style="color: #1e293b; font-weight: 600; text-transform: capitalize;">${shift}</span>
//               </div>
//               <div style="display: flex; justify-content: space-between; padding: 8px 0;">
//                 <span style="color: #64748b; font-weight: 500;">Password:</span>
//                 <span style="color: #1e293b; font-weight: 600; font-family: monospace; background: #f1f5f9; padding: 4px 8px; border-radius: 4px;">${password}</span>
//               </div>
//             </div>
//           </div>

//           <!-- Security Notice -->
//           <div style="background: linear-gradient(135deg, #fee2e2, #fecaca); border-radius: 15px; padding: 20px; margin-bottom: 25px; border-left: 4px solid #ef4444;">
//             <h3 style="color: #dc2626; margin: 0 0 10px; font-size: 16px; font-weight: 600;">🔒 Security Notice</h3>
//             <p style="color: #b91c1c; margin: 0; font-size: 14px; line-height: 1.5;">Please change your password after your first login. Keep your login credentials secure and do not share them with anyone.</p>
//           </div>

//           <!-- Next Steps -->
//           <div style="background: linear-gradient(135deg, #dbeafe, #bfdbfe); border-radius: 15px; padding: 20px; margin-bottom: 25px; border-left: 4px solid #3b82f6;">
//             <h3 style="color: #1d4ed8; margin: 0 0 10px; font-size: 16px; font-weight: 600;">🚀 Next Steps</h3>
//             <p style="color: #1e40af; margin: 0; font-size: 14px; line-height: 1.5;">Use your credentials to log in to the Liveattendece system and start using the attendance management features.</p>
//           </div>

//           <!-- Footer -->
//           <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e2e8f0;">
//             <p style="color: #64748b; font-size: 14px; margin: 0;">This is an automated message from Liveattendece</p>
//             <p style="color: #94a3b8; font-size: 12px; margin: 5px 0 0;">Please do not reply to this email</p>
//           </div>
//         </div>
//       </div>
//     </body>
//     </html>
//     `

//     const mailOptions = {
//       from: `${institutionName} <liveattendance@noreply.com>`,
//       to,
//       subject,
//       html: htmlContent,
//     }

//     await transporter.sendMail(mailOptions)
//     return true
//   } catch (error) {
//     console.error("Failed to send welcome email:", error)
//     return false
//   }
// }

// export async function sendUpdateNotificationEmail({
//   to,
//   subject,
//   name,
//   code,
//   shift,
//   password,
//   type,
//   classLevel,
//   department,
//   role,
//   changes,
//   previousData,
//   institutionName,
// }: {
//   to: string
//   subject: string
//   name: string
//   code: string
//   shift: string
//   password?: string
//   type: "staff" | "student"
//   classLevel?: string
//   department?: string
//   role?: string
//   changes?: Record<string, { old: any; new: any }>
//   previousData?: Record<string, any>
//   institutionName?: string
// }) {
//   try {
//     const transporter = createTransporter()

//     const changesHtml =
//       changes && Object.keys(changes).length > 0
//         ? `
//       <!-- Recent Changes -->
//       <div style="background: linear-gradient(135deg, #ecfdf5, #d1fae5); border-radius: 15px; padding: 25px; margin-bottom: 25px; border-left: 4px solid #10b981;">
//         <h3 style="color: #065f46; margin: 0 0 15px; font-size: 18px; font-weight: 600;">📝 Recent Changes Made</h3>
//         <div style="display: grid; gap: 12px;">
//           ${Object.entries(changes)
//             .map(([field, change]) => {
//               const fieldLabel =
//                 field === "classLevel"
//                   ? "Class Level"
//                   : field === "dateOfBirth"
//                     ? "Date of Birth"
//                     : field === "dateOfJoining"
//                       ? "Date of Joining"
//                       : field === "parentName"
//                         ? "Parent Name"
//                         : field === "academicYear"
//                           ? "Academic Year"
//                           : field.charAt(0).toUpperCase() + field.slice(1)

//               return `
//             <div style="background: rgba(255, 255, 255, 0.7); border-radius: 8px; padding: 12px; border: 1px solid rgba(16, 185, 129, 0.2);">
//               <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
//                 <span style="color: #065f46; font-weight: 600; font-size: 14px;">${fieldLabel}</span>
//                 <span style="background: #10b981; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 500;">UPDATED</span>
//               </div>
//               <div style="display: grid; gap: 4px;">
//                 <div style="display: flex; align-items: center; gap: 8px;">
//                   <span style="color: #6b7280; font-size: 12px; font-weight: 500;">Previous:</span>
//                   <span style="color: #ef4444; font-size: 13px; text-decoration: line-through;">${change.old || "Not set"}</span>
//                 </div>
//                 <div style="display: flex; align-items: center; gap: 8px;">
//                   <span style="color: #6b7280; font-size: 12px; font-weight: 500;">Current:</span>
//                   <span style="color: #10b981; font-size: 13px; font-weight: 600;">${change.new || "Not set"}</span>
//                 </div>
//               </div>
//             </div>
//             `
//             })
//             .join("")}
//         </div>
//         <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(16, 185, 129, 0.2);">
//           <p style="color: #065f46; margin: 0; font-size: 13px; line-height: 1.4;">
//             <strong>Update Time:</strong> ${new Date().toLocaleString("en-US", {
//               timeZone: "Asia/Kolkata",
//               year: "numeric",
//               month: "long",
//               day: "numeric",
//               hour: "2-digit",
//               minute: "2-digit",
//               second: "2-digit",
//             })} IST
//           </p>
//         </div>
//       </div>
//     `
//         : ""

//     const htmlContent = `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="utf-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Account Updated - Liveattendece</title>
//     </head>
//     <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
//       <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
//         <div style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border-radius: 20px; padding: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); border: 1px solid rgba(255,255,255,0.2);">
          
//           <!-- Header -->
//           <div style="text-align: center; margin-bottom: 30px;">
//             <div style="background: linear-gradient(135deg, #0ea5e9, #06b6d4); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 30px rgba(14, 165, 233, 0.3);">
//               <span style="color: white; font-size: 32px; font-weight: bold;">📝</span>
//             </div>
//             <h1 style="color: #1e293b; margin: 0; font-size: 28px; font-weight: 700;">Account Updated</h1>
//             <p style="color: #64748b; margin: 10px 0 0; font-size: 16px;">Your account details have been successfully updated</p>
//           </div>

//           <!-- Greeting -->
//           <div style="margin-bottom: 30px;">
//             <p style="color: #334155; font-size: 18px; margin: 0;">Hello <strong>${name}</strong>,</p>
//             <p style="color: #64748b; font-size: 16px; margin: 10px 0 0; line-height: 1.6;">Your ${type} account has been updated with new information. ${changes && Object.keys(changes).length > 0 ? "Below are the specific changes made to your account:" : "Here are your current details:"}</p>
//           </div>

//           ${changesHtml}

//           <!-- Account Details -->
//           <div style="background: linear-gradient(135deg, #f8fafc, #e2e8f0); border-radius: 15px; padding: 25px; margin-bottom: 25px; border-left: 4px solid #0ea5e9;">
//             <h3 style="color: #1e293b; margin: 0 0 15px; font-size: 18px; font-weight: 600;">📋 Current Account Details</h3>
//             <div style="display: grid; gap: 10px;">
//               <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(148, 163, 184, 0.2);">
//                 <span style="color: #64748b; font-weight: 500;">Name:</span>
//                 <span style="color: #1e293b; font-weight: 600;">${name}</span>
//               </div>
//               ${
//                 institutionName
//                   ? `
//               <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(148, 163, 184, 0.2);">
//                 <span style="color: #64748b; font-weight: 500;">Institution:</span>
//                 <span style="color: #1e293b; font-weight: 600;">${institutionName}</span>
//               </div>`
//                   : ``
//               }
//               <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(148, 163, 184, 0.2);">
//                 <span style="color: #64748b; font-weight: 500;">${type === "staff" ? "Employee Code:" : "Roll Number:"}</span>
//                 <span style="color: #1e293b; font-weight: 600;">${code}</span>
//               </div>
//               ${
//                 department
//                   ? `
//               <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(148, 163, 184, 0.2);">
//                 <span style="color: #64748b; font-weight: 500;">Department:</span>
//                 <span style="color: #1e293b; font-weight: 600;">${department}</span>
//               </div>
//               `
//                   : ""
//               }
//               ${
//                 role
//                   ? `
//               <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(148, 163, 184, 0.2);">
//                 <span style="color: #64748b; font-weight: 500;">Role:</span>
//                 <span style="color: #1e293b; font-weight: 600;">${role}</span>
//               </div>
//               `
//                   : ""
//               }
//               ${
//                 classLevel
//                   ? `
//               <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(148, 163, 184, 0.2);">
//                 <span style="color: #64748b; font-weight: 500;">Class:</span>
//                 <span style="color: #1e293b; font-weight: 600;">${classLevel}</span>
//               </div>
//               `
//                   : ""
//               }
//               <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(148, 163, 184, 0.2);">
//                 <span style="color: #64748b; font-weight: 500;">Shift:</span>
//                 <span style="color: #1e293b; font-weight: 600; text-transform: capitalize;">${shift}</span>
//               </div>
//               <div style="display: flex; justify-content: space-between; padding: 8px 0;">
//                 <span style="color: #64748b; font-weight: 500;">Email:</span>
//                 <span style="color: #1e293b; font-weight: 600;">${to}</span>
//               </div>
//             </div>
//           </div>

//           ${
//             password
//               ? `
//           <!-- Password Info -->
//           <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 15px; padding: 20px; margin-bottom: 25px; border-left: 4px solid #f59e0b;">
//             <h3 style="color: #92400e; margin: 0 0 10px; font-size: 16px; font-weight: 600;">🔐 Password Updated</h3>
//             <p style="color: #b45309; margin: 0 0 10px; font-size: 14px; line-height: 1.5;">Your password has been updated. Please use your new credentials to log in to the system.</p>
//             <div style="background: rgba(255, 255, 255, 0.7); border-radius: 8px; padding: 12px; margin-top: 10px;">
//               <div style="display: flex; justify-content: space-between; align-items: center;">
//                 <span style="color: #92400e; font-weight: 500; font-size: 14px;">New Password:</span>
//                 <span style="color: #92400e; font-weight: 600; font-family: monospace; background: #f1f5f9; padding: 4px 8px; border-radius: 4px; font-size: 13px;">${password}</span>
//               </div>
//             </div>
//           </div>
//           `
//               : ""
//           }

//           <!-- Security Notice -->
//           <div style="background: linear-gradient(135deg, #fee2e2, #fecaca); border-radius: 15px; padding: 20px; margin-bottom: 25px; border-left: 4px solid #ef4444;">
//             <h3 style="color: #dc2626; margin: 0 0 10px; font-size: 16px; font-weight: 600;">🔒 Security Notice</h3>
//             <p style="color: #b91c1c; margin: 0; font-size: 14px; line-height: 1.5;">If you did not request this update, please contact your administrator immediately. Keep your login credentials secure and do not share them with anyone.</p>
//           </div>

//           <!-- Footer -->
//           <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e2e8f0;">
//             <p style="color: #64748b; font-size: 14px; margin: 0;">This is an automated message from Liveattendece</p>
//             <p style="color: #94a3b8; font-size: 12px; margin: 5px 0 0;">Please do not reply to this email</p>
//           </div>
//         </div>
//       </div>
//     </body>
//     </html>
//     `

//     const mailOptions = {
//       from: `${institutionName} <liveattendance@noreply.com>`,
//       to,
//       subject,
//       html: htmlContent,
//     }

//     await transporter.sendMail(mailOptions)
//     return true
//   } catch (error) {
//     console.error("Failed to send update notification email:", error)
//     return false
//   }
// }

// export async function sendLeaveRequestNotificationEmail({
//   to,
//   toName,
//   requesterName,
//   requesterType,
//   requesterCode,
//   leaveType,
//   startDate,
//   endDate,
//   totalDays,
//   reason,
//   appliedDate,
//   leaveRequestId,
// }: {
//   to: string
//   toName: string
//   requesterName: string
//   requesterType: "staff" | "student"
//   requesterCode: string
//   leaveType: string
//   startDate: string
//   endDate: string
//   totalDays: number
//   reason: string
//   appliedDate: string
//   leaveRequestId: string
// }) {
//   try {
//     const transporter = createTransporter()

//     const leaveTypeLabels: Record<string, string> = {
//       sick: "Sick Leave",
//       casual: "Casual Leave",
//       annual: "Annual Leave",
//       maternity: "Maternity Leave",
//       emergency: "Emergency Leave",
//       other: "Other Leave",
//     }

//     const htmlContent = `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="utf-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Leave Request - Liveattendece</title>
//     </head>
//     <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
//       <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
//         <div style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border-radius: 20px; padding: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); border: 1px solid rgba(255,255,255,0.2);">
          
//           <!-- Header -->
//           <div style="text-align: center; margin-bottom: 30px;">
//             <div style="background: linear-gradient(135deg, #f59e0b, #d97706); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 30px rgba(245, 158, 11, 0.3);">
//               <span style="color: white; font-size: 32px; font-weight: bold;">📋</span>
//             </div>
//             <h1 style="color: #1e293b; margin: 0; font-size: 28px; font-weight: 700;">Leave Request Pending</h1>
//             <p style="color: #64748b; margin: 10px 0 0; font-size: 16px;">A new leave request requires your approval</p>
//           </div>

//           <!-- Greeting -->
//           <div style="margin-bottom: 30px;">
//             <p style="color: #334155; font-size: 18px; margin: 0;">Hello <strong>${toName}</strong>,</p>
//             <p style="color: #64748b; font-size: 16px; margin: 10px 0 0; line-height: 1.6;">A ${requesterType} has submitted a leave request that requires your approval. Please review the details below:</p>
//           </div>

//           <!-- Requester Info -->
//           <div style="background: linear-gradient(135deg, #f0f9ff, #e0f2fe); border-radius: 15px; padding: 25px; margin-bottom: 25px; border-left: 4px solid #0ea5e9;">
//             <h3 style="color: #0c4a6e; margin: 0 0 15px; font-size: 18px; font-weight: 600;">👤 Requester Information</h3>
//             <div style="display: grid; gap: 10px;">
//               <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(14, 165, 233, 0.2);">
//                 <span style="color: #0369a1; font-weight: 500;">Name:</span>
//                 <span style="color: #0c4a6e; font-weight: 600;">${requesterName}</span>
//               </div>
//               <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(14, 165, 233, 0.2);">
//                 <span style="color: #0369a1; font-weight: 500;">Type:</span>
//                 <span style="color: #0c4a6e; font-weight: 600; text-transform: capitalize;">${requesterType}</span>
//               </div>
//               <div style="display: flex; justify-content: space-between; padding: 8px 0;">
//                 <span style="color: #0369a1; font-weight: 500;">${requesterType === "staff" ? "Employee Code:" : "Roll Number:"}</span>
//                 <span style="color: #0c4a6e; font-weight: 600;">${requesterCode}</span>
//               </div>
//             </div>
//           </div>

//           <!-- Leave Details -->
//           <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 15px; padding: 25px; margin-bottom: 25px; border-left: 4px solid #f59e0b;">
//             <h3 style="color: #92400e; margin: 0 0 15px; font-size: 18px; font-weight: 600;">📅 Leave Request Details</h3>
//             <div style="display: grid; gap: 10px;">
//               <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(245, 158, 11, 0.2);">
//                 <span style="color: #b45309; font-weight: 500;">Leave Type:</span>
//                 <span style="color: #92400e; font-weight: 600;">${leaveTypeLabels[leaveType] || leaveType}</span>
//               </div>
//               <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(245, 158, 11, 0.2);">
//                 <span style="color: #b45309; font-weight: 500;">Start Date:</span>
//                 <span style="color: #92400e; font-weight: 600;">${new Date(startDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
//               </div>
//               <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(245, 158, 11, 0.2);">
//                 <span style="color: #b45309; font-weight: 500;">End Date:</span>
//                 <span style="color: #92400e; font-weight: 600;">${new Date(endDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
//               </div>
//               <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(245, 158, 11, 0.2);">
//                 <span style="color: #b45309; font-weight: 500;">Total Days:</span>
//                 <span style="color: #92400e; font-weight: 600;">${totalDays} working days</span>
//               </div>
//               <div style="display: flex; justify-content: space-between; padding: 8px 0;">
//                 <span style="color: #b45309; font-weight: 500;">Applied On:</span>
//                 <span style="color: #92400e; font-weight: 600;">${new Date(appliedDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
//               </div>
//             </div>
//           </div>

//           <!-- Reason -->
//           <div style="background: linear-gradient(135deg, #f3f4f6, #e5e7eb); border-radius: 15px; padding: 25px; margin-bottom: 25px; border-left: 4px solid #6b7280;">
//             <h3 style="color: #374151; margin: 0 0 15px; font-size: 18px; font-weight: 600;">💬 Reason for Leave</h3>
//             <p style="color: #4b5563; margin: 0; font-size: 15px; line-height: 1.6; background: rgba(255, 255, 255, 0.7); padding: 15px; border-radius: 8px;">${reason}</p>
//           </div>

//           <!-- Action Required -->
//           <div style="background: linear-gradient(135deg, #dbeafe, #bfdbfe); border-radius: 15px; padding: 20px; margin-bottom: 25px; border-left: 4px solid #3b82f6;">
//             <h3 style="color: #1d4ed8; margin: 0 0 10px; font-size: 16px; font-weight: 600;">⚡ Action Required</h3>
//             <p style="color: #1e40af; margin: 0; font-size: 14px; line-height: 1.5;">Please log in to the Liveattendece system to review and approve or reject this leave request. The requester will be notified of your decision via email.</p>
//           </div>

//           <!-- Footer -->
//           <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e2e8f0;">
//             <p style="color: #64748b; font-size: 14px; margin: 0;">Request ID: ${leaveRequestId}</p>
//             <p style="color: #94a3b8; font-size: 12px; margin: 5px 0 0;">This is an automated message from Liveattendece</p>
//           </div>
//         </div>
//       </div>
//     </body>
//     </html>
//     `

//     const mailOptions = {
//       from: `Leave Request Approval Required - ${requesterName}`,
//       to,
//       subject: `Leave Request Approval Required - ${requesterName} (${requesterCode})`,
//       html: htmlContent,
//     }

//     await transporter.sendMail(mailOptions)
//     return true
//   } catch (error) {
//     console.error("Failed to send leave request notification email:", error)
//     return false
//   }
// }

// export async function sendLeaveStatusNotificationEmail({
//   to,
//   requesterName,
//   requesterType,
//   requesterCode,
//   leaveType,
//   startDate,
//   endDate,
//   totalDays,
//   reason,
//   status,
//   reviewerName,
//   reviewComments,
//   reviewedDate,
//   leaveRequestId,
// }: {
//   to: string
//   requesterName: string
//   requesterType: "staff" | "student"
//   requesterCode: string
//   leaveType: string
//   startDate: string
//   endDate: string
//   totalDays: number
//   reason: string
//   status: "approved" | "rejected"
//   reviewerName: string
//   reviewComments?: string
//   reviewedDate: string
//   leaveRequestId: string
// }) {
//   try {
//     const transporter = createTransporter()

//     const leaveTypeLabels: Record<string, string> = {
//       sick: "Sick Leave",
//       casual: "Casual Leave",
//       annual: "Annual Leave",
//       maternity: "Maternity Leave",
//       emergency: "Emergency Leave",
//       other: "Other Leave",
//     }

//     const isApproved = status === "approved"
//     const statusColor = isApproved ? "#10b981" : "#ef4444"
//     const statusBg = isApproved
//       ? "linear-gradient(135deg, #ecfdf5, #d1fae5)"
//       : "linear-gradient(135deg, #fee2e2, #fecaca)"
//     const statusIcon = isApproved ? "✅" : "❌"
//     const statusText = isApproved ? "Approved" : "Rejected"

//     const htmlContent = `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="utf-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Leave Request ${statusText} - Liveattendece</title>
//     </head>
//     <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
//       <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
//         <div style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border-radius: 20px; padding: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); border: 1px solid rgba(255,255,255,0.2);">
          
//           <!-- Header -->
//           <div style="text-align: center; margin-bottom: 30px;">
//             <div style="background: linear-gradient(135deg, ${statusColor}, ${statusColor}dd); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 30px ${statusColor}33;">
//               <span style="color: white; font-size: 32px; font-weight: bold;">${statusIcon}</span>
//             </div>
//             <h1 style="color: #1e293b; margin: 0; font-size: 28px; font-weight: 700;">Leave Request ${statusText}</h1>
//             <p style="color: #64748b; margin: 10px 0 0; font-size: 16px;">Your leave request has been ${status}</p>
//           </div>

//           <!-- Greeting -->
//           <div style="margin-bottom: 30px;">
//             <p style="color: #334155; font-size: 18px; margin: 0;">Hello <strong>${requesterName}</strong>,</p>
//             <p style="color: #64748b; font-size: 16px; margin: 10px 0 0; line-height: 1.6;">Your leave request has been reviewed and ${status} by ${reviewerName}. Here are the details:</p>
//           </div>

//           <!-- Status -->
//           <div style="background: ${statusBg}; border-radius: 15px; padding: 25px; margin-bottom: 25px; border-left: 4px solid ${statusColor};">
//             <h3 style="color: ${statusColor === "#10b981" ? "#065f46" : "#dc2626"}; margin: 0 0 15px; font-size: 18px; font-weight: 600;">${statusIcon} Request ${statusText}</h3>
//             <div style="display: grid; gap: 10px;">
//               <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid ${statusColor}33;">
//                 <span style="color: ${statusColor === "#10b981" ? "#047857" : "#b91c1c"}; font-weight: 500;">Status:</span>
//                 <span style="color: ${statusColor === "#10b981" ? "#065f46" : "#dc2626"}; font-weight: 600; text-transform: uppercase;">${statusText}</span>
//               </div>
//               <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid ${statusColor}33;">
//                 <span style="color: ${statusColor === "#10b981" ? "#047857" : "#b91c1c"}; font-weight: 500;">Reviewed By:</span>
//                 <span style="color: ${statusColor === "#10b981" ? "#065f46" : "#dc2626"}; font-weight: 600;">${reviewerName}</span>
//               </div>
//               <div style="display: flex; justify-content: space-between; padding: 8px 0;">
//                 <span style="color: ${statusColor === "#10b981" ? "#047857" : "#b91c1c"}; font-weight: 500;">Reviewed On:</span>
//                 <span style="color: ${statusColor === "#10b981" ? "#065f46" : "#dc2626"}; font-weight: 600;">${new Date(reviewedDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
//               </div>
//             </div>
//           </div>

//           <!-- Leave Details -->
//           <div style="background: linear-gradient(135deg, #f8fafc, #e2e8f0); border-radius: 15px; padding: 25px; margin-bottom: 25px; border-left: 4px solid #0ea5e9;">
//             <h3 style="color: #1e293b; margin: 0 0 15px; font-size: 18px; font-weight: 600;">📅 Leave Request Details</h3>
//             <div style="display: grid; gap: 10px;">
//               <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(148, 163, 184, 0.2);">
//                 <span style="color: #64748b; font-weight: 500;">Leave Type:</span>
//                 <span style="color: #1e293b; font-weight: 600;">${leaveTypeLabels[leaveType] || leaveType}</span>
//               </div>
//               <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(148, 163, 184, 0.2);">
//                 <span style="color: #64748b; font-weight: 500;">Duration:</span>
//                 <span style="color: #1e293b; font-weight: 600;">${new Date(startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${new Date(endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
//               </div>
//               <div style="display: flex; justify-content: space-between; padding: 8px 0;">
//                 <span style="color: #64748b; font-weight: 500;">Total Days:</span>
//                 <span style="color: #1e293b; font-weight: 600;">${totalDays} working days</span>
//               </div>
//             </div>
//           </div>

//           ${
//             reviewComments
//               ? `
//           <!-- Review Comments -->
//           <div style="background: linear-gradient(135deg, #f3f4f6, #e5e7eb); border-radius: 15px; padding: 25px; margin-bottom: 25px; border-left: 4px solid #6b7280;">
//             <h3 style="color: #374151; margin: 0 0 15px; font-size: 18px; font-weight: 600;">💬 Review Comments</h3>
//             <p style="color: #4b5563; margin: 0; font-size: 15px; line-height: 1.6; background: rgba(255, 255, 255, 0.7); padding: 15px; border-radius: 8px;">${reviewComments}</p>
//           </div>
//           `
//               : ""
//           }

//           <!-- Next Steps -->
//           <div style="background: linear-gradient(135deg, #dbeafe, #bfdbfe); border-radius: 15px; padding: 20px; margin-bottom: 25px; border-left: 4px solid #3b82f6;">
//             <h3 style="color: #1d4ed8; margin: 0 0 10px; font-size: 16px; font-weight: 600;">📋 Next Steps</h3>
//             <p style="color: #1e40af; margin: 0; font-size: 14px; line-height: 1.5;">
//               ${
//                 isApproved
//                   ? "Your leave has been approved. Please ensure proper handover of responsibilities before your leave period begins."
//                   : "Your leave request has been rejected. If you have questions about this decision, please contact your supervisor or HR department."
//               }
//             </p>
//           </div>

//           <!-- Footer -->
//           <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e2e8f0;">
//             <p style="color: #64748b; font-size: 14px; margin: 0;">Request ID: ${leaveRequestId}</p>
//             <p style="color: #94a3b8; font-size: 12px; margin: 5px 0 0;">This is an automated message from Liveattendece</p>
//           </div>
//         </div>
//       </div>
//     </body>
//     </html>
//     `

//     const mailOptions = {
//       from: `<liveattendance@noreply.com>`,
//       to,
//       subject: `Leave Request ${statusText} - ${leaveTypeLabels[leaveType] || leaveType}`,
//       html: htmlContent,
//     }

//     await transporter.sendMail(mailOptions)
//     return true
//   } catch (error) {
//     console.error("Failed to send leave status notification email:", error)
//     return false
//   }
// }





import { createTransporter } from "./transporter"

export async function sendWelcomeEmail({
  to,
  subject,
  name,
  code,
  shift,
  password,
  type,
  institutionName,
}: {
  to: string
  subject: string
  name: string
  code: string
  shift: string
  password: string
  type: "staff" | "student"
  institutionName?: string
}) {
  try {
    const transporter = createTransporter()

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Face Attendence</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border-radius: 20px; padding: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); border: 1px solid rgba(255,255,255,0.2);">
          
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background: linear-gradient(135deg, #0ea5e9, #06b6d4); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 30px rgba(14, 165, 233, 0.3);">
              <span style="color: white; font-size: 32px; font-weight: bold;">🎉</span>
            </div>
            <h1 style="color: #1e293b; margin: 0; font-size: 28px; font-weight: 700;">Welcome to Face Attendence!</h1>
            <p style="color: #64748b; margin: 10px 0 0; font-size: 16px;">Your account has been successfully created</p>
          </div>

          <!-- Greeting -->
          <div style="margin-bottom: 30px;">
            <p style="color: #334155; font-size: 18px; margin: 0;">Hello <strong>${name}</strong>,</p>
            <p style="color: #64748b; font-size: 16px; margin: 10px 0 0; line-height: 1.6;">Welcome to Face Attendence! Your ${type} account has been created successfully. Here are your login credentials:</p>
          </div>

          <!-- Account Details -->
          <div style="background: linear-gradient(135deg, #f8fafc, #e2e8f0); border-radius: 15px; padding: 25px; margin-bottom: 25px; border-left: 4px solid #0ea5e9;">
            <h3 style="color: #1e293b; margin: 0 0 15px; font-size: 18px; font-weight: 600;">📋 Your Account Details</h3>
            <div style="display: grid; gap: 10px;">
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(148, 163, 184, 0.2);">
                <span style="color: #64748b; font-weight: 500;">Name:</span>
                <span style="color: #1e293b; font-weight: 600;">${name}</span>
              </div>
              ${
                institutionName
                  ? `
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(148, 163, 184, 0.2);">
                <span style="color: #64748b; font-weight: 500;">Institution:</span>
                <span style="color: #1e293b; font-weight: 600;">${institutionName}</span>
              </div>`
                  : ``
              }
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(148, 163, 184, 0.2);">
                <span style="color: #64748b; font-weight: 500;">${type === "staff" ? "Employee Code:" : "Roll Number:"}</span>
                <span style="color: #1e293b; font-weight: 600;">${code}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(148, 163, 184, 0.2);">
                <span style="color: #64748b; font-weight: 500;">Email:</span>
                <span style="color: #1e293b; font-weight: 600;">${to}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(148, 163, 184, 0.2);">
                <span style="color: #64748b; font-weight: 500;">Shift:</span>
                <span style="color: #1e293b; font-weight: 600; text-transform: capitalize;">${shift}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                <span style="color: #64748b; font-weight: 500;">Password:</span>
                <span style="color: #1e293b; font-weight: 600; font-family: monospace; background: #f1f5f9; padding: 4px 8px; border-radius: 4px;">${password}</span>
              </div>
            </div>
          </div>

          <!-- Security Notice -->
          <div style="background: linear-gradient(135deg, #fee2e2, #fecaca); border-radius: 15px; padding: 20px; margin-bottom: 25px; border-left: 4px solid #ef4444;">
            <h3 style="color: #dc2626; margin: 0 0 10px; font-size: 16px; font-weight: 600;">🔒 Security Notice</h3>
            <p style="color: #b91c1c; margin: 0; font-size: 14px; line-height: 1.5;">Please change your password after your first login. Keep your login credentials secure and do not share them with anyone.</p>
          </div>

          <!-- Next Steps -->
          <div style="background: linear-gradient(135deg, #dbeafe, #bfdbfe); border-radius: 15px; padding: 20px; margin-bottom: 25px; border-left: 4px solid #3b82f6;">
            <h3 style="color: #1d4ed8; margin: 0 0 10px; font-size: 16px; font-weight: 600;">🚀 Next Steps</h3>
            <p style="color: #1e40af; margin: 0; font-size: 14px; line-height: 1.5;">Use your credentials to log in to the Face Attendence system and start using the attendance management features.</p>
          </div>

          <!-- Login Button -->
          <div style="text-align: center; margin-bottom: 25px;">
            <a href="https://faceattendv1.netlify.app/login" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); transition: all 0.3s ease;">
              🚀 Login to Face Attendence
            </a>
            <p style="color: #94a3b8; font-size: 13px; margin: 10px 0 0;">Click the button above to access your dashboard</p>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 14px; margin: 0;">This is an automated message from Face Attendence</p>
            <p style="color: #94a3b8; font-size: 12px; margin: 5px 0 0;">Please do not reply to this email</p>
          </div>
        </div>
      </div>
    </body>
    </html>
    `

    const mailOptions = {
      from: `${institutionName} <liveattendance@noreply.com>`,
      to,
      subject,
      html: htmlContent,
    }

    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error("Failed to send welcome email:", error)
    return false
  }
}

export async function sendUpdateNotificationEmail({
  to,
  subject,
  name,
  code,
  shift,
  password,
  type,
  classLevel,
  department,
  role,
  changes,
  previousData,
  institutionName,
}: {
  to: string
  subject: string
  name: string
  code: string
  shift: string
  password?: string
  type: "staff" | "student"
  classLevel?: string
  department?: string
  role?: string
  changes?: Record<string, { old: any; new: any }>
  previousData?: Record<string, any>
  institutionName?: string
}) {
  try {
    const transporter = createTransporter()

    const changesHtml =
      changes && Object.keys(changes).length > 0
        ? `
      <!-- Recent Changes -->
      <div style="background: linear-gradient(135deg, #ecfdf5, #d1fae5); border-radius: 15px; padding: 25px; margin-bottom: 25px; border-left: 4px solid #10b981;">
        <h3 style="color: #065f46; margin: 0 0 15px; font-size: 18px; font-weight: 600;">📝 Recent Changes Made</h3>
        <div style="display: grid; gap: 12px;">
          ${Object.entries(changes)
            .map(([field, change]) => {
              const fieldLabel =
                field === "classLevel"
                  ? "Class Level"
                  : field === "dateOfBirth"
                    ? "Date of Birth"
                    : field === "dateOfJoining"
                      ? "Date of Joining"
                      : field === "parentName"
                        ? "Parent Name"
                        : field === "academicYear"
                          ? "Academic Year"
                          : field.charAt(0).toUpperCase() + field.slice(1)

              return `
            <div style="background: rgba(255, 255, 255, 0.7); border-radius: 8px; padding: 12px; border: 1px solid rgba(16, 185, 129, 0.2);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <span style="color: #065f46; font-weight: 600; font-size: 14px;">${fieldLabel}</span>
                <span style="background: #10b981; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 500;">UPDATED</span>
              </div>
              <div style="display: grid; gap: 4px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="color: #6b7280; font-size: 12px; font-weight: 500;">Previous:</span>
                  <span style="color: #ef4444; font-size: 13px; text-decoration: line-through;">${change.old || "Not set"}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="color: #6b7280; font-size: 12px; font-weight: 500;">Current:</span>
                  <span style="color: #10b981; font-size: 13px; font-weight: 600;">${change.new || "Not set"}</span>
                </div>
              </div>
            </div>
            `
            })
            .join("")}
        </div>
        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(16, 185, 129, 0.2);">
          <p style="color: #065f46; margin: 0; font-size: 13px; line-height: 1.4;">
            <strong>Update Time:</strong> ${new Date().toLocaleString("en-US", {
              timeZone: "Asia/Kolkata",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })} IST
          </p>
        </div>
      </div>
    `
        : ""

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Account Updated - Face Attendence</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border-radius: 20px; padding: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); border: 1px solid rgba(255,255,255,0.2);">
          
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background: linear-gradient(135deg, #0ea5e9, #06b6d4); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 30px rgba(14, 165, 233, 0.3);">
              <span style="color: white; font-size: 32px; font-weight: bold;">📝</span>
            </div>
            <h1 style="color: #1e293b; margin: 0; font-size: 28px; font-weight: 700;">Account Updated</h1>
            <p style="color: #64748b; margin: 10px 0 0; font-size: 16px;">Your account details have been successfully updated</p>
          </div>

          <!-- Greeting -->
          <div style="margin-bottom: 30px;">
            <p style="color: #334155; font-size: 18px; margin: 0;">Hello <strong>${name}</strong>,</p>
            <p style="color: #64748b; font-size: 16px; margin: 10px 0 0; line-height: 1.6;">Your ${type} account has been updated with new information. ${changes && Object.keys(changes).length > 0 ? "Below are the specific changes made to your account:" : "Here are your current details:"}</p>
          </div>

          ${changesHtml}

          <!-- Account Details -->
          <div style="background: linear-gradient(135deg, #f8fafc, #e2e8f0); border-radius: 15px; padding: 25px; margin-bottom: 25px; border-left: 4px solid #0ea5e9;">
            <h3 style="color: #1e293b; margin: 0 0 15px; font-size: 18px; font-weight: 600;">📋 Current Account Details</h3>
            <div style="display: grid; gap: 10px;">
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(148, 163, 184, 0.2);">
                <span style="color: #64748b; font-weight: 500;">Name:</span>
                <span style="color: #1e293b; font-weight: 600;">${name}</span>
              </div>
              ${
                institutionName
                  ? `
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(148, 163, 184, 0.2);">
                <span style="color: #64748b; font-weight: 500;">Institution:</span>
                <span style="color: #1e293b; font-weight: 600;">${institutionName}</span>
              </div>`
                  : ``
              }
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(148, 163, 184, 0.2);">
                <span style="color: #64748b; font-weight: 500;">${type === "staff" ? "Employee Code:" : "Roll Number:"}</span>
                <span style="color: #1e293b; font-weight: 600;">${code}</span>
              </div>
              ${
                department
                  ? `
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(148, 163, 184, 0.2);">
                <span style="color: #64748b; font-weight: 500;">Department:</span>
                <span style="color: #1e293b; font-weight: 600;">${department}</span>
              </div>
              `
                  : ""
              }
              ${
                role
                  ? `
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(148, 163, 184, 0.2);">
                <span style="color: #64748b; font-weight: 500;">Role:</span>
                <span style="color: #1e293b; font-weight: 600;">${role}</span>
              </div>
              `
                  : ""
              }
              ${
                classLevel
                  ? `
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(148, 163, 184, 0.2);">
                <span style="color: #64748b; font-weight: 500;">Class:</span>
                <span style="color: #1e293b; font-weight: 600;">${classLevel}</span>
              </div>
              `
                  : ""
              }
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(148, 163, 184, 0.2);">
                <span style="color: #64748b; font-weight: 500;">Shift:</span>
                <span style="color: #1e293b; font-weight: 600; text-transform: capitalize;">${shift}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                <span style="color: #64748b; font-weight: 500;">Email:</span>
                <span style="color: #1e293b; font-weight: 600;">${to}</span>
              </div>
            </div>
          </div>

          ${
            password
              ? `
          <!-- Password Info -->
          <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 15px; padding: 20px; margin-bottom: 25px; border-left: 4px solid #f59e0b;">
            <h3 style="color: #92400e; margin: 0 0 10px; font-size: 16px; font-weight: 600;">🔐 Password Updated</h3>
            <p style="color: #b45309; margin: 0 0 10px; font-size: 14px; line-height: 1.5;">Your password has been updated. Please use your new credentials to log in to the system.</p>
            <div style="background: rgba(255, 255, 255, 0.7); border-radius: 8px; padding: 12px; margin-top: 10px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #92400e; font-weight: 500; font-size: 14px;">New Password:</span>
                <span style="color: #92400e; font-weight: 600; font-family: monospace; background: #f1f5f9; padding: 4px 8px; border-radius: 4px; font-size: 13px;">${password}</span>
              </div>
            </div>
          </div>
          `
              : ""
          }

          <!-- Security Notice -->
          <div style="background: linear-gradient(135deg, #fee2e2, #fecaca); border-radius: 15px; padding: 20px; margin-bottom: 25px; border-left: 4px solid #ef4444;">
            <h3 style="color: #dc2626; margin: 0 0 10px; font-size: 16px; font-weight: 600;">🔒 Security Notice</h3>
            <p style="color: #b91c1c; margin: 0; font-size: 14px; line-height: 1.5;">If you did not request this update, please contact your administrator immediately. Keep your login credentials secure and do not share them with anyone.</p>
          </div>

          <!-- Login Button -->
          <div style="text-align: center; margin-bottom: 25px;">
            <a href="https://faceattendv1.netlify.app/login" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); transition: all 0.3s ease;">
              🚀 Login to Face Attendence
            </a>
            <p style="color: #94a3b8; font-size: 13px; margin: 10px 0 0;">Click the button above to access your dashboard</p>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 14px; margin: 0;">This is an automated message from Face Attendence</p>
            <p style="color: #94a3b8; font-size: 12px; margin: 5px 0 0;">Please do not reply to this email</p>
          </div>
        </div>
      </div>
    </body>
    </html>
    `

    const mailOptions = {
      from: `${institutionName} <faceattendance@noreply.com>`,
      to,
      subject,
      html: htmlContent,
    }

    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error("Failed to send update notification email:", error)
    return false
  }
}

export async function sendLeaveRequestNotificationEmail({
  to,
  toName,
  requesterName,
  requesterType,
  requesterCode,
  leaveType,
  startDate,
  endDate,
  totalDays,
  reason,
  appliedDate,
  leaveRequestId,
}: {
  to: string
  toName: string
  requesterName: string
  requesterType: "staff" | "student"
  requesterCode: string
  leaveType: string
  startDate: string
  endDate: string
  totalDays: number
  reason: string
  appliedDate: string
  leaveRequestId: string
}) {
  try {
    const transporter = createTransporter()

    const leaveTypeLabels: Record<string, string> = {
      sick: "Sick Leave",
      casual: "Casual Leave",
      annual: "Annual Leave",
      maternity: "Maternity Leave",
      emergency: "Emergency Leave",
      other: "Other Leave",
    }

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Leave Request - Face Attendence</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border-radius: 20px; padding: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); border: 1px solid rgba(255,255,255,0.2);">
          
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background: linear-gradient(135deg, #f59e0b, #d97706); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 30px rgba(245, 158, 11, 0.3);">
              <span style="color: white; font-size: 32px; font-weight: bold;">📋</span>
            </div>
            <h1 style="color: #1e293b; margin: 0; font-size: 28px; font-weight: 700;">Leave Request Pending</h1>
            <p style="color: #64748b; margin: 10px 0 0; font-size: 16px;">A new leave request requires your approval</p>
          </div>

          <!-- Greeting -->
          <div style="margin-bottom: 30px;">
            <p style="color: #334155; font-size: 18px; margin: 0;">Hello <strong>${toName}</strong>,</p>
            <p style="color: #64748b; font-size: 16px; margin: 10px 0 0; line-height: 1.6;">A ${requesterType} has submitted a leave request that requires your approval. Please review the details below:</p>
          </div>

          <!-- Requester Info -->
          <div style="background: linear-gradient(135deg, #f0f9ff, #e0f2fe); border-radius: 15px; padding: 25px; margin-bottom: 25px; border-left: 4px solid #0ea5e9;">
            <h3 style="color: #0c4a6e; margin: 0 0 15px; font-size: 18px; font-weight: 600;">👤 Requester Information</h3>
            <div style="display: grid; gap: 10px;">
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(14, 165, 233, 0.2);">
                <span style="color: #0369a1; font-weight: 500;">Name:</span>
                <span style="color: #0c4a6e; font-weight: 600;">${requesterName}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(14, 165, 233, 0.2);">
                <span style="color: #0369a1; font-weight: 500;">Type:</span>
                <span style="color: #0c4a6e; font-weight: 600; text-transform: capitalize;">${requesterType}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                <span style="color: #0369a1; font-weight: 500;">${requesterType === "staff" ? "Employee Code:" : "Roll Number:"}</span>
                <span style="color: #0c4a6e; font-weight: 600;">${requesterCode}</span>
              </div>
            </div>
          </div>

          <!-- Leave Details -->
          <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 15px; padding: 25px; margin-bottom: 25px; border-left: 4px solid #f59e0b;">
            <h3 style="color: #92400e; margin: 0 0 15px; font-size: 18px; font-weight: 600;">📅 Leave Request Details</h3>
            <div style="display: grid; gap: 10px;">
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(245, 158, 11, 0.2);">
                <span style="color: #b45309; font-weight: 500;">Leave Type:</span>
                <span style="color: #92400e; font-weight: 600;">${leaveTypeLabels[leaveType] || leaveType}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(245, 158, 11, 0.2);">
                <span style="color: #b45309; font-weight: 500;">Start Date:</span>
                <span style="color: #92400e; font-weight: 600;">${new Date(startDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(245, 158, 11, 0.2);">
                <span style="color: #b45309; font-weight: 500;">End Date:</span>
                <span style="color: #92400e; font-weight: 600;">${new Date(endDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(245, 158, 11, 0.2);">
                <span style="color: #b45309; font-weight: 500;">Total Days:</span>
                <span style="color: #92400e; font-weight: 600;">${totalDays} working days</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                <span style="color: #b45309; font-weight: 500;">Applied On:</span>
                <span style="color: #92400e; font-weight: 600;">${new Date(appliedDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
              </div>
            </div>
          </div>

          <!-- Reason -->
          <div style="background: linear-gradient(135deg, #f3f4f6, #e5e7eb); border-radius: 15px; padding: 25px; margin-bottom: 25px; border-left: 4px solid #6b7280;">
            <h3 style="color: #374151; margin: 0 0 15px; font-size: 18px; font-weight: 600;">💬 Reason for Leave</h3>
            <p style="color: #4b5563; margin: 0; font-size: 15px; line-height: 1.6; background: rgba(255, 255, 255, 0.7); padding: 15px; border-radius: 8px;">${reason}</p>
          </div>

          <!-- Action Required -->
          <div style="background: linear-gradient(135deg, #dbeafe, #bfdbfe); border-radius: 15px; padding: 20px; margin-bottom: 25px; border-left: 4px solid #3b82f6;">
            <h3 style="color: #1d4ed8; margin: 0 0 10px; font-size: 16px; font-weight: 600;">⚡ Action Required</h3>
            <p style="color: #1e40af; margin: 0; font-size: 14px; line-height: 1.5;">Please log in to the Face Attendence system to review and approve or reject this leave request. The requester will be notified of your decision via email.</p>
          </div>

          <!-- Login Button -->
          <div style="text-align: center; margin-bottom: 25px;">
            <a href="https://faceattendv1.netlify.app/login" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); transition: all 0.3s ease;">
              🚀 Review Leave Request
            </a>
            <p style="color: #94a3b8; font-size: 13px; margin: 10px 0 0;">Click the button above to access your dashboard</p>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 14px; margin: 0;">Request ID: ${leaveRequestId}</p>
            <p style="color: #94a3b8; font-size: 12px; margin: 5px 0 0;">This is an automated message from Face Attendence</p>
          </div>
        </div>
      </div>
    </body>
    </html>
    `

    const mailOptions = {
      from: 'faceattendance@noreply.com',
      to,
      subject: `Leave Request Approval Required - ${requesterName} (${requesterCode})`,
      html: htmlContent,
    }

    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error("Failed to send leave request notification email:", error)
    return false
  }
}

export async function sendLeaveStatusNotificationEmail({
  to,
  requesterName,
  requesterType,
  requesterCode,
  leaveType,
  startDate,
  endDate,
  totalDays,
  reason,
  status,
  reviewerName,
  reviewComments,
  reviewedDate,
  leaveRequestId,
}: {
  to: string
  requesterName: string
  requesterType: "staff" | "student"
  requesterCode: string
  leaveType: string
  startDate: string
  endDate: string
  totalDays: number
  reason: string
  status: "approved" | "rejected"
  reviewerName: string
  reviewComments?: string
  reviewedDate: string
  leaveRequestId: string
}) {
  try {
    const transporter = createTransporter()

    const leaveTypeLabels: Record<string, string> = {
      sick: "Sick Leave",
      casual: "Casual Leave",
      annual: "Annual Leave",
      maternity: "Maternity Leave",
      emergency: "Emergency Leave",
      other: "Other Leave",
    }

    const isApproved = status === "approved"
    const statusColor = isApproved ? "#10b981" : "#ef4444"
    const statusBg = isApproved
      ? "linear-gradient(135deg, #ecfdf5, #d1fae5)"
      : "linear-gradient(135deg, #fee2e2, #fecaca)"
    const statusIcon = isApproved ? "✅" : "❌"
    const statusText = isApproved ? "Approved" : "Rejected"

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Leave Request ${statusText} - Face Attendence</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border-radius: 20px; padding: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); border: 1px solid rgba(255,255,255,0.2);">
          
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background: linear-gradient(135deg, ${statusColor}, ${statusColor}dd); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 30px ${statusColor}33;">
              <span style="color: white; font-size: 32px; font-weight: bold;">${statusIcon}</span>
            </div>
            <h1 style="color: #1e293b; margin: 0; font-size: 28px; font-weight: 700;">Leave Request ${statusText}</h1>
            <p style="color: #64748b; margin: 10px 0 0; font-size: 16px;">Your leave request has been ${status}</p>
          </div>

          <!-- Greeting -->
          <div style="margin-bottom: 30px;">
            <p style="color: #334155; font-size: 18px; margin: 0;">Hello <strong>${requesterName}</strong>,</p>
            <p style="color: #64748b; font-size: 16px; margin: 10px 0 0; line-height: 1.6;">Your leave request has been reviewed and ${status} by ${reviewerName}. Here are the details:</p>
          </div>

          <!-- Status -->
          <div style="background: ${statusBg}; border-radius: 15px; padding: 25px; margin-bottom: 25px; border-left: 4px solid ${statusColor};">
            <h3 style="color: ${statusColor === "#10b981" ? "#065f46" : "#dc2626"}; margin: 0 0 15px; font-size: 18px; font-weight: 600;">${statusIcon} Request ${statusText}</h3>
            <div style="display: grid; gap: 10px;">
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid ${statusColor}33;">
                <span style="color: ${statusColor === "#10b981" ? "#047857" : "#b91c1c"}; font-weight: 500;">Status:</span>
                <span style="color: ${statusColor === "#10b981" ? "#065f46" : "#dc2626"}; font-weight: 600; text-transform: uppercase;">${statusText}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid ${statusColor}33;">
                <span style="color: ${statusColor === "#10b981" ? "#047857" : "#b91c1c"}; font-weight: 500;">Reviewed By:</span>
                <span style="color: ${statusColor === "#10b981" ? "#065f46" : "#dc2626"}; font-weight: 600;">${reviewerName}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                <span style="color: ${statusColor === "#10b981" ? "#047857" : "#b91c1c"}; font-weight: 500;">Reviewed On:</span>
                <span style="color: ${statusColor === "#10b981" ? "#065f46" : "#dc2626"}; font-weight: 600;">${new Date(reviewedDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
              </div>
            </div>
          </div>

          <!-- Leave Details -->
          <div style="background: linear-gradient(135deg, #f8fafc, #e2e8f0); border-radius: 15px; padding: 25px; margin-bottom: 25px; border-left: 4px solid #0ea5e9;">
            <h3 style="color: #1e293b; margin: 0 0 15px; font-size: 18px; font-weight: 600;">📅 Leave Request Details</h3>
            <div style="display: grid; gap: 10px;">
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(148, 163, 184, 0.2);">
                <span style="color: #64748b; font-weight: 500;">Leave Type:</span>
                <span style="color: #1e293b; font-weight: 600;">${leaveTypeLabels[leaveType] || leaveType}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(148, 163, 184, 0.2);">
                <span style="color: #64748b; font-weight: 500;">Duration:</span>
                <span style="color: #1e293b; font-weight: 600;">${new Date(startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${new Date(endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                <span style="color: #64748b; font-weight: 500;">Total Days:</span>
                <span style="color: #1e293b; font-weight: 600;">${totalDays} working days</span>
              </div>
            </div>
          </div>

          ${
            reviewComments
              ? `
          <!-- Review Comments -->
          <div style="background: linear-gradient(135deg, #f3f4f6, #e5e7eb); border-radius: 15px; padding: 25px; margin-bottom: 25px; border-left: 4px solid #6b7280;">
            <h3 style="color: #374151; margin: 0 0 15px; font-size: 18px; font-weight: 600;">💬 Review Comments</h3>
            <p style="color: #4b5563; margin: 0; font-size: 15px; line-height: 1.6; background: rgba(255, 255, 255, 0.7); padding: 15px; border-radius: 8px;">${reviewComments}</p>
          </div>
          `
              : ""
          }

          <!-- Next Steps -->
          <div style="background: linear-gradient(135deg, #dbeafe, #bfdbfe); border-radius: 15px; padding: 20px; margin-bottom: 25px; border-left: 4px solid #3b82f6;">
            <h3 style="color: #1d4ed8; margin: 0 0 10px; font-size: 16px; font-weight: 600;">📋 Next Steps</h3>
            <p style="color: #1e40af; margin: 0; font-size: 14px; line-height: 1.5;">
              ${
                isApproved
                  ? "Your leave has been approved. Please ensure proper handover of responsibilities before your leave period begins."
                  : "Your leave request has been rejected. If you have questions about this decision, please contact your supervisor or HR department."
              }
            </p>
          </div>

          <!-- Login Button -->
          <div style="text-align: center; margin-bottom: 25px;">
            <a href="https://faceattendv1.netlify.app/login" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); transition: all 0.3s ease;">
              🚀 View Dashboard
            </a>
            <p style="color: #94a3b8; font-size: 13px; margin: 10px 0 0;">Click the button above to access your dashboard</p>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 14px; margin: 0;">Request ID: ${leaveRequestId}</p>
            <p style="color: #94a3b8; font-size: 12px; margin: 5px 0 0;">This is an automated message from Face Attendence</p>
          </div>
        </div>
      </div>
    </body>
    </html>
    `

    const mailOptions = {
      from: 'liveattendance@noreply.com>',
      to,
      subject: `Leave Request ${statusText} - ${leaveTypeLabels[leaveType] || leaveType}`,
      html: htmlContent,
    }

    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error("Failed to send leave status notification email:", error)
    return false
  }
}
