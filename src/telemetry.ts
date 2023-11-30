import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { SimpleSpanProcessor } from '@opentelemetry/tracing';

const metricExporter = new OTLPMetricExporter({});

const traceExporter = new OTLPTraceExporter({
  // optional - default url is http://localhost:4318/v1/traces
  //url: '<your-otlp-endpoint>/v1/traces',
  // optional - collection of custom headers to be sent with each request, empty by default
  //headers: {},
});

const spanProcessor = new SimpleSpanProcessor(traceExporter as any);

const sdk = new NodeSDK({
  spanProcessor: spanProcessor as any,
  metricReader: new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis: 1000,
  }),
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'Nest + Otel POC',
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
