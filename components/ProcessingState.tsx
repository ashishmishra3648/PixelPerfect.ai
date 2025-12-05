"use client"

import { useEffect, useState } from 'react'
import { Progress } from '@/components/ui/progress'
import { Loader2, Sparkles } from 'lucide-react'

interface ProcessingStateProps {
    message?: string
}

export function ProcessingState({ message = "Processing your image..." }: ProcessingStateProps) {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) return prev
                return prev + Math.random() * 10
            })
        }, 800)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="p-12 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md">
            <div className="flex flex-col items-center justify-center space-y-8">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/30 rounded-full blur-2xl animate-pulse"></div>
                    <div className="relative bg-black/50 p-4 rounded-full border border-white/10">
                        <Loader2 className="h-12 w-12 text-primary animate-spin" />
                    </div>
                    <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400 animate-bounce" />
                </div>

                <div className="text-center space-y-3">
                    <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                        {message}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        AI is analyzing details and enhancing resolution...
                    </p>
                </div>

                <div className="w-full max-w-sm space-y-3">
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div
                            className="h-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground font-mono">
                        <span>ENHANCING</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
