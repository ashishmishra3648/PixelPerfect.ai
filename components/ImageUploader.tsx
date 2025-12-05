"use client"

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ImageUploaderProps {
    onImageSelect: (file: File, preview: string) => void
    selectedImage: string | null
    onClear: () => void
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ACCEPTED_FORMATS = {
    'image/png': ['.png'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/webp': ['.webp']
}

export function ImageUploader({ onImageSelect, selectedImage, onClear }: ImageUploaderProps) {
    const [error, setError] = useState<string | null>(null)

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
        setError(null)

        if (rejectedFiles.length > 0) {
            const rejection = rejectedFiles[0]
            if (rejection.errors[0]?.code === 'file-too-large') {
                setError('File size must be less than 10MB')
            } else if (rejection.errors[0]?.code === 'file-invalid-type') {
                setError('Only PNG, JPG, JPEG, and WebP formats are supported')
            } else {
                setError('Invalid file. Please try again.')
            }
            return
        }

        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0]
            const preview = URL.createObjectURL(file)
            onImageSelect(file, preview)
        }
    }, [onImageSelect])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: ACCEPTED_FORMATS,
        maxSize: MAX_FILE_SIZE,
        multiple: false
    })

    if (selectedImage) {
        return (
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm">
                <div className="relative aspect-video w-full">
                    <img
                        src={selectedImage}
                        alt="Selected image"
                        className="h-full w-full object-contain"
                    />
                    <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 rounded-full shadow-lg"
                        onClick={onClear}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div
                {...getRootProps()}
                className={`
          relative overflow-hidden rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300
          ${isDragActive
                        ? 'border-primary bg-primary/10 scale-[1.02] shadow-[0_0_30px_rgba(var(--primary),0.3)]'
                        : 'border-white/10 hover:border-primary/50 hover:bg-white/5'}
        `}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                    <div className={`
            rounded-full p-6 mb-6 transition-all duration-300
            ${isDragActive ? 'bg-primary/20 scale-110' : 'bg-white/5'}
          `}>
                        {isDragActive ? (
                            <Upload className="h-10 w-10 text-primary animate-bounce" />
                        ) : (
                            <ImageIcon className="h-10 w-10 text-muted-foreground" />
                        )}
                    </div>

                    <h3 className="text-xl font-semibold mb-3">
                        {isDragActive ? 'Drop your image here' : 'Upload an image'}
                    </h3>

                    <p className="text-muted-foreground mb-6 max-w-xs mx-auto">
                        Drag and drop or click to browse your files
                    </p>

                    <div className="flex flex-wrap gap-2 justify-center text-xs text-muted-foreground/60 uppercase tracking-wider font-medium">
                        <span className="px-2 py-1 bg-white/5 rounded border border-white/5">PNG</span>
                        <span className="px-2 py-1 bg-white/5 rounded border border-white/5">JPG</span>
                        <span className="px-2 py-1 bg-white/5 rounded border border-white/5">WEBP</span>
                        <span className="px-2 py-1 bg-white/5 rounded border border-white/5">MAX 10MB</span>
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl animate-fade-in">
                    <p className="text-sm text-red-400 text-center font-medium">{error}</p>
                </div>
            )}
        </div>
    )
}
