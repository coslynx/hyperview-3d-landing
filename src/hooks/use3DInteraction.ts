import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';

import { three3DHelpersUtil } from '../../utils/three-helpers';

interface InteractionOptions {
  threshold?: number;
  onClick?: (object: THREE.Object3D, event: THREE.Intersection) => void;
  onHover?: (object: THREE.Object3D, event: THREE.Intersection) => void;
  objectHoveredMaterial?: THREE.Material;
  draggable?: boolean;
  useKeyboard?: boolean;
  isInterractable?: boolean;
}

interface Use3DInteractionResult {
  raycaster: THREE.Raycaster;
  intersected: THREE.Intersection | null;
  selected: THREE.Object3D | null;
  hovered: THREE.Object3D | null;
  setInteractivity: (obj: THREE.Object3D | null, isInterractable: boolean) => void;
}

const use3DInteraction = (options: InteractionOptions = {}): Use3DInteractionResult => {
  const { threshold = 0.1, onClick, onHover, objectHoveredMaterial, draggable = false, useKeyboard = false } = options;
  const { scene, camera, gl } = useThree();
  const [selected, setSelected] = useState<THREE.Object3D | null>(null);
  const [hovered, setHovered] = useState<THREE.Object3D | null>(null);
  const previousHoveredRef = useRef<THREE.Object3D | null>(null);
  const raycaster = useMemo(() => three3DHelpersUtil.createRaycaster(), []);
  const dragStart = useRef<THREE.Vector3 | null>(null);
  const isDragging = useRef<boolean>(false);
  const enableInteractivity = useRef<boolean>(false);
  const interactableMap = useRef<WeakMap<THREE.Object3D, boolean>>(new WeakMap());

  const getScreenSpacePosition = useCallback((event: React.PointerEvent): THREE.Vector2 => {
    const rect = (event.target as HTMLCanvasElement).getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width * 2 - 1;
    const y = - (event.clientY - rect.top) / rect.height * 2 + 1;
    return new THREE.Vector2(x, y);
  }, []);

  const handlePointerMove = useCallback((event: React.PointerEvent) => {
    if (!enableInteractivity.current) return;

    const pointer = getScreenSpacePosition(event);
    raycaster.ray.origin.setFromMatrixPosition(camera.matrixWorld);
    raycaster.ray.direction.set(pointer.x, pointer.y, 0.5).unproject(camera).sub(raycaster.ray.origin).normalize();

    const intersects = raycaster.intersectObjects(scene.children, true);
    const intersectedObject = intersects.length > 0 ? intersects[0].object : null;

    if (intersectedObject && interactableMap.current.get(intersectedObject)) {
      if (hovered !== intersectedObject) {
        setHovered(intersectedObject);
      }
    } else {
      setHovered(null);
    }
  }, [raycaster, scene, camera, getScreenSpacePosition, hovered]);

  useEffect(() => {
    if (hovered !== previousHoveredRef.current) {
      if (previousHoveredRef.current) {
        if(objectHoveredMaterial){
            // (previousHoveredRef.current as THREE.Mesh).material = objectHoveredMaterial;
          console.warn("No way to update color from hover");
        }
      }
      previousHoveredRef.current = hovered;
    }
  }, [hovered, objectHoveredMaterial]);

  const handleClick = useCallback((event: React.PointerEvent) => {
    if (!enableInteractivity.current) return;

    const pointer = getScreenSpacePosition(event);
    raycaster.ray.origin.setFromMatrixPosition(camera.matrixWorld);
    raycaster.ray.direction.set(pointer.x, pointer.y, 0.5).unproject(camera).sub(raycaster.ray.origin).normalize();

    const intersects = raycaster.intersectObjects(scene.children, true);
    const intersectedObject = intersects.length > 0 ? intersects[0].object : null;

    if (intersectedObject && interactableMap.current.get(intersectedObject)) {
      setSelected(intersectedObject);
      if (onClick) {
        onClick(intersectedObject, intersects[0]);
      }
    } else {
      setSelected(null);
    }
  }, [raycaster, scene, camera, getScreenSpacePosition, onClick]);

  const handleDragStart = useCallback((event: React.PointerEvent) => {
    if (!enableInteractivity.current) return;
    if (!draggable || !hovered) return;

    isDragging.current = true;
    dragStart.current = new THREE.Vector3(event.clientX, event.clientY, 0);
  }, [draggable, hovered]);

  const handleDragEnd = useCallback((event: React.PointerEvent) => {
    if (!enableInteractivity.current) return;
    if (!draggable) return;

    isDragging.current = false;
    dragStart.current = null;
  }, [draggable]);

  const updateObjectPosition = useCallback((object: THREE.Object3D, event: React.PointerEvent) => {
    if (!enableInteractivity.current) return;
    if (!draggable || !isDragging.current || !dragStart.current) return;

    const pointer = getScreenSpacePosition(event);

    const endPosition = new THREE.Vector3(event.clientX, event.clientY, 0);
    const deltaPos = new THREE.Vector3().subVectors(endPosition, dragStart.current).multiplyScalar(0.01);

    dragStart.current.copy(endPosition);

    object.position.x += deltaPos.x;
    object.position.y -= deltaPos.y;
  }, [draggable, getScreenSpacePosition]);

    const setInteractivity = useCallback((obj: THREE.Object3D | null, isInterractable: boolean) => {
        if (!obj) return;

        interactableMap.current.set(obj, isInterractable);
    }, []);

  useEffect(() => {
    const element = gl.domElement;

    const onPointerMove = (e: React.PointerEvent) => {
      handlePointerMove(e);
    };

    const onPointerDown = (e: React.PointerEvent) => {
      handleDragStart(e)
    };

    const onPointerUp = (e: React.PointerEvent) => {
      handleDragEnd(e);
    }

    const onClickEvent = (e: React.PointerEvent) => {
      handleClick(e);
    };

    element.addEventListener('pointermove', onPointerMove);
    element.addEventListener('pointerdown', onPointerDown);
    element.addEventListener('pointerup', onPointerUp)
    element.addEventListener('click', onClickEvent);

    return () => {
      element.removeEventListener('pointermove', onPointerMove);
      element.removeEventListener('pointerdown', onPointerDown);
      element.removeEventListener('pointerup', onPointerUp);
      element.removeEventListener('click', onClickEvent);
    };
  }, [gl, handlePointerMove, handleClick, handleDragStart, handleDragEnd]);

  return {
    raycaster,
    intersected: hovered,
    selected,
    hovered,
    setInteractivity,
  };
};

export default use3DInteraction;