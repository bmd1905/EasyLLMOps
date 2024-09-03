from fastapi import APIRouter, HTTPException

from src import logger
from src.chat_completion.conversation_handler import ConversationHandler
from src.chat_completion.prompt_enhancer import DefaultPromptEnhancer
from src.schemas.prompt_schema import ConversationIn

conversation_router = APIRouter(
    prefix='/api/easyllmops_conversation',
    tags=['easyllmops_conversation'],
    responses={404: {'description': 'Not found'}},
)

conversation_handler = ConversationHandler(
    prompt_enhancer=DefaultPromptEnhancer(),
    model='gemini-flash',
)


@conversation_router.post('/conversation')
async def conversation_endpoint(data: ConversationIn):
    """
    Handles the conversation endpoint for the EasyLLMOps API.

    :param data: The conversation data

    :return: The response from the conversation
    """
    logger.info(str(data))
    try:
        return await conversation_handler.handle_conversation(data)
    except Exception as e:
        logger.error(f'Error in conversation endpoint: {e}')
        raise HTTPException(status_code=500, detail=f'An Error occurred: {str(e)}')
