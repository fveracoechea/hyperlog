import { FormEvent } from "react";

import { Controller, useForm } from "react-hook-form";

import { CreateLinkSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleXIcon, LoaderCircleIcon, PlusIcon } from "lucide-react";

import { CollectionIcon } from "./CollectionIcon";
import { FormField } from "./FormField";
import { Button } from "./ui/button";
import { DialogClose, DialogFooter } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Typography } from "./ui/typography";
import { useLoaderData, useNavigate } from "react-router";
import { LayoutLoaderData } from "@/routes/Layout.tsx";
import { client } from "../utility/honoClient.ts";
import { href } from "react-router";

const resolver = zodResolver(CreateLinkSchema);

export function CreateLinkForm(props: { onComplete?(): void }) {
  const { onComplete } = props;
  const { ownedCollections } = useLoaderData<LayoutLoaderData>();
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver });

  function maskURL(e: FormEvent<HTMLFormElement>) {
    const url = new FormData(e.currentTarget).get("url") ?? "";
    if (!/^https?:\/\//.test(String(url))) {
      setValue("url", `https://${url}`);
    }
  }

  const onSubmit = handleSubmit(async (fields) => {
    const res = await client.api.link.$post({ json: fields });
    const json = await res.json();
    if (json.error) {
      setError(json.error.field, { message: json.error.message });
    } else {
      onComplete?.();
      navigate(href("/links/:linkId", { linkId: json.data.link.id }));
    }
  });

  return (
    <form
      noValidate
      onSubmit={(e) => {
        maskURL(e);
        onSubmit(e);
      }}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-4">
        <FormField
          label="URL"
          placeholder="https://example.com"
          required
          {...register("url")}
          errorMessage={errors.url?.message}
        />
        <FormField
          label="Title"
          placeholder="Auto-generated if left blank"
          {...register("title")}
          errorMessage={errors.title?.message}
        />
        <div className="flex flex-col gap-1">
          <Typography as="label" htmlFor="tag-select">
            Collection
          </Typography>
          <Controller
            control={control}
            name="collectionId"
            render={({ field: { value, name, onChange, ...selectProps } }) => (
              <Select
                key={value}
                name={name}
                value={value ?? undefined}
                onValueChange={(selected) => {
                  if (selected === "NO-COLLECTION") onChange("");
                  else onChange(selected);
                }}
              >
                <SelectTrigger {...selectProps}>
                  <SelectValue placeholder="No collection" />
                </SelectTrigger>
                <SelectContent>
                  {value && (
                    <SelectItem value="NO-COLLECTION">
                      <div className="flex items-center gap-2">
                        <CircleXIcon className="h-5 w-5" />
                        <Typography>No Collection</Typography>
                      </div>
                    </SelectItem>
                  )}
                  {ownedCollections.map((collection) => (
                    <SelectItem key={collection.id} value={collection.id}>
                      <div className="flex items-center gap-2">
                        <CollectionIcon size="small" color={collection.color ?? undefined} />
                        <Typography>{collection.name}</Typography>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <FormField
          variant="textarea"
          label="Notes"
          className="resize-none"
          placeholder="Relevant details or thoughts"
          {...register("notes")}
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
            <Button disabled type="button" className="min-w-24">
              <LoaderCircleIcon className="min-h-5 min-w-5 animate-spin" />
            </Button>
          )
          : (
            <Button type="submit">
              <PlusIcon />
              Create Link
            </Button>
          )}
      </DialogFooter>
    </form>
  );
}
