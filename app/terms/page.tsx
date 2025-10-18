import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, AlertCircle, CheckCircle, XCircle, Scale, UserX } from "lucide-react"

export default function TermsOfServicePage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <header className="space-y-2">
        <h1 className="text-balance text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
          Terms of Service
        </h1>
        <p className="text-sm text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-teal-600" />
            Agreement to Terms
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            Welcome to FaceAttend Attendance System. These Terms of Service ("Terms") govern your access to and use of
            our attendance management system, including any related services, features, content, and applications
            (collectively, the "Service").
          </p>
          <p>
            By accessing or using the Service, you agree to be bound by these Terms. If you do not agree to these Terms,
            you may not access or use the Service.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Acceptable Use
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700 leading-relaxed">
          <p>You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>To provide accurate, current, and complete information when creating your account</li>
            <li>To maintain the security of your account credentials and not share them with others</li>
            <li>To use the facial recognition feature only for legitimate attendance tracking purposes</li>
            <li>To comply with all applicable laws, regulations, and institutional policies</li>
            <li>Not to attempt to circumvent or manipulate the attendance tracking system</li>
            <li>Not to use the Service to harass, abuse, or harm another person or organization</li>
            <li>Not to interfere with or disrupt the Service or servers connected to the Service</li>
            <li>Not to attempt to gain unauthorized access to any portion of the Service</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserX className="h-5 w-5 text-blue-600" />
            User Accounts and Responsibilities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700 leading-relaxed">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Account Creation</h3>
            <p>
              Your account is typically created by your institution's administrator. You are responsible for maintaining
              the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Account Security</h3>
            <p>You must:</p>
            <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
              <li>Keep your password secure and confidential</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>Ensure that you log out from your account at the end of each session</li>
              <li>Not allow others to use your account for attendance marking</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Biometric Data Consent</h3>
            <p>
              By using the facial recognition feature, you explicitly consent to the collection, storage, and processing
              of your biometric data (facial templates) for attendance tracking purposes. You acknowledge that this data
              will be stored securely and used only for authentication and attendance management.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-600" />
            Prohibited Activities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700 leading-relaxed">
          <p>You are expressly prohibited from:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Using another person's account or allowing others to use your account</li>
            <li>Attempting to mark attendance on behalf of another person (proxy attendance)</li>
            <li>Using photos, videos, or any other means to deceive the facial recognition system</li>
            <li>Tampering with, reverse engineering, or attempting to extract source code from the Service</li>
            <li>Uploading or transmitting viruses, malware, or any other malicious code</li>
            <li>Collecting or harvesting personal information of other users</li>
            <li>Using automated systems or bots to access the Service</li>
            <li>Attempting to bypass any security features or access controls</li>
            <li>Misrepresenting your identity or affiliation with any person or organization</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-purple-600" />
            Intellectual Property Rights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            The Service and its original content, features, and functionality are owned by FaceAttend and are protected
            by international copyright, trademark, patent, trade secret, and other intellectual property laws.
          </p>
          <p>
            You may not copy, modify, distribute, sell, or lease any part of our Service or included software, nor may
            you reverse engineer or attempt to extract the source code of that software, unless laws prohibit these
            restrictions or you have our written permission.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Data Accuracy and Attendance Records</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            While we strive to ensure the accuracy of attendance records, the system relies on facial recognition
            technology which may occasionally produce errors. You are responsible for:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Reviewing your attendance records regularly</li>
            <li>Reporting any discrepancies to your supervisor or administrator promptly</li>
            <li>Following your institution's procedures for attendance corrections</li>
          </ul>
          <p className="mt-4">
            We are not liable for any consequences arising from inaccurate attendance records, including but not limited
            to salary deductions, disciplinary actions, or academic penalties, unless such inaccuracies are directly
            caused by system malfunctions that we failed to address in a timely manner.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Service Availability and Modifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            We reserve the right to modify, suspend, or discontinue the Service (or any part thereof) at any time, with
            or without notice. We will not be liable to you or any third party for any modification, suspension, or
            discontinuance of the Service.
          </p>
          <p>
            We do not guarantee that the Service will be available at all times or that it will be error-free. We may
            experience hardware, software, or other problems that could lead to interruptions, delays, or errors.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            Limitation of Liability
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            To the maximum extent permitted by applicable law, FaceAttend and its affiliates, officers, employees,
            agents, partners, and licensors shall not be liable for any indirect, incidental, special, consequential, or
            punitive damages, including but not limited to:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Loss of profits, data, use, goodwill, or other intangible losses</li>
            <li>Damages resulting from unauthorized access to or use of our servers</li>
            <li>Interruption or cessation of transmission to or from the Service</li>
            <li>Errors or omissions in any content or data</li>
            <li>Any conduct or content of any third party on the Service</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Termination</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            We may terminate or suspend your account and access to the Service immediately, without prior notice or
            liability, for any reason, including but not limited to:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Breach of these Terms</li>
            <li>Request by your institution's administrator</li>
            <li>Fraudulent, abusive, or illegal activity</li>
            <li>End of your employment or enrollment with the institution</li>
          </ul>
          <p className="mt-4">
            Upon termination, your right to use the Service will immediately cease. All provisions of these Terms which
            by their nature should survive termination shall survive, including ownership provisions, warranty
            disclaimers, and limitations of liability.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Governing Law and Dispute Resolution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            These Terms shall be governed by and construed in accordance with the laws of India, without regard to its
            conflict of law provisions.
          </p>
          <p>
            Any disputes arising out of or relating to these Terms or the Service shall first be attempted to be
            resolved through good faith negotiations. If negotiations fail, disputes shall be resolved through binding
            arbitration in accordance with the applicable arbitration rules.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Changes to Terms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            We reserve the right to modify or replace these Terms at any time at our sole discretion. If a revision is
            material, we will provide at least 30 days' notice prior to any new terms taking effect.
          </p>
          <p>
            By continuing to access or use our Service after those revisions become effective, you agree to be bound by
            the revised terms. If you do not agree to the new terms, you must stop using the Service.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg bg-gradient-to-br from-teal-50 to-blue-50 border-teal-200">
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700 leading-relaxed">
          <p>If you have any questions about these Terms of Service, please contact us:</p>
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
