import Link from "next/link"
import { HomeIcon, LockIcon } from "lucide-react"

interface UnauthorizedPageProps {
  customMessage?: string
  contactEmail?: string
}

export default function UnauthorizedPage({
  customMessage,
  contactEmail = "tech.kushalgoyal@gmail.com",
}: UnauthorizedPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-100 to-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 text-center">
        <div>
          <div className="flex justify-center">
            <LockIcon className="h-24 w-24 text-red-600" />
          </div>
          <h1 className="mt-6 text-4xl font-extrabold text-gray-900 sm:text-5xl">Access Denied</h1>
          <p className="mt-2 text-xl text-gray-600">Oops! You don't have permission to view this page.</p>
          {customMessage && <p className="mt-4 text-sm text-gray-500 italic">{customMessage}</p>}
        </div>
        <div className="mt-8 space-y-4">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            Back to Homepage
          </Link>
        </div>
        <div className="mt-6">
          <p className="text-base text-gray-500">
            Think this is a mistake? Contact us at{" "}
            <a href={`mailto:${contactEmail}`} className="font-medium text-red-600 hover:text-red-500">
              {contactEmail}
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

