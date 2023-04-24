'use client';

import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  FieldValues, 
  SubmitHandler, 
  useForm
} from 'react-hook-form';
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation';
import { useMemo, useState } from "react";

import useRentModal from '@/app/hooks/useRentModal';

import Modal from "./Modal";
import Counter from "../inputs/Counter";
import CategoryInput from '../inputs/CategoryInput';
import CountrySelect from "../inputs/CountrySelect";
import { categories } from '../navbar/Categories';
import ImageUpload from '../inputs/ImageUpload';
import Input from '../inputs/Input';
import Heading from '../Heading';

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

  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(STEPS.CATEGORY);

  const { 
    register, 
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors,
    },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      category: '',
      location: null,
      guestCount: 1,
      roomCount: 1,
      bathroomCount: 1,
      imageSrc: '',
      price: 1,
      title: '',
      description: '',
    }
  });

  const location = watch('location');
  const category = watch('category');
  const guestCount = watch('guestCount');
  const roomCount = watch('roomCount');
  const bathroomCount = watch('bathroomCount');
  const imageSrc = watch('imageSrc');

  const Map = useMemo(() => dynamic(() => import('../Map'), { 
    ssr: false 
  }), [location]);


  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    })
  }

  const onBack = () => {
    setStep((value) => value - 1);
  }

  const onNext = () => {
    setStep((value) => value + 1);
  }

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        if (step !== STEPS.PRICE) {
            return onNext();
        }

        setIsLoading(true);

        const payload = {
            ...data,
            images: imageSrc,
        };

        axios.post('/api/listings', payload)
            .then(() => {
                toast.success('تم إنشاء القائمة');
                router.refresh();
                reset();
                setStep(STEPS.CATEGORY)
                rentModal.onClose();

            })
            .catch(() => {
                toast.error('هناك خطأ ما');


            })
            .finally(() => {
                setIsLoading(false);
            })
    }


    const actionLabel = useMemo(() => {
    if (step === STEPS.PRICE) {
      return 'انشأ'
    }

    return 'التالي'
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY) {
      return undefined
    }

    return 'الخلف'
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="أي مما يلي يصف مكانك بأفضل شكل؟"
        subtitle="اختر فئة"
      />
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
              onClick={(category) => 
                setCustomValue('category', category)}
              selected={category === item.label}
              label={item.label}
              icon={item.icon}
            />
          </div>
        ))}
      </div>
    </div>
  )

  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="أين يقع مكانك"
          subtitle="ساعد الضيوف في العثور عليك!"
        />
        <CountrySelect 
          value={location} 
          onChange={(value) => setCustomValue('location', value)} 
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
          onChange={(value) => setCustomValue('guestCount', value)}
          value={guestCount}
          title="ضيوف"
          subtitle="كم عدد الضيوف المسموح لهم؟"
        />
        <hr />
        <Counter 
          onChange={(value) => setCustomValue('roomCount', value)}
          value={roomCount}
          title="غرف"
          subtitle="كم عدد الغرف التي لديك؟"
        />
        <hr />
        <Counter 
          onChange={(value) => setCustomValue('bathroomCount', value)}
          value={bathroomCount}
          title="الحمامات"
          subtitle="كم عدد الحمامات لديك؟"
        />
      </div>
    )
  }

  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="أضف صورة لمكانك"
          subtitle="أظهر للضيوف كيف يبدو مكانك!"
        />
        <ImageUpload
          onChange={(value) => setCustomValue('imageSrc', value)}
          value={imageSrc}
        />
      </div>
    )
  }

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="كيف تصف مكانك؟"
          subtitle="اختصار الوصف في كلمات قليلة و أضف رقم هاتفك"
        />
        <Input
          id="title"
          label="العنوان"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <Input
          id="description"
          label="الوصف"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    )
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
          // formatPrice
          type="number" 
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    )
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
}

export default RentModal;
