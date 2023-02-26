import { StarIcon } from '@heroicons/react/solid'
import classNames from 'classnames'
import { useEffect } from 'react'
import { useState } from 'react'

type Props = {
  value: any
  type: 'LINEAR' | 'LIKERT'
  size: 'xs' | 's' | 'm' | 'lg' | 'xl'
  showLabel: boolean
  schema: any
  onChoose?: Function
  interactive?: boolean
}

const ScoreAssessment: React.FC<Props> = ({
  value = -1,
  type,
  schema,
  onChoose = () => {},
  interactive = true,
  size = 'lg',
  showLabel = true,
}) => {
  const [wrapperHovered, setWrapperHovered] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState(-1)
  const [initialIndex, setInitialIndex] = useState(-1)

  useEffect(() => {
    const idx = schema.findIndex((item: any) => item.val === value)

    setInitialIndex(idx)
    setHoveredIndex(idx)
  }, [schema, value])

  return (
    <div
      className={classNames({ 'grid grid-flow-col': interactive, 'justify-center': type === 'LINEAR' })}
      onMouseEnter={() => interactive && setWrapperHovered(true)}
      onMouseLeave={() => interactive && setWrapperHovered(false)}
    >
      {schema.map((item: any, index: number) => (
        <button
          key={item.key}
          onMouseEnter={() => interactive && setHoveredIndex(index)}
          onMouseLeave={() => interactive && setHoveredIndex(initialIndex)}
          onClick={() => interactive && onChoose(item.val)}
        >
          {type === 'LINEAR' && (
            <StarIcon
              className={classNames(``, {
                'h-20 w-20': size === 'lg',
                'h-10 w-10': size === 'm',
                'h-5 w-5': size === 's',
                'text-amber-400': wrapperHovered,
                'text-amber-300 ': !wrapperHovered,
                'opacity-100': hoveredIndex >= index,
                'opacity-30': hoveredIndex < index,
              })}
              aria-hidden="true"
            />
          )}
          {type === 'LIKERT' && (
            <div>
              <div
                className={classNames(``, {
                  'text-[40px]': size === 'lg',
                  'text-[20px]': size === 'm',
                  'text-[10px]': size === 's',
                  'opacity-100': hoveredIndex >= index,
                  'opacity-30': hoveredIndex < index,
                })}
              >
                {item.icon}
              </div>
              {showLabel && item.key}
            </div>
          )}
        </button>
      ))}
    </div>
  )
}

export default ScoreAssessment
