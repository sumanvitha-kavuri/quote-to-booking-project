export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="bg-white p-10 rounded-2xl shadow text-center">

        <h1 className="text-3xl font-bold mb-6">
          Quote to Booking System
        </h1>

        <p className="text-gray-600 mb-6">
          Create and manage quotes, track customer actions, and accept payments.
        </p>

        <a
          href="/dashboard/quotes/new"
          className="bg-black text-white px-6 py-3 rounded-lg"
        >
          Create New Quote
        </a>

      </div>

    </main>
  )
}