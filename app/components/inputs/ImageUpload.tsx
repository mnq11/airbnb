import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useCallback, useState } from "react";
import { TbPhotoPlus } from "react-icons/tb";

declare global {
  var cloudinary: any;
}

const uploadPreset = "ufsgae4f";

interface ImageUploadProps {
    onChange: (value: string[]) => void;
    value: string[];
}


const ImageUpload: React.FC<ImageUploadProps> = ({ onChange, value }) => {
    const [images, setImages] = useState(value || []);

    const handleUpload = useCallback((result: any) => {
        console.log("Upload result: ", result); // Add this line
        if (result.event === "success") {
            const newImages = [...images, result.info.secure_url];
            setImages(newImages);
            console.log("Uploading new images: ", newImages);
            onChange(newImages);
        }
    }, [onChange, images]);






    return (
      <div>
          <CldUploadWidget
              onUpload={handleUpload}
              uploadPreset={uploadPreset}
              options={{
                  maxFiles: 5, // Adjust this number based on how many images you want to allow
              }}
          >
              {(uploadWidgetProps) => (
                  <button onClick={() => uploadWidgetProps?.open?.()} className="...">
                      <TbPhotoPlus size={50} />
                      <div className="font-semibold text-lg">Click to upload</div>
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
                  </div>
              ))}
        </div>
      </div>
  );
};

export default ImageUpload;
