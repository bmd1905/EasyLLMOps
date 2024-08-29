from langfuse.openai import openai
from opentelemetry import metrics
from opentelemetry.exporter.jaeger.thrift import JaegerExporter
from opentelemetry.exporter.prometheus import PrometheusMetricReader
from opentelemetry.metrics import set_meter_provider
from opentelemetry.sdk.metrics import MeterProvider
from opentelemetry.sdk.resources import SERVICE_NAME, Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.trace import get_tracer_provider, set_tracer_provider
from prometheus_client import start_http_server
from slowapi import Limiter
from slowapi.util import get_remote_address

from src import logger

limiter = None


def setup_prometheus() -> metrics.Meter:
    """Set up Prometheus client and metrics."""
    try:
        # Start Prometheus client
        start_http_server(port=8099, addr='0.0.0.0')

        # Set up Prometheus metrics
        resource = Resource(attributes={SERVICE_NAME: 'promptalchemy-service'})

        # Set up Prometheus metric reader
        reader = PrometheusMetricReader()

        # Set up Prometheus meter provider
        provider = MeterProvider(resource=resource, metric_readers=[reader])
        set_meter_provider(provider)

        # Get Prometheus meter
        meter = metrics.get_meter('mypromptalchemy', '0.3.6')

        return meter
    except Exception as e:
        logger.info(f'Failed to set up Prometheus metrics: {e}')
        return None


def setup_jaeger() -> TracerProvider:
    """Set up Jaeger tracer and exporter."""
    try:
        # Set up Jaeger tracer provider
        set_tracer_provider(
            TracerProvider(resource=Resource.create({SERVICE_NAME: 'promptalchemy-service-trace-manual'}))
        )

        # Get Jaeger tracer
        tracer = get_tracer_provider().get_tracer('mypromptalchemy-trace', '0.1.2')

        # Set up Jaeger exporter
        jaeger_exporter = JaegerExporter(
            agent_host_name='jaeger',
            agent_port=6831,
        )

        # Set up Jaeger span processor
        span_processor = BatchSpanProcessor(jaeger_exporter)
        get_tracer_provider().add_span_processor(span_processor)

        logger.info('Jaeger tracer setup successfully.')
        return tracer
    except Exception as e:
        logger.info(f'Failed to set up Jaeger tracer: {e}')
        return None


async def startup():
    """Initialize components at application startup."""
    global limiter

    # Initialize rate limiter
    limiter = Limiter(key_func=get_remote_address)

    # Check connection to Langfuse
    try:
        openai.langfuse_auth_check()
    except Exception as e:
        logger.info(f'Langfuse connection check failed: {e}')


async def shutdown():
    """Clean up components at application shutdown."""
    await limiter.close()


# Initialize your components once at application startup
meter = setup_prometheus()
tracer = setup_jaeger()
if tracer is None:
    logger.info('Tracer is None after setup.')
else:
    logger.info('Tracer initialized successfully.')
counter = meter.create_counter(
    name='promptalchemy_request_counter',
    description='Number of promptalchemy requests',
)
histogram = meter.create_histogram(
    name='promptalchemy_response_histogram',
    description='promptalchemy response histogram',
    unit='seconds',
)
