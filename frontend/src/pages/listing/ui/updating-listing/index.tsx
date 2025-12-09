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

import styles from "../../styles.module.css";
import { useTranslation } from "react-i18next";
import { categories } from "../../../../shared/enums";

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
      category: listing.category,
    },
  });

  const { t } = useTranslation();
  const images = form.watch("images");

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: updateListing,
    onSuccess: (data) => {
      console.log(data);
      form.reset();
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

    if (data.category !== listing.category) {
      formData.append("category", data.category);
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

    const id = listing.id;
    mutation.mutate({ id, formData });

    setIsUpdating(false);
  }

  function handleCancel() {
    form.reset();
    setIsUpdating(false);
  }

  function handleDeleteExisting(url: string) {
    setExistingImages((prev) => prev.filter((existing) => existing !== url));
  }

  function addImage(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files) {
      const currentImages = form.getValues("images") || [];
      const newImages = [...currentImages, ...Array.from(files)];
      form.setValue("images", newImages.slice(0, 3));
    }
  }

  function dropImages(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );
    const currentImages = form.getValues("images") || [];
    const newImages = [...currentImages, ...files];
    form.setValue("images", newImages.slice(0, 3));
  }

  function deleteImagePreview(index: number) {
    const filtered = images?.filter((_, i) => i !== index);
    form.setValue("images", filtered);
  }

  return (
    <Modal className="items-start md:items-center">
      <form className={styles.form} onSubmit={form.handleSubmit(onSubmit)}>
        <Card className={styles.form_card}>
          <div className="flex flex-col gap-10 w-full">
            <label className="field">
              <span className="">{t("listingForm.title.label")}</span>
              <input
                className="w-full"
                placeholder={t("listingForm.title.placeholder")}
                autoComplete="off"
                {...form.register("title")}
              />
            </label>

            {form.formState.errors.title && (
              <p className="text-destructive">
                {form.formState.errors.title.message}
              </p>
            )}

            <label className="field">
              <span className="">{t("listingForm.description.label")}</span>
              <textarea
                className="w-full h-32"
                autoComplete="off"
                placeholder={t("listingForm.description.placeholder")}
                {...form.register("description")}
              />
            </label>

            {form.formState.errors.description && (
              <p className="text-destructive">
                {form.formState.errors.description.message}
              </p>
            )}

            <label className="field">
              <span className="">{t("listingForm.category.label")}</span>
              <div className="">
                {categories.map((category: string) => (
                  <div key={category} className="flex items-center space-x-2">
                    <label className="flex items-center space-x-1">
                      <input
                        type="radio"
                        value={category}
                        {...form.register("category")}
                      />
                      <span>
                        {t(
                          `listingForm.category.categories.${category.toLowerCase()}`
                        )}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </label>

            {form.formState.errors.category && (
              <p className="text-destructive">
                {form.formState.errors.category.message}
              </p>
            )}

            <label className="field">
              <span className="">{t("listingForm.price.label")}</span>
              <input
                className="w-full"
                placeholder={t("listingForm.title.placeholder")}
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

          <div className={styles.image_upload}>
            <div className={styles.image_input}>
              <input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={addImage}
                className="hidden w-full h-full"
              />

              <div className="flex flex-col gap-2">
                <label className="w-full">
                  <span className="">{t("listingForm.images.label")}</span>
                </label>

                <label
                  htmlFor="images"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={dropImages}
                  className={styles.image_upload_area}
                >
                  <p className="text-muted-foreground font-medium text-[12px]">
                    {t("listingForm.images.placeholder")}
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
                      <div className={styles.image_preview_hover}>
                        <TrashIcon className="size-10 text-destructive" />
                      </div>
                    </button>
                  </div>
                ))}

                {images &&
                  images.map((file, index) => (
                    <div key={`new-${index}`} className="relative">
                      <button
                        type="button"
                        onClick={() => deleteImagePreview(index)}
                        className="relative w-35 h-35"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-35 h-35 object-cover rounded-sm"
                        />
                        <div className={styles.image_preview_hover}>
                          <TrashIcon className="size-10 text-destructive" />
                        </div>
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex gap-2 justify-end font-medium">
              <Button
                type="submit"
                variant="primary"
                disabled={mutation.isPending}
              >
                {t("listingForm.buttons.update.name")}
              </Button>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            className={styles.button_cancel}
          >
            <XMarkIcon className="size-5" />
          </button>
        </Card>
      </form>
    </Modal>
  );
}
