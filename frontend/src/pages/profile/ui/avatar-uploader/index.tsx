import React, { useState } from "react";
import { uploadAvatar } from "../../api";
import { Button } from "../../../../shared/ui/button";

export default function SimpleAvatarUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      if (!selectedFile.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      setFile(selectedFile);

      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
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

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <div className="flex flex-col items-start gap-4">
      <input
        id="avatar"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button>
        <label htmlFor="avatar" className="">
          {file ? "Change File" : "Choose File"}
        </label>
      </Button>

      {/* File info */}
      {file && (
        <div className="text-gray-700 text-sm">
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

      {/* Image preview */}
      {previewUrl && (
        <div className="w-40 h-40">
          <img
            className="w-full h-full object-cover rounded-full"
            src={previewUrl}
            alt="Preview"
          />
        </div>
      )}

      {/* Upload button */}
      {file && (
        <Button variant="secondary" onClick={handleUpload}>
          Upload Avatar
        </Button>
      )}
    </div>
  );
}
