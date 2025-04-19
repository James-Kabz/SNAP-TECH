// src/services/imageService.ts

/**
 * Service to handle image URL processing and retrieval
 */
export class ImageService {
    private apiUrl: string;
  
    constructor() {
      this.apiUrl = import.meta.env.VITE_API_URL || '';
    }
  
    /**
     * Get the proper image URL for product images
     * @param imageUrl - The image URL from the API response
     * @returns Properly formatted URL for the image
     */
    getProductImageUrl(imageUrl: string | null): string {
      if (!imageUrl) return "/placeholder.svg";
  
      try {
        // If it's already a full URL, return it
        if (imageUrl.startsWith('http')) {
          return imageUrl;
        }
        
        // Handle case where the URL is just the filename
        if (!imageUrl.includes('/')) {
          return `${this.apiUrl}/images/products/${imageUrl}`;
        }
        
        // Handle case where it's 'products/filename.jpg'
        if (imageUrl.startsWith('products/')) {
          const filename = imageUrl.split('/').pop();
          if (!filename) return "/placeholder.svg";
          return `${this.apiUrl}/images/products/${filename}`;
        }
        
        // For any other format, try to extract the filename
        const filename = imageUrl.split('/').pop();
        if (!filename) return "/placeholder.svg";
        
        return `${this.apiUrl}/images/products/${filename}`;
      } catch (error) {
        console.error("Error processing image URL:", error);
        return "/placeholder.svg";
      }
    }
  
    /**
     * Prefetch an image to ensure it's cached
     * @param imageUrl - The image URL to prefetch
     */
    prefetchImage(imageUrl: string): Promise<void> {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Failed to load image: ${imageUrl}`));
        img.src = imageUrl;
      });
    }
  }
  
  // Create a singleton instance
  export const imageService = new ImageService();
  
  // Export default for easier imports
  export default imageService;