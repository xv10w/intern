import { useLoadScript, Autocomplete } from '@react-google-maps/api';
import { useState, useRef } from 'react';

/** @type {("places")[]} */
const libraries = ['places'];

export default function AddressAutocomplete({ onAddressSelect, onChange, defaultValue = '' }) {
    const [address, setAddress] = useState(defaultValue);
    const autocompleteRef = useRef(null);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const onLoad = (autocomplete) => {
        autocompleteRef.current = autocomplete;
    };

    const onPlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();

            if (place.formatted_address) {
                setAddress(place.formatted_address);

                // Extract address components
                const addressComponents = {
                    fullAddress: place.formatted_address,
                    street: '',
                    city: '',
                    state: '',
                    postal_code: '',
                    country: '',
                    lat: place.geometry?.location?.lat(),
                    lng: place.geometry?.location?.lng(),
                };

                place.address_components?.forEach((component) => {
                    const types = component.types;

                    if (types.includes('street_number') || types.includes('route')) {
                        addressComponents.street += component.long_name + ' ';
                    }
                    if (types.includes('locality')) {
                        addressComponents.city = component.long_name;
                    }
                    if (types.includes('administrative_area_level_1')) {
                        addressComponents.state = component.long_name;
                    }
                    if (types.includes('postal_code')) {
                        addressComponents.postal_code = component.long_name;
                    }
                    if (types.includes('country')) {
                        addressComponents.country = component.long_name;
                    }
                });

                addressComponents.street = addressComponents.street.trim();

                if (onAddressSelect) {
                    onAddressSelect(addressComponents);
                }
            }
        }
    };

    if (loadError) {
        return (
            <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-2 text-sm shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Street Address"
            />
        );
    }

    if (!isLoaded) {
        return (
            <input
                type="text"
                value={address}
                onChange={(e) => {
                    setAddress(e.target.value);
                    if (onChange) onChange(e);
                }}
                placeholder="Street Address"
                className="mt-2 text-sm shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
        );
    }

    return (
        // @ts-ignore - Autocomplete types are incompatible with current React types
        <Autocomplete
            onLoad={onLoad}
            onPlaceChanged={onPlaceChanged}
            options={{
                componentRestrictions: { country: 'in' }, // Restrict to India for UPI payments
                fields: ['address_components', 'formatted_address', 'geometry'],
            }}
        >
            <input
                type="text"
                value={address}
                name="street"
                onChange={(e) => {
                    setAddress(e.target.value);
                    if (onChange) onChange(e);
                }}
                className="mt-2 text-sm shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Start typing your address..."
            />
        </Autocomplete>
    );
}
