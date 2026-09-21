import { rest } from '@/utils/rest'

export interface RunAgentRequest {
  sessionId: string
  userId: string
  message: string
  variables?: Record<string, unknown>
}

export interface RunAgentResponse {
  executionId: string
  agentId: string
  sessionId: string
  modelId: string
  content: string
}

export function runAgent(agentId: string, data: RunAgentRequest) {
  return rest.post<RunAgentResponse, RunAgentRequest>(`/v1/agents/${agentId}/runs`, data)
}
