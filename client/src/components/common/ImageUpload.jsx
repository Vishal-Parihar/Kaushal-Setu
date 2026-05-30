import { useRef, useState } from 'react'

export default function ImageUpload({ images = [], onChange, max = 3 }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const processFiles = (files) => {
    const remaining = max - images.length
    const toProcess = Array.from(files).slice(0, remaining)
    toProcess.forEach(file => {
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = (e) => {
        onChange(prev => [...prev, e.target.result])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    processFiles(e.dataTransfer.files)
  }

  const handleRemove = (index) => {
    onChange(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((img, i) => (
            <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 group">
              <img src={img} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-lg"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      {images.length < max && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current.click()}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
            dragging ? 'border-saffron bg-saffron/5' : 'border-gray-200 hover:border-saffron hover:bg-cream'
          }`}
        >
          <div className="text-2xl mb-1">📷</div>
          <p className="text-sm font-medium text-gray-600">Click or drag to upload</p>
          <p className="text-xs text-gray-400 mt-0.5">JPG, PNG up to 2MB · {max - images.length} remaining</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={e => processFiles(e.target.files)}
          />
        </div>
      )}
    </div>
  )
}