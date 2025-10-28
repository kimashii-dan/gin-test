import { useForm } from "react-hook-form";
import { Card } from "../../../../shared/ui/card";
import { Modal } from "../../../../shared/ui/modal";
import type z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Listing, ServerError } from "../../../../shared/types";
import { updateListingSchema } from "../../../../shared/core/schemas";

import { Button } from "../../../../shared/ui/button";
import { TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { updateListing } from "../../api";
import { useState } from "react";

type UpdateListingFormProps = {
  setIsUpdating: (value: React.SetStateAction<boolean>) => void;
  listing: Listing;
};

export default function UpdateListingForm({
  setIsUpdating,
  listing,
}: UpdateListingFormProps) {
  const form = useForm<z.infer<typeof updateListingSchema>>({
    resolver: zodResolver(updateListingSchema),
    defaultValues: {
      title: listing.title,
      description: listing.description,
      price: listing.price,
      images: [],
    },
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: updateListing,
    onSuccess: (data) => {
      console.log(data);
      form.reset();
      setIsUpdating(false);
      queryClient.invalidateQueries({ queryKey: ["listing"] });
    },
    onError: (error: ServerError) => {
      console.log(error.response.data.error);
    },
  });

  const [existingImages, setExistingImages] = useState<string[]>(
    listing.image_urls
  );

  async function onSubmit(data: z.infer<typeof updateListingSchema>) {
    console.log(data);

    const formData = new FormData();

    if (data.title !== listing.title) {
      formData.append("title", data.title);
    }

    if (data.description !== listing.description) {
      formData.append("description", data.description ?? "");
    }

    if (data.price !== listing.price) {
      formData.append("price", data.price.toString());
    }

    if ((data.images?.length ?? 0) + existingImages.length > 5) {
      return;
    }

    (data.images ?? []).forEach((image) => {
      formData.append("new_images", image);
    });

    existingImages.forEach((url: string) => {
      formData.append("kept_images", url);
    });

    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const id = listing.id;
    mutation.mutate({ id, formData });
  }

  const images = form.watch("images");

  function handleCancel() {
    form.reset();
    setIsUpdating(false);
  }

  function handleDeleteExisting(url: string) {
    setExistingImages((prev) => prev.filter((existing) => existing !== url));
  }

  return (
    <Modal>
      <form
        className="flex flex-col w-11/12 h-auto md:h-[80vh]"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Card className="flex-col md:flex-row relative w-full h-full justify-between items-center gap-5 p-5">
          <div className="flex flex-col gap-10 w-full h-full">
            <label className="flex flex-col items-start gap-2 w-full">
              <span className="">Title</span>
              <input
                className="w-full"
                placeholder="Enter title of the product"
                autoComplete="off"
                {...form.register("title")}
              />
            </label>

            {form.formState.errors.title && (
              <p className="text-destructive">
                {form.formState.errors.title.message}
              </p>
            )}

            <label className="flex flex-col items-start gap-2 w-full">
              <span className="">Description</span>
              <textarea
                className="w-full h-32"
                autoComplete="off"
                placeholder="Enter description of the product"
                {...form.register("description")}
              />
            </label>

            {form.formState.errors.description && (
              <p className="text-destructive">
                {form.formState.errors.description.message}
              </p>
            )}

            <label className="flex flex-col items-start gap-2 w-full">
              <span className="">Price</span>
              <input
                className="w-full"
                placeholder="Add your price"
                autoComplete="off"
                type="number"
                {...form.register("price", { valueAsNumber: true })}
              />
            </label>

            {form.formState.errors.price && (
              <p className="text-destructive">
                {form.formState.errors.price.message}
              </p>
            )}
          </div>

          <div className="w-full h-full flex flex-col gap-5 md:justify-between">
            <div className="flex flex-col gap-5 overflow-y-auto max-h-[500px]">
              <input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = e.target.files;
                  if (files) {
                    const currentImages = form.getValues("images") || [];
                    const newImages = [...currentImages, ...Array.from(files)];
                    form.setValue("images", newImages.slice(0, 3));
                  }
                }}
                className="hidden w-full h-full"
              />

              <div className="flex flex-col gap-2">
                <label className="w-full">
                  <span className="">Images</span>
                </label>

                <label
                  htmlFor="images"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const files = Array.from(e.dataTransfer.files).filter(
                      (file) => file.type.startsWith("image/")
                    );
                    const currentImages = form.getValues("images") || [];
                    const newImages = [...currentImages, ...files];
                    form.setValue("images", newImages.slice(0, 3));
                  }}
                  className="flex flex-col inset-shadow-soft gap-2 items-center justify-center w-full h-32 border-2 border-border border-dashed rounded cursor-pointer"
                >
                  <p className="text-base text-muted-foreground font-medium">
                    Click to upload or drag and drop
                  </p>
                </label>
              </div>
              {form.formState.errors.images && (
                <p className="text-destructive text-sm">
                  {form.formState.errors.images.message}
                </p>
              )}

              <div className="flex gap-2 flex-wrap">
                {existingImages.map((url, index) => (
                  <div key={`existing-${index}`} className="relative">
                    <button
                      type="button"
                      onClick={() => handleDeleteExisting(url)}
                      className="relative w-35 h-35"
                    >
                      <img
                        src={url}
                        alt={`Existing ${index + 1}`}
                        className="w-35 h-35 object-cover rounded-sm"
                      />
                      <div className="absolute bg-black/50 inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                        <TrashIcon className="size-10 text-destructive" />
                      </div>
                    </button>
                  </div>
                ))}

                {images?.map((file, index) => (
                  <div key={`new-${index}`} className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        const filtered = images.filter((_, i) => i !== index);
                        form.setValue("images", filtered);
                      }}
                      className="relative w-35 h-35"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-35 h-35 object-cover rounded-sm"
                      />
                      <div className="absolute bg-black/50 inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                        <TrashIcon className="size-10 text-destructive" />
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                type="submit"
                variant="primary"
                disabled={mutation.isPending}
              >
                Create
              </Button>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            className="w-fit absolute top-2 right-2"
          >
            <XMarkIcon className="size-5" />
          </button>
        </Card>
      </form>
    </Modal>
  );
}
