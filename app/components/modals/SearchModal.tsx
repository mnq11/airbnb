"use client";
import Loader from "@/app/components/Loader";

import qs from "query-string";
import dynamic from "next/dynamic";
import { useCallback, useMemo, useState, useEffect } from "react";
import { Range } from "react-date-range";
import { formatISO } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";

import useSearchModal from "@/app/hooks/useSearchModal";

import Modal from "./Modal";
import Calendar from "../inputs/Calendar";
import Counter from "../inputs/Counter";
import CountrySelect, {
  RegionSelectValue as CountrySelectValue,
} from "../inputs/CountrySelect";

import Heading from "../Heading";
import { LatLngTuple } from "leaflet";

enum STEPS {
  LOCATION = 0,
  DATE = 1,
  INFO = 2,
}

const SearchModal = () => {
  const router = useRouter();
  const searchModal = useSearchModal();
  const params = useSearchParams();

  const [step, setStep] = useState(STEPS.LOCATION);

  const [location, setLocation] = useState<CountrySelectValue>();
  const [guestCount, setGuestCount] = useState(1);
  const [roomCount, setRoomCount] = useState(1);
  const [bathroomCount, setBathroomCount] = useState(1);
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  // Move the useState hook for isLoading inside the SearchModal component
  const [isLoading, setIsLoading] = useState(false);
  const loader = isLoading ? <Loader /> : null;

  useEffect(() => {
    if (location?.latlng) {
      // Add any code necessary to update the map's center
    }
  }, [location]);

  const Map = useMemo(
    () =>
      dynamic(() => import("../Map"), {
        ssr: false,
      }),
    [],
  );

  const onBack = useCallback(() => {
    setStep((value) => value - 1);
  }, []);

  const onNext = useCallback(() => {
    setStep((value) => value + 1);
  }, []);

  const onSubmit = useCallback(async () => {
    if (step !== STEPS.INFO) {
      return onNext();
    }

    setIsLoading(true);

    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    const updatedQuery: any = {
      ...currentQuery,
      locationValue: location?.value,
      guestCount,
      roomCount,
      bathroomCount,
    };

    if (dateRange.startDate) {
      updatedQuery.startDate = formatISO(dateRange.startDate);
    }

    if (dateRange.endDate) {
      updatedQuery.endDate = formatISO(dateRange.endDate);
    }

    const url = qs.stringifyUrl(
      {
        url: "/",
        query: updatedQuery,
      },
      { skipNull: true },
    );

    setStep(STEPS.LOCATION);
    searchModal.onClose();
    await router.push(url);
    setIsLoading(false);
  }, [
    step,
    searchModal,
    location,
    router,
    guestCount,
    roomCount,
    dateRange,
    onNext,
    bathroomCount,
    params,
  ]);

  const actionLabel = useMemo(() => {
    if (step === STEPS.INFO) {
      return "بحث";
    }

    return "التالي";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.LOCATION) {
      return undefined;
    }

    return "خلف";
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8" dir="rtl">
      {" "}
      {/* Add dir="rtl" here */}
      <Heading
        title="إلى أين تريد الذهاب؟"
        subtitle="اعثر على الموقع المثالي!"
      />
      <CountrySelect
        value={location}
        onChange={(value) => setLocation(value as CountrySelectValue)}
      />
      <hr />
      <Map center={location?.latlng as LatLngTuple | undefined} />
    </div>
  );

  if (step === STEPS.DATE) {
    bodyContent = (
      <div className="flex flex-col gap-8" dir="rtl">
        {" "}
        {/* Add dir="rtl" here */}
        <Heading title="متى تخطط للذهاب؟" subtitle="تأكد من ان المكان شاغر" />
        <Calendar
          onChange={(value) => setDateRange(value.selection)}
          value={dateRange}
        />
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div style={{ position: "relative" }}>
        {loader}
        <div className="flex flex-col gap-8" dir="rtl">
          {" "}
          {/* Add dir="rtl" here */}
          <Heading title="معلومات اكثر" subtitle="اعثر على مكانك المثالي" />
          <Counter
            onChange={(value) => setGuestCount(value)}
            value={guestCount}
            title="ضيوف"
            subtitle="كم عدد الضيوف القادمين؟"
          />
          <hr />
          <Counter
            onChange={(value) => setRoomCount(value)}
            value={roomCount}
            title="غرف"
            subtitle="كم عدد الغرف التي تحتاجها؟"
          />
          <hr />
          <Counter
            onChange={(value) => {
              setBathroomCount(value);
            }}
            value={bathroomCount}
            title="الحمامات"
            subtitle="كم عدد الحمامات التي تحتاجها؟"
          />
        </div>
      </div>
    );
  }

  return (
    <Modal
      isOpen={searchModal.isOpen}
      title="فلتر"
      actionLabel={actionLabel}
      onSubmit={onSubmit}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
      onClose={searchModal.onClose}
      body={bodyContent}
    />
  );
};

export default SearchModal;
