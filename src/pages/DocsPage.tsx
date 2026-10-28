import { ArrowUpRight, BookOpen, ShieldCheck } from 'lucide-react';
import SwaggerUI from 'swagger-ui-react';
import openApiSpec from '../data/openapi.json';
import 'swagger-ui-react/swagger-ui.css';

export function DocsPage() {
  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            <BookOpen size={14} />
            API documentation
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Build with RelayDeck
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Explore the API, inspect request and response schemas, and try endpoints from an
            interactive OpenAPI reference.
          </p>
        </div>
        <a
          href="https://spec.openapis.org/oas/v3.0.3"
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          OpenAPI 3.0 <ArrowUpRight size={15} />
        </a>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-indigo-100 bg-indigo-50/70 p-4 text-sm text-indigo-950">
        <ShieldCheck className="mt-0.5 shrink-0 text-indigo-600" size={18} />
        <p>
          <strong>Authentication:</strong> production API requests use a bearer token. This
          interactive reference uses a starter OpenAPI spec; connect your live API definition
          before enabling real requests.
        </p>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <SwaggerUI spec={openApiSpec} />
      </section>
    </div>
  );
}
