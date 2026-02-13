export function FileStatusBadge({ status, errorMessage, progress }) {
    if (status === 'uploading') {
        return (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                Uploading… {progress}%
            </span>
        )
    }

    if (status === 'success') {
        return (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                Success
            </span>
        )
    }

    if (status === 'failed') {
        return (
            <span
                className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800"
                title={errorMessage}
            >
                Failed
            </span>
        )
    }

    return null
}
