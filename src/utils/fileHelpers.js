let nextId = 0

export const FAILURE_RATE = 0.03

export function generateUniqueFileId() {
    return `file-${++nextId}-${Date.now()}`
}

export function getOptimalChunkSize(fileSize) {
    const MB = 1024 * 1024

    if (fileSize < 20 * MB) return 3 * MB
    if (fileSize < 100 * MB) return 10 * MB
    if (fileSize < 500 * MB) return 20 * MB
    return 20 * MB
}

