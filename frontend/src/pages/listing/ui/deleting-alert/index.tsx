import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../../../../shared/ui/button";
import { Card } from "../../../../shared/ui/card";
import { Modal } from "../../../../shared/ui/modal";
import type { ServerError } from "../../../../shared/types";
import { deleteListing } from "../../api";
import { useNavigate } from "react-router";

export default function DeletingAlert({
  setIsDeleting,
  id,
}: {
  setIsDeleting: (value: React.SetStateAction<boolean>) => void;
  id: number;
}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: deleteListing,
    onSuccess: (data) => {
      console.log(data);
      setIsDeleting(false);
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      navigate("/");
    },
    onError: (error: ServerError) => {
      console.log(error.response.data.error);
    },
  });

  function handleDelete() {
    mutation.mutate(id);
  }

  function handleCancel() {
    setIsDeleting(false);
  }

  return (
    <Modal className="items-center">
      <Card className="p-5 md:p-10 flex-col gap-5 m-5">
        <p className="text-lg font-medium">
          Do you really want to delete this beautiful listing?
        </p>
        <div className="flex gap-5">
          <Button className="flex-1" onClick={handleCancel} variant="secondary">
            No
          </Button>
          <Button className="flex-1" onClick={handleDelete} variant="danger">
            Yes
          </Button>
        </div>
      </Card>
    </Modal>
  );
}
