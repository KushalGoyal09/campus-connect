import Link from "next/link"
import { HomeIcon, SearchIcon, BookOpenIcon } from "lucide-react"

interface NotFoundPageProps {
  title?: string
  message?: string
  customMessage?: string
}

export default function NotFoundPage({
  title = "Page Not Found",
  message = "Oops! The page you're looking for has gone missing in the campus shuffle.",
  customMessage,
}: NotFoundPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 text-center">
        <div>
          <div className="flex justify-center">
            <BookOpenIcon className="h-24 w-24 text-purple-600" />
          </div>
          <h1 className="mt-6 text-4xl font-extrabold text-gray-900 sm:text-5xl">{title}</h1>
          <p className="mt-2 text-xl text-gray-600">{message}</p>
          {customMessage && <p className="mt-4 text-sm text-gray-500 italic">{customMessage}</p>}
        </div>
        <div className="mt-8 space-y-4">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            Back to Homepage
          </Link>
        </div>
        
      </div>
    </div>
  )
}

