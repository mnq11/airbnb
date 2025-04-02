"use client";

import axios from "axios";
import { AiFillGithub } from "react-icons/ai";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import useLoginModal from "@/app/hooks/useLoginModal";
import useRegisterModal from "@/app/hooks/useRegisterModal";

import Modal from "./Modal";
import Input from "../inputs/Input";
import Heading from "../Heading";
import Button from "../Button";

/**
 * RegisterModal Component
 * 
 * A modal dialog component for user registration that provides:
 * - Email, name, and password registration form
 * - Google OAuth sign-up option
 * - Form validation with error handling
 * - Toggle to login modal for existing users
 * - Loading state management during registration
 * - Success/error notifications
 * 
 * This component uses:
 * - axios for API requests to the registration endpoint
 * - react-hook-form for form handling and validation
 * - NextAuth.js for OAuth authentication
 * - Modal component for consistent UI
 * - Custom hooks for state management (useRegisterModal, useLoginModal)
 * 
 * The component supports RTL layout and Arabic text for localization.
 * After successful registration, it automatically redirects to the login modal.
 * 
 * @component
 * @returns {JSX.Element} Rendered registration modal dialog
 */
const RegisterModal = () => {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize react-hook-form with default values
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  /**
   * Handle form submission for user registration
   * 
   * Makes an axios POST request to the /api/register endpoint
   * Shows success/error notifications and navigates accordingly
   * On success, closes registration modal and opens login modal
   * 
   * @param {FieldValues} data - Form data containing name, email and password
   */
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    axios
      .post("/api/register", data)
      .then(() => {
        toast.success("مسجل");
        registerModal.onClose();
        loginModal.onOpen();
      })
      .catch((error) => {
        if (axios.isAxiosError(error) && error.response) {
          // Handle specific error responses from the server
          const errorMessage = error.response.data || "حدث خطأ أثناء التسجيل";
          toast.error(errorMessage);
        } else {
          // Handle unexpected errors
          console.error("[REGISTER_ERROR]", error);
          toast.error("حدث خطأ أثناء التسجيل");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  /**
   * Toggle between registration and login modals
   * 
   * Closes the registration modal and opens the login modal
   * Used for the "Login" link in the footer
   */
  const onToggle = useCallback(() => {
    registerModal.onClose();
    loginModal.onOpen();
  }, [registerModal, loginModal]);

  // Modal body content with registration form fields
  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="مرحبا في رحلات" subtitle="أنشاء حساب جديد" />
      {/* Email input field */}
      <Input
        id="email"
        label="الريد الإلكتروني"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      {/* Name input field */}
      <Input
        id="name"
        label="الاسم"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      {/* Password input field */}
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

  // Modal footer with OAuth providers and login link
  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      {/* Google OAuth registration button */}
      <Button
        outline
        label="سجل بواسطة جوجل"
        icon={FcGoogle}
        onClick={() => signIn("google")}
      />
      {/*<Button */}
      {/*  outline */}
      {/*  label="Continue with Github"*/}
      {/*  icon={AiFillGithub}*/}
      {/*  onClick={() => signIn('github')}*/}
      {/*/>*/}
      
      {/* Login link section */}
      <div
        className="
          text-neutral-500 
          text-center 
          mt-4 
          font-light
        "
      >
        <p>
          هل لديك حساب؟
          <span
            onClick={onToggle}
            className="
              text-neutral-800
              cursor-pointer 
              hover:underline
            "
          >
            دخول
          </span>
        </p>
      </div>
    </div>
  );

  // Render Modal component with registration content
  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="تسجيل"
      actionLabel="متابعة"
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default RegisterModal;
