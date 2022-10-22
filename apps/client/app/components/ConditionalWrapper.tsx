type Props = {
  condition: boolean
  // A react prop called wrapper, that takes any react function containing a react element
  wrapper: (children?: React.ReactNode) => React.ReactNode
}

const ConditionalWrapper: React.FC<Props> = ({ condition, wrapper, children }) =>
  condition ? <>{wrapper(children)}</> : <>children</>

export default ConditionalWrapper
