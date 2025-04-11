/**
 * RentModal Component
 *
 * Client component that displays a multi-step modal form for creating new property listings.
 * Guides users through the complete listing creation process with validation at each step.
 *
 * Features:
 * - Multi-step wizard interface
 * - Form validation with react-hook-form
 * - Image upload functionality
 * - Location selection with map integration
 * - Dynamic pricing and details input
 * - Arabic localization for all form fields and labels
 *
 * @component
 * @returns {JSX.Element} Rendered modal form for creating property listings
 */
"use client";

import axios from "axios";
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect, useCallback } from "react";
import Select from 'react-select';

import useRentModal from "@/app/hooks/useRentModal";
import Modal from "./Modal";
import Counter from "../inputs/Counter";

import CategoryInput from "../inputs/CategoryInput";
import { categories } from "../navbar/Categories";
import ImageUpload from "../inputs/ImageUpload";

import Input from "../inputs/Input";
import Heading from "../Heading";
import CountrySelect, { CountrySelectValue } from "@/app/components/inputs/CountrySelect";

/**
 * Enum defining the steps in the listing creation process
 *
 * @enum {number}
 */
enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4,
  PRICE = 5,
}

// Define Payment Options
const paymentMethodOptions = [
  { value: 'كاش', label: 'كاش' },
  { value: 'تحويل مالي', label: 'تحويل مالي' },
  { value: 'دفع عند الوصول', label: 'دفع عند الوصول' },
  { value: 'دفع عربون مقدم', label: 'دفع عربون مقدم' },
  { value: 'دفع مقدم' , label: 'دفع مقدم' },
];

