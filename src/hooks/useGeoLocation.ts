import { useState, useEffect } from "react";

const ANONYMOUS_NAMES = [
  "Monkey", "Panda", "Tiger", "Eagle", "Dolphin", "Fox", "Wolf", "Bear",
  "Hawk", "Lion", "Cobra", "Falcon", "Shark", "Raven", "Phoenix", "Jaguar",
  "Panther", "Viper", "Sparrow", "Mustang", "Bison", "Lynx", "Orca", "Gecko",
];

function getRandomName(): string {
  const name = ANONYMOUS_NAMES[Math.floor(Math.random() * ANONYMOUS_NAMES.length)];
  const num = Math.floor(Math.random() * 999) + 1;
  return `${name}${num}`;
}

interface GeoInfo {
  country: string;
  countryCode: string;
  anonymousName: string;
}

export function useGeoLocation() {
  const [geoInfo, setGeoInfo] = useState<GeoInfo>({
    country: "Unknown",
    countryCode: "",
    anonymousName: getRandomName(),
  });

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        if (res.ok) {
          const data = await res.json();
          setGeoInfo((prev) => ({
            ...prev,
            country: data.country_name || "Unknown",
            countryCode: data.country_code?.toLowerCase() || "",
          }));
        }
      } catch {
        // Fallback — keep "Unknown"
      }
    };
    fetchCountry();
  }, []);

  return geoInfo;
}
