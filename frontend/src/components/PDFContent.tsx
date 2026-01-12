export default function PDFContent() {
  return (
    <div className="flex-1 overflow-auto h-full rounded-b-xl">
      <div className="flex-1 flex items-center h-full justify-center p-8 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
        <div className="bg-white rounded-lg w-full h-full shadow-2xl flex flex-col items-center justify-center text-slate-900 p-8 text-center">
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
            className="lucide lucide-book-open text-slate-200 mb-4"
            aria-hidden="true"
          >
            <path d="M12 7v14"></path>
            <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>
          </svg>
          <h4 className="font-bold text-lg mb-2 text-slate-400 uppercase tracking-tighter">
            PDF Viewer Plugin
          </h4>
          <p className="text-slate-400 text-sm">
            Pratinjau visual manual akan muncul di sini secara otomatis saat
            Anda mengklik referensi halaman.
          </p>
        </div>
      </div>
    </div>
  );
}
