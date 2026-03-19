export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-100 flex flex-col">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-6 py-4 border-b bg-white/70 backdrop-blur-md">
        <h1 className="text-lg font-bold tracking-tight">
          <span className="text-gray-900">Quote</span>{" "}
          <span className="text-blue-600">to Booking</span>
        </h1>

        <div className="flex items-center gap-4">
          <a href="/login" className="text-gray-600 hover:text-black transition">
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

      {/* 🔥 TOP SCROLL STRIP */}
      <div className="overflow-hidden whitespace-nowrap border-b bg-gradient-to-r from-white via-slate-50 to-white">
        <div className="animate-marquee text-sm text-gray-600 py-2">
          <span className="mx-6">🚀 Send Quotes Faster</span>
          <span className="mx-6">📩 Track Responses</span>
          <span className="mx-6">💳 Collect Deposits</span>
          <span className="mx-6">⏱️ Auto Follow-ups</span>
          <span className="mx-6">📊 Real-time Status</span>
        </div>
      </div>

      {/* HERO */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">

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
            className="bg-white border border-gray-300 px-6 py-3 rounded-lg text-lg hover:bg-gray-100 transition"
          >
            Login
          </a>
        </div>

        <p className="text-sm text-gray-400 mt-6">
          No setup required • Works on mobile & desktop
        </p>
      </div>

      {/* 🔥 REALISTIC DASHBOARD PREVIEW */}
      <div className="mt-10 flex justify-center px-6">

        <div className="bg-white border rounded-2xl shadow-2xl p-6 max-w-5xl w-full">

          {/* STATS */}
          <div className="grid grid-cols-4 gap-4 mb-6">

            <div className="p-4 bg-blue-50 rounded-xl">
              <p className="text-xs text-blue-600">Total Quotes</p>
              <p className="text-2xl font-bold text-blue-700">18</p>
            </div>

            <div className="p-4 bg-yellow-50 rounded-xl">
              <p className="text-xs text-yellow-600">Awaiting</p>
              <p className="text-2xl font-bold text-yellow-700">6</p>
            </div>

            <div className="p-4 bg-green-50 rounded-xl">
              <p className="text-xs text-green-600">Paid</p>
              <p className="text-2xl font-bold text-green-700">4</p>
            </div>

            <div className="p-4 bg-purple-50 rounded-xl">
              <p className="text-xs text-purple-600">Revenue</p>
              <p className="text-2xl font-bold text-purple-700">₹32K</p>
            </div>

          </div>

          {/* ATTENTION BOX */}
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl">
            <p className="text-sm font-semibold text-red-600 mb-2">
              ⚠ Needs Attention
            </p>
            <ul className="text-sm text-red-500 space-y-1">
              <li>• 2 quotes expiring today</li>
              <li>• 1 approved but not paid</li>
              <li>• 3 customers not responded</li>
            </ul>
          </div>

          {/* TABLE */}
          <div className="space-y-3 text-sm">

            <div className="flex justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
              <span>Rahul</span>
              <span>₹5000</span>
              <span className="text-yellow-600 font-medium">Awaiting</span>
            </div>

            <div className="flex justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
              <span>Ankit</span>
              <span>₹8000</span>
              <span className="text-blue-600 font-medium">Approved</span>
            </div>

            <div className="flex justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
              <span>Sneha</span>
              <span>₹3000</span>
              <span className="text-green-600 font-medium">Paid</span>
            </div>

          </div>

        </div>

      </div>

      {/* FEATURES */}
      <div className="py-10 px-6 bg-slate-50 border-t mt-16">
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