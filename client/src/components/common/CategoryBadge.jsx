const MAP = {
  cobbler: { color: 'bg-amber-100 text-amber-800', label: '🥿 Cobbler' },
  potter:  { color: 'bg-orange-100 text-orange-800', label: '🏺 Potter' },
  tailor:  { color: 'bg-blue-100 text-blue-800', label: '🧵 Tailor' },
  artisan: { color: 'bg-purple-100 text-purple-800', label: '🎨 Artisan' },
  vendor:  { color: 'bg-green-100 text-green-800', label: '🛒 Vendor' },
  other:   { color: 'bg-gray-100 text-gray-700', label: '⚙️ Other' },
}
const CategoryBadge = ({ category, className = '' }) => {
  const { color, label } = MAP[category] || MAP.other
  return <span className={`badge ${color} ${className}`}>{label}</span>
}
export default CategoryBadge
