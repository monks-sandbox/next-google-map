import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { Status, Wrapper } from "@googlemaps/react-wrapper";
import { Map } from "../components/map";
import { Marker } from "../components/maker";
import { Form } from "../components/form";

const render = (status: Status) => {
  if (status === Status.LOADING) return <h3>{status} ..</h3>;
  if (status === Status.FAILURE) return <h3>{status} ...</h3>;
  return <></>;
};

const App: NextPage = () => {
  const [clicks, setClicks] = useState<google.maps.LatLng[]>([]);
  const [zoom, setZoom] = useState(16); // initial zoom
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({
    lat: 35.6351075,
    lng: 139.7100831,
  });

  const onClick = (e: google.maps.MapMouseEvent) => {
    // avoid directly mutating state
    setClicks([...clicks, e.latLng!]);
  };

  const onIdle = (m: google.maps.Map) => {
    console.log("onIdle");
    setZoom(m.getZoom()!);

    const currentZoom = m.getZoom();
    if (currentZoom) {
      setZoom(currentZoom);
    }

    const currentCenter = m.getCenter();
    if (currentCenter) {
      setCenter(currentCenter.toJSON());
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      <Wrapper
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY ?? ""}
        // apiKey={""}
        render={render}
      >
        <Map
          center={center}
          onClick={onClick}
          onIdle={onIdle}
          zoom={zoom}
          style={{ flexGrow: "1", height: "100%" }}
          // style={{
          //   display: "flex",
          //   justifyContent: "center",
          //   alignItems: "center",
          //   height: "80vh",
          //   width: "100vw",
          // }}
        >
          {clicks.map((latLng, i) => (
            <Marker key={i} position={latLng} />
          ))}
        </Map>
      </Wrapper>

      <Form {...{ clicks, zoom, center, setClicks, setZoom, setCenter }} />
    </div>
  );
};

const Page: NextPage = () => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <></>;
  }

  return <App />;
};

export default Page;
