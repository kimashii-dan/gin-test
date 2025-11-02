import { useForm } from "react-hook-form";
import { Card } from "../../../../shared/ui/card";
import { Modal } from "../../../../shared/ui/modal";
import type z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ServerError } from "../../../../shared/types";
import { listingSchema } from "../../../../shared/core/schemas";
import { createListing } from "../../api";
import { Button } from "../../../../shared/ui/button";
import { TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import styles from "../../styles.module.css";

export default function CreateListingForm({
  setIsCreating,
}: {
  setIsCreating: (value: React.SetStateAction<boolean>) => void;
}) {
  const form = useForm<z.infer<typeof listingSchema>>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      images: [],
    },
  });

  const images = form.watch("images");

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createListing,
    onSuccess: (data) => {
      console.log(data);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
    onError: (error: ServerError) => {
      console.log(error.response.data.error);
    },
  });

  async function onSubmit(data: z.infer<typeof listingSchema>) {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description ?? "");
    formData.append("price", data.price.toString());
    data.images.forEach((image) => {
      formData.append("images[]", image);
    });

    mutation.mutate(formData);
    setIsCreating(false);
  }

  function handleCancel() {
    form.reset();
    setIsCreating(false);
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
    const currentImages = form.getValues("images");
    const filtered = currentImages.filter((_, i) => i !== index);
    form.setValue("images", filtered);
  }

  return (
    <Modal className="items-start md:items-center">
      <form className={styles.form} onSubmit={form.handleSubmit(onSubmit)}>
        <Card className={styles.form_card}>
          <div className="flex flex-col gap-10 w-full">
            <label className="field">
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

            <label className="field">
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

            <label className="field">
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
                  <span className="">Images</span>
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
                  <p className="text-muted-foreground font-medium">
                    Click to upload or drag and drop
                  </p>
                </label>
              </div>

              {form.formState.errors.images && (
                <p className="text-destructive">
                  {form.formState.errors.images.message}
                </p>
              )}

              {images && images.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {Array.from(images).map((file, index) => (
                    <div key={index} className="relative">
                      <button
                        type="button"
                        onClick={() => deleteImagePreview(index)}
                        className="relative w-35 h-35"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover rounded-md"
                        />
                        <div className={styles.image_preview_hover}>
                          <TrashIcon className="size-10 text-destructive" />
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                type="submit"
                variant="primary"
                disabled={mutation.isPending}
                className=""
              >
                Create
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
