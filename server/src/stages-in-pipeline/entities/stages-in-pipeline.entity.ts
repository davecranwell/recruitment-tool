import { Stage } from 'src/stage/entities/stage.entity'
import { Pipeline } from 'src/pipeline/entities/pipeline.entity'

export class StagesInPipeline {
  stage?: Stage
  stageId: number
  pipeline?: Pipeline
  pipelineId: number
  order: number
  createdAt: Date
  updatedAt: Date
}
