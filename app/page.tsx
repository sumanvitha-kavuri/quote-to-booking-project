export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50 flex flex-col">

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

      {/* HERO */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">

        {/* Badge */}
        <div className="mb-4 px-4 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-full">
          Workflow Automation for Service Businesses
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-gray-900">
          Turn Quotes into{" "}
          <span className="text-blue-600">Booked Jobs</span>
        </h1>

        {/* Subtext */}
        <p className="text-gray-600 text-lg mb-8 max-w-xl">
          Send quotes, track responses, collect deposits, and stop chasing customers.
        </p>

        {/* CTA */}
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

        {/* Trust */}
        <p className="text-sm text-gray-400 mt-6">
          No setup required • Works on mobile & desktop
        </p>
      </div>

      {/* DASHBOARD PREVIEW */}
      <div className="mt-10 flex justify-center px-6">

        <div className="bg-white border rounded-2xl shadow-xl p-6 max-w-5xl w-full">

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">

            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-xs text-gray-500">Total Quotes</p>
              <p className="text-2xl font-bold">18</p>
            </div>

            <div className="p-4 bg-yellow-50 rounded-xl">
              <p className="text-xs text-yellow-600">Awaiting</p>
              <p className="text-2xl font-bold text-yellow-700">6</p>
            </div>

            <div className="p-4 bg-green-50 rounded-xl">
              <p className="text-xs text-green-600">Paid</p>
              <p className="text-2xl font-bold text-green-700">4</p>
            </div>

          </div>

          {/* Table */}
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

      {/* SCROLLING STRIP (MOVEMENT 🔥) */}
      <div className="mt-16 overflow-hidden whitespace-nowrap border-t py-4 bg-white">
        <div className="animate-marquee inline-block text-sm text-gray-500">
          🚀 Send Quotes &nbsp;&nbsp; • &nbsp;&nbsp; 📩 Track Responses &nbsp;&nbsp; • &nbsp;&nbsp; 💳 Collect Deposits &nbsp;&nbsp; • &nbsp;&nbsp; 📊 Real-time Status &nbsp;&nbsp; • &nbsp;&nbsp;
        </div>
      </div>

      {/* FEATURES */}
      <div className="py-10 px-6 bg-slate-50 border-t">
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