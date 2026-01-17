export default function PDFContent() {
  return (
    <div className="h-full flex-1 overflow-auto rounded-b-xl">
      <div className="flex h-full flex-1 items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] p-8">
        <div className="flex h-full w-full flex-col items-center justify-center rounded-lg bg-white p-8 text-center text-slate-900 shadow-2xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-book-open mb-4 text-slate-200"
            aria-hidden="true"
          >
            <path d="M12 7v14"></path>
            <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>
          </svg>
          <h4 className="mb-2 text-lg font-bold tracking-tighter text-slate-400 uppercase">
            PDF Viewer Plugin
          </h4>
          <p className="text-sm text-slate-400">
            Pratinjau visual manual akan muncul di sini secara otomatis saat
            Anda mengklik referensi halaman.
          </p>
        </div>
      </div>
    </div>
  );
}
