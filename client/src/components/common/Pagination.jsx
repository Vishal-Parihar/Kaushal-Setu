const Pagination = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null
  const pages = []
  const start = Math.max(1, page - 2)
  const end = Math.min(totalPages, page + 2)
  for (let i = start; i <= end; i++) pages.push(i)

  const btn = 'w-9 h-9 rounded-lg text-sm font-medium transition-colors border'
  const active = 'bg-saffron text-white border-saffron'
  const inactive = 'bg-white border-gray-200 text-gray-600 hover:border-saffron hover:text-saffron'
  const arrow = `${btn} ${inactive} disabled:opacity-40 disabled:cursor-not-allowed`

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      <button onClick={() => onChange(page - 1)} disabled={page === 1} className={arrow}>‹</button>
      {start > 1 && <><button onClick={() => onChange(1)} className={`${btn} ${inactive}`}>1</button>{start > 2 && <span className="text-gray-400 px-1 text-sm">…</span>}</>}
      {pages.map(p => <button key={p} onClick={() => onChange(p)} className={`${btn} ${p === page ? active : inactive}`}>{p}</button>)}
      {end < totalPages && <>{end < totalPages - 1 && <span className="text-gray-400 px-1 text-sm">…</span>}<button onClick={() => onChange(totalPages)} className={`${btn} ${inactive}`}>{totalPages}</button></>}
      <button onClick={() => onChange(page + 1)} disabled={page === totalPages} className={arrow}>›</button>
    </div>
  )
}
export default Pagination
