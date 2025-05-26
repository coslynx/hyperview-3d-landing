import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

/**
 * @module three3DHelpersUtil
 * @description Provides a collection of utility functions for common Three.js operations, such as object creation, material manipulation, geometry generation, and scene management.
 *
 * @remarks
 * This module promotes code reuse and simplifies Three.js tasks throughout the application, adhering to performance and WebGL best practices. It integrates with the project's theme and ensures responsive and accessible 3D experiences.
 *
 * @see Three.js documentation for core concepts and APIs
 * {@link https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene | Creating a scene}
 *
 * @example
 * ```typescript
 * // Import the module
 * import { three3DHelpersUtil } from './utils/three-helpers';
 *
 * // Create a mesh
 * const geometry = new THREE.BoxGeometry(1, 1, 1);
 * const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
 * const mesh = three3DHelpersUtil.createMesh(geometry, material);
 * ```
 */

/**
 * @function createMesh
 * @description Creates a Three.js Mesh object with specified geometry and material.
 *
 * @param geometry - The geometry for the mesh.
 * @param material - The material for the mesh.
 * @returns A Three.js Mesh object.
 *
 * @example
 * ```typescript
 * const geometry = new THREE.BoxGeometry(1, 1, 1);
 * const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
 * const mesh = three3DHelpersUtil.createMesh(geometry, material);
 * ```
 */
export const createMesh = (geometry: THREE.BufferGeometry, material: THREE.Material): THREE.Mesh => {
  if (!geometry) {
    console.warn('createMesh: Geometry is undefined.');
    throw new Error('createMesh: Geometry cannot be undefined.');
  }

  if (!material) {
    console.warn('createMesh: Material is undefined.');
    throw new Error('createMesh: Material cannot be undefined.');
  }

  try {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  } catch (error:any) {
    console.error('Error creating mesh:', error);
    throw new Error(`Failed to create mesh: ${error.message}`);
  }
};

/**
 * @function createCamera
 * @description Creates a Three.js PerspectiveCamera with specified parameters.
 * @param fov - The field of view in degrees.
 * @param aspect - The aspect ratio (width / height).
 * @param near - The near clipping plane.
 * @param far - The far clipping plane.
 * @returns A Three.js PerspectiveCamera.
 *
 * @example
 * ```typescript
 * const camera = three3DHelpersUtil.createCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
 * ```
 */
export const createCamera = (fov: number, aspect: number, near: number, far: number): THREE.PerspectiveCamera => {
  if (typeof fov !== 'number' || typeof aspect !== 'number' || typeof near !== 'number' || typeof far !== 'number') {
    console.warn('createCamera: Invalid parameters. Ensure all arguments are numbers.');
    throw new Error('createCamera: Invalid parameters. Ensure all arguments are numbers.');
  }

  try {
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);
    return camera;
  } catch (error:any) {
    console.error('Error creating camera:', error);
    throw new Error(`Failed to create camera: ${error.message}`);
  }
};

/**
 * @function createLight
 * @description Creates a Three.js DirectionalLight with specified color and intensity.
 *
 * @param color - The color of the light.
 * @param intensity - The intensity of the light.
 * @returns A Three.js DirectionalLight.
 *
 * @example
 * ```typescript
 * const light = three3DHelpersUtil.createLight(0xffffff, 0.5);
 * ```
 */
export const createLight = (color: number, intensity: number): THREE.DirectionalLight => {
  if (typeof color !== 'number' || typeof intensity !== 'number') {
    console.warn('createLight: Invalid parameters. Ensure color and intensity are numbers.');
    throw new Error('createLight: Invalid parameters. Ensure color and intensity are numbers.');
  }

  try {
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(5, 5, 5);
    light.castShadow = true;
    return light;
  } catch (error:any) {
    console.error('Error creating light:', error);
    throw new Error(`Failed to create light: ${error.message}`);
  }
};

/**
 * @function loadModel
 * @description Loads a 3D model from a given path using GLTFLoader with Draco compression support.
 * @param path - The path to the 3D model file (GLTF/GLB).
 * @returns A Promise that resolves with a Three.js Group containing the loaded model.
 *
 * @example
 * ```typescript
 * three3DHelpersUtil.loadModel('/models/scene.glb').then((model) => {
 *   scene.add(model);
 * });
 * ```
 */
export const loadModel = async (path: string): Promise<THREE.Group> => {
  if (typeof path !== 'string') {
    console.warn('loadModel: Invalid path. Ensure path is a string.');
    throw new Error('loadModel: Invalid path. Ensure path is a string.');
  }

  try {
    return new Promise((resolve, reject) => {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('/draco/'); // Specify the Draco decoder path - MUST DEPLOY DRACO FILES

      const gltfLoader = new GLTFLoader();
      gltfLoader.setDRACOLoader(dracoLoader);

      gltfLoader.load(
        path,
        (gltf) => {
          const model = gltf.scene;
          resolve(model);
        },
        (xhr) => {
          // Handle loading progress
          // console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        (error) => {
          console.error('Error loading model:', error);
          reject(error);
        }
      );
    });
  } catch (error:any) {
    console.error('Error loading model:', error);
    throw new Error(`Failed to load model: ${error.message}`);
  }
};

