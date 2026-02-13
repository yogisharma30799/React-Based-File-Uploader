import { FAILURE_RATE, getOptimalChunkSize } from "./fileHelpers"

function simulateChunkUpload(chunk, index, signal) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      if (Math.random() < FAILURE_RATE) {
        reject(new Error(`Chunk ${index + 1} upload failed (size=${chunk.size})`))
      } else {
        resolve({ index, size: chunk.size })
      }
    }, 400 + Math.random() * 600)

    signal?.addEventListener('abort', () => {
      clearTimeout(timeout)
      reject(new DOMException('Aborted', 'AbortError'))
    })
  })
}

export async function simulateUpload(file, onProgress, signal) {
  const chunkSize = getOptimalChunkSize(file.size)
  const totalChunks = Math.ceil(file.size / chunkSize)
  let start = 0
  let chunkIndex = 0

  if (signal?.aborted) throw new Error('Upload cancelled')

  while (start < file.size) {
    const end = Math.min(start + chunkSize, file.size)
    const chunk = file.slice(start, end)

    try {
      await simulateChunkUpload(chunk, chunkIndex, signal)
    } catch (err) {
      if (err.name === 'AbortError') throw err
      return { success: false, message: `Failed at ${Math.floor((chunkIndex / totalChunks) * 100)}%` }
    }

    chunkIndex++
    start = end
    const progress = Math.round((start / file.size) * 100)
    onProgress(progress)

    if (signal?.aborted) throw new Error('Upload cancelled')
  }

  return { success: true }
}