"use client";

import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DraggableImageListProps {
  images: string[];
  onReorder: (newImages: string[]) => void;
  onRemove: (imageToRemove: string) => void;
}

interface SortableImageProps {
  url: string;
  id: string;
  index: number;
  onRemove: (url: string) => void;
}

export const SortableImage = ({
  url,
  id,
  index,
  onRemove,
}: SortableImageProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    // Use Translate instead of Transform to avoid scaling artifacts and simplify movement
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group relative aspect-square cursor-grab touch-none active:cursor-grabbing"
    >
      <Image
        src={url}
        alt={`Image ${index + 1}`}
        fill
        sizes="20vw"
        className="rounded-md bg-neutral-800 object-cover"
        draggable={false} // Prevent browser native drag validation
      />
      {index === 0 && (
        <Badge className="absolute top-1 left-1 z-20">Ảnh bìa</Badge>
      )}
      <Button
        type="button"
        variant="destructive"
        size="icon"
        className="pointer-events-auto absolute top-1 right-1 z-20 h-6 w-6 opacity-0 group-hover:opacity-100"
        onClick={(e) => {
          // Prevent drag from starting when clicking delete
          e.stopPropagation();
          onRemove(url);
        }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export const DraggableImageList = ({
  images,
  onReorder,
  onRemove,
}: DraggableImageListProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require movement of 8px before drag starts to allow click events
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = images.indexOf(active.id as string);
      const newIndex = images.indexOf(over.id as string);
      onReorder(arrayMove(images, oldIndex, newIndex));
    }

    setActiveId(null);
  };

  if (!images || images.length === 0) return null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={images} strategy={rectSortingStrategy}>
        <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {images.map((url, index) => (
            <SortableImage
              key={url}
              id={url}
              url={url}
              index={index}
              onRemove={onRemove}
            />
            // Note: If you have duplicate URLs, keys will conflict. Ensure backend returns unique URLs.
          ))}
        </div>
      </SortableContext>
      <DragOverlay adjustScale={true}>
        {activeId ? (
          <div className="relative aspect-square opacity-80 shadow-2xl">
            {/* Used to show the item being dragged */}
            <Image
              src={activeId}
              alt="Dragging"
              fill
              className="rounded-md bg-neutral-800 object-cover"
              draggable={false}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