/**
 * @function createRaycaster
 * @description Creates a Three.js Raycaster for 3D object picking.
 *
 * @returns A new THREE.Raycaster object for raycasting operations.
 *
 * @example
 * ```typescript
 * const raycaster = three3DHelpersUtil.createRaycaster();
 * ```
 */
export const createRaycaster = (): THREE.Raycaster => {
  try {
    return new THREE.Raycaster();
  } catch (error:any) {
    console.error('Error creating raycaster:', error);
    throw new Error(`Failed to create raycaster: ${error.message}`);
  }
};

/**
 * @function addLightsToScene
 * @description Adds multiple lights to scene.
 *
 * @param scene - ThreeJS scene instance.
 * @param lights - Array with lights.
 * @returns void
 *
 * @example
 * ```typescript
 * three3DHelpersUtil.addLightsToScene(scene, [ light, light2 ]);
 * ```
 */
export const addLightsToScene = (scene: THREE.Scene, lights: THREE.Light[]): void => {
  if (!scene) {
    console.warn('addLightsToScene: Scene is undefined.');
    return;
  }

  if (!Array.isArray(lights)) {
    console.warn('addLightsToScene: Lights is not an array.');
    return;
  }

  try {
    lights.forEach(light => {
      if (light && light instanceof THREE.Light) {
        scene.add(light);
      } else {
        console.warn('addLightsToScene: Invalid light object. Skipping.');
      }
    });
  } catch (error:any) {
    console.error('Error adding lights to scene:', error);
  }
};

/**
 * @function recursiveDespose
 * @description Recursively disposes of all objects in a Three.js scene to free up memory and prevent memory leaks.
 *
 * @param obj - ThreeJS object.
 * @returns void
 *
 * @example
 * ```typescript
 * three3DHelpersUtil.recursiveDespose(scene);
 * ```
 */
export const recursiveDespose = (obj: THREE.Object3D): void => {
  if (!obj) return;

  try {
    obj.traverse(function (node: THREE.Object3D) {
      if (node instanceof THREE.Mesh) {
        node.geometry?.dispose();
        if (node.material) {
          if (Array.isArray(node.material)) {
            node.material.forEach(material => {
              if (material.map) material.map.dispose();
              material.dispose();
            });
          } else {
            if (node.material.map) node.material.map.dispose();
            (node.material as THREE.Material).dispose();
          }
        }
      }
    });

    if (obj.parent) {
      obj.removeFromParent();
    }
  } catch (error:any) {
    console.error('Error disposing object:', error);
  }
};

/**
 * @function applyMaterialToAllChildren
 * @description Recursively applies a specified material to all children of a Three.js object (e.g., a loaded model).
 * @param object - The parent Three.js object.
 * @param material - The Three.js material to apply to all children.
 *
 * @example
 * ```typescript
 * const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
 * three3DHelpersUtil.applyMaterialToAllChildren(model, material);
 * ```
 */
export const applyMaterialToAllChildren = (object: THREE.Object3D, material: THREE.Material): void => {
  if (!object) {
    console.warn('applyMaterialToAllChildren: Object is undefined.');
    return;
  }

  if (!material) {
    console.warn('applyMaterialToAllChildren: Material is undefined.');
    return;
  }

  try {
    object.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        node.material = material;
      }
    });
  } catch (error:any) {
    console.error('Error applying material to children:', error);
  }
};

/**
 * @function createBasicMaterial
 * @description Creates a basic Three.js material with specified properties, integrating with the project's theme.
 *
 * @param color - The color of the material.
 * @param transparent - Whether the material is transparent.
 * @param opacity - The opacity of the material (if transparent).
 * @returns A Three.js MeshBasicMaterial with the specified properties.
 *
 * @example
 * ```typescript
 * const material = three3DHelpersUtil.createBasicMaterial(0xff0000, true, 0.5);
 * ```
 */
export const createBasicMaterial = (color: number, transparent: boolean, opacity: number): THREE.MeshBasicMaterial => {
  if (typeof color !== 'number') {
    console.warn('createBasicMaterial: Invalid color. Ensure color is a number.');
  }

  if (typeof transparent !== 'boolean') {
    console.warn('createBasicMaterial: Invalid transparent. Ensure transparent is a boolean.');
  }

  if (typeof opacity !== 'number') {
    console.warn('createBasicMaterial: Invalid opacity. Ensure opacity is a number.');
  }

  try {
    const material = new THREE.MeshBasicMaterial({
      color: color,
      transparent: transparent,
      opacity: opacity,
    });
    return material;
  } catch (error:any) {
    console.error('Error creating basic material:', error);
    throw new Error(`Failed to create basic material: ${error.message}`);
  }
};

