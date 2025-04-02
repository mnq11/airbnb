"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import { TbPhotoPlus } from "react-icons/tb";
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
      
      // Ensure we have a valid secure_url from the upload result
      if (result?.info?.secure_url) {
        onChange([...value, result.info.secure_url]);
        toast.success("تم رفع الصورة بنجاح");
      } else {
        setError("فشل تحميل الصورة. يرجى المحاولة مرة أخرى.");
        toast.error("فشل تحميل الصورة");
        console.error("Upload result missing secure_url:", result);
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
      toast.success("تم حذف الصورة");
    },
    [onChange, value]
  );

  return (
    <div>
      <div className="mb-4">
        {error && (
          <div className="p-2 mb-2 text-sm text-red-600 bg-red-100 rounded-md">
            {error}
          </div>
        )}
        
        {/* Image Grid */}
        {value.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-4">
            {value.map((image, index) => (
              <div key={index} className="relative">
                <Image
                  src={image}
                  alt="Property image"
                  className="object-cover rounded-md"
                  width={200}
                  height={200}
                  style={{ width: '100%', height: '150px' }}
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition"
                  aria-label="Remove image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

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
        }}
        onError={handleUploadError}
      >
        {({ open }: { open: () => void }) => {
          return (
            <div
              onClick={() => !disabled && !isUploading && open()}
              className={`
                relative
                cursor-pointer
                hover:opacity-70
                transition
                border-dashed 
                border-2 
                p-6
                border-neutral-300
                flex
                flex-col
                justify-center
                items-center
                gap-4
                text-neutral-600
                ${disabled || isUploading ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              <TbPhotoPlus size={50} />
              <div className="font-semibold text-lg">
                {isUploading ? "جاري التحميل..." : "انقر لإضافة صور"}
              </div>
              <div className="text-sm text-center text-neutral-500">
                {value.length > 0 ? `تم رفع ${value.length} صور` : "اسحب وأفلت الصور هنا أو انقر للاختيار"}
              </div>
            </div>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
