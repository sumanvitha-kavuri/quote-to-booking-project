export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-6 py-4 border-b bg-white/80 backdrop-blur-md">
        <h1 className="text-lg font-bold tracking-tight">
          <span className="text-gray-900">Quote</span>{" "}
          <span className="text-blue-600">to Booking</span>
        </h1>

        <div className="flex items-center gap-4">
          <a
            href="/login"
            className="px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 font-medium hover:bg-blue-100 transition"
          >
            Login
          </a>

          <a
            href="/signup"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Get Started
          </a>
        </div>
      </div>

      {/* SCROLL STRIP */}
      <div className="overflow-hidden border-b bg-white py-3">
        <div className="animate-marquee flex gap-10 text-base font-medium text-gray-700">

          <span>🚀 Send Quotes Faster</span>
          <span>📩 Track Responses Easily</span>
          <span>💳 Collect Deposits Securely</span>
          <span>⏱️ Automated Follow-ups</span>
          <span>📊 Real-time Business Status</span>

          <span>🚀 Send Quotes Faster</span>
          <span>📩 Track Responses Easily</span>
          <span>💳 Collect Deposits Securely</span>
          <span>⏱️ Automated Follow-ups</span>
          <span>📊 Real-time Business Status</span>

        </div>
      </div>

      {/* HERO */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 text-center bg-gradient-to-b from-blue-50 via-white to-indigo-100 overflow-hidden">

  {/* 🔥 Soft Glow Behind Text */}
  <div className="absolute top-20 w-[500px] h-[500px] bg-blue-300 opacity-20 blur-3xl rounded-full"></div>
        <div className="mb-4 px-4 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-full">
          Workflow Automation for Service Businesses
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-gray-900">
          Turn Quotes into{" "}
          <span className="text-blue-600">Booked Jobs</span>
        </h1>

        <p className="text-gray-600 text-lg mb-8 max-w-xl">
          Send quotes, track responses, collect deposits, and stop chasing customers.
        </p>

        <div className="flex gap-4">
          <a
            href="/signup"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg shadow-md hover:bg-blue-700 transition"
          >
            Get Started
          </a>

          <a
            href="/login"
            className="px-6 py-3 rounded-lg text-lg font-medium text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition shadow-sm"
          >
            Login
          </a>
        </div>

        <p className="text-sm text-gray-400 mt-6">
          No setup required • Works on mobile & desktop
        </p>
      </div>

      {/* 🔥 DASHBOARD SECTION WITH REAL BACKGROUND */}
<div className="relative flex flex-1 flex-col items-center justify-center px-6 text-center bg-gradient-to-b from-blue-50 via-white to-indigo-100 overflow-hidden">

  {/* 🔥 Soft Glow Behind Text */}
  <div className="absolute top-20 w-[500px] h-[500px] bg-blue-300 opacity-20 blur-3xl rounded-full"></div>
        <div className="absolute top-0 w-[600px] h-[600px] bg-blue-200 opacity-30 blur-3xl rounded-full"></div>

        <div className="bg-white border rounded-2xl shadow-2xl p-6 max-w-5xl w-full relative z-10">

          {/* STATS */}
          <div className="grid grid-cols-4 gap-4 mb-6">

            <div className="p-4 bg-blue-100 rounded-xl">
              <p className="text-sm text-blue-700 font-medium">Total Quotes</p>
              <p className="text-2xl font-bold text-blue-800">18</p>
            </div>

            <div className="p-4 bg-yellow-100 rounded-xl">
              <p className="text-sm text-yellow-700 font-medium">Awaiting</p>
              <p className="text-2xl font-bold text-yellow-800">6</p>
            </div>

            <div className="p-4 bg-green-100 rounded-xl">
              <p className="text-sm text-green-700 font-medium">Paid</p>
              <p className="text-2xl font-bold text-green-800">4</p>
            </div>

            <div className="p-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl text-white shadow-lg">
              <p className="text-sm">Revenue</p>
              <p className="text-2xl font-bold">₹32,000</p>
            </div>

          </div>

          {/* ATTENTION */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <p className="text-sm font-semibold text-blue-700 mb-2">
              Needs Attention
            </p>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• 2 quotes expiring today</li>
              <li>• 1 approved but pending payment</li>
              <li>• 3 customers awaiting response</li>
            </ul>
          </div>

          {/* TABLE */}
          <div className="space-y-3 text-base">

            <div className="flex justify-between p-3 bg-white border rounded-lg shadow-sm">
              <span className="font-medium text-gray-900">Rahul</span>
              <span className="font-semibold text-gray-900">₹5,000</span>
              <span className="text-yellow-600 font-semibold">Awaiting</span>
            </div>

            <div className="flex justify-between p-3 bg-white border rounded-lg shadow-sm">
              <span className="font-medium text-gray-900">Ankit</span>
              <span className="font-semibold text-gray-900">₹8,000</span>
              <span className="text-blue-600 font-semibold">Approved</span>
            </div>

            <div className="flex justify-between p-3 bg-white border rounded-lg shadow-sm">
              <span className="font-medium text-gray-900">Sneha</span>
              <span className="font-semibold text-gray-900">₹3,000</span>
              <span className="text-green-600 font-semibold">Paid</span>
            </div>

          </div>

        </div>
      </div>

      {/* FEATURES */}
      <div className="py-10 px-6 bg-white border-t">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">

          <div>
            <p className="font-semibold text-gray-900">Send Quotes</p>
            <p className="text-sm text-gray-500">Create and share instantly</p>
          </div>

          <div>
            <p className="font-semibold text-gray-900">Track Responses</p>
            <p className="text-sm text-gray-500">Know who opened and replied</p>
          </div>

          <div>
            <p className="font-semibold text-gray-900">Collect Deposits</p>
            <p className="text-sm text-gray-500">Secure bookings faster</p>
          </div>

        </div>
      </div>

    </div>
  )
}