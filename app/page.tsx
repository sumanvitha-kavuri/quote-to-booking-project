export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      
      {/* NAVBAR */}
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <h1 className="text-lg font-semibold">Quote to Booking</h1>

        <div className="flex gap-4">
          <a href="/login" className="text-gray-600 hover:text-black">
            Login
          </a>
          <a
            href="/signup"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Get Started
          </a>
        </div>
      </div>

      {/* HERO SECTION */}
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="max-w-2xl text-center">
          
          {/* Badge (small premium touch) */}
          <div className="inline-block mb-4 px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-full">
            Workflow Automation for Service Businesses
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Turn Quotes into <span className="text-blue-600">Booked Jobs</span>
          </h1>

          {/* Subtext */}
          <p className="text-gray-600 text-lg mb-8">
            Send quotes, track responses, collect deposits, and stop chasing customers.
          </p>

          {/* CTA Buttons */}
          <div className="flex justify-center gap-4">
            <a
              href="/signup"
              className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg hover:bg-blue-700"
            >
              Get Started
            </a>

            <a
              href="/login"
              className="border px-6 py-3 rounded-md text-lg hover:bg-gray-100"
            >
              Login
            </a>
          </div>

          {/* Trust line */}
          <p className="text-sm text-gray-400 mt-6">
            No setup required • Works on mobile & desktop
          </p>
        </div>
      </div>

      {/* SIMPLE FEATURE STRIP */}
      <div className="border-t py-8 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          
          <div>
            <p className="font-semibold">Send Quotes</p>
            <p className="text-sm text-gray-500">Create and share in seconds</p>
          </div>

          <div>
            <p className="font-semibold">Track Responses</p>
            <p className="text-sm text-gray-500">Know who opened and replied</p>
          </div>

          <div>
            <p className="font-semibold">Collect Deposits</p>
            <p className="text-sm text-gray-500">Secure bookings instantly</p>
          </div>

        </div>
      </div>

    </div>
  )
}