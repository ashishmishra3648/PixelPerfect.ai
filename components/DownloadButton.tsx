"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Check, Sparkles } from 'lucide-react'

interface DownloadButtonProps {
    imageUrl: string
    fileName: string
    scaleFactor: string
}

export function DownloadButton({ imageUrl, fileName, scaleFactor }: DownloadButtonProps) {
    const [isDownloading, setIsDownloading] = useState(false)
    const [downloaded, setDownloaded] = useState(false)

    const handleDownload = async () => {
        setIsDownloading(true)

        try {
            const response = await fetch(imageUrl)
            const blob = await response.blob()

            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url

            // Add scale factor to filename
            const nameParts = fileName.split('.')
            const extension = nameParts.pop()
            const baseName = nameParts.join('.')
            link.download = `${baseName}_upscaled_${scaleFactor}.${extension}`

            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)

            setDownloaded(true)
            setTimeout(() => setDownloaded(false), 3000)
        } catch (error) {
            console.error('Download failed:', error)
        } finally {
            setIsDownloading(false)
        }
    }

    return (
        <Button
            onClick={handleDownload}
            disabled={isDownloading || downloaded}
            size="lg"
            className={`
                w-full h-14 text-lg font-bold tracking-wide transition-all duration-300
                ${downloaded
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-[0_0_20px_rgba(var(--primary),0.4)] hover:shadow-[0_0_30px_rgba(var(--primary),0.6)] hover:scale-[1.02]'}
            `}
        >
            {downloaded ? (
                <>
                    <Check className="mr-2 h-6 w-6" />
                    Saved to Device
                </>
            ) : isDownloading ? (
                <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                    Downloading...
                </>
            ) : (
                <>
                    <Download className="mr-2 h-6 w-6" />
                    Download Enhanced Image
                    <Sparkles className="ml-2 h-4 w-4 opacity-70 animate-pulse" />
                </>
            )}
        </Button>
    )
}
