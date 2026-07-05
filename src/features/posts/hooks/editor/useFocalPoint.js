import { useCallback, useRef, useState } from "react";

const clamp01 = (n) => Math.min(1, Math.max(0, n));

// Owns the pointer + keyboard math for positioning the cover focal point.
// Keeps the picker component declarative: it just renders `focalX`/`focalY`
// and spreads `handlers` onto the image stage.
//
// - `onChange(field, value)` is the same lifted setter used across the editor;
//   we commit `focalX` / `focalY` (normalized to [0,1]) through it.
export function useFocalPoint({ focalX, focalY, onChange }) {
  const stageRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const commitFromEvent = useCallback(
    (event) => {
      const el = stageRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = clamp01((event.clientX - rect.left) / rect.width);
      const y = clamp01((event.clientY - rect.top) / rect.height);
      onChange("focalX", x);
      onChange("focalY", y);
    },
    [onChange],
  );

  const onPointerDown = useCallback(
    (event) => {
      // Ignore secondary buttons; keep the drag on the stage via pointer capture.
      if (event.button !== 0) return;
      event.currentTarget.setPointerCapture?.(event.pointerId);
      setDragging(true);
      commitFromEvent(event);
    },
    [commitFromEvent],
  );

  const onPointerMove = useCallback(
    (event) => {
      if (!dragging) return;
      commitFromEvent(event);
    },
    [dragging, commitFromEvent],
  );

  const endDrag = useCallback((event) => {
    if (event?.pointerId != null) {
      event.currentTarget.releasePointerCapture?.(event.pointerId);
    }
    setDragging(false);
  }, []);

  const onKeyDown = useCallback(
    (event) => {
      const step = event.shiftKey ? 0.05 : 0.01;
      const x = Number.isFinite(focalX) ? focalX : 0.5;
      const y = Number.isFinite(focalY) ? focalY : 0.5;
      switch (event.key) {
        case "ArrowLeft":
          onChange("focalX", clamp01(x - step));
          break;
        case "ArrowRight":
          onChange("focalX", clamp01(x + step));
          break;
        case "ArrowUp":
          onChange("focalY", clamp01(y - step));
          break;
        case "ArrowDown":
          onChange("focalY", clamp01(y + step));
          break;
        case "Home":
        case "0":
          onChange("focalX", 0.5);
          onChange("focalY", 0.5);
          break;
        default:
          return;
      }
      event.preventDefault();
    },
    [focalX, focalY, onChange],
  );

  const recenter = useCallback(() => {
    onChange("focalX", 0.5);
    onChange("focalY", 0.5);
  }, [onChange]);

  return {
    stageRef,
    dragging,
    recenter,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onKeyDown,
    },
  };
}
