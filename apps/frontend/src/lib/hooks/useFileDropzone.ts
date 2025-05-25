import { ChangeEvent, DragEvent, useRef, useState } from "react";

export type FileUploadStatus =
  | "idle"
  | "dragging"
  | "submitted"
  | "loading"
  | "success"
  | "error";

export type FileUploadCallback = (args: {
  file: File;
  status: FileUploadStatus;
  setStatus: (status: FileUploadStatus) => void;
}) => void;

/**
 * Provides event handling for a file dropzone
 */
export function useFileDropzone(args: {
  autoSubmit?: boolean;
  fileUploadCallback?: FileUploadCallback;
}) {
  const { autoSubmit, fileUploadCallback } = args;

  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<FileUploadStatus>("idle");

  function handleFile(file: File) {
    if (autoSubmit) {
      inputRef.current?.form?.requestSubmit();
      setStatus("submitted");
      return;
    }

    if (fileUploadCallback) {
      if (status === "loading") return;
      setStatus("loading");
      fileUploadCallback({ file, status, setStatus });
      return;
    }
  }

  function triggerFileInpuClick() {
    if (inputRef.current) inputRef.current.click();
  }

  function onDragOver(e: DragEvent<Element>) {
    e.preventDefault();
    setStatus("dragging");
  }

  function onDragLeave(e: DragEvent<Element>) {
    e.preventDefault();
    setStatus("idle");
  }

  function onDrop(e: DragEvent<Element>) {
    e.preventDefault();
    const file = e.dataTransfer.files.item(0);
    if (file && inputRef.current) {
      const dt = new DataTransfer();
      dt.items.add(file);
      inputRef.current.files = dt.files;
      return handleFile(file);
    }
    setStatus("idle");
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.item(0);
    if (file) return handleFile(file);
    setStatus("idle");
  }

  return {
    status,
    setStatus,
    triggerFileInpuClick,
    inputProps: { onChange, ref: inputRef },
    containerProps: { onDragOver, onDragLeave, onDrop },
  };
}
