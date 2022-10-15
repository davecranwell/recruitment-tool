type Props = {
  text?: string
  className?: string
  [x: string]: any
}

const Divider: React.FC<Props> = ({ text, className }) => {
  return (
    <div className={`relative py-8 ${className}`}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="bg-white px-2 text-gray-500">{text}</span>
      </div>
    </div>
  )
}

export default Divider
