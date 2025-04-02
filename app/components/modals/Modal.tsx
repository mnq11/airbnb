"use client";

import { useCallback, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";

import Button from "../Button";

/**
 * Interface for Modal component props
 * 
 * @interface ModalProps
 * @property {boolean} [isOpen] - Controls whether the modal is visible
 * @property {() => void} onClose - Function to call when modal is closed
 * @property {() => void} onSubmit - Function to call when primary action button is clicked
 * @property {string} [title] - Modal title displayed in the header
 * @property {React.ReactElement} [body] - Content to render in the modal body
 * @property {React.ReactElement} [footer] - Additional content to render in the footer (below buttons)
 * @property {string} actionLabel - Label for the primary action button
 * @property {boolean} [disabled] - Disables all actions and buttons when true
 * @property {() => void} [secondaryAction] - Function to call when secondary action button is clicked
 * @property {string} [secondaryActionLabel] - Label for the secondary action button (required if secondaryAction is provided)
 */
interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title?: string;
  body?: React.ReactElement;
  footer?: React.ReactElement;
  actionLabel: string;
  disabled?: boolean;
  secondaryAction?: () => void;
  secondaryActionLabel?: string;
}

/**
 * Modal Component
 * 
 * A reusable and customizable modal dialog component that serves as the foundation
 * for all modal dialogs in the application. Features include:
 * 
 * - Animated entrance/exit with smooth transitions
 * - Customizable header, body, and footer sections
 * - Primary and optional secondary action buttons
 * - Close button and backdrop click handling
 * - Responsive design that adapts to different screen sizes
 * - Focus management and accessibility considerations
 * - Disabling capability during loading/processing states
 * 
 * This component is extended by specialized modal types such as LoginModal,
 * RegisterModal, RentModal, and SearchModal to create consistent UX throughout
 * the application.
 * 
 * @component
 * @param {ModalProps} props - Component props
 * @returns {JSX.Element|null} Rendered modal or null if not open
 */
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  body,
  actionLabel,
  footer,
  disabled,
  secondaryAction,
  secondaryActionLabel,
}) => {
  // Local state to control animation
  const [showModal, setShowModal] = useState(isOpen);

  // Update local state when isOpen prop changes
  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  /**
   * Handles modal close with animation
   * Sets showModal to false first, then calls onClose after animation completes
   */
  const handleClose = useCallback(() => {
    if (disabled) {
      return;
    }

    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300); // Duration matches the CSS transition
  }, [onClose, disabled]);

  /**
   * Handles primary action button click
   * Calls the provided onSubmit function if not disabled
   */
  const handleSubmit = useCallback(() => {
    if (disabled) {
      return;
    }

    onSubmit();
  }, [onSubmit, disabled]);

  /**
   * Handles secondary action button click
   * Calls the provided secondaryAction function if not disabled and function exists
   */
  const handleSecondaryAction = useCallback(() => {
    if (disabled || !secondaryAction) {
      return;
    }

    secondaryAction();
  }, [secondaryAction, disabled]);

  // Don't render anything if modal is not open
  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Modal backdrop/overlay */}
      <div
        className="
          justify-center 
          items-center 
          flex 
          overflow-x-hidden 
          overflow-y-auto 
          fixed 
          inset-0 
          z-50 
          outline-none 
          focus:outline-none
          bg-neutral-800/70
        "
      >
        {/* Modal container with responsive widths */}
        <div
          className="
          relative 
          w-full
          md:w-4/6
          lg:w-3/6
          xl:w-2/5
          my-6
          mx-auto 
          h-full 
          lg:h-auto
          md:h-auto
          "
        >
          {/* Content wrapper with animation */}
          <div
            className={`
            translate
            duration-300
            h-full
            ${showModal ? "translate-y-0" : "translate-y-full"}
            ${showModal ? "opacity-100" : "opacity-0"}
          `}
          >
            {/* Modal content container */}
            <div
              className="
              translate
              h-full
              lg:h-auto
              md:h-auto
              border-0 
              rounded-lg 
              shadow-lg 
              relative 
              flex 
              flex-col 
              w-full 
              bg-white 
              outline-none 
              focus:outline-none
            "
            >
              {/* Modal header with title and close button */}
              <div
                className="
                flex 
                items-center 
                p-6
                rounded-t
                justify-center
                relative
                border-b-[1px]
                "
              >
                <button
                  className="
                    p-1
                    border-0 
                    hover:opacity-70
                    transition
                    absolute
                    left-9
                  "
                  onClick={handleClose}
                  aria-label="Close modal"
                >
                  <IoMdClose size={18} />
                </button>
                <div className="text-lg font-semibold">{title}</div>
              </div>
              
              {/* Modal body */}
              <div className="relative p-6 flex-auto">{body}</div>
              
              {/* Modal footer with action buttons and optional footer content */}
              <div className="flex flex-col gap-2 p-6">
                <div
                  className="
                    flex 
                    flex-row 
                    items-center 
                    gap-4 
                    w-full
                  "
                >
                  {/* Secondary action button (conditional) */}
                  {secondaryAction && secondaryActionLabel && (
                    <Button
                      disabled={disabled}
                      label={secondaryActionLabel}
                      onClick={handleSecondaryAction}
                      outline
                    />
                  )}
                  
                  {/* Primary action button */}
                  <Button
                    disabled={disabled}
                    label={actionLabel}
                    onClick={handleSubmit}
                  />
                </div>
                {/* Optional additional footer content */}
                {footer}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
