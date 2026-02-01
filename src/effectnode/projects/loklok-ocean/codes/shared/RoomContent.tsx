import { useGLTF } from '@react-three/drei'
import { useEffect, useMemo } from 'react'
import { Mesh, Object3D } from 'three'

// @ts-ignore
import { clone } from 'three/examples/jsm/utils/SkeletonUtils'
import { findPathByObjects, genSoloNavMesh } from './navcat/simple-nav'

export function RoomContent({ files }: any) {
  let gltf = useGLTF('/projects/loklok-ocean/env/digital-palace-loklok.glb') as any

  let cloned = useMemo(() => {
    return clone(gltf?.scene) as any
  }, [gltf?.scene?.uuid])

  useEffect(() => {
    //

    //
    const meshes: Mesh[] = []

    //
    cloned.traverse((it: Mesh) => {
      if (it.isMesh) {
        it.castShadow = true
        it.receiveShadow = true

        meshes.push(it)
      }
    })

    genSoloNavMesh({
      walkableMeshes: meshes,
    }).then(({ navMesh }) => {
      console.log('navMesh')
      console.log(navMesh)

      let start = new Object3D()
      let end = new Object3D()

      start.position.set(0, 1, 0)
      end.position.set(10, 1, 10)

      findPathByObjects({
        navMesh: navMesh,
        start: start,
        end: end,
      })
    })
  }, [cloned])

  return (
    <group
      onClick={(ev) => {
        console.log('clicked', ev.point.toArray(), ev.object.name)
      }}
    >
      <primitive object={cloned}></primitive>
    </group>
  )
}

//
//
//
