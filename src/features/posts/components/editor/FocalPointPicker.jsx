import { useState } from "react";
import { Upload, X, Crosshair, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { focalToObjectPosition } from "@/utils/imageUtils";
import { useFocalPoint } from "../../hooks/editor/useFocalPoint";
import { ALLOWED_TYPES, MAX_SIZE } from "../../hooks/editor/useCoverImageUpload";

const THIRDS = [33.3333, 66.6667];

const pct = (n) => `${Math.round((Number.isFinite(n) ? n : 0.5) * 100)}%`;

// Derived from the same constants the uploader validates against, so the copy
// can never drift from the actual accepted formats / size limit.
const FORMATS = ALLOWED_TYPES.map((t) =>
  t.split("/")[1].replace("jpeg", "jpg").toUpperCase(),
).join(", ");
const MAX_MB = MAX_SIZE / (1024 * 1024);

export default function FocalPointPicker({
  src,
  focalX,
  focalY,
  onChange,
  onChangeImage,
  onRemoveImage,
}) {
  const [dims, setDims] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const { stageRef, dragging, recenter, handlers } = useFocalPoint({
    focalX,
    focalY,
    onChange,
  });

  const objectPosition = focalToObjectPosition(focalX, focalY);
  const gridVisible = dragging;

  return (
    <div className="mb-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        {/* Interactive stage: the whole image, no crop, so any subject is reachable. */}
        <div className="group relative flex-1">
          <div
            ref={stageRef}
            {...{
              onPointerDown: handlers.onPointerDown,
              onPointerMove: handlers.onPointerMove,
              onPointerUp: handlers.onPointerUp,
              onPointerCancel: handlers.onPointerCancel,
            }}
            className={cn(
              "relative mx-auto w-full max-h-[32rem] select-none touch-none overflow-hidden rounded-xl bg-muted",
              dragging ? "cursor-grabbing" : "cursor-crosshair",
            )}
            style={{ aspectRatio: dims ? `${dims.w} / ${dims.h}` : "16 / 9" }}
          >
            <img
              src={src}
              alt="Imagen de portada"
              draggable={false}
              onLoad={(e) => {
                setDims({
                  w: e.currentTarget.naturalWidth || 16,
                  h: e.currentTarget.naturalHeight || 9,
                });
                setLoaded(true);
              }}
              className={cn(
                "pointer-events-none h-full w-full object-contain transition-opacity duration-300",
                loaded ? "opacity-100" : "opacity-0",
              )}
            />

            {/* Rule-of-thirds grid, only while positioning. */}
            <div
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute inset-0 transition-opacity duration-200 ease-out motion-reduce:transition-none",
                gridVisible ? "opacity-100" : "opacity-0",
              )}
            >
              {THIRDS.map((p) => (
                <span
                  key={`v${p}`}
                  className="absolute top-0 bottom-0 w-px bg-white/70 shadow-[0_0_1px_rgba(0,0,0,0.7)]"
                  style={{ left: `${p}%` }}
                />
              ))}
              {THIRDS.map((p) => (
                <span
                  key={`h${p}`}
                  className="absolute right-0 left-0 h-px bg-white/70 shadow-[0_0_1px_rgba(0,0,0,0.7)]"
                  style={{ top: `${p}%` }}
                />
              ))}
            </div>

            {/* Focal target. Focusable; arrow keys nudge, Home recenters. */}
            <div
              role="slider"
              tabIndex={0}
              aria-label="Punto focal de la portada"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round((Number.isFinite(focalX) ? focalX : 0.5) * 100)}
              aria-valuetext={`Horizontal ${pct(focalX)}, vertical ${pct(focalY)}`}
              onKeyDown={handlers.onKeyDown}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              style={{ left: pct(focalX), top: pct(focalY) }}
            >
              <span className="block h-7 w-7 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.45),0_1px_4px_rgba(0,0,0,0.55)]">
                <span className="absolute top-1/2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.5)]" />
              </span>
            </div>
          </div>

          {/* Toolbar: persistent so change/remove stay discoverable. */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onChangeImage}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Upload size={15} />
              Cambiar
            </button>
            <button
              type="button"
              onClick={recenter}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Crosshair size={15} />
              Centrar foco
            </button>
            <button
              type="button"
              onClick={onRemoveImage}
              className="ml-auto inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:text-rose-400 dark:hover:bg-rose-950/40"
            >
              <X size={15} />
              Eliminar
            </button>
          </div>

          <p className="mt-2 text-xs text-muted-foreground">
            Arrastra el punto para elegir el foco. Cada sección recorta la portada de forma distinta.
          </p>
        </div>

        {/* Preview + specs panel, mirroring the public post page hero (16/9). */}
        <div className="lg:w-80">
          <div className="rounded-xl border border-border bg-surface-warm p-4">
            <p className="text-center text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Vista del artículo
            </p>

            <figure className="mt-3">
              <div className="aspect-[16/9] overflow-hidden rounded-lg border border-border bg-muted shadow-sm">
                <img
                  src={src}
                  alt=""
                  draggable={false}
                  className="h-full w-full object-cover"
                  style={{ objectPosition }}
                />
              </div>
              <figcaption className="mx-auto mt-2.5 max-w-[24ch] text-center text-xs leading-relaxed text-muted-foreground">
                Así se recorta la portada en la página del artículo.
              </figcaption>
            </figure>

            <p className="mt-4 border-t border-border/70 pt-3 text-center text-xs leading-relaxed text-muted-foreground">
              {FORMATS.replace(/, ([^,]*)$/, " o $1")} · Máximo {MAX_MB} MB · Recomendado 1600 × 840
            </p>
          </div>

          <div className="mt-3 flex items-start gap-2.5 rounded-lg bg-muted/50 px-3.5 py-3 text-xs leading-relaxed text-muted-foreground">
            <Lightbulb size={15} className="mt-0.5 shrink-0 text-foreground" aria-hidden="true" />
            <span>
              Coloca el punto sobre el elemento más importante de la imagen; se mantiene
              visible aunque la portada se recorte o se reescale en otros tamaños.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
