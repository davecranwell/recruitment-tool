export type Stage = {
  id: number
  name: string
  description?: String
  pipelineId: number
  order: number
  _count?: {
    applicants: number
  }
}

// export type StageInPipeline = {
//   stageId: number

//   stage: Stage
// }