const RentModal = () => {
  const router = useRouter();
  const rentModal = useRentModal();
  const [, setMapCenter] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(STEPS.CATEGORY);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      category: "",
      location: null,
      guestCount: 0,
      roomCount: 0,
      bathroomCount: 0,
      imageSrc: [],
      price: 1000,
      title: "",
      description: "",
      phone: "",
      paymentMethod: "",
    },
  });

  const location = watch("location");
  const category = watch("category");
  const guestCount = watch("guestCount");
  const roomCount = watch("roomCount");
  const bathroomCount = watch("bathroomCount");
  const imageSrc = watch("imageSrc");
  const title = watch("title");
  const description = watch("description");
  const phone = watch("phone");
  const paymentMethodValue = watch("paymentMethod");
  const price = watch("price");

  /**
   * Dynamically imports the Map component with SSR enabled
   */
  const Map = useMemo(
    () =>
      dynamic(() => import("../Map"), {
        ssr: true,
      }),
    [],
  );

  /**
   * Sets form field values with proper validation flags
   *
   * @param {string} id - Form field identifier
   * @param {any} value - New value to set for the field
   */
  const setCustomValue = (id: string, value: any) => {
    // Special handling for location to store coords separately if needed
    if (id === 'location' && value && typeof value === 'object' && value.latlng) {
      // We might want to store a simplified location object
      const simplifiedLocation: CountrySelectValue = {
        flag: value.flag,
        label: value.label,
        latlng: value.latlng,
        region: value.region,
        value: value.value
      };
      setValue(id, simplifiedLocation, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    } else {
       setValue(id, value, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }
  };

  /**
   * Navigates to the previous step in the form
   */
  const onBack = () => {
    setStep((value) => value - 1);
  };

  /**
   * Navigates to the next step in the form
   */
  const onNext = () => {
    setStep((value) => value + 1);
  };

  /**
   * Validates the current step before allowing progression
   * Shows toast errors for validation failures
   *
   * @returns {boolean} Whether the current step is valid
   */
  const isStepValid = () => {
    switch (step) {
      case STEPS.CATEGORY:
        if (!category) {
          toast.error("يرجى اختيار الفئة");
          return false;
        }
        return true;
      case STEPS.LOCATION:
        if (!location || !location.value || !location.label) {
          toast.error("يرجى تحديد المنطقة والموقع");
          return false;
        }
        return true;
      case STEPS.INFO:
        if (guestCount <= 0 && roomCount <= 0 && bathroomCount <= 0) {
          toast.error("يرجى تحديد عدد الضيوف أو الغرف أو الحمامات (واحد على الأقل)");
          return false;
        }
        return true;
      case STEPS.IMAGES:
        console.log("Validating images:", imageSrc);
        
        // Filter out blob URLs since they're temporary
        const validImages = Array.isArray(imageSrc) 
          ? imageSrc.filter(url => typeof url === 'string' && !url.startsWith('blob:') && url.includes('cloudinary.com'))
          : [];
        
        if (validImages.length > 0) {
          if (validImages.length !== imageSrc?.length) {
            setCustomValue("imageSrc", validImages);
          }
          return true;
        }
        
        try {
          const storedImages = JSON.parse(localStorage.getItem('uploadedImages') || '[]');
          const validStoredImages = Array.isArray(storedImages) 
            ? storedImages.filter(url => typeof url === 'string' && !url.startsWith('blob:') && url.includes('cloudinary.com'))
            : [];
            
          if (validStoredImages.length > 0) {
            setCustomValue("imageSrc", validStoredImages);
            return true;
          }
        } catch (e) {
          console.error("Failed to retrieve images from localStorage:", e);
        }
        
        toast.error("يرجى تحميل صور توضيحية صالحة (صورة واحدة على الأقل)");
        return false;
      case STEPS.DESCRIPTION:
        if (!title) {
          toast.error("يرجى إدخال عنوان للعقار");
          return false;
        }
        if (!description) {
          toast.error("يرجى إدخال وصف للعقار");
          return false;
        }
        if (!phone) {
          toast.error("يرجى إدخال رقم الهاتف");
          return false;
        }
        if (!paymentMethodValue) {
          toast.error("يرجى اختيار طريقة الدفع المفضلة");
          return false;
        }
        return true;
      case STEPS.PRICE:
        const priceValue = parseFloat(price);
        if (isNaN(priceValue) || priceValue <= 0) {
            toast.error("يرجى إدخال سعر صحيح أكبر من صفر");
            return false;
        }
        if (errors.price) {
            return false;
        }
        return true;
      default:
        return false;
    }
  };

  /**
   * Callback to handle location selection from the map
   */
  const handleMapLocationSelect = useCallback((coords: L.LatLngTuple) => {
    console.log("Map selected coords:", coords);

    const currentLocation = watch("location");
    
    // Create a *new* location object prioritizing map coordinates
    const updatedLocation: CountrySelectValue = {
      // Keep flag/region if they exist from CountrySelect
      flag: currentLocation?.flag,
      region: currentLocation?.region,
      // Update latlng with the precise coordinates from the map
      latlng: coords,
      // Update label and value to reflect map selection
      label: `موقع محدد (${coords[0].toFixed(4)}, ${coords[1].toFixed(4)})`, // Indicate map selection
      value: `${coords[0]},${coords[1]}`, // Use coordinates as the primary value
    };

    setCustomValue("location", updatedLocation);
    toast.success("تم تحديث الموقع من الخريطة");

  }, [setValue, watch, setCustomValue]);

  /**
   * Handles form submission
   * Validates current step and either progresses to next step or submits data
   *
   * @param {FieldValues} data - Form data values
   */
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (!isStepValid()) {
      return;
    }
    if (step !== STEPS.PRICE) {
      return onNext();
    }

    setIsLoading(true);

    // Ensure we only use valid image URLs (not blob URLs)
    const finalImageSrc = Array.isArray(data.imageSrc)
      ? data.imageSrc.filter((url: string) => !url.startsWith('blob:'))
      : [];

    // Check if we have enough images
    if (finalImageSrc.length === 0) {
      toast.error("حدث خطأ في الصور، يرجى الرجوع وإعادة التحميل");
      setIsLoading(false);
      return;
    }

    // Prepare final payload - locationValue will now use the coords if map was used
    const payload = {
      ...data,
      locationValue: data.location?.value, // This now correctly reflects map coords if map was used
      // Ensure latlng is also sent explicitly if needed by backend
      latitude: data.location?.latlng?.[0],
      longitude: data.location?.latlng?.[1],
      description: data.description, 
      imageSrc: finalImageSrc,
      price: parseInt(data.price, 10),
      phoneNumber: data.phone,
      preferredPayment: data.paymentMethod,
    };

    // Submit listing data
    axios
      .post("/api/listings", payload)
      .then(() => {
        toast.success("تم إنشاء العقار بنجاح");
        router.refresh();
        reset();
        setStep(STEPS.CATEGORY);
        // Clear stored images on successful submission
        try {
          localStorage.removeItem('uploadedImages');
          console.log("Cleared stored images from localStorage.");
        } catch (e) {
          console.error("Failed to clear stored images from localStorage:", e);
        }
        rentModal.onClose();
      })
      .catch(() => {
        toast.error("حدث خطأ ما");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  /**
   * Determines the label for the primary action button based on current step
   */
  const actionLabel = useMemo(() => {
    if (step === STEPS.PRICE) {
      return "انشأ";
    }
    return "التالي";
  }, [step]);

  /**
   * Determines the label for the secondary action button based on current step
   */
  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY) {
      return undefined;
    }
    return "الخلف";
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading title="أي مما يلي يصف مكانك بأفضل شكل؟" subtitle="اختر فئة" />
      <div
        className="
        grid
        grid-cols-1
        md:grid-cols-2
        gap-3
        max-h-[50vh]
        overflow-y-auto
      "
      >
        {categories.map((item) => (
          <div key={item.label} className="col-span-1">
            <CategoryInput
              onClick={(category) => setCustomValue("category", category)}
              selected={category === item.label}
              label={item.label}
              icon={item.icon}
            />
          </div>
        ))}
      </div>
    </div>
  );

  /**
   * Updates map center when location changes
   */
  useEffect(() => {
    if (location && location.latlng) {
      setMapCenter(location.latlng);
    }
  }, [location]);

  // Initialize modal form with images from localStorage if available
  useEffect(() => {
    if (rentModal.isOpen && (!imageSrc || imageSrc.length === 0)) {
      try {
        const storedImages = JSON.parse(localStorage.getItem('uploadedImages') || '[]');
        if (Array.isArray(storedImages) && storedImages.length > 0) {
          console.log("Found stored images in localStorage, restoring:", storedImages);
          setCustomValue("imageSrc", storedImages);
        }
      } catch (e) {
        console.error("Failed to retrieve images from localStorage on modal open:", e);
      }
    }
  }, [rentModal.isOpen, imageSrc, setCustomValue]);

  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="أين يقع مكانك؟"
          subtitle="اختر المنطقة ثم حدد الموقع على الخريطة أو استخدم موقعك الحالي"
        />
        <CountrySelect
          value={location}
          onChange={(value) => setCustomValue("location", value)}
        />
        <div className="h-[45vh] rounded-lg overflow-hidden border border-neutral-200 shadow-sm">
          <Map 
            center={location?.latlng} 
            onLocationSelect={handleMapLocationSelect}
          />
        </div>
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8 text-center">
        <Heading
          title="شارك ببعض الأساسيات حول مكانك"
          subtitle="ما هي المرافق التي لديك؟"
        />
        <Counter
          onChange={(value) => setCustomValue("guestCount", value)}
          value={guestCount}
          title="ضيوف"
          subtitle="كم عدد الضيوف المسموح لهم؟"
        />
        <hr />
        <Counter
          onChange={(value) => setCustomValue("roomCount", value)}
          value={roomCount}
          title="غرف"
          subtitle="كم عدد الغرف التي لديك؟"
        />
        <hr />
        <Counter
          onChange={(value) => setCustomValue("bathroomCount", value)}
          value={bathroomCount}
          title="الحمامات"
          subtitle="كم عدد الحمامات لديك؟"
        />
      </div>
    );
  }

  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="أضف صوراً لعقارك"
          subtitle="أظهر للضيوف جمال المكان وميزاته!"
        />
        
        <div className="bg-white rounded-lg p-1">
          <ImageUpload
            onChange={(value) => {
              // Only log and update if we have actual images
              if (Array.isArray(value) && value.length > 0) {
                console.log("ImageUpload onChange called with:", value);
                setCustomValue("imageSrc", value);
                
                // Store in localStorage as backup
                try {
                  localStorage.setItem('uploadedImages', JSON.stringify(value));
                } catch (e) {
                  console.error("Failed to store images in localStorage:", e);
                }
              }
            }}
            value={imageSrc || []}
          />
        </div>

        {/* Image upload instructions */}
        <div className="bg-blue-50 p-4 rounded-md">
          <h3 className="text-sm font-medium text-blue-800 mb-2">نصائح لصور أفضل:</h3>
          <ul className="text-xs text-blue-700 list-disc list-inside space-y-1">
            <li>أضف صوراً واضحة للغرف والمرافق الرئيسية</li>
            <li>التقط الصور في وضح النهار للحصول على إضاءة أفضل</li>
            <li>أظهر الميزات الفريدة للمكان (مثل الإطلالة أو المسبح)</li>
            <li>يُفضّل إضافة 5-10 صور على الأقل</li>
          </ul>
        </div>
      </div>
    );
  }

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="كيف تصف مكانك؟"
          subtitle="اخبر الضيوف عن مكانك وما يميزه"
        />
        <Input
          id="title"
          label="اختر عنوان لمكانك "
          disabled={isLoading}
          register={register}
          errors={errors}
          textDirection="rtl"
          required
        />
        <hr />
        <Input
          id="description"
          label="اوصف مكانك بشكل مختصر"
          disabled={isLoading}
          register={register}
          errors={errors}
          textDirection="rtl"
          required
        />
        <hr />
        <Input
          id="phone"
          label="رقم الهاتف للتواصل"
          type="tel"
          disabled={isLoading}
          register={register}
          errors={errors}
          textDirection="rtl"
          required
        />
        <hr />
        <div>
          <label className="block text-sm font-medium text-neutral-700 text-right mb-1">
            طريقة الدفع المفضلة
          </label>
          <Select
            placeholder="اختر طريقة الدفع..." 
            isClearable
            options={paymentMethodOptions}
            value={paymentMethodOptions.find(option => option.value === paymentMethodValue) || null}
            onChange={(option) => setCustomValue('paymentMethod', option ? option.value : "")}
            formatOptionLabel={(option: any) => (
              <div className="flex flex-row items-center gap-3 text-right">
                <div>{option.label}</div>
              </div>
            )}
            theme={(theme) => ({
              ...theme,
              borderRadius: 6,
              colors: {
                ...theme.colors,
                primary: 'black',
                primary25: '#ffe4e6',
              },
            })}
            styles={{
              input: (provided) => ({ ...provided, direction: 'rtl' }),
              option: (provided) => ({ ...provided, direction: 'rtl', textAlign: 'right' }),
              singleValue: (provided) => ({ ...provided, direction: 'rtl', textAlign: 'right' }),
              placeholder: (provided) => ({ ...provided, direction: 'rtl', textAlign: 'right' }),
            }}
            isDisabled={isLoading}
            instanceId="payment-method-select"
            required
          />
        </div>
      </div>
    );
  }

  if (step === STEPS.PRICE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="الآن ، حدد السعر الخاص بك"
          subtitle="حدد السعر في اليوم الواحد"
        />
        <Input
          id="price"
          label="السعر بالريال اليمني"
          type="number"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }

  return (
    <Modal
      disabled={isLoading}
      isOpen={rentModal.isOpen}
      title="أضف عقار"
      actionLabel={actionLabel}
      onSubmit={handleSubmit(onSubmit)}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
      onClose={rentModal.onClose}
      body={bodyContent}
    />
  );
};

export default RentModal;
