import { Link } from 'react-router-dom'
import StarRating from '../common/StarRating'
import CategoryBadge from '../common/CategoryBadge'

export default function EntrepreneurCard({ entrepreneur }) {
  const { _id, businessName, category, location, description, profileImage, rating, totalReviews, availability, user } = entrepreneur
  const img = profileImage || null

  return (
    <Link to={`/explore/${_id}`} className="card flex flex-col group hover:shadow-card hover:-translate-y-1 transition-all duration-300">
      <div className="relative h-44 overflow-hidden bg-cream-dark">
        {img ? (
          <img src={img} alt={businessName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-cream-dark to-cream">
            <div className="w-16 h-16 rounded-full bg-saffron/20 flex items-center justify-center text-3xl font-bold text-saffron mb-1">
              {businessName?.[0]?.toUpperCase()}
            </div>
            <span className="text-xs text-gray-400">{category}</span>
          </div>
        )}
        <div className="absolute top-2.5 left-2.5">
          <CategoryBadge category={category} />
        </div>
        <div className={`absolute top-3 right-3 w-2.5 h-2.5 rounded-full ${availability ? 'bg-green-400' : 'bg-gray-400'} shadow-sm ring-2 ring-white`} />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-charcoal text-[15px] leading-snug group-hover:text-saffron transition-colors line-clamp-1">{businessName}</h3>
        <p className="text-xs text-gray-400 mt-0.5 mb-2">{user?.name} &middot; {location?.city}</p>
        <p className="text-xs text-gray-500 line-clamp-2 flex-1 leading-relaxed">{description || 'Skilled local artisan offering quality services.'}</p>
        <div className="mt-3 flex items-center justify-between">
          <StarRating rating={rating} />
          <span className="text-xs text-gray-400">{totalReviews} reviews</span>
        </div>
      </div>
    </Link>
  )
}