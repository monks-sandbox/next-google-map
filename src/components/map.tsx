import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDeepCompareEffectForMaps } from "../hooks";

interface Props extends google.maps.MapOptions {
  children: React.ReactNode;
  style: { [key: string]: string };
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onIdle?: (map: google.maps.Map) => void;
}

export const Map: React.VFC<Props> = ({
  onClick,
  onIdle,
  children,
  style,
  ...options
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();

  useEffect(() => {
    if (ref.current && !map) {
      setMap(
        new window.google.maps.Map(ref.current, {
          zoom: options.zoom,
          center: options.center,
        })
      );
    }
  }, [ref, map]);

  useDeepCompareEffectForMaps(() => {
    if (map) {
      map.setOptions(options);
    }
  }, [map, options]);

  useEffect(() => {
    if (map) {
      ["click", "idle"].forEach((eventName) =>
        google.maps.event.clearListeners(map, eventName)
      );

      if (onClick) {
        map.addListener("click", onClick);
      }

      if (onIdle) {
        map.addListener("idle", () => onIdle(map));
      }
    }
  }, [map, onClick, onIdle]);

  return (
    <>
      <div ref={ref} style={style} />
      {Children.map(children, (child) => {
        if (isValidElement(child)) {
          // set the map prop on the child component
          return cloneElement(child, { map });
        }
      })}
    </>
  );
};

// function MyMapComponent({
//   center,
//   zoom,
// }: {
//   center: google.maps.LatLngLiteral;
//   zoom: number;
// }) {
//   const ref = useRef(null);

//   useEffect(() => {
//     if (ref.current) {
//       new window.google.maps.Map(ref.current, {
//         center,
//         zoom,
//       });
//     }
//   });

//   return (
//     <div
//       ref={ref}
//       id="map"
//       style={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         height: "80vh",
//         width: "100vw",
//       }}
//     />
//   );
// }
