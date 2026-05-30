const StarRating = ({ rating = 0, max = 5, size = 'sm' }) => {
  const text = { sm: 'text-sm', md: 'text-base', lg: 'text-xl' }[size]
  return (
    <div className={`flex items-center gap-0.5 ${text}`}>
      {[...Array(max)].map((_, i) => (
        <span key={i} className={i < Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}>★</span>
      ))}
      <span className="ml-1 text-xs text-gray-400 font-medium">{Number(rating).toFixed(1)}</span>
    </div>
  )
}
export default StarRating