/**
 * @function createStandardMaterial
 * @description Creates a standard Three.js material with specified properties, integrating with the project's theme.
 * @param color - The color of the material.
 * @param roughness - The roughness of the material.
 * @param metalness - The metalness of the material.
 * @returns A Three.js MeshStandardMaterial with the specified properties.
 *
 * @example
 * ```typescript
 * const material = three3DHelpersUtil.createStandardMaterial(0xff0000, 0.5, 0.5);
 * ```
 */
export const createStandardMaterial = (color: number, roughness: number, metalness: number): THREE.MeshStandardMaterial => {
  if (typeof color !== 'number') {
    console.warn('createStandardMaterial: Invalid color. Ensure color is a number.');
  }

  if (typeof roughness !== 'number') {
    console.warn('createStandardMaterial: Invalid roughness. Ensure roughness is a number.');
  }

  if (typeof metalness !== 'number') {
    console.warn('createStandardMaterial: Invalid metalness. Ensure metalness is a number.');
  }

  try {
    const material = new THREE.MeshStandardMaterial({
      color: color,
      roughness: roughness,
      metalness: metalness,
    });
    return material;
  } catch (error:any) {
    console.error('Error creating standard material:', error);
    throw new Error(`Failed to create standard material: ${error.message}`);
  }
};

/**
 * @function createShaderMaterial
 * @description Creates a custom shader material with specified vertex and fragment shaders.
 *
 * @param vertexShader - The vertex shader code.
 * @param fragmentShader - The fragment shader code.
 * @param uniforms - Uniforms to pass to the shader.
 * @returns A Three.js ShaderMaterial with the specified shaders and uniforms.
 *
 * @example
 * ```typescript
 * const material = three3DHelpersUtil.createShaderMaterial(vertexShader, fragmentShader, uniforms);
 * ```
 */
export const createShaderMaterial = (vertexShader: string, fragmentShader: string, uniforms: { [uniform: string]: THREE.IUniform }): THREE.ShaderMaterial => {
  if (typeof vertexShader !== 'string') {
    console.warn('createShaderMaterial: Invalid vertexShader. Ensure vertexShader is a string.');
  }

  if (typeof fragmentShader !== 'string') {
    console.warn('createShaderMaterial: Invalid fragmentShader. Ensure fragmentShader is a string.');
  }

  if (typeof uniforms !== 'object' || uniforms === null) {
    console.warn('createShaderMaterial: Invalid uniforms. Ensure uniforms is an object.');
  }

  try {
    const material = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: uniforms,
    });
    return material;
  } catch (error:any) {
    console.error('Error creating shader material:', error);
    throw new Error(`Failed to create shader material: ${error.message}`);
  }
};

/**
 * @function applyTexture
 * @description Applies a texture to a given material.
 *
 * @param material - The material to apply the texture to.
 * @param texturePath - The path to the texture image.
 * @returns void
 *
 * @example
 * ```typescript
 * const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
 * three3DHelpersUtil.applyTexture(material, '/textures/myTexture.png');
 * ```
 */
export const applyTexture = (material: THREE.Material, texturePath: string): void => {
  if (!material) {
    console.warn('applyTexture: Material is undefined.');
    return;
  }

  if (typeof texturePath !== 'string') {
    console.warn('applyTexture: Texture path is invalid');
    return;
  }

  try {
    new THREE.TextureLoader().load(texturePath, (texture) => {
      material.map = texture;
      material.needsUpdate = true;
    }, undefined, (error) => {
      console.error('An error occurred while loading the texture.', error);
    });
  } catch (error:any) {
    console.error('Error applying texture:', error);
  }
};

export const createEnvironmentMap = (url: string, renderer: THREE.WebGLRenderer): THREE.Texture | null => {
  try {
    const texture = new THREE.CubeTextureLoader().load( [
      url + 'px.png', url + 'nx.png',
      url + 'py.png', url + 'ny.png',
      url + 'pz.png', url + 'nz.png'
    ] );

    texture.encoding = THREE.sRGBEncoding;
    return texture;
  }
  catch (error:any) {
    console.error( 'Error loading environment map', error);
    return null;
  }
}

const three3DHelpersUtil = {
  createMesh,
  createCamera,
  createLight,
  loadModel,
  createRaycaster,
  addLightsToScene,
  recursiveDespose,
  applyMaterialToAllChildren,
  createBasicMaterial,
  createStandardMaterial,
  createShaderMaterial,
  applyTexture,
  createEnvironmentMap
};

export { three3DHelpersUtil };