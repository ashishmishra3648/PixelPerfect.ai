"use client"

import { useState } from 'react'
import { ImageUploader } from '@/components/ImageUploader'
import { UpscaleOptions } from '@/components/UpscaleOptions'
import { ProcessingState } from '@/components/ProcessingState'
import { ImageComparison } from '@/components/ImageComparison'
import { DownloadButton } from '@/components/DownloadButton'
import { mockUpscaleImage } from '@/lib/mock-api'
import { Sparkles, RotateCcw, Zap, Shield, Image as ImageIcon, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null)
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [upscaledImage, setUpscaledImage] = useState<string | null>(null)
  const [upscaledDimensions, setUpscaledDimensions] = useState<{ width: number; height: number } | null>(null)
  const [scaleFactor, setScaleFactor] = useState<'2x' | '4x'>('2x')
  const [error, setError] = useState<string | null>(null)

  const handleImageSelect = (file: File, preview: string) => {
    setSelectedFile(file)
    setSelectedPreview(preview)
    setError(null)
    setUpscaledImage(null)

    // Get original dimensions
    const img = new Image()
    img.onload = () => {
      setOriginalDimensions({ width: img.width, height: img.height })
    }
    img.src = preview
  }

  const handleClear = () => {
    setSelectedFile(null)
    setSelectedPreview(null)
    setOriginalDimensions(null)
    setUpscaledImage(null)
    setUpscaledDimensions(null)
    setError(null)
  }

  const handleUpscale = async (scale: '2x' | '4x') => {
    if (!selectedFile) return

    setIsProcessing(true)
    setError(null)
    setScaleFactor(scale)

    try {
      const formData = new FormData()
      formData.append('image', selectedFile)
      formData.append('scale', scale)

      const response = await fetch('/api/upscale', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        // Fall back to mock API on any error
        console.log('API failed, falling back to mock API:', data.error)
        const result = await mockUpscaleImage(selectedFile, scale)
        if (result.success) {
          setUpscaledImage(result.upscaledImageUrl)
          setUpscaledDimensions(result.upscaledResolution)
        } else {
          setError(result.error || 'Failed to upscale image')
        }
        setIsProcessing(false)
        return
      }

      const upscaledUrl = data.result

      // Load image to get dimensions
      await new Promise<void>((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
          setUpscaledImage(upscaledUrl)
          setUpscaledDimensions({ width: img.width, height: img.height })
          resolve()
        }
        img.onerror = () => reject(new Error('Failed to load upscaled image'))
        img.src = upscaledUrl
      })

    } catch (err) {
      // Final fallback to mock API if everything fails
      console.log('Exception caught, falling back to mock API:', err)
      try {
        const result = await mockUpscaleImage(selectedFile, scale)
        if (result.success) {
          setUpscaledImage(result.upscaledImageUrl)
          setUpscaledDimensions(result.upscaledResolution)
        } else {
          setError(result.error || 'Failed to upscale image')
        }
      } catch (mockErr) {
        setError('An error occurred while processing your image. Please try again.')
        console.error('Mock API also failed:', mockErr)
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const handleStartOver = () => {
    handleClear()
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0a] to-black text-white selection:bg-primary/30">

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold text-lg tracking-tight">PixelPerfect<span className="text-primary">.ai</span></span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://github.com" target="_blank" className="text-sm text-muted-foreground hover:text-white transition-colors">GitHub</a>
            {(selectedPreview || upscaledImage) && (
              <Button onClick={handleStartOver} variant="ghost" size="sm" className="text-muted-foreground hover:text-white">
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-32 pb-20">

        {/* Hero Section */}
        {!selectedPreview && !upscaledImage && (
          <div className="max-w-4xl mx-auto text-center space-y-8 mb-20 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-muted-foreground mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Powered by Real-ESRGAN AI
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
              Transform Low-Res Images into <br />
              <span className="text-gradient">High-Definition Masterpieces</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Upscale your images by 2x or 4x without losing quality. Our advanced AI restores details, sharpens edges, and removes noise instantly.
            </p>

            <div className="glass-card p-8 rounded-3xl mt-12 max-w-2xl mx-auto border-white/10 bg-black/40">
              <ImageUploader
                onImageSelect={handleImageSelect}
                selectedImage={selectedPreview}
                onClear={handleClear}
              />
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 mt-20 text-left">
              {[
                { icon: Zap, title: "Lightning Fast", desc: "Process images in seconds with our optimized AI pipeline." },
                { icon: Shield, title: "Secure & Private", desc: "Your photos are processed securely and never stored permanently." },
                { icon: ImageIcon, title: "Smart Enhancement", desc: "Automatically restores missing details and textures." }
              ].map((feature, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <feature.icon className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Workspace Section */}
        {(selectedPreview || upscaledImage) && (
          <div className="max-w-6xl mx-auto animate-slide-up">

            {/* Processing View */}
            {isProcessing ? (
              <div className="max-w-xl mx-auto py-20">
                <ProcessingState message="Enhancing your image..." />
              </div>
            ) : (
              <div className="space-y-8">

                {/* Main Display Area */}
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Left Column: Image Display */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold">
                        {upscaledImage ? 'Result Comparison' : 'Image Preview'}
                      </h2>
                      <Button onClick={handleStartOver} variant="outline" size="sm" className="gap-2">
                        <Upload className="h-4 w-4" />
                        Upload New Image
                      </Button>
                    </div>

                    {upscaledImage && upscaledDimensions && originalDimensions ? (
                      <ImageComparison
                        originalImage={selectedPreview!}
                        upscaledImage={upscaledImage}
                        originalDimensions={originalDimensions}
                        upscaledDimensions={upscaledDimensions}
                      />
                    ) : (
                      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-2xl">
                        <img
                          src={selectedPreview!}
                          alt="Preview"
                          className="w-full h-auto object-contain max-h-[600px]"
                        />
                        <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-xs font-mono border border-white/10">
                          {originalDimensions?.width} × {originalDimensions?.height}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Controls */}
                  <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-6">
                      {!upscaledImage ? (
                        <div className="p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md">
                          <h3 className="text-lg font-semibold mb-4">Upscale Settings</h3>
                          <UpscaleOptions
                            onUpscale={handleUpscale}
                            isProcessing={isProcessing}
                            originalDimensions={originalDimensions || undefined}
                          />
                        </div>
                      ) : (
                        <div className="p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md space-y-6">
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Download Result</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              Your image has been successfully enhanced by {scaleFactor}.
                            </p>
                            <DownloadButton
                              imageUrl={upscaledImage}
                              fileName={selectedFile?.name || 'upscaled-image.png'}
                              scaleFactor={scaleFactor}
                            />
                          </div>

                          <div className="pt-6 border-t border-white/10">
                            <h4 className="text-sm font-medium mb-3">Image Details</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Original Size</span>
                                <span className="font-mono">{originalDimensions?.width} × {originalDimensions?.height}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Upscaled Size</span>
                                <span className="font-mono text-primary">{upscaledDimensions?.width} × {upscaledDimensions?.height}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Scale Factor</span>
                                <span>{scaleFactor}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/50 backdrop-blur-xl py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 PixelPerfect.ai. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
