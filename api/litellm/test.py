from dotenv import load_dotenv

import litellm
from litellm import completion

load_dotenv()  # take environment variables from .env.


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
        print('streaming response_cost', response_cost)
    except:
        pass


# set callback
litellm.success_callback = ['langfuse']
litellm.failure_callback = ['langfuse']


# litellm.completion() call
response = completion(model='gpt-3.5-turbo', messages=[{'role': 'user', 'content': "Hi 👋 - i'm openai"}], stream=False)


print(response.choices[0].message.content)
