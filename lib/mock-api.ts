/**
 * Mock API for image upscaling
 * This simulates the upscaling process without calling an external API
 * Used for development and testing
 */

export interface UpscaleResult {
    success: boolean
    upscaledImageUrl: string
    originalResolution: { width: number; height: number }
    upscaledResolution: { width: number; height: number }
    error?: string
}

export async function mockUpscaleImage(
    imageFile: File,
    scaleFactor: '2x' | '4x'
): Promise<UpscaleResult> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 3000))

    return new Promise((resolve, reject) => {
        const img = new Image()
        const reader = new FileReader()

        reader.onload = (e) => {
            img.onload = () => {
                const originalWidth = img.width
                const originalHeight = img.height
                const multiplier = scaleFactor === '2x' ? 2 : 4

                // Create canvas for upscaled image
                const canvas = document.createElement('canvas')
                canvas.width = originalWidth * multiplier
                canvas.height = originalHeight * multiplier
                const ctx = canvas.getContext('2d')

                if (!ctx) {
                    reject(new Error('Failed to get canvas context'))
                    return
                }

                // Draw upscaled image with better quality
                ctx.imageSmoothingEnabled = true
                ctx.imageSmoothingQuality = 'high'
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

                // Add a subtle "enhanced" effect (optional)
                ctx.filter = 'contrast(1.05) brightness(1.02)'
                ctx.drawImage(canvas, 0, 0)

                // Convert to blob and create URL
                canvas.toBlob((blob) => {
                    if (blob) {
                        const upscaledImageUrl = URL.createObjectURL(blob)
                        resolve({
                            success: true,
                            upscaledImageUrl,
                            originalResolution: { width: originalWidth, height: originalHeight },
                            upscaledResolution: { width: canvas.width, height: canvas.height }
                        })
                    } else {
                        reject(new Error('Failed to create blob'))
                    }
                }, 'image/png', 0.95)
            }

            img.onerror = () => {
                reject(new Error('Failed to load image'))
            }

            img.src = e.target?.result as string
        }

        reader.onerror = () => {
            reject(new Error('Failed to read file'))
        }

        reader.readAsDataURL(imageFile)
    })
}
