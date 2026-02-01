import { helvetica } from '@/components/helvetica-font/font.helvetica'
import { Center, Html, Text3D } from '@react-three/drei'
import { ReactNode, useEffect, useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import { Flex, Box } from '@react-three/flex'

export function ToolBox({ useStore, useNodeMemory }) {
  const primaryColor = useNodeMemory((r) => r.primaryColor)
  const secondaryColor = useNodeMemory((r) => r.secondaryColor)

  const textColor = useNodeMemory((r) => r.textColor)
  const backgroundColor = useNodeMemory((r) => r.backgroundColor)

  return (
    <>
      {/*  */}
      <div className='p-5'>
        <div className='p-5'>
          <div>primaryColor</div>
          <HexColorPicker
            color={primaryColor}
            onChange={(change) => {
              useNodeMemory.setState({
                primaryColor: change,
              })
            }}
          />
        </div>
        <div className='p-5'>
          <div>secondaryColor</div>
          <HexColorPicker
            color={secondaryColor}
            onChange={(change) => {
              useNodeMemory.setState({
                secondaryColor: change,
              })
            }}
          />
        </div>
        <div className='p-5'>
          <div>textColor</div>
          <HexColorPicker
            color={textColor}
            onChange={(change) => {
              useNodeMemory.setState({
                textColor: change,
              })
            }}
          />
        </div>
        <div className='p-5'>
          <div>backgroundColor</div>
          <HexColorPicker
            color={backgroundColor}
            onChange={(change) => {
              useNodeMemory.setState({
                backgroundColor: change,
              })
            }}
          />
        </div>
      </div>
    </>
  )
}

export function Runtime({ useNodeMemory, io }) {
  //

  const primaryColor = useNodeMemory((r) => r.primaryColor)
  useEffect(() => {
    io.output(0, primaryColor)
  }, [io, primaryColor])

  const secondaryCollor = useNodeMemory((r) => r.secondaryCollor)
  useEffect(() => {
    io.output(0, secondaryCollor)
  }, [io, secondaryCollor])

  const textColor = useNodeMemory((r) => r.textColor)
  useEffect(() => {
    io.output(0, textColor)
  }, [io, textColor])

  const backgroundColor = useNodeMemory((r) => r.backgroundColor)
  useEffect(() => {
    io.output(0, backgroundColor)
  }, [io, backgroundColor])

  return <></>
}

const Flexbox = Flex as typeof Flex | any
const Boxunit = Box as typeof Box | any

export function NodeBox({ useNodeMemory }) {
  return (
    <group position={[-1, 0, -5]}>
      <group rotation={[-0.5 * Math.PI, 0, 0]}>
        <Flexbox centerAnchor justifyContent='center' alignItems={'center'}>
          <Boxunit centerAnchor justifyContent='start' margin={0.5}>
            <group rotation={[0, 0, 0]}>
              <InputColor keyname='primaryColor' useNodeMemory={useNodeMemory}></InputColor>
            </group>
          </Boxunit>
          <Boxunit centerAnchor justifyContent='start' margin={0.5}>
            <group rotation={[0, 0, 0]}>
              <InputColor keyname='secondaryColor' useNodeMemory={useNodeMemory}></InputColor>
            </group>
          </Boxunit>
          <Boxunit centerAnchor justifyContent='start' margin={0.5}>
            <group rotation={[0, 0, 0]}>
              <InputColor keyname='textColor' useNodeMemory={useNodeMemory}></InputColor>
            </group>
          </Boxunit>
          <Boxunit centerAnchor justifyContent='start' margin={0.5}>
            <group rotation={[0, 0, 0]}>
              <InputColor keyname='backgroundColor' useNodeMemory={useNodeMemory}></InputColor>
            </group>
          </Boxunit>
        </Flexbox>
      </group>
    </group>
  )
}

function InputColor({ useNodeMemory, keyname = 'primaryColor' }) {
  const value = useNodeMemory((r) => r[keyname])

  return (
    <>
      <Text3D size={1} font={helvetica as any}>
        {keyname}
        <meshBasicMaterial color={value}></meshBasicMaterial>
      </Text3D>
      <Html>
        <input
          type='color'
          className='h-5'
          value={value}
          onChange={(va) => {
            useNodeMemory.setState({
              [keyname]: va.target.value,
            })
          }}
        />
      </Html>
    </>
  )
}
