import { useRef, useState, useEffect, useCallback } from 'react'

const COLORS = ['#5e3b22', '#9a5e1f', '#cc9850', '#e8ddd0', '#ff6b6b', '#4ecdc4', '#ffffff']
const SIZES  = [3, 6, 12, 20]

export default function PoopDrawCanvas({ onChange }) {
  const canvasRef  = useRef(null)
  const drawing    = useRef(false)
  const lastPos    = useRef(null)
  const [color, setColor]  = useState('#5e3b22')
  const [size, setSize]    = useState(6)
  const [isEraser, setIsEraser] = useState(false)
  const [hasDrawn, setHasDrawn] = useState(false)

  // Initialize canvas with cream background
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#faf6f0'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width  / rect.width
    const scaleY = canvas.height / rect.height
    const src = e.touches ? e.touches[0] : e
    return {
      x: (src.clientX - rect.left) * scaleX,
      y: (src.clientY - rect.top)  * scaleY,
    }
  }

  const startDraw = useCallback((e) => {
    e.preventDefault()
    drawing.current = true
    const canvas = canvasRef.current
    lastPos.current = getPos(e, canvas)
  }, [])

  const draw = useCallback((e) => {
    e.preventDefault()
    if (!drawing.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const pos = getPos(e, canvas)

    ctx.beginPath()
    ctx.moveTo(lastPos.current.x, lastPos.current.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.strokeStyle = isEraser ? '#faf6f0' : color
    ctx.lineWidth   = isEraser ? size * 3 : size
    ctx.lineCap     = 'round'
    ctx.lineJoin    = 'round'
    ctx.stroke()

    lastPos.current = pos
    setHasDrawn(true)
  }, [color, size, isEraser])

  const stopDraw = useCallback(() => {
    if (!drawing.current) return
    drawing.current = false
    if (hasDrawn || true) {
      const dataUrl = canvasRef.current.toDataURL('image/png')
      onChange(dataUrl)
    }
  }, [onChange, hasDrawn])

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#faf6f0'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    setHasDrawn(false)
    onChange(null)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="label">Draw your popo ✏️</span>
        <button
          type="button"
          onClick={clearCanvas}
          className="text-xs text-muted hover:text-primary transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Canvas */}
      <div className="rounded-2xl overflow-hidden border-2 border-dashed"
        style={{ borderColor: 'var(--border)' }}>
        <canvas
          ref={canvasRef}
          width={320}
          height={200}
          className="drawing-canvas w-full block"
          style={{ touchAction: 'none' }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
        />
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Colors */}
        <div className="flex gap-1.5">
          {COLORS.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => { setColor(c); setIsEraser(false) }}
              className="w-6 h-6 rounded-full border-2 transition-transform"
              style={{
                backgroundColor: c,
                borderColor: (color === c && !isEraser) ? 'var(--brand)' : 'var(--border)',
                transform: (color === c && !isEraser) ? 'scale(1.25)' : 'scale(1)',
              }}
            />
          ))}
        </div>

        {/* Divider */}
        <div className="w-px h-5" style={{ backgroundColor: 'var(--border)' }} />

        {/* Brush sizes */}
        <div className="flex items-center gap-2">
          {SIZES.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => { setSize(s); setIsEraser(false) }}
              className="flex items-center justify-center w-7 h-7 rounded-lg transition-all"
              style={{
                backgroundColor: size === s && !isEraser ? 'var(--brand)' : 'var(--bg-subtle)',
              }}
            >
              <span
                className="rounded-full"
                style={{
                  width: Math.max(4, s * 0.8),
                  height: Math.max(4, s * 0.8),
                  backgroundColor: size === s && !isEraser ? 'white' : 'var(--text-secondary)',
                  display: 'block',
                }}
              />
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="w-px h-5" style={{ backgroundColor: 'var(--border)' }} />

        {/* Eraser */}
        <button
          type="button"
          onClick={() => setIsEraser(e => !e)}
          className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all"
          style={{
            backgroundColor: isEraser ? 'var(--brand)' : 'var(--bg-subtle)',
            color: isEraser ? 'white' : 'var(--text-secondary)',
          }}
        >
          Eraser
        </button>
      </div>
    </div>
  )
}