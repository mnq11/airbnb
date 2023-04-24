'use client';

interface ContainerProps {
    children: React.ReactNode
};

const Container: React.FC<ContainerProps> = ({ children }) => {
    return (
        <div
            dir="rtl" // Add the dir attribute here
            className="
        text-right // Add the 'text-right' class here
        max-w-[2520px]
        mx-auto
        xl:px-20
        md:px-10
        sm:px-2
        px-4
      "
        >
            {children}
        </div>
    );
}

export default Container;
