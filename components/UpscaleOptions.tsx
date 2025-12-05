"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sparkles, Zap, Maximize } from 'lucide-react'

interface UpscaleOptionsProps {
    onUpscale: (scaleFactor: '2x' | '4x') => void
    isProcessing: boolean
    originalDimensions?: { width: number; height: number }
}

export function UpscaleOptions({ onUpscale, isProcessing, originalDimensions }: UpscaleOptionsProps) {
    const [selectedScale, setSelectedScale] = useState<'2x' | '4x'>('2x')

    const getEstimatedDimensions = (scale: '2x' | '4x') => {
        if (!originalDimensions) return null
        const multiplier = scale === '2x' ? 2 : 4
        return {
            width: originalDimensions.width * multiplier,
            height: originalDimensions.height * multiplier
        }
    }

    const estimated2x = getEstimatedDimensions('2x')
    const estimated4x = getEstimatedDimensions('4x')

    return (
        <div className="space-y-6">
            <div className="flex gap-4">
                <button
                    onClick={() => setSelectedScale('2x')}
                    disabled={isProcessing}
                    className={`
            flex-1 relative p-4 rounded-xl border transition-all duration-300 group
            ${selectedScale === '2x'
                            ? 'border-primary bg-primary/20 shadow-[0_0_20px_rgba(var(--primary),0.2)]'
                            : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'}
            ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
                >
                    <div className="flex flex-col items-center gap-2">
                        <Zap className={`h-6 w-6 ${selectedScale === '2x' ? 'text-primary' : 'text-muted-foreground'}`} />
                        <div className="text-xl font-bold">2x</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Standard</div>
                    </div>
                    {estimated2x && (
                        <div className="mt-3 text-xs text-muted-foreground/80 bg-black/20 rounded-full px-2 py-1">
                            {estimated2x.width} × {estimated2x.height}
                        </div>
                    )}
                </button>

                <button
                    onClick={() => setSelectedScale('4x')}
                    disabled={isProcessing}
                    className={`
            flex-1 relative p-4 rounded-xl border transition-all duration-300 group
            ${selectedScale === '4x'
                            ? 'border-primary bg-primary/20 shadow-[0_0_20px_rgba(var(--primary),0.2)]'
                            : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'}
            ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
                >
                    <div className="flex flex-col items-center gap-2">
                        <Maximize className={`h-6 w-6 ${selectedScale === '4x' ? 'text-primary' : 'text-muted-foreground'}`} />
                        <div className="text-xl font-bold">4x</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Ultra HD</div>
                    </div>
                    {estimated4x && (
                        <div className="mt-3 text-xs text-muted-foreground/80 bg-black/20 rounded-full px-2 py-1">
                            {estimated4x.width} × {estimated4x.height}
                        </div>
                    )}
                </button>
            </div>

            <Button
                onClick={() => onUpscale(selectedScale)}
                disabled={isProcessing}
                className="w-full h-12 text-lg font-medium bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(var(--primary),0.4)] hover:shadow-[0_0_30px_rgba(var(--primary),0.6)] transition-all duration-300"
            >
                {isProcessing ? (
                    <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                        Enhancing...
                    </>
                ) : (
                    <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Upscale Image
                    </>
                )}
            </Button>
        </div>
    )
}
