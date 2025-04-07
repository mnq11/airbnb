"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import React, { useCallback, useState, useEffect, useRef } from "react";
import { TbPhotoPlus, TbCloudUpload, TbX } from "react-icons/tb";
import toast from "react-hot-toast";

declare global {
  var cloudinary: any;
}

const uploadPreset = "ufsgae4f";

/**
 * Interface for CldUploadWidget children props
 */
interface CldUploadWidgetPropsChildren {
  open: () => void;
}

/**
 * Interface for ImageUpload component props
 *
 * @interface ImageUploadProps
 * @property {(value: string[]) => void} onChange - Callback function when images are added or removed
 * @property {string[]} value - Array of image URLs that have been uploaded
 * @property {boolean} [disabled] - Whether the upload functionality is disabled
 */
interface ImageUploadProps {
  onChange: (value: string[]) => void;
  value: string[];
  disabled?: boolean;
}

/**
 * ImageUpload Component
 *
 * A component that allows users to upload multiple images to Cloudinary.
 * Supports drag-and-drop, multiple image selection, and image preview.
 *
 * Features:
 * - Direct integration with Cloudinary for image storage
 * - Preview of uploaded images
 * - Ability to remove uploaded images
 *
 * @component
 * @param {ImageUploadProps} props - Component props
 * @returns {JSX.Element} Image upload widget with previews
 */
