import { useEffect, useRef } from "react";
import { createCustomEqual } from "fast-equals";
// import { isLatLngLiteral } from "@googlemaps/typescript-guards";

const deepCompareEqualsForMaps = createCustomEqual(
  (deepEqual) => (a: any, b: any) => {
    /**
     * It is commented out because it raises the error SyntaxError: Unexpected token 'export'.
     */

    // if (
    //   isLatLngLiteral(a) ||
    //   a instanceof google.maps.LatLng ||
    //   isLatLngLiteral(b) ||
    //   b instanceof google.maps.LatLng
    // ) {
    //   return new google.maps.LatLng(a).equals(new google.maps.LatLng(b));
    // }

    // TODO extend to other types

    // use fast-equals for other objects
    return deepEqual(a, b);
  }
);

function useDeepCompareMemoize(value: any) {
  const ref = useRef();

  if (!deepCompareEqualsForMaps(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

export function useDeepCompareEffectForMaps(
  callback: React.EffectCallback,
  dependencies: any[]
) {
  useEffect(callback, dependencies.map(useDeepCompareMemoize));
}
