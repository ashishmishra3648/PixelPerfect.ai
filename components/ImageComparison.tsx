"use client"

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { ZoomIn, ZoomOut } from 'lucide-react'

interface ImageComparisonProps {
    originalImage: string
    upscaledImage: string
    originalDimensions: { width: number; height: number }
    upscaledDimensions: { width: number; height: number }
}

export function ImageComparison({
    originalImage,
    upscaledImage,
    originalDimensions,
    upscaledDimensions
}: ImageComparisonProps) {
    const [activeTab, setActiveTab] = useState<'before' | 'after'>('after')
    const [isZoomed, setIsZoomed] = useState(false)

    return (
        <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden shadow-2xl">
            <div className="border-b border-white/10 bg-white/5">
                <div className="flex">
                    <button
                        onClick={() => setActiveTab('before')}
                        className={`
              flex-1 px-6 py-4 text-sm font-medium transition-all duration-300 relative
              ${activeTab === 'before'
                                ? 'text-white bg-white/10'
                                : 'text-muted-foreground hover:text-white hover:bg-white/5'}
            `}
                    >
                        <div className="flex flex-col items-center gap-1">
                            <span className="uppercase tracking-wider text-xs">Original</span>
                            <span className="text-xs opacity-60 font-mono">
                                {originalDimensions.width} × {originalDimensions.height}
                            </span>
                        </div>
                        {activeTab === 'before' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"></div>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('after')}
                        className={`
              flex-1 px-6 py-4 text-sm font-medium transition-all duration-300 relative
              ${activeTab === 'after'
                                ? 'text-white bg-white/10'
                                : 'text-muted-foreground hover:text-white hover:bg-white/5'}
            `}
                    >
                        <div className="flex flex-col items-center gap-1">
                            <span className="uppercase tracking-wider text-xs">Enhanced</span>
                            <span className="text-xs opacity-60 font-mono">
                                {upscaledDimensions.width} × {upscaledDimensions.height}
                            </span>
                        </div>
                        {activeTab === 'after' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"></div>
                        )}
                    </button>
                </div>
            </div>

            <div className="relative aspect-video bg-black/50 overflow-hidden group">
                <div className={`
          absolute inset-0 transition-opacity duration-500 ease-in-out
          ${activeTab === 'before' ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}>
                    <img
                        src={originalImage}
                        alt="Original image"
                        className={`w-full h-full object-contain transition-transform duration-700 ${isZoomed ? 'scale-150' : 'scale-100'}`}
                    />
                </div>
                <div className={`
          absolute inset-0 transition-opacity duration-500 ease-in-out
          ${activeTab === 'after' ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}>
                    <img
                        src={upscaledImage}
                        alt="Upscaled image"
                        className={`w-full h-full object-contain transition-transform duration-700 ${isZoomed ? 'scale-150' : 'scale-100'}`}
                    />
                </div>

                {/* Controls Overlay */}
                <div className="absolute top-4 right-4 flex gap-2">
                    <button
                        onClick={() => setIsZoomed(!isZoomed)}
                        className="p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-primary hover:border-primary transition-all duration-300"
                    >
                        {isZoomed ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
                    </button>
                    <Badge variant={activeTab === 'after' ? 'default' : 'secondary'} className="shadow-lg backdrop-blur-md">
                        {activeTab === 'after' ? '✨ AI Enhanced' : 'Original Quality'}
                    </Badge>
                </div>
            </div>

            {/* Resolution Info */}
            <div className="p-4 border-t border-white/10 bg-white/5 flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                    Resolution Scale
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground line-through">
                        {originalDimensions.width}px
                    </span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-sm font-bold text-primary">
                        {upscaledDimensions.width}px
                    </span>
                    <Badge variant="outline" className="ml-2 border-primary/30 text-primary bg-primary/10">
                        {Math.round(upscaledDimensions.width / originalDimensions.width)}x
                    </Badge>
                </div>
            </div>
        </div>
    )
}
