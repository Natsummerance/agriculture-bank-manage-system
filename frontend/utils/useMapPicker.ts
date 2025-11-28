import { useState } from 'react';

export interface Location {
  address: string;
  lat: number;
  lng: number;
}

export function useMapPicker() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const selectLocation = (location: Location) => {
    setSelectedLocation(location);
  };

  const confirm = (onConfirm: (location: Location) => void) => {
    if (selectedLocation) {
      onConfirm(selectedLocation);
      close();
    }
  };

  // Mock location search
  const searchLocation = async (query: string): Promise<Location[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    return [
      { address: `${query} - 朝阳区`, lat: 39.9087, lng: 116.4589 },
      { address: `${query} - 海淀区`, lat: 39.9891, lng: 116.3142 },
      { address: `${query} - 东城区`, lat: 39.9289, lng: 116.4056 },
    ];
  };

  return {
    isOpen,
    open,
    close,
    selectedLocation,
    selectLocation,
    confirm,
    searchLocation,
  };
}
