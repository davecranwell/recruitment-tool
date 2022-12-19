import { StarIcon } from '@heroicons/react/solid'
import { useEffect } from 'react'
import { useState } from 'react'

type Props = {
  value: any
  type: 'LINEAR' | 'LIKERT'
  schema: any
  onChoose?: Function
}

const ScoreAssessment: React.FC<Props> = ({ value = -1, type, schema, onChoose = () => {} }) => {
  const [wrapperHovered, setWrapperHovered] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState(-1)
  const [initialIndex, setInitialIndex] = useState(-1)

  const iconSize = `h-20 w-20`

  useEffect(() => {
    const idx = schema.findIndex((item: any) => item.val === value)

    setInitialIndex(idx)
    setHoveredIndex(idx)
  }, [schema, value])

  return (
    <div
      className={`grid grid-flow-col ${type === 'LINEAR' && 'justify-center'}`}
      onMouseEnter={() => setWrapperHovered(true)}
      onMouseLeave={() => setWrapperHovered(false)}
    >
      {schema.map((item: any, index: number) => (
        <button
          key={item.key}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(initialIndex)}
          onClick={() => onChoose(item.val)}
        >
          {type === 'LINEAR' && (
            <StarIcon
              className={`${iconSize} ${wrapperHovered ? 'text-amber-400' : 'text-amber-300 '} ${
                hoveredIndex >= index ? 'opacity-100' : 'opacity-30'
              }`}
              aria-hidden="true"
            />
          )}
          {type === 'LIKERT' && (
            <div>
              <div className={`text-[40px] ${hoveredIndex >= index ? 'opacity-100' : 'opacity-30'}`}>{item.icon}</div>
              {item.key}
            </div>
          )}
        </button>
      ))}
    </div>
  )
}

export default ScoreAssessment
