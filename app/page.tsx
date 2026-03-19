export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-6 py-4 border-b bg-white">
        <h1 className="text-lg font-semibold text-gray-900">
          Quote to Booking
        </h1>

        <div className="flex items-center gap-4">
          <a
            href="/login"
            className="text-gray-600 hover:text-black transition"
          >
            Login
          </a>

          <a
            href="/signup"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition"
          >
            Get Started
          </a>
        </div>
      </div>

      {/* HERO SECTION */}
      <div className="flex flex-1 items-center justify-center px-6 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-3xl text-center">

          {/* Badge */}
          <div className="inline-block mb-4 px-4 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-full">
            Workflow Automation for Service Businesses
          </div>

          {/* Heading */}
          <h1 className="text-5xl font-bold mb-6 leading-tight text-gray-900">
            Turn Quotes into{" "}
            <span className="text-blue-600">Booked Jobs</span>
          </h1>

          {/* Subtext */}
          <p className="text-gray-600 text-lg mb-8">
            Send quotes, track responses, collect deposits, and stop chasing customers.
          </p>

          {/* CTA */}
          <div className="flex justify-center gap-4">
            <a
              href="/signup"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg shadow-md hover:bg-blue-700 transition"
            >
              Get Started
            </a>

            <a
              href="/login"
              className="bg-white border border-gray-300 px-6 py-3 rounded-lg text-lg hover:bg-gray-100 transition"
            >
              Login
            </a>
          </div>

          {/* Trust */}
          <p className="text-sm text-gray-400 mt-6">
            No setup required • Works on mobile & desktop
          </p>
        </div>
      </div>

      {/* PRODUCT PREVIEW (FAKE DASHBOARD) */}
      <div className="mt-16 flex justify-center px-6">
        <div className="bg-white border rounded-xl shadow-lg p-6 max-w-4xl w-full">

          <p className="text-sm text-gray-500 mb-4">Dashboard Preview</p>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-xs text-gray-500">Total Quotes</p>
              <p className="text-xl font-bold">18</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-xs text-gray-500">Awaiting</p>
              <p className="text-xl font-bold">6</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-xs text-gray-500">Paid</p>
              <p className="text-xl font-bold">4</p>
            </div>
          </div>

          <div className="text-sm text-gray-600 space-y-2">
            <p>Rahul — ₹5000 — Awaiting Response</p>
            <p>Ankit — ₹8000 — Approved (Pending Payment)</p>
            <p>Sneha — ₹3000 — Paid</p>
          </div>

        </div>
      </div>

      {/* FEATURES */}
      <div className="border-t mt-16 py-10 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">

          <div className="p-4">
            <p className="font-semibold text-gray-900">Send Quotes</p>
            <p className="text-sm text-gray-500">Create and share instantly</p>
          </div>

          <div className="p-4">
            <p className="font-semibold text-gray-900">Track Responses</p>
            <p className="text-sm text-gray-500">Know who opened and replied</p>
          </div>

          <div className="p-4">
            <p className="font-semibold text-gray-900">Collect Deposits</p>
            <p className="text-sm text-gray-500">Secure bookings faster</p>
          </div>

        </div>
      </div>

    </div>
  )
}