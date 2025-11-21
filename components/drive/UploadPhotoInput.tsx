"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "@/components/ui/empty";
import { Button } from "../ui/button";
import { UploadCloud, X, ImageIcon } from "lucide-react";
import Image from "next/image";

interface UploadPhotoInputProps {
  value?: File;
  onChange?: (file: File | undefined) => void;
}

export default function UploadPhotoInput({
  value,
  onChange,
}: UploadPhotoInputProps) {
  const [tempUrl, setTempUrl] = useState<string | null>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  // Sync tempUrl with value prop
  useEffect(() => {
    if (value) {
      const url = URL.createObjectURL(value);
      setTempUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      if (tempUrl) {
        URL.revokeObjectURL(tempUrl);
        setTempUrl(null);
      }
    }
  }, [value]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (tempUrl) {
        URL.revokeObjectURL(tempUrl);
      }
    };
  }, [tempUrl]);

  const handleFileChange = () => {
    const selectedFile = hiddenInputRef.current?.files?.[0];
    if (selectedFile) {
      onChange?.(selectedFile);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(undefined);
    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="w-full">
      <Input
        className="hidden"
        ref={hiddenInputRef}
        type="file"
        accept="image/jpeg, image/png"
        onChange={handleFileChange}
      />

      {value && tempUrl ? (
        <div className="space-y-3">
          <div className="relative group rounded-lg border-2 border-border overflow-hidden bg-muted/30">
            <div
              className="cursor-pointer relative aspect-video w-full flex items-center justify-center"
              onClick={() => hiddenInputRef.current?.click()}
            >
              <Image
                src={tempUrl}
                alt={value.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    hiddenInputRef.current?.click();
                  }}
                >
                  Change Photo
                </Button>
              </div>
            </div>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleRemove}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
            <ImageIcon className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{value.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(value.size)}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => hiddenInputRef.current?.click()}
          className="cursor-pointer transition-colors"
        >
          <Empty>
            <EmptyHeader className="border-2 border-dashed rounded-lg p-8 hover:border-primary/50 hover:bg-muted/50 transition-colors">
              <EmptyMedia variant="default">
                <UploadCloud className="w-12 h-12 text-muted-foreground" />
              </EmptyMedia>
              <EmptyDescription className="text-base font-medium mt-4">
                Upload photo
              </EmptyDescription>
              <EmptyDescription className="text-sm text-muted-foreground mt-1">
                JPEG or PNG, max 5MB
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      )}
    </div>
  );
}
