from api.src import logger


def track_cost_callback(
    kwargs,
    completion_response,
    start_time,
    end_time,
):
    """
    Track cost of completion

    :param kwargs: kwargs to completion
    :param completion_response: response from completion
    :param start_time: start time
    :param end_time: end time
    """
    try:
        response_cost = kwargs.get('response_cost', 0)
        logger.info('streaming response_cost', response_cost)
    except Exception as e:
        logger.error(e)
        pass
