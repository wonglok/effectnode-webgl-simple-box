import { DEFAULT_QUERY_FILTER, findPath, NavMesh, type Vec3 } from 'navcat'
import { generateSoloNavMesh, type SoloNavMeshInput, type SoloNavMeshOptions } from 'navcat/blocks'

import {
  // createNavMeshHelper,
  // createNavMeshOffMeshConnectionsHelper,
  // createNavMeshPolyHelper,
  // type DebugObject,

  getPositionsAndIndices,
} from 'navcat/three'
import { Mesh, Object3D, Vector3 } from 'three'

export async function genSoloNavMesh({ walkableMeshes = [] }: { walkableMeshes: Mesh[] }) {
  //   /* generation input */
  //   // populate positions and indices with your level geometry
  //   // don't include geometry that shouldn't contribute to walkable-surface
  //   // generation, like foliage or small decorative props
  //   const positions = new Float32Array(positionsArr);
  //   const indices = new Uint32Array(indicesArr);

  if (walkableMeshes?.length <= 0) {
    throw new Error('no walk nav mesh')
  }

  const [positions, indices] = getPositionsAndIndices(walkableMeshes)

  const input: SoloNavMeshInput = {
    positions,
    indices,
  }

  /* generation options */
  // the following are defaults you might start from for a human-sized agent in a 1 m scale world.
  // it's generally recommended that you use the library debug helpers to visualize the navmesh
  // generation and fine tune these parameters.

  // heightfield parameters
  const cellSize = 0.15 * 10
  const cellHeight = 0.25 * 10

  // agent parameters
  const walkableRadiusWorld = 0.3
  const walkableHeightWorld = 2.0
  const walkableClimbWorld = 0.5
  const walkableSlopeAngleDegrees = 45

  const walkableRadiusVoxels = Math.ceil(walkableRadiusWorld / cellSize)
  const walkableClimbVoxels = Math.ceil(walkableClimbWorld / cellHeight)
  const walkableHeightVoxels = Math.ceil(walkableHeightWorld / cellHeight)

  // compact heightfield region parameters
  const minRegionArea = 8
  const mergeRegionArea = 20

  // polygon generation parameters
  const maxSimplificationError = 1.3
  const maxEdgeLength = 12
  const maxVerticesPerPoly = 5

  // detail mesh generation parameters
  const detailSampleDistanceVoxels = 6
  const detailSampleMaxErrorVoxels = 1

  const detailSampleDistance = detailSampleDistanceVoxels < 0.9 ? 0 : cellSize * detailSampleDistanceVoxels
  const detailSampleMaxError = cellHeight * detailSampleMaxErrorVoxels

  // border size around each tile, in voxels. 0 for solo navmesh.
  const borderSize = 0

  const options: SoloNavMeshOptions = {
    cellSize,
    cellHeight,
    walkableRadiusWorld,
    walkableRadiusVoxels,
    walkableClimbWorld,
    walkableClimbVoxels,
    walkableHeightWorld,
    walkableHeightVoxels,
    walkableSlopeAngleDegrees,
    borderSize,
    minRegionArea,
    mergeRegionArea,
    maxSimplificationError,
    maxEdgeLength,
    maxVerticesPerPoly,
    detailSampleDistance,
    detailSampleMaxError,
  }

  /* generate the navmesh */
  const result = generateSoloNavMesh(input, options)

  const navMesh = result.navMesh // the nav mesh
  const intermediates = result.intermediates // intermediate data for debugging
  console.log('generated navmesh:', navMesh, intermediates)

  return { navMesh, intermediates }
}

export async function runExample() {
  const { navMesh } = await genSoloNavMesh({ walkableMeshes: [] })
  /* find a path */
  const start: Vec3 = [-4, 0, -4]
  const end: Vec3 = [4, 0, 4]
  const halfExtents: Vec3 = [0.5, 0.5, 0.5]

  const path = findPath(navMesh, start, end, halfExtents, DEFAULT_QUERY_FILTER)

  console.log(
    'path:',
    path.path.map((p) => p.position),
  )
  console.log(path)
}

const startV3 = new Vector3()
const endV3 = new Vector3()

export const findPathByObjects = ({ navMesh, start, end }: { navMesh: NavMesh; start: Object3D; end: Object3D }) => {
  start.getWorldPosition(startV3)
  end.getWorldPosition(endV3)

  const startArr: Vec3 = startV3.toArray()
  const endArr: Vec3 = endV3.toArray()
  const halfExtents: Vec3 = [0.5, 0.5, 0.5]

  const path = findPath(navMesh, startArr, endArr, halfExtents, DEFAULT_QUERY_FILTER)

  console.log(
    'path:',
    path.path.map((p) => p.position),
  )

  return path
}
