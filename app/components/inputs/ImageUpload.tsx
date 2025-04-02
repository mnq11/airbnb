import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import { TbPhotoPlus } from "react-icons/tb";

declare global {
  var cloudinary: any;
}

const uploadPreset = "ufsgae4f";

/**
 * Interface for ImageUpload component props
 * 
 * @interface ImageUploadProps
 * @property {(value: string[]) => void} onChange - Callback function when images are added or removed
 * @property {string[]} value - Array of image URLs that have been uploaded
 */
interface ImageUploadProps {
  onChange: (value: string[]) => void;
  value: string[];
}

/**
 * ImageUpload Component
 * 
 * A component that allows users to upload and manage images using Cloudinary.
 * This component is used in property listing forms to add property photos.
 * 
 * Features:
 * - Integration with Cloudinary widget for image uploads
 * - Preview of uploaded images with delete capability
 * - Multiple image upload support
 * - State management for tracking uploaded images
 * - Arabic localization for button text
 * 
 * @component
 * @param {ImageUploadProps} props - Component props
 * @returns {JSX.Element} Rendered image upload component with previews
 */
const ImageUpload: React.FC<ImageUploadProps> = ({ onChange, value }) => {
  const [images, setImages] = useState(value || []);

  /**
   * Handles successful image upload from Cloudinary
   * Adds the new image URL to the existing images array
   */
  const handleUpload = useCallback(
    (result: any) => {
      if (result.event === "success") {
        const newImages = [...images, result.info.secure_url];
        setImages(newImages);
        onChange(newImages);
      }
    },
    [onChange, images],
  );

  /**
   * Removes an image at the specified index
   * Updates both local state and parent component
   */
  const handleDelete = (indexToDelete: number) => {
    const updatedImages = images.filter(
      (_img, index) => index !== indexToDelete,
    );
    setImages(updatedImages);
    onChange(updatedImages);
  };

  return (
    <div>
      <CldUploadWidget
        onUpload={handleUpload}
        uploadPreset={uploadPreset}
        options={{
          maxFiles: 10, // Adjust this number based on how many images you want to allow
        }}
      >
        {(uploadWidgetProps) => (
          <button onClick={() => uploadWidgetProps?.open?.()} className="...">
            <TbPhotoPlus size={50} />
            <div className="font-semibold text-lg">التالي</div>
          </button>
        )}
      </CldUploadWidget>

      <div className="image-thumbnails">
        {images.map((img, index) => (
          <div key={index} className="...">
            <Image
              width={100}
              height={100}
              src={img}
              alt={`Uploaded image ${index + 1}`}
            />
            <button
              className="delete-button backdrop-blur-0 hover:bg-pink-900" // Add your own CSS styles for the delete button
              onClick={() => handleDelete(index)}
            >
              حذف
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;
