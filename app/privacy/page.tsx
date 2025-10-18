import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, Eye, Database, UserCheck, FileText } from "lucide-react"

export default function PrivacyPolicyPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <header className="space-y-2">
        <h1 className="text-balance text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-teal-600" />
            Introduction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            Welcome to FaceAttend Attendance System. We are committed to protecting your personal information and your
            right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information
            when you use our attendance management system.
          </p>
          <p>
            By using our service, you agree to the collection and use of information in accordance with this policy. If
            you do not agree with our policies and practices, please do not use our service.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-600" />
            Information We Collect
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700 leading-relaxed">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
            <p>We collect the following types of personal information:</p>
            <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
              <li>Name, email address, and phone number</li>
              <li>Employee code or roll number</li>
              <li>Department and role information</li>
              <li>Institution or organization name</li>
              <li>Joining date and employment details</li>
              <li>Profile photographs</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Biometric Data</h3>
            <p>
              Our system uses facial recognition technology for attendance tracking. We collect and store facial
              templates (mathematical representations of facial features) for authentication purposes. These templates
              are encrypted and stored securely.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Attendance Records</h3>
            <p>We automatically collect and store:</p>
            <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
              <li>Check-in and check-out timestamps</li>
              <li>Attendance status (present, absent, late, on leave)</li>
              <li>Location data (if location tracking is enabled)</li>
              <li>Leave requests and approval records</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Usage Data</h3>
            <p>
              We may collect information about how you access and use our service, including your IP address, browser
              type, pages visited, and time spent on pages.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-purple-600" />
            How We Use Your Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700 leading-relaxed">
          <p>We use the collected information for the following purposes:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong>Attendance Tracking:</strong> To record and manage employee/student attendance using facial
              recognition technology
            </li>
            <li>
              <strong>Identity Verification:</strong> To authenticate users and prevent unauthorized access
            </li>
            <li>
              <strong>Leave Management:</strong> To process and track leave requests and approvals
            </li>
            <li>
              <strong>Reporting and Analytics:</strong> To generate attendance reports and insights for administrators
            </li>
            <li>
              <strong>System Administration:</strong> To maintain and improve our service, troubleshoot issues, and
              provide customer support
            </li>
            <li>
              <strong>Communication:</strong> To send notifications, updates, and important information about your
              account
            </li>
            <li>
              <strong>Compliance:</strong> To comply with legal obligations and institutional policies
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-red-600" />
            Data Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            We implement appropriate technical and organizational security measures to protect your personal information
            against unauthorized access, alteration, disclosure, or destruction. These measures include:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Encryption of sensitive data in transit and at rest</li>
            <li>Secure storage of biometric templates using industry-standard encryption</li>
            <li>Role-based access controls to limit data access to authorized personnel only</li>
            <li>Regular security audits and vulnerability assessments</li>
            <li>Secure authentication mechanisms including password protection</li>
          </ul>
          <p className="mt-4">
            However, no method of transmission over the internet or electronic storage is 100% secure. While we strive
            to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute
            security.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-green-600" />
            Your Rights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700 leading-relaxed">
          <p>You have the following rights regarding your personal information:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong>Access:</strong> You can request access to your personal data and attendance records
            </li>
            <li>
              <strong>Correction:</strong> You can request correction of inaccurate or incomplete information
            </li>
            <li>
              <strong>Deletion:</strong> You can request deletion of your personal data, subject to legal and
              contractual obligations
            </li>
            <li>
              <strong>Objection:</strong> You can object to the processing of your personal data in certain
              circumstances
            </li>
            <li>
              <strong>Data Portability:</strong> You can request a copy of your data in a structured, machine-readable
              format
            </li>
          </ul>
          <p className="mt-4">
            To exercise these rights, please contact your system administrator or reach out to us through the contact
            support page.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-orange-600" />
            Data Retention
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            We retain your personal information for as long as necessary to fulfill the purposes outlined in this
            Privacy Policy, unless a longer retention period is required or permitted by law. Attendance records are
            typically retained for the duration of your employment/enrollment and for a period thereafter as required by
            institutional policies or legal requirements.
          </p>
          <p>
            When your data is no longer needed, we will securely delete or anonymize it in accordance with our data
            retention policies.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Third-Party Services</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            Our service may use third-party services for hosting, analytics, and other functionalities. These
            third-party service providers have access to your personal information only to perform specific tasks on our
            behalf and are obligated not to disclose or use it for any other purpose.
          </p>
          <p>We do not sell, trade, or rent your personal information to third parties.</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Changes to This Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
            Privacy Policy on this page and updating the "Last updated" date at the top of this policy.
          </p>
          <p>
            You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy
            are effective when they are posted on this page.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg bg-gradient-to-br from-teal-50 to-blue-50 border-teal-200">
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700 leading-relaxed">
          <p>If you have any questions about this Privacy Policy, please contact us:</p>
          <div className="space-y-2 mt-4">
            <p className="font-semibold">Email: venkythota469@gmail.com</p>
            <p>
              Or visit our{" "}
              <a href="/contact" className="text-teal-600 hover:text-teal-700 underline font-medium">
                Contact Support
              </a>{" "}
              page
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
