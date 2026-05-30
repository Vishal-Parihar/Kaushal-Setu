import { Link } from 'react-router-dom'
import StarRating from '../common/StarRating'

export default function ProductCard({ product, onOrder }) {
  const { 
    _id, 
    name, 
    price, 
    images, 
    description, 
    rating, 
    entrepreneur, 
    stock, 
    isAvailable 
  } = product

  const img = images?.[0] || null
  const available = isAvailable && stock > 0

  return (
    <div className="card flex flex-col group hover:shadow-card hover:-translate-y-1 transition-all duration-300">
      <Link to={`/marketplace/${_id}`} className="relative h-44 overflow-hidden bg-cream-dark block">
        {img ? (
          <img 
            src={img} 
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-cream-dark text-gray-300">
            <span className="text-5xl">🛍️</span>
            <span className="text-xs mt-2 text-gray-400">No image</span>
          </div>
        )}

        {!available && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-xs font-semibold px-3 py-1 rounded-full text-gray-700">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <Link 
          to={`/marketplace/${_id}`} 
          className="font-semibold text-charcoal text-sm leading-snug group-hover:text-saffron transition-colors line-clamp-1"
        >
          {name}
        </Link>

        <p className="text-xs text-gray-400 mt-0.5 mb-1.5">
          by {entrepreneur?.user?.name || 'Artisan'}
        </p>

        <p className="text-xs text-gray-500 line-clamp-2 flex-1 leading-relaxed">
          {description}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-saffron font-bold text-base">₹{price}</span>
          <StarRating rating={rating} />
        </div>

        {onOrder && (
          <button 
            onClick={() => onOrder(product)} 
            disabled={!available}
            className="mt-3 btn-primary w-full text-sm py-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {available ? 'Order Now' : 'Unavailable'}
          </button>
        )}
      </div>
    </div>
  )
}