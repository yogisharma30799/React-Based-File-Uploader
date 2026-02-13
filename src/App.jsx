import { useCallback, useRef, useState } from 'react'
import { DropZone } from './components/DropZone'
import { FileList } from './components/FileList'
import { simulateUpload } from './utils/uploadSimulator'
import { generateUniqueFileId } from './utils/fileHelpers'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function App() {
  const [files, setFiles] = useState([])
  const abortRef = useRef({})

  const updateFile = useCallback((id, updates) => {
    setFiles((prev) => prev.map((file) => (file.id === id ? { ...file, ...updates } : file)))
  }, [])

  const runUpload = useCallback(
    (id, file) => {
      const controller = new AbortController()
      abortRef.current[id] = controller

      simulateUpload(file, (progress) => updateFile(id, { progress }), controller.signal)
        .then((result) => {
          if (result.success) {
            updateFile(id, { status: 'success', progress: 100 })
            toast.success(`File ${file.name} uploaded successfully!`)
          } else {
            updateFile(id, { status: 'failed', errorMessage: result.message })
            toast.error(`Failed to upload ${file.name} — ${result.message}`)
          }
        })
        .catch((err) => {
          const message = err?.message || 'Upload failed'
          updateFile(id, { status: 'failed', errorMessage: message })
          if (message !== 'Upload cancelled') {
            toast.error(`Failed to upload ${file.name} — ${message}`)
          }
        })
        .finally(() => {
          delete abortRef.current[id]
        })
    },
    [updateFile]
  )

  const onFilesSelected = useCallback(
    (selectedFiles) => {
      const newItems = selectedFiles.map((file) => ({
        id: generateUniqueFileId(),
        file,
        status: 'uploading',
        progress: 0,
        errorMessage: null,
      }))
      setFiles((prev) => [...prev, ...newItems])
      newItems.forEach(({ id, file }) => runUpload(id, file))
    },
    [runUpload]
  )

  const onCancel = useCallback((fileId) => {
    const controller = abortRef.current[fileId]
    if (controller) controller.abort()
  }, [])


  const onRetry = useCallback(
    (fileId) => {
      const item = files.find((f) => f.id === fileId)
      if (!item || item.status !== 'failed') return
      updateFile(fileId, { status: 'uploading', progress: 0, errorMessage: null })
      runUpload(fileId, item.file)
    },
    [files, updateFile, runUpload]
  )

  const onDelete = useCallback((fileId) => {
    const controller = abortRef.current[fileId]
    if (controller) controller.abort()
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-black text-white py-12 px-6">
      <div className="mx-auto max-w-2xl">

        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
            Upload. Chill. Repeat.
          </h1>
        </div>

        <DropZone onFilesSelected={onFilesSelected} />

        <div className="mt-8">
          <FileList
            files={files}
            onCancel={onCancel}
            onRetry={onRetry}
            onDelete={onDelete}
          />
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        pauseOnHover
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
      />
    </div>
  )
}
