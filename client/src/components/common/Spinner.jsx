const Spinner = ({ size = 'md' }) => {
  const s = { sm: 'w-5 h-5 border-2', md: 'w-8 h-8 border-3', lg: 'w-12 h-12 border-4' }[size]
  return (
    <div className="flex items-center justify-center">
      <div className={`${s} border-cream-dark border-t-saffron rounded-full animate-spin`} />
    </div>
  )
}
export default Spinner
