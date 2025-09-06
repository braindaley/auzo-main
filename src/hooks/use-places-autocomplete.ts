
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import {
  useMapsLibrary,
  useMap,
} from '@vis.gl/react-google-maps';

export type UsePlacesAutocompleteProps = {
  debounce?: number,
  defaultValue?: string,
  options?: google.maps.places.AutocompletionRequest,
  onPlaceSelect?: (place: google.maps.places.PlaceResult) => void;
};

export const usePlacesAutocomplete = ({
  debounce = 500,
  defaultValue = '',
  options,
  onPlaceSelect
}: UsePlacesAutocompleteProps = {}) => {
  const [query, setQuery] = useState<string>(defaultValue);
  const places = useMapsLibrary('places');
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null);
  const [autocompleteService, setAutocompleteService] = useState<google.maps.places.AutocompleteService | null>(null);
  const [placePredictions, setPlacePredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [isPlacePredictionsLoading, setIsPlacePredictionsLoading] = useState<boolean>(false);
  const map = useMap();

  useEffect(() => {
    if (places && map) {
      setAutocompleteService(new places.AutocompleteService());
      setPlacesService(new places.PlacesService(map));
    }
  }, [places, map]);
  
  const getPlacePredictions = useDebouncedCallback(({ input }: { input: string }) => {
    setQuery(input);
    if (!autocompleteService || input === '') {
      setPlacePredictions([]);
      return;
    }
    
    setIsPlacePredictionsLoading(true);
    autocompleteService.getPlacePredictions({ input, ...options }, (predictions) => {
      setPlacePredictions(predictions || []);
      setIsPlacePredictionsLoading(false);
    })
  }, debounce);

  const getPlaceDetails = ({ placeId }: { placeId: string }) => {
    if (!placesService) return;
    
    placesService.getDetails({ placeId }, (place) => {
      onPlaceSelect && place && onPlaceSelect(place);
    })
  };
  
  return {
    query,
    setQuery,
    placePredictions,
    isPlacePredictionsLoading,
    getPlacePredictions,
    getPlaceDetails
  };
};

export type UsePlacesAutocompleteReturn = ReturnType<typeof usePlacesAutocomplete>;
