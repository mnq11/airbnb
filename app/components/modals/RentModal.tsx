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
import { useMemo, useState, useEffect } from "react";

import useRentModal from "@/app/hooks/useRentModal";
import Modal from "./Modal";
import Counter from "../inputs/Counter";

import CategoryInput from "../inputs/CategoryInput";
import { categories } from "../navbar/Categories";
import ImageUpload from "../inputs/ImageUpload";

import Input from "../inputs/Input";
import Heading from "../Heading";
import CountrySelect from "@/app/components/inputs/CountrySelect";

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
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
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
        return !!category;
      case STEPS.LOCATION:
        if (!location || location.label === "" || location.value === "") {
          toast.error("يرجى تحديد المنطقة والموقع");
          return false;
        }
        return !!location;
      case STEPS.INFO:
        if (guestCount + roomCount + bathroomCount <= 0) {
          toast.error("يرجى تحديد عدد الضيوف والغرف والحمامات او احداها");
          return false;
        }
        return !!STEPS.INFO;
      case STEPS.IMAGES:
        if (imageSrc.length === 0) {
          toast.error("يرجى تحميل صور توضيحية");
          return false;
        }
        return !!imageSrc;
      case STEPS.DESCRIPTION:
        return !!STEPS.DESCRIPTION;
      case STEPS.PRICE:
        return !errors.price;
      default:
        return false;
    }
  };

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

    const updatedDescription = `${data.description}\n\nرقم الهاتف: ${data.phone}\nطريقة الدفع المفضلة: ${data.paymentMethod}`;

    const payload = {
      ...data,
      description: updatedDescription,
      imageSrc: data.imageSrc, // Ensure imageSrc is an array of string URLs
      location: data.location, // Ensure location is included with value
      price: parseInt(data.price, 10), // Convert price to integer
    };

    axios
      .post("/api/listings", payload)
      .then(() => {
        toast.success("تم إنشاء القائمة");
        router.refresh();
        reset();
        setStep(STEPS.CATEGORY);
        rentModal.onClose();
      })
      .catch(() => {
        toast.error("هناك خطأ ما");
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

  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading title="أين يقع مكانك" subtitle="ساعد الضيوف في العثور عليك!" />
        <CountrySelect
          value={location}
          onChange={(value) => setCustomValue("location", value)}
        />
        <Map center={location?.latlng} />
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
          title="أضف صورة لمكانك"
          subtitle="أظهر للضيوف كيف يبدو مكانك!"
        />
        <ImageUpload
          onChange={(value) => setCustomValue("imageSrc", value)}
          value={imageSrc}
        />
      </div>
    );
  }

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="كيف تصف مكانك؟"
          subtitle="اخبر الضيوف عن مكانك و طريقة التواصل معك و طريقة الدفع المفضلة"
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
          label="رقم الهاتف"
          type="tel"
          disabled={isLoading}
          register={register}
          errors={errors}
          textDirection="rtl"
          required
        />
        <hr />
        <Input
          id="paymentMethod"
          label="طريقة الدفع المفضلة"
          disabled={isLoading}
          register={register}
          errors={errors}
          textDirection="rtl"
          required
        />
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
