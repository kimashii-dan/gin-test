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
import { XMarkIcon } from "@heroicons/react/24/outline";

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

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createListing,
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      form.reset();
    },
    onError: (error: ServerError) => {
      console.log(error.response.data.error);
    },
  });

  async function onSubmit(data: z.infer<typeof listingSchema>) {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());
    data.images.forEach((image) => {
      formData.append("images[]", image);
    });

    mutation.mutate(formData);
  }

  const images = form.watch("images");

  function handleCancel() {
    form.reset();
    setIsCreating(false);
  }

  console.log(images);

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
                {...form.register("price")}
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
                  {images && images.length > 0 && (
                    <p className="text-sm text-accent">
                      {images.length} image(s) selected
                    </p>
                  )}
                </label>
              </div>
              {form.formState.errors.images && (
                <p className="text-destructive text-sm">
                  {form.formState.errors.images.message}
                </p>
              )}

              {images && images.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {Array.from(images).map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-35 h-35 object-cover rounded-sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const currentImages = form.getValues("images");
                          const filtered = currentImages.filter(
                            (_, i) => i !== index
                          );
                          form.setValue("images", filtered);
                        }}
                        className="absolute -top-2 -right-2 rounded-full bg-destructive text-highlight w-5 h-5 p-1 flex items-center justify-center"
                      >
                        <XMarkIcon className="w-full" />
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
