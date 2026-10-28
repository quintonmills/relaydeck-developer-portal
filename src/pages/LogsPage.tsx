import { ChevronRight, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { CodeBlock } from '../components/CodeBlock';
import { StatusBadge } from '../components/StatusBadge';

const deliveries = [
  { id: 'wh_01HX8M9QK4', event: 'event.created', endpoint: '/webhooks/relaydeck', status: 200, retries: 0, time: 'Just now' },
  { id: 'wh_01HX8M8TR2', event: 'user.updated', endpoint: '/api/hooks/users', status: 503, retries: 2, time: '4 min ago' },
  { id: 'wh_01HX8M2SA9', event: 'event.created', endpoint: '/webhooks/relaydeck', status: 422, retries: 0, time: '12 min ago' },
];

const problemPayload = {
  type: 'https://api.relaydeck.dev/problems/endpoint-unavailable',
  title: 'Webhook endpoint unavailable',
  status: 503,
  detail: 'The destination returned a 503 response. RelayDeck will retry delivery.',
  instance: '/v1/deliveries/wh_01HX8M8TR2',
  request_id: 'req_01HX8M8TR2',
};

export function LogsPage() {
  const [selectedId, setSelectedId] = useState(deliveries[1].id);
  const selected = deliveries.find((delivery) => delivery.id === selectedId) ?? deliveries[0];
  const selectedProblem = selected.status >= 400 ? problemPayload : null;

  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            <RefreshCw size={14} />
            Observability
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Delivery logs</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
            Inspect webhook attempts, response codes, retries, and structured errors.
          </p>
        </div>
        <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ['Total deliveries', '1,284'],
          ['Succeeded', '1,261'],
          ['Needs attention', '8'],
          ['Avg. response', '184 ms'],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500">{label}</p>
            <p className="mt-1.5 text-2xl font-bold tracking-tight text-slate-950">{value}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3.5">Event / delivery</th>
                <th className="px-5 py-3.5">Endpoint</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Attempted</th>
                <th className="px-5 py-3.5"><span className="sr-only">Details</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deliveries.map((delivery) => (
                <tr
                  key={delivery.id}
                  className={`cursor-pointer transition hover:bg-slate-50 ${selectedId === delivery.id ? 'bg-indigo-50/50' : ''}`}
                  onClick={() => setSelectedId(delivery.id)}
                >
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-900">{delivery.event}</p>
                    <p className="mt-1 font-mono text-xs text-slate-500">{delivery.id}</p>
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-slate-600">{delivery.endpoint}</td>
                  <td className="px-5 py-4"><StatusBadge statusCode={delivery.status} retryCount={delivery.retries} /></td>
                  <td className="px-5 py-4 text-slate-600">{delivery.time}</td>
                  <td className="px-5 py-4 text-slate-400"><ChevronRight size={16} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedProblem ? (
        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-bold text-slate-950">Problem details</h2>
            <p className="mt-1 text-sm text-slate-500">RFC 7807 response for {selected.id}</p>
          </div>
          <CodeBlock title="application/problem+json" language="json" code={JSON.stringify(selectedProblem, null, 2)} />
        </section>
      ) : (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          This delivery succeeded with HTTP {selected.status}; no problem response was returned.
        </div>
      )}
    </div>
  );
}
