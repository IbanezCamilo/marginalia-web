import React, { useRef } from "react";

export function useCoverImageUpload(onChange) {

  const inputFileRef = useRef(null);
  //Execute when an archive is selected
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    //1. Provide the archive to the parent
    onChange("image", file);

    //2. Generate preview(base64) and pass it to the parent too
    const reader = new FileReader();
    reader.onload = () => {
      onChange("previewUrl", reader.result);
    };
    reader.readAsDataURL(file);
  };

  //Remove Image
  const handleRemoveImage = () => {
    onChange("image", null);
    onChange("previewUrl", "");
    if (inputFileRef.current) {
      inputFileRef.current.value = "";
    }
  };

  //Allows to open the file on click in the overlay or button
  const triggerFileSelect = () => {
    inputFileRef.current?.click();
  };

  return {onChange, inputFileRef, handleImageSelect, handleRemoveImage, triggerFileSelect}
}