import { useEffect } from 'react'

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className={`relative bg-white rounded-xl2 shadow-lift w-full ${maxWidth} animate-fade-up max-h-[90vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
            <h2 className="text-base font-bold text-charcoal">{title}</h2>
            <button onClick={onClose} className="w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-charcoal transition-colors text-lg leading-none">×</button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
export default Modal
