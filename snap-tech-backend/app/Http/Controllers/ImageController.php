<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ImageController extends Controller
{
    public function getProductImage($filename)
    {
        try {
            // Validate filename to prevent directory traversal
            if (strpbrk($filename, '/.\\') !== false) {
                Log::warning('Potentially malicious filename requested: ' . $filename);
                return $this->returnPlaceholder();
            }
            
            // Check if the file exists
            $path = 'products/' . $filename;
            
            if (!Storage::disk('public')->exists($path)) {
                Log::info('Image not found: ' . $path);
                return $this->returnPlaceholder();
            }
            
            // Get the file content
            $file = Storage::disk('public')->get($path);
            
            // Get the MIME type
            $mimeType = Storage::disk('public')->mimeType($path);
            
            // Return the file with appropriate headers
            return response($file, 200)
                ->header('Content-Type', $mimeType)
                ->header('Cache-Control', 'public, max-age=86400');
        } catch (\Exception $e) {
            Log::error('Error serving product image: ' . $e->getMessage());
            // return $this->returnPlaceholder();
        }
    }
    
    private function returnPlaceholder()
    {
        // Path to a default placeholder image in your public directory
        $placeholderPath = public_path('placeholder.svg');
        
        if (file_exists($placeholderPath)) {
            $file = file_get_contents($placeholderPath);
            return response($file, 200)
                ->header('Content-Type', 'image/svg+xml')
                ->header('Cache-Control', 'public, max-age=86400');
        }
        
        // If even the placeholder doesn't exist, return a transparent 1x1 PNG
        $transparentPixel = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
        return response($transparentPixel, 200)
            ->header('Content-Type', 'image/png')
            ->header('Cache-Control', 'public, max-age=86400');
    }
}