import React, { useRef, useState } from "react";
import { uploadAvatar } from "../../api";
import { Button } from "../../../../shared/ui/button";
import { Modal } from "../../../../shared/ui/modal";
import { PencilSquareIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Card } from "../../../../shared/ui/card";

export default function AvatarUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      if (!selectedFile.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      setFile(selectedFile);

      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const data = await uploadAvatar(formData);

      if (!data.ok) {
        throw new Error(`Upload failed: ${data.statusText}`);
      }

      console.log("Upload successful:", data);

      if (preview) {
        URL.revokeObjectURL(preview);
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const handleClick = () => {
    if (!fileInputRef.current) {
      return;
    }

    fileInputRef.current.click();
  };

  const handleCancel = () => {
    setPreview(null);
    setFile(null);
  };

  return (
    <div className="flex flex-col items-start gap-4 absolute bottom-2 right-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <button className="w-fit" onClick={handleClick}>
        <PencilSquareIcon className="size-6" />
      </button>

      {file && (
        <Modal className="items-center">
          <Card className="flex-col relative justify-center items-center gap-5 w-80 md:w-96 p-5 md:p-10">
            {file && (
              <div className="text-sm break-all">
                <div>
                  Selected: <span className="text-primary">{file.name}</span>
                </div>
                <div>
                  Size:{" "}
                  <span className="text-accent">
                    {(file.size / 1024).toFixed(2)} KB
                  </span>
                </div>
              </div>
            )}

            {preview && (
              <div className="w-40 h-40">
                <img
                  className="w-full h-full object-cover rounded-full"
                  src={preview}
                  alt="Preview"
                />
              </div>
            )}

            {file && (
              <div className="flex flex-row justify-center gap-2">
                <Button
                  className="w-fit font-medium"
                  variant="primary"
                  onClick={handleUpload}
                >
                  Upload Avatar
                </Button>

                <Button
                  className="w-fit font-medium"
                  variant="secondary"
                  onClick={handleClick}
                >
                  Change image
                </Button>
              </div>
            )}

            <button
              onClick={handleCancel}
              className="w-fit absolute top-2 right-2"
            >
              <XMarkIcon className="size-5" />
            </button>
          </Card>
        </Modal>
      )}
    </div>
  );
}
