import { useForm } from "react-hook-form";
import { href, useNavigate, useRevalidator } from "react-router";
import { LoaderCircleIcon, PlusIcon } from "lucide-react";

import { DialogClose, DialogFooter } from "./ui/dialog.tsx";
import { Button } from "./ui/button.tsx";
import { FormField } from "./FormField.tsx";
import { zodResolver } from "@hookform/resolvers/zod";

import { CreateTagSchema } from "@hyperlog/schemas";
import { client } from "../utility/honoClient.ts";

const resolver = zodResolver(CreateTagSchema);

export function CreateTagForm(props: { onComplete?(): void }) {
  const { onComplete } = props;

  const navigate = useNavigate();
  const revalidator = useRevalidator();

  const { setError, handleSubmit, register, formState: { isSubmitting, errors } } = useForm({
    resolver,
  });

  const onSubmit = handleSubmit(async (fields) => {
    const response = await client.api.tag.$post({ json: fields });
    const json = await response.json();

    if (!json.success) {
      setError("name", { message: json.error.message });
      return;
    }

    onComplete?.();
    navigate(href("/tags/:tagId", { tagId: json.data.tag.id }));
    revalidator.revalidate();
  });

  return (
    <form noValidate method="POST" className="flex flex-col gap-4" onSubmit={onSubmit}>
      <div className="flex flex-col gap-4">
        <FormField
          label="Name"
          required
          placeholder="e.g. Productivity"
          errorMessage={errors.name?.message}
          {...register("name")}
        />
        <FormField
          variant="textarea"
          label="Description"
          className="resize-none"
          placeholder="The purpose of this tag"
          errorMessage={errors.description?.message}
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
