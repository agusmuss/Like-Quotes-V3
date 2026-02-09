export default function Card({ children }) {
  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 sm:p-8">
      {children}
    </div>
  );
}
