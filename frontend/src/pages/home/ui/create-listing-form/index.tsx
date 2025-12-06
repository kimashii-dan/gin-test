import { useForm } from "react-hook-form";
import { Card } from "../../../../shared/ui/card";
import { Modal } from "../../../../shared/ui/modal";
import type z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  PriceSuggestionResponse,
  ServerError,
} from "../../../../shared/types";
import { listingSchema } from "../../../../shared/core/schemas";
import { createListing, getAIPRiceReport } from "../../api";
import { Button } from "../../../../shared/ui/button";
import {
  LightBulbIcon,
  SparklesIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import styles from "../../styles.module.css";
import { useState } from "react";
// import { reportData } from "../../../../shared/core/mock";

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
  const [report, setReport] = useState<PriceSuggestionResponse | null>(null);
  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: createListing,
    onSuccess: (data) => {
      console.log(data);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
    onError: (error: ServerError) => {
      console.log(error.response.data.error);
      setReport(null);
    },
  });

  const aiMutation = useMutation({
    mutationFn: getAIPRiceReport,
    onSuccess: (data) => {
      console.log(data);
      setReport(data);
    },
    onError: (error: ServerError) => {
      console.log(error.response.data.error);
    },
  });

  async function onSubmit(data: z.infer<typeof listingSchema>) {
    const reportString = JSON.stringify(report);

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description ?? "");
    formData.append("price", data.price.toString());
    if (report !== null) {
      formData.append("price_suggestion", reportString);
    }

    data.images.forEach((image) => {
      formData.append("images[]", image);
    });

    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    createMutation.mutate(formData);
    setIsCreating(false);
  }

  function handleCancel() {
    form.reset();
    setReport(null);
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

  function askAI() {
    const title = form.watch("title");
    const description = form.watch("description");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description ?? "");
    images.forEach((image) => {
      formData.append("images[]", image);
    });

    aiMutation.mutate(formData);
  }

  const map = new Map<string, string>([
    ["low", "bg-gray-300"],
    ["medium", "bg-orange-400"],
    ["high", "bg-green-400"],
  ]);

  return (
    <Modal className="items-start">
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

            <Button
              onClick={askAI}
              type="button"
              className="flex gap-2 items-center w-fit"
              disabled={!!report || aiMutation.isPending}
            >
              <SparklesIcon className="size-6 text-yellow-300" />
              <span>
                {aiMutation.isPending
                  ? "Getting suggestion..."
                  : "Get AI suggestion"}
              </span>
            </Button>

            {aiMutation.isPending && (
              <Card className="flex-col p-8 gap-6 animate-pulse">
                <div className="flex lg:flex-row flex-col justify-between gap-5 lg:items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-muted rounded"></div>
                    <div className="h-6 bg-muted rounded w-40"></div>
                  </div>
                  <div className="h-6 bg-muted rounded-full w-24"></div>
                </div>

                <div className="flex items-baseline gap-3">
                  <div className="h-12 bg-muted rounded w-32"></div>
                  <div className="h-8 bg-muted rounded w-12"></div>
                </div>

                <hr className="border border-border" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                </div>
              </Card>
            )}

            {report && (
              <Card className="flex-col p-8 gap-6">
                <div className="flex lg:flex-row flex-col justify-between gap-5 lg:items-center">
                  <div className="flex items-center gap-2">
                    <LightBulbIcon className="text-yellow-400 size-7" />
                    <h2 className="text-xl text-card-foreground font-medium">
                      AI Price Suggestion
                    </h2>
                  </div>

                  <p
                    className={`${map.get(
                      report.confidence_level
                    )} shadow-sm px-3 p-0.5 text-sm w-fit font-semibold rounded-full text-black`}
                  >
                    {report.confidence_level} confidence
                  </p>
                </div>

                <div className="flex items-baseline gap-3">
                  <p className="text-4xl text-highlight font-semibold">
                    {report.suggested_price_min} - {report.suggested_price_max}
                  </p>
                  <p className="text-xl text-muted-foreground font-medium">
                    {report.currency}
                  </p>
                </div>

                <hr className="border border-border" />
                <p className="text-base font-normal text-muted-foreground leading-relaxed">
                  {report.reasoning}
                </p>
              </Card>
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
                disabled={createMutation.isPending}
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
