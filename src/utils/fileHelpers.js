/**
 * File Helper Utilities
 */

let nextId = 0

/**
 * Generates a unique ID for each file upload
 * Format: file-{incrementing-number}-{timestamp}
 */
export function generateUniqueFileId() {
    return `file-${++nextId}-${Date.now()}`
}
