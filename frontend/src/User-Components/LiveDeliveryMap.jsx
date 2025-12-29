import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { useEffect } from "react";

function Recenter({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom(), { animate: true });
  }, [lat, lng]);
  return null;
}

export default function LiveDeliveryMap({ location }) {
  if (!location) {
    return (
      <p className="text-center text-gray-500">
        Waiting for delivery partner location...
      </p>
    );
  }

  return (
    <MapContainer
      center={[location.lat, location.lng]}
      zoom={16}
      style={{ height: "300px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[location.lat, location.lng]} />
      <Recenter lat={location.lat} lng={location.lng} />
    </MapContainer>
  );
}
