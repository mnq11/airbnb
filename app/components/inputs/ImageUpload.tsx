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
        if (result.event === "success") {
            const newImages = [...images, result.info.secure_url];
            setImages(newImages);
            onChange(newImages);
        }
    }, [onChange, images]);

    const handleDelete = (indexToDelete: number) => {
        const updatedImages = images.filter((_img, index) => index !== indexToDelete);
        setImages(updatedImages);
        onChange(updatedImages);
    }

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
                    <button
                        onClick={() => uploadWidgetProps?.open?.()}
                        className="..."
                    >
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
