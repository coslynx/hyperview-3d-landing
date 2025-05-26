import * as THREE from 'three';

/**
 * Interface for cached models, mapping URLs to THREE.Group objects.
 */
interface ModelCache {
    [url: string]: THREE.Group;
}

/**
 * LoadModel function params.
 */
interface loadModelParams {
    url: string;
}

/**
 * Disposes a model by traversing its scene and disposing of geometries and materials.
 *
 * @param model The 3D model (THREE.Group) to dispose.
 */
const disposeModel = (model: THREE.Group): void => {
    model.traverse((object: any) => {
        if (object.isMesh) {
            object.geometry?.dispose();

            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => {
                        material.dispose();
                        if (material.map) material.map.dispose();
                        if (material.normalMap) material.normalMap?.dispose();
                        if (material.roughnessMap) material.roughnessMap?.dispose();
                        if (material.metalnessMap) material.metalnessMap?.dispose();
                    });
                } else {
                    object.material.dispose();
                    if (object.material.map) object.material.map.dispose();
                    if (object.material.normalMap) object.material.normalMap?.dispose();
                    if (object.material.roughnessMap) object.material.roughnessMap?.dispose();
                    if (object.material.metalnessMap) object.material.metalnessMap?.dispose();
                }
            }
        }
    });
};

/**
 * The cache for storing loaded 3D models, keyed by URL.
 */
const modelCache: ModelCache = {};

/**
 * Asynchronously loads a 3D model from the provided URL using THREE.GLTFLoader.
 * Implements caching to efficiently reuse models.
 *
 * @param url - The URL of the 3D model to load (e.g., GLTF or GLB file).
 * @returns A Promise that resolves with the loaded THREE.Group model.
 */
const loadModel = async ({ url }: loadModelParams): Promise<THREE.Group> => {
    if (modelCache[url]) {
        return modelCache[url].clone(); // Return a clone to avoid shared state
    }

    return new Promise((resolve, reject) => {
        new THREE.GLTFLoader().load(
            url,
            (gltf) => {
                const model = gltf.scene;
                modelCache[url] = model; // Cache the loaded model
                resolve(model.clone()); // Return a clone
            },
            (xhr) => {
                // Handle loading progress
                // console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                console.error('An error happened', error);
                reject(error);
            }
        );
    });
};

/**
 * Returns a 3D model from the cache.
 *
 * @param url - The URL of the 3D model.
 * @returns The 3D model or `undefined` if it is not in the cache.
 */
const getModel = (url: string): THREE.Group | undefined => {
    if (modelCache[url]) {
        return modelCache[url].clone(); // Return a clone to avoid shared state
    }
    return undefined;
};

/**
 * Clears the model cache, disposing of all models to free up memory.
 */
const clearCache = (): void => {
    Object.values(modelCache).forEach(model => {
        disposeModel(model);
    });
    Object.keys(modelCache).forEach(key => delete modelCache[key]);
    THREE.Cache.enabled = true;
};

export { loadModel, disposeModel, clearCache, getModel };