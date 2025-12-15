import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal } from "../../../../shared/ui/modal";
import { Card } from "../../../../shared/ui/card";
import { Button } from "../../../../shared/ui/button";
import RatingStars from "../../../../shared/ui/rating-stars";
import { createRating, updateRating } from "../../../../shared/api";
import type { Rating, User } from "../../../../shared/types";
import { useTranslation } from "react-i18next";
import { XMarkIcon } from "@heroicons/react/24/outline";
import styles from "./styles.module.css";

type RatingModalProps = {
  onClose: () => void;
  seller: User;
  listingId?: number;
  existingRating?: Rating;
};

export default function RatingModal({
  onClose,
  seller,
  listingId,
  existingRating,
}: RatingModalProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(existingRating?.rating || 0);
  const [comment, setComment] = useState(existingRating?.comment || "");
  const [error, setError] = useState("");

  const createMutation = useMutation({
    mutationFn: createRating,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ratings", seller.id] });
      queryClient.invalidateQueries({ queryKey: ["checkRating"] });
      queryClient.invalidateQueries({ queryKey: ["listing"] });
      queryClient.invalidateQueries({ queryKey: ["user", seller.id] });
      onClose();
      setRating(0);
      setComment("");
      setError("");
    },
    onError: (error: any) => {
      setError(error.response?.data?.error || "Failed to submit rating");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      updateRating(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ratings", seller.id] });
      queryClient.invalidateQueries({ queryKey: ["checkRating"] });
      queryClient.invalidateQueries({ queryKey: ["listing"] });
      queryClient.invalidateQueries({ queryKey: ["user", seller.id] });
      onClose();
      setRating(0);
      setComment("");
      setError("");
    },
    onError: (error: any) => {
      setError(error.response?.data?.error || "Failed to update rating");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    if (existingRating) {
      updateMutation.mutate({
        id: existingRating.id,
        data: { rating, comment },
      });
    } else {
      createMutation.mutate({
        user_id: seller.id,
        rating,
        comment,
        listing_id: listingId,
      });
    }
  };

  const handleClose = () => {
    if (!createMutation.isPending && !updateMutation.isPending) {
      onClose();
      setRating(existingRating?.rating || 0);
      setComment(existingRating?.comment || "");
      setError("");
    }
  };

  return (
    <Modal className="items-start">
      <form onSubmit={handleSubmit}>
        <Card className={styles.card}>
          <h2 className={styles.title}>
            {existingRating ? t("ratings.update") : t("ratings.rate")}{" "}
            {seller.name || seller.email}
          </h2>

          <div className={styles.form}>
            <div className={styles.ratingSection}>
              <label className={styles.label}>{t("ratings.yourRating")}:</label>
              <RatingStars
                rating={rating}
                interactive
                onRatingChange={setRating}
                size="large"
              />
            </div>

            <div className={styles.commentSection}>
              <label htmlFor="comment" className={styles.label}>
                {t("ratings.comment")} ({t("ratings.optional")}):
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className={styles.textarea}
                rows={4}
                placeholder={t("ratings.commentPlaceholder")}
              />
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.actions}>
              <Button
                type="submit"
                variant="primary"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending
                  ? t("buttons.submitting")
                  : existingRating
                    ? t("buttons.update")
                    : t("buttons.submit")}
              </Button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className={styles.button_cancel}
          >
            <XMarkIcon className="size-5" />
          </button>
        </Card>
      </form>
    </Modal>
  );
}
