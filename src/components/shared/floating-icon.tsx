import Image from "next/image";

export default function FloatingIcon() {
  return (
    <a
      className="fixed bottom-5 left-5 z-50 flex h-16 w-16 items-center justify-center rounded-full border border-primary bg-white shadow-lg transition-transform hover:scale-105 sm:bottom-8 sm:left-8 sm:h-20 sm:w-20"
    >
      <Image
        src="/images/floating-icon.png"
        alt=""
        width={64}
        height={64}
        className="h-[80%] w-[80%] object-contain"
      />
    </a>
  );
}