'use client';

type RoomUploaderProps = {
  onUpload: (url: string) => void;
};

export default function RoomUploader({
  onUpload,
}: RoomUploaderProps) {

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    const url = URL.createObjectURL(file);

    onUpload(url);
  }


  return (
    <label
      className="
        inline-flex
        cursor-pointer
        items-center
        rounded-lg
        bg-black
        px-5
        py-3
        text-white
      "
    >
      انتخاب عکس محیط

      <input
        hidden
        type="file"
        accept="image/*"
        onChange={handleChange}
      />
    </label>
  );
}