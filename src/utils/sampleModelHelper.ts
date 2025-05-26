import * as THREE from 'three';

/**
 * SampleModel interface defines the structure for 3D model data.
 */
export interface SampleModel {
    /** URL of the 3D model (e.g., GLTF/GLB file). */
    url: string;
    /** Title of the 3D model. */
    title: string;
    /** Description of the 3D model. */
    description: string;
    /** External URL for more details about the model. */
    href: string;
    /** Boolean if geometry cast a shadow*/
    castShadow?: boolean;
    /**Boolean to decide if geometry receive a shadow*/
    receiveShadow?: boolean;
}

/**
 * Returns an array of sample 3D model data for demonstration purposes.
 *
 * @returns An array of `SampleModel` objects.
 * @throws {Error} If there is an issue loading sample models.
 */
export const getSampleModels = (): SampleModel[] => {
    try {
        const baseUrl = '/models/';

        const isValidURL = (url: string): boolean => {
          try {
            new URL(url);
            return true;
          } catch (_) {
            return false;
          }
        };

        if (!isValidURL(baseUrl)) {
          console.warn("baseUrl is not a valid url, check the getSampleModels");
        }

        const sampleModels: SampleModel[] = [
            {
                url: `${baseUrl}laptop.glb`,
                title: 'Laptop',
                description: 'A high-quality 3D model of a modern laptop. Ideal for showcasing product features or creating realistic office environments.',
                href: 'https://example.com/laptop-details',
                castShadow: true,
                receiveShadow: true,
            },
            {
                url: `${baseUrl}modern-chair.glb`,
                title: 'Modern Chair',
                description: 'A stylish 3D model of a modern chair. Perfect for interior design visualizations and furniture showcases.',
                href: 'https://example.com/chair-details',
                castShadow: true,
                receiveShadow: true,
            },
            {
                url: `${baseUrl}plant.glb`,
                title: 'Office Plant',
                description: 'A detailed 3D model of an office plant. Use it to add a touch of greenery and realism to your 3D scenes.',
                href: 'https://example.com/plant-details',
                castShadow: false,
                receiveShadow: false,
            },
        ];
        return sampleModels;
    } catch (error) {
        console.warn('Error loading sample models:', error);
        return [];
    }
};