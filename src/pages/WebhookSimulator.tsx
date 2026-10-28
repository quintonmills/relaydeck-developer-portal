import { useState, type FormEvent } from 'react';
import { AlertCircle, CheckCircle2, LoaderCircle, Send, ShieldCheck, WandSparkles } from 'lucide-react';
import { CodeBlock } from '../components/CodeBlock';

const eventExamples = {
  'event.created': {
    id: 'evt_01HX8M9QK4',
    type: 'event.created',
    created_at: '2026-10-28T14:00:00Z',
    data: { id: 'event_123', name: 'invoice.paid', account_id: 'acct_demo' },
  },
  'user.updated': {
    id: 'evt_01HX8M9QK5',
    type: 'user.updated',
    created_at: '2026-10-28T14:00:00Z',
    data: { id: 'usr_456', email: 'alex@example.com', updated_fields: ['email'] },
  },
} as const;

type EventType = keyof typeof eventExamples;
type SimulationResult = {
  signature: string;
  timestamp: number;
  endpoint: string;
};

async function createSignature(payload: string): Promise<string> {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Web Crypto is unavailable. Use localhost or a secure HTTPS connection.');
  }

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode('whsec_demo_only_replace_in_production'),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  const hex = Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, '0')).join('');
  return `sha256=${hex}`;
}

export function WebhookSimulator() {
  const [endpoint, setEndpoint] = useState('https://your-server.com/webhooks/relaydeck');
  const [eventType, setEventType] = useState<EventType>('event.created');
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const payload = JSON.stringify(eventExamples[eventType], null, 2);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(null);
    setError('');

    let parsedEndpoint: URL;
    try {
      parsedEndpoint = new URL(endpoint);
      if (!['http:', 'https:'].includes(parsedEndpoint.protocol)) {
        throw new Error('Enter an HTTP or HTTPS endpoint URL.');
      }
    } catch (urlError) {
      setError(urlError instanceof Error ? urlError.message : 'Enter a valid endpoint URL.');
      return;
    }

    setIsSending(true);
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const signature = await createSignature(`${timestamp}.${payload}`);
      setResult({ signature, timestamp, endpoint: parsedEndpoint.toString() });
    } catch (signatureError) {
      setError(signatureError instanceof Error ? signatureError.message : 'Unable to sign payload.');
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="space-y-7">
      <div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
          <WandSparkles size={14} />
          Developer sandbox
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          Webhook simulator
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
          Preview a signed RelayDeck event and inspect the headers your endpoint would receive.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div>
            <label htmlFor="endpoint" className="mb-2 block text-sm font-semibold text-slate-800">
              Target endpoint URL
            </label>
            <input
              id="endpoint"
              type="url"
              required
              value={endpoint}
              onChange={(event) => setEndpoint(event.target.value)}
              placeholder="https://example.com/webhooks"
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
            <p className="mt-1.5 text-xs text-slate-500">The endpoint is shown for preview only; no request is sent.</p>
          </div>

          <div>
            <label htmlFor="event-type" className="mb-2 block text-sm font-semibold text-slate-800">
              Event type
            </label>
            <select
              id="event-type"
              value={eventType}
              onChange={(event) => {
                setEventType(event.target.value as EventType);
                setResult(null);
                setError('');
              }}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            >
              <option value="event.created">event.created</option>
              <option value="user.updated">user.updated</option>
            </select>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="payload" className="text-sm font-semibold text-slate-800">
                Test payload
              </label>
              <span className="text-xs text-slate-500">JSON · read only</span>
            </div>
            <textarea
              id="payload"
              readOnly
              value={payload}
              rows={9}
              className="w-full resize-y rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs leading-5 text-slate-700 outline-none"
            />
          </div>

          {error && (
            <div role="alert" className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
              <AlertCircle size={17} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-wait disabled:opacity-70 sm:w-auto"
          >
            {isSending ? <LoaderCircle size={16} className="animate-spin" /> : <Send size={16} />}
            {isSending ? 'Generating signature…' : 'Generate test webhook'}
          </button>
        </form>

        <section className="space-y-4">
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
            <ShieldCheck className="mt-0.5 shrink-0 text-amber-700" size={18} />
            <p>
              <strong>Simulation only.</strong> The signature uses a public demo secret. Never use
              it to secure production webhooks.
            </p>
          </div>
          {result ? (
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                <CheckCircle2 size={18} />
                Signed test event ready
              </div>
              <div className="space-y-2 text-sm">
                <p className="break-all text-slate-600">
                  <span className="font-medium text-slate-800">Destination:</span> {result.endpoint}
                </p>
                <p className="text-slate-600">
                  <span className="font-medium text-slate-800">Timestamp:</span> {result.timestamp}
                </p>
              </div>
              <CodeBlock
                title="Outgoing request headers"
                language="bash"
                code={`Content-Type: application/json\nX-RelayDeck-Event: ${eventType}\nX-RelayDeck-Timestamp: ${result.timestamp}\nX-RelayDeck-Signature: ${result.signature}`}
              />
              <CodeBlock title="Signed payload" language="json" code={payload} />
            </div>
          ) : (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <Send size={20} />
              </span>
              <h2 className="text-sm font-semibold text-slate-800">Your signed event will appear here</h2>
              <p className="mt-1 max-w-xs text-sm leading-5 text-slate-500">
                Choose an event and generate a test webhook to inspect its HMAC signature.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
