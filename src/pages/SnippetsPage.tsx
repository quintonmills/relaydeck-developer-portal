import { useState } from 'react';
import { CodeBlock } from '../components/CodeBlock';

const snippets = {
  'Node.js': `import { createHmac, timingSafeEqual } from 'node:crypto';\n\nexport function verifyRelayDeckSignature(\n  rawBody: Buffer,\n  timestamp: string,\n  signatureHeader: string,\n  secret: string,\n): boolean {\n  const expected = createHmac('sha256', secret)\n    .update(timestamp + '.')\n    .update(rawBody)\n    .digest('hex');\n  const received = signatureHeader.replace(/^sha256=/, '');\n\n  if (!/^[a-f0-9]{64}$/i.test(received)) return false;\n  return timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(received, 'hex'));\n}`,
  Python: `import hashlib\nimport hmac\n\ndef verify_relaydeck_signature(\n    raw_body: bytes, timestamp: str, signature_header: str, secret: str\n) -> bool:\n    signed_payload = timestamp.encode() + b"." + raw_body\n    expected = hmac.new(\n        secret.encode(), signed_payload, hashlib.sha256\n    ).hexdigest()\n    received = signature_header.removeprefix("sha256=")\n    return hmac.compare_digest(expected, received)`,
  'cURL': `curl -X POST "$RELAYDECK_TEST_ENDPOINT" \\\n  -H "Content-Type: application/json" \\\n  -H "X-RelayDeck-Timestamp: $TIMESTAMP" \\\n  -H "X-RelayDeck-Signature: sha256=$SIGNATURE" \\\n  --data-binary @payload.json`,
} as const;

type Language = keyof typeof snippets;

export function SnippetsPage() {
  const [language, setLanguage] = useState<Language>('Node.js');

  return (
    <div className="space-y-7">
      <div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
          <span className="font-mono">&lt;/&gt;</span>
          Integration guides
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          Verify webhook signatures
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
          Verify HMAC-SHA256 using the exact raw request body and timestamp before processing events.
        </p>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
        Read the request body as raw bytes before JSON parsing. Use constant-time comparison and
        reject timestamps outside your replay-protection window. Keep your signing secret in a
        secure environment variable.
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap gap-1 border-b border-slate-200 p-2">
          {(Object.keys(snippets) as Language[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setLanguage(item)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                language === item
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="p-3 sm:p-5">
          <CodeBlock
            title={`${language} · HMAC-SHA256 verification`}
            language={language === 'Node.js' ? 'javascript' : language === 'Python' ? 'python' : 'bash'}
            code={snippets[language]}
          />
        </div>
      </div>
    </div>
  );
}
