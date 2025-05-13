import { useForm } from "react-hook-form";
import { href, useNavigate, useRevalidator } from "react-router";
import { LoaderCircleIcon, PlusIcon } from "lucide-react";

import { DialogClose, DialogFooter } from "./ui/dialog.tsx";
import { Button } from "./ui/button.tsx";
import { FormField } from "./FormField.tsx";

export function CreateTagForm(props: { onComplete?(): void }) {
  const { onComplete } = props;

  const navigate = useNavigate();
  const revalidator = useRevalidator();

  const { handleSubmit, register, formState: { isSubmitting } } = useForm({});

  const onSubmit = handleSubmit(async () => {
    onComplete?.();
    navigate(href("/tags/:tagId", { tagId: "" }));
    revalidator.revalidate();
  });

  return (
    <form noValidate method="POST" className="flex flex-col gap-4" onSubmit={onSubmit}>
      <div className="flex flex-col gap-4">
        <FormField
          label="Name"
          required
          placeholder="e.g. Recipes"
          {...register("name")}
        />

        <FormField
          variant="textarea"
          label="Description"
          className="resize-none"
          placeholder="The purpose of this tag"
          {...register("description")}
        />
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="ghost">
            Close
          </Button>
        </DialogClose>

        {isSubmitting
          ? (
            <Button disabled type="button" className="min-w-28">
              <LoaderCircleIcon className="min-h-5 min-w-5 animate-spin" />
            </Button>
          )
          : (
            <Button type="submit">
              <PlusIcon />
              Create Tag
            </Button>
          )}
      </DialogFooter>
    </form>
  );
}
