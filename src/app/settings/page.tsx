import Link from "next/link";

export default function SettingsHub() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white p-6">
      <header className="flex items-center space-x-4 mb-8">
        <Link href="/" className="p-2 bg-gray-900 rounded-full text-gray-400 hover:text-white transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold">Settings</h1>
      </header>

      <main className="space-y-4">
        {/* Categories Section */}
        <Link href="/settings/categories" className="block bg-gray-900 p-5 rounded-2xl border border-gray-800 hover:bg-gray-800 transition">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div>
                <h2 className="font-bold text-gray-100">Categories & Budgets</h2>
                <p className="text-sm text-gray-500">Manage spending limits</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>

        {/* Vendors Section */}
        <Link href="/settings/vendors" className="block bg-gray-900 p-5 rounded-2xl border border-gray-800 hover:bg-gray-800 transition">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h2 className="font-bold text-gray-100">Vendors</h2>
                <p className="text-sm text-gray-500">Fix names & default mappings</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>

        {/* Account Info placeholder */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="text-center text-sm text-gray-500">
            <p>PayGuardian v1.0.0</p>
            <p className="mt-1">Offline-first local mode active.</p>
          </div>
        </div>

      </main>
    </div>
  );
}
