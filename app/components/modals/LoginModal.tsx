"use client";

import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { AiFillGithub } from "react-icons/ai";
import { useRouter } from "next/navigation";

import useRegisterModal from "@/app/hooks/useRegisterModal";
import useLoginModal from "@/app/hooks/useLoginModal";

import Modal from "./Modal";
import Input from "../inputs/Input";
import Heading from "../Heading";
import Button from "../Button";

/**
 * LoginModal Component
 * 
 * A modal dialog component for user authentication that provides:
 * - Email and password login functionality
 * - Google OAuth authentication
 * - Toggle to registration modal for new users
 * - Form validation with error handling
 * - Loading state management during authentication
 * - Success/error notifications
 * 
 * This component uses:
 * - NextAuth.js for authentication
 * - react-hook-form for form handling and validation
 * - Modal component for consistent UI
 * - Custom hooks for state management (useLoginModal, useRegisterModal)
 * 
 * The component supports RTL layout and Arabic text for localization.
 * 
 * @component
 * @returns {JSX.Element} Rendered login modal dialog
 */
const LoginModal = () => {
  const router = useRouter();
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize react-hook-form with default values
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  /**
   * Handle form submission for email/password login
   * 
   * Uses NextAuth.js signIn method with credentials provider
   * Shows success/error notifications and navigates accordingly
   * 
   * @param {FieldValues} data - Form data containing email and password
   */
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    signIn("credentials", {
      ...data,
      redirect: false,
    }).then((callback) => {
      setIsLoading(false);

      if (callback?.ok) {
        toast.success("تسجيل الدخول");
        router.refresh();
        loginModal.onClose();
      }

      if (callback?.error) {
        toast.error(callback.error);
      }
    });
  };

  /**
   * Toggle between login and registration modals
   * 
   * Closes the login modal and opens the registration modal
   * Used for the "Create account" link in the footer
   */
  const onToggle = useCallback(() => {
    loginModal.onClose();
    registerModal.onOpen();
  }, [loginModal, registerModal]);

  // Modal body content with form fields
  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="مرحبا بك " subtitle="سجل دخولك لحسابك" />
      <Input
        id="email"
        label="الايميل"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="password"
        label="كلمة المرور"
        type="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  );

  // Modal footer with OAuth providers and registration link
  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      {/* Google OAuth login button */}
      <Button
        outline
        label="تابع عبر جوجل"
        icon={FcGoogle}
        onClick={() => signIn("google")}
      />
      {/*<Button */}
      {/*  outline */}
      {/*  label="Continue with Github"*/}
      {/*  icon={AiFillGithub}*/}
      {/*  onClick={() => signIn('github')}*/}
      {/*/>*/}
      
      {/* Registration link section */}
      <div
        className="
      text-neutral-500 text-center mt-4 font-light"
      >
        <p>
          اذا لم تكن لديك حساب
          <span
            onClick={onToggle}
            className="
              text-neutral-800
              cursor-pointer 
              hover:underline
            "
          >
            {" "}
            أنشئ حساب
          </span>
        </p>
      </div>
    </div>
  );

  // Render Modal component with login content
  return (
    <Modal
      disabled={isLoading}
      isOpen={loginModal.isOpen}
      title="دخول"
      actionLabel="متابعة"
      onClose={loginModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default LoginModal;
