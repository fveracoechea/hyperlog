import { Controller, useForm, UseFormReturn } from "react-hook-form";
import { href, useNavigate } from "react-router";

import { CreateCollectionSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircleIcon, PlusIcon } from "lucide-react";

import { ColorPicker } from "./ColorPicker";
import { FormField } from "./FormField";
import { Button } from "./ui/button";
import { DialogClose, DialogFooter } from "./ui/dialog";
import { client } from "@/utility/honoClient.ts";
import { CreateCollectionFormFields } from "@hyperlog/schemas";
import { useRevalidator } from "react-router";

const resolver = zodResolver(CreateCollectionSchema);

export function CreateCollectionForm(props: { onComplete?(): void }) {
  const { onComplete } = props;

  const navigate = useNavigate();
  const revalidator = useRevalidator();

  const { register, setError, control, handleSubmit, formState: { errors, isSubmitting } } =
    useForm({ resolver }) as UseFormReturn<CreateCollectionFormFields>;

  const onSubmit = handleSubmit(async (fields) => {
    const res = await client.api.collection.$post({ json: fields });
    const json = await res.json();
    if (json.error) {
      setError("name", { message: json.error.message });
    } else {
      onComplete?.();
      navigate(href("/collections/:collectionId", { collectionId: json.data.collection.id }));
      revalidator.revalidate();
    }
  });

  return (
    <form
      noValidate
      method="POST"
      onSubmit={onSubmit}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-4">
        <FormField
          label="Name"
          required
          placeholder="e.g. Recipes"
          {...register("name")}
          errorMessage={errors.name?.message}
        />

        <Controller
          control={control}
          name="color"
          render={({ field }) => {
            return <ColorPicker {...field} value={field.value} />;
          }}
        />

        <FormField
          variant="textarea"
          label="Description"
          className="resize-none"
          placeholder="The purpose of this collection"
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
              Create Collection
            </Button>
          )}
      </DialogFooter>
    </form>
  );
}
