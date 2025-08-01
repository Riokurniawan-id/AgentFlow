import { NextRequest, NextResponse } from 'next/server'
import { AgentService } from '@/lib/agent-service'

export async function GET(
  request: NextRequest,
  { params }: { params: { agentId: string } }
) {
  try {
    const agentId = params.agentId

    if (!agentId) {
      return NextResponse.json(
        { error: 'Agent ID is required' },
        { status: 400 }
      )
    }

    const agent = await AgentService.getAgentById(agentId)

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      )
    }

    // Return only necessary data for embed (exclude sensitive info like API keys)
    const publicAgentData = {
      id: agent.id,
      name: agent.name,
      personality: agent.personality,
      personalityType: agent.personalityType,
      knowledgeBase: agent.knowledgeBase,
      aiProvider: agent.aiProvider,
      aiModel: agent.aiModel,
      maxTokens: agent.maxTokens,
      temperature: agent.temperature,
      status: agent.status,
      chatCount: agent.chatCount,
      createdAt: agent.createdAt
    }

    return NextResponse.json(publicAgentData)

  } catch (error: any) {
    console.error('Error fetching agent:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { agentId: string } }
) {
  try {
    const agentId = params.agentId
    const body = await request.json()

    if (!agentId) {
      return NextResponse.json(
        { error: 'Agent ID is required' },
        { status: 400 }
      )
    }

    const updatedAgent = await AgentService.updateAgent(agentId, body)

    if (!updatedAgent) {
      return NextResponse.json(
        { error: 'Agent not found or update failed' },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedAgent)

  } catch (error: any) {
    console.error('Error updating agent:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { agentId: string } }
) {
  try {
    const agentId = params.agentId

    if (!agentId) {
      return NextResponse.json(
        { error: 'Agent ID is required' },
        { status: 400 }
      )
    }

    const success = await AgentService.deleteAgent(agentId)

    if (!success) {
      return NextResponse.json(
        { error: 'Agent not found or delete failed' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Agent deleted successfully' })

  } catch (error: any) {
    console.error('Error deleting agent:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 