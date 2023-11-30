import { Injectable } from '@nestjs/common';
import { SpanStatusCode, context, trace } from '@opentelemetry/api';

@Injectable()
export class AppService {
  hello(): string {
    return 'Hello!';
  }

  manual(): string {
    const span = trace.getSpan(context.active());
    span.setAttribute('teste', 'instrumentação manual');

    return 'Hello com instrumentação manual!';
  }

  throwError() {
    throw new Error('Deu ruim');
  }

  markError(): string {
    const span = trace.getSpan(context.active());
    span.recordException('Registrando um erro!');
    span.setStatus({ code: SpanStatusCode.ERROR });

    return 'Span marcada com erro!';
  }
}
