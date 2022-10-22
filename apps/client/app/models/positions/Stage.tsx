export type Stage = {
  id: number
  name: string
  description?: String
}

export type StageInPipeline = {
  stageId: number
  pipelineId: number
  order: number
  stage: Stage
}