const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
  value,
  disabled,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Check localStorage for images on initial render if value is empty
  useEffect(() => {
    if (value.length === 0) {
      try {
        const storedImages = JSON.parse(localStorage.getItem('uploadedImages') || '[]');
        if (storedImages.length > 0) {
          console.log("Retrieved images from localStorage on mount:", storedImages);
          onChange(storedImages);
        }
      } catch (e) {
        console.error("Failed to retrieve images from localStorage:", e);
      }
    }
  }, [value, onChange]);

  /**
   * Handle successful image upload
   * Adds the new image URL to the existing array of images
   *
   * @param {Object} result - Upload result from Cloudinary
   */
  const handleUpload = useCallback(
    (result: any) => {
      setIsUploading(false);
      setError(null);
      
      console.log("Upload result:", result);
      
      try {
        let imageUrl = null;
        
        // Try to extract image URL from various Cloudinary response formats
        if (result?.event === "success" && result?.info?.secure_url) {
          imageUrl = result.info.secure_url;
        } else if (result?.info?.secure_url) {
          imageUrl = result.info.secure_url;
        } else if (result?.secure_url) {
          imageUrl = result.secure_url;
        } else if (typeof result === 'string' && result.includes('cloudinary.com')) {
          imageUrl = result;
        }
        
        if (imageUrl) {
          // Ensure value is always an array
          const safeValue = Array.isArray(value) ? value : [];
          const newImages = [...safeValue, imageUrl];
          
          console.log("Updating images:", newImages);
          
          // Update both component state and localStorage
          onChange(newImages);
          
          // Store in localStorage for backup
          try {
            localStorage.setItem('uploadedImages', JSON.stringify(newImages));
          } catch (e) {
            console.warn("Could not store image in localStorage", e);
          }
          
          toast.success("تم رفع الصورة بنجاح");
        } else {
          setError("فشل تحميل الصورة. يرجى المحاولة مرة أخرى.");
          toast.error("فشل تحميل الصورة");
          console.error("Upload result missing secure_url:", result);
        }
      } catch (error) {
        console.error("Error in handleUpload:", error);
        setError("حدث خطأ أثناء معالجة تحميل الصورة");
        toast.error("فشل معالجة الصورة");
      }
    },
    [onChange, value]
  );

  /**
   * Handles upload error
   */
  const handleUploadError = useCallback((error: any) => {
    setIsUploading(false);
    setError("فشل تحميل الصورة. يرجى المحاولة مرة أخرى.");
    toast.error("فشل تحميل الصورة");
    console.error("Upload error:", error);
  }, []);

  /**
   * Removes an image from the array by its index
   *
   * @param {number} index - Index of the image to remove
   */
  const removeImage = useCallback(
    (index: number) => {
      const newImages = [...value];
      newImages.splice(index, 1);
      onChange(newImages);
      
      // Update localStorage
      try {
        localStorage.setItem('uploadedImages', JSON.stringify(newImages));
      } catch (e) {
        console.warn("Could not update localStorage after removing image", e);
      }
      
      toast.success("تم حذف الصورة");
    },
    [onChange, value]
  );

  /**
   * Handles direct file uploads via standard file input
   * Uploads files directly to Cloudinary
   */
  const handleDirectFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true);
    setError(null);
    
    if (!event.target.files || event.target.files.length === 0) {
      setIsUploading(false);
      return;
    }
    
    const files = Array.from(event.target.files);
    const uploadPromises = files.map(async (file) => {
      try {
        // Create form data for upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);
        formData.append('folder', 'rental_platform');
        
        // Upload directly to Cloudinary API
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/dwnp6hztx/image/upload`,
          {
            method: 'POST',
            body: formData
          }
        );
        
        const data = await response.json();
        
        if (data.secure_url) {
          return data.secure_url;
        } else {
          console.error("Upload failed:", data);
          return null;
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        return null;
      }
    });
    
    try {
      // Wait for all uploads to complete
      const uploadedUrls = await Promise.all(uploadPromises);
      const validUrls = uploadedUrls.filter(url => url !== null) as string[];
      
      if (validUrls.length === 0) {
        setError("فشل تحميل الصور. يرجى المحاولة مرة أخرى.");
        toast.error("فشل تحميل الصور");
        setIsUploading(false);
        return;
      }
      
      // Update form state with actual Cloudinary URLs
      const safeValue = Array.isArray(value) ? value : [];
      const newImages = [...safeValue, ...validUrls];
      
      console.log("Direct upload images to Cloudinary:", newImages);
      onChange(newImages);
      
      // Store in localStorage
      try {
        localStorage.setItem('uploadedImages', JSON.stringify(newImages));
      } catch (e) {
        console.warn("Could not store direct upload images in localStorage", e);
      }
      
      toast.success(`تم رفع ${validUrls.length} صورة بنجاح`);
    } catch (error) {
      console.error("Error processing uploads:", error);
      setError("حدث خطأ أثناء معالجة تحميل الصور");
      toast.error("فشل معالجة الصور");
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Format plural/singular text for image count
  const getImageCountText = (count: number) => {
    if (count === 0) return "";
    if (count === 1) return "تم رفع صورة واحدة";
    if (count === 2) return "تم رفع صورتين";
    if (count >= 3 && count <= 10) return `تم رفع ${count} صور`;
    return `تم رفع ${count} صورة`;
  };

  return (
    <div className="image-upload-container">
      {/* Error messages */}
      {error && (
        <div className="p-3 mb-4 text-sm text-red-600 bg-red-100 rounded-md">
          <p className="flex items-center">
            <TbX className="mr-2" size={18} />
            {error}
          </p>
        </div>
      )}
      
      {/* Hidden file input */}
      <input 
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        multiple
        onChange={handleDirectFileUpload}
      />
      
      {/* Cookie warning */}
      {typeof window !== 'undefined' && window.navigator.cookieEnabled === false && (
        <div className="p-3 mb-4 text-sm text-amber-600 bg-amber-100 rounded-md">
          <p>الملاحظة: يُرجى تمكين ملفات تعريف الارتباط للطرف الثالث في متصفحك لاستخدام خدمة Cloudinary</p>
        </div>
      )}
      
      {/* Image Preview Grid */}
      {value.length > 0 && (
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
            {value.map((image, index) => (
              <div key={index} className="relative group overflow-hidden rounded-lg shadow-md transition">
                <div className="aspect-square w-full relative">
                  <Image
                    src={image}
                    alt="صورة العقار"
                    fill
                    className="object-cover hover:scale-105 transition duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-full text-white
                             hover:bg-red-600 transition transform hover:scale-110
                             shadow-lg"
                  aria-label="حذف الصورة"
                >
                  <TbX size={18} />
                </button>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-green-600 font-medium">
            {getImageCountText(value.length)}
          </p>
        </div>
      )}

      {/* Upload Area */}
      <CldUploadWidget
        onUpload={handleUpload}
        uploadPreset={uploadPreset}
        options={{
          maxFiles: 5,
          maxFileSize: 10000000, // 10MB
          resourceType: "image",
          folder: "rental_platform",
          clientAllowedFormats: ["png", "jpeg", "jpg"],
          sources: ["local", "url", "camera"],
          multiple: true
        }}
        onError={handleUploadError}
      >
        {({ open }: { open: () => void }) => (
          <div
            onClick={() => {
              if (disabled || isUploading) return;
              fileInputRef.current?.click();
            }}
            className={`
              relative
              cursor-pointer
              hover:bg-gray-50
              transition-all
              border-dashed 
              border-2 
              p-8
              border-neutral-300
              rounded-lg
              flex
              flex-col
              justify-center
              items-center
              gap-4
              text-neutral-600
              ${disabled || isUploading ? "opacity-70 cursor-not-allowed bg-gray-100" : ""}
              ${isUploading ? "animate-pulse" : ""}
            `}
          >
            {isUploading ? (
              <>
                <div className="w-12 h-12 border-4 border-t-blue-500 border-neutral-200 rounded-full animate-spin"></div>
                <div className="font-semibold text-lg">
                  جاري تحميل الصور...
                </div>
                <div className="text-sm text-center text-neutral-500">
                  يرجى الانتظار، جاري رفع الصور إلى السيرفر
                </div>
              </>
            ) : (
              <>
                <TbPhotoPlus size={50} className="text-neutral-500" />
                <div className="font-semibold text-lg">
                  انقر لإضافة صور
                </div>
                <div className="text-sm text-center text-neutral-500 max-w-xs">
                  {value.length > 0 
                    ? getImageCountText(value.length)
                    : "يمكنك سحب وإفلات الصور هنا أو النقر للاختيار من جهازك"
                  }
                </div>
              </>
            )}
            
            {/* Cloudinary alternate option */}
            {!isUploading && (
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  try {
                    open();
                  } catch (e) {
                    console.error("Failed to open Cloudinary widget:", e);
                    fileInputRef.current?.click();
                  }
                }}
                className="mt-3 flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800 
                           hover:underline transition-colors px-3 py-1.5 bg-blue-50 
                           hover:bg-blue-100 rounded-full"
              >
                <TbCloudUpload size={16} />
                <span>استخدام خدمة Cloudinary للتحميل</span>
              </button>
            )}
          </div>
        )}
      </CldUploadWidget>
      
      {/* Image format requirements */}
      <div className="mt-3 text-xs text-neutral-500">
        <p>* الصيغ المدعومة: JPG، JPEG، PNG | الحد الأقصى: 10 ميجابايت لكل صورة</p>
      </div>
    </div>
  );
};

export default ImageUpload;
