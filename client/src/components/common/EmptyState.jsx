const EmptyState = ({ icon = '📭', title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center px-4">
    <div className="text-5xl mb-4 opacity-80">{icon}</div>
    {title && <h3 className="text-lg font-semibold text-gray-700 mb-1">{title}</h3>}
    {description && <p className="text-gray-400 text-sm max-w-xs leading-relaxed">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
)
export default EmptyState
