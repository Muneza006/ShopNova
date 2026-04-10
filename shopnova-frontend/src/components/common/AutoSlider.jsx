import { useRef, useEffect } from 'react'

const AutoSlider = ({ children, speed = 1.2, minItems = 4 }) => {
  const containerRef = useRef(null)
  const trackRef = useRef(null)
  const animRef = useRef(null)
  const posRef = useRef(0)
  const pausedRef = useRef(false)
  const dragRef = useRef({ dragging: false, startX: 0, startPos: 0 })

  const items = Array.isArray(children) ? children : [children]
  const shouldScroll = items.length >= minItems

  useEffect(() => {
    if (!shouldScroll) return
    const track = trackRef.current
    if (!track) return
    const step = () => {
      if (!pausedRef.current && !dragRef.current.dragging) {
        posRef.current += speed
        const half = track.scrollWidth / 2
        if (posRef.current >= half) posRef.current = 0
        track.style.transform = `translateX(-${posRef.current}px)`
      }
      animRef.current = requestAnimationFrame(step)
    }
    animRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animRef.current)
  }, [shouldScroll, speed])

  const onMouseDown = (e) => { dragRef.current = { dragging: true, startX: e.clientX, startPos: posRef.current }; pausedRef.current = true }
  const onMouseMove = (e) => {
    if (!dragRef.current.dragging) return
    const delta = dragRef.current.startX - e.clientX
    const track = trackRef.current
    if (!track) return
    const half = track.scrollWidth / 2
    let newPos = dragRef.current.startPos + delta
    if (newPos < 0) newPos = 0
    if (newPos >= half) newPos = half - 1
    posRef.current = newPos
    track.style.transform = `translateX(-${newPos}px)`
  }
  const onMouseUp = () => { dragRef.current.dragging = false; pausedRef.current = false }
  const onTouchStart = (e) => { dragRef.current = { dragging: true, startX: e.touches[0].clientX, startPos: posRef.current }; pausedRef.current = true }
  const onTouchMove = (e) => {
    if (!dragRef.current.dragging) return
    const delta = dragRef.current.startX - e.touches[0].clientX
    const track = trackRef.current
    if (!track) return
    const half = track.scrollWidth / 2
    let newPos = dragRef.current.startPos + delta
    if (newPos < 0) newPos = 0
    if (newPos >= half) newPos = half - 1
    posRef.current = newPos
    track.style.transform = `translateX(-${newPos}px)`
  }
  const onTouchEnd = () => { dragRef.current.dragging = false; pausedRef.current = false }
  const slide = (dir) => {
    const track = trackRef.current
    if (!track) return
    const half = track.scrollWidth / 2
    let newPos = posRef.current + dir * 220
    if (newPos < 0) newPos = 0
    if (newPos >= half) newPos = half - 1
    posRef.current = newPos
    track.style.transform = `translateX(-${newPos}px)`
  }

  if (!shouldScroll) {
    return <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'thin' }}>{items}</div>
  }

  return (
    <div className="relative group">
      <button onClick={() => slide(-1)} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white/90 shadow-md rounded-full flex items-center justify-center text-gray-700 hover:bg-orange-500 hover:text-white transition opacity-0 group-hover:opacity-100 -translate-x-1" style={{ backdropFilter: 'blur(4px)' }}>‹</button>
      <div ref={containerRef} className="overflow-hidden w-full" style={{ cursor: 'grab' }}
        onMouseEnter={() => { pausedRef.current = true }}
        onMouseLeave={() => { pausedRef.current = false; onMouseUp() }}
        onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp}
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
        <div ref={trackRef} className="flex gap-3 will-change-transform select-none" style={{ width: 'max-content' }}>
          {items}{items}
        </div>
      </div>
      <button onClick={() => slide(1)} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white/90 shadow-md rounded-full flex items-center justify-center text-gray-700 hover:bg-orange-500 hover:text-white transition opacity-0 group-hover:opacity-100 translate-x-1" style={{ backdropFilter: 'blur(4px)' }}>›</button>
    </div>
  )
}

export default AutoSlider
