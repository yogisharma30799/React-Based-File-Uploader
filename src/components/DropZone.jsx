import { useCallback, useRef } from 'react'

export function DropZone({ onFilesSelected, disabled }) {
  const inputRef = useRef(null)

  const handleFiles = useCallback(
    (fileList) => {
      if (!fileList?.length) return
      const files = Array.from(fileList)
      onFilesSelected(files)
    },
    [onFilesSelected]
  )

  const onDrop = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      if (disabled) return
      handleFiles(e.dataTransfer?.files)
    },
    [disabled, handleFiles]
  )

  const onDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const onClick = useCallback(() => {
    if (disabled) return
    inputRef.current?.click()
  }, [disabled])

  const onChange = useCallback(
    (e) => {
      handleFiles(e.target.files)
      e.target.value = ''
    },
    [handleFiles]
  )

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      onClick={onClick}
      onDrop={onDrop}
      onDragOver={onDragOver}
      className={`
        relative overflow-hidden rounded-2xl p-10 text-center cursor-pointer
        transition-all duration-300 backdrop-blur-xl border
        ${disabled
          ? 'opacity-50 cursor-not-allowed bg-slate-200'
          : 'bg-white/60 border-slate-300 hover:scale-[1.02] hover:shadow-2xl hover:border-indigo-500'
        }
      `}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={onChange}
        disabled={disabled}
      />

      <div className="flex flex-col items-center gap-4">
        <div className="text-5xl animate-bounce">
          🚀
        </div>


        <p className="text-lg font-semibold text-slate-800">
          Drag your files here like it’s 2026 🚀
        </p>

        <p className="text-sm text-slate-600">
          Or click. We know you will anyway.
        </p>

        <p className="text-xs text-slate-100 mt-2">
          No size limit. We don’t judge.
        </p>
      </div>
    </div>
  )
}


