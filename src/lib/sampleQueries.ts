import { QueryComplexity } from '../types';

export interface SampleQueryItem {
  prompt: string;
  expectedComplexity: QueryComplexity;
  domain: 'ecommerce_support' | 'developer_copilot' | 'legal_finance' | 'general';
  sampleResponse: string;
}

export const SAMPLE_QUERIES: SampleQueryItem[] = [
  // SIMPLE / FAQ / Conversational
  {
    prompt: 'Summarize the main points of our 14-day customer return policy.',
    expectedComplexity: 'SIMPLE',
    domain: 'ecommerce_support',
    sampleResponse: 'Customers can return undamaged items within 14 days for a full refund with original receipt and packaging.'
  },
  {
    prompt: 'Translate "Thank you for contacting technical support, have a great day" to French and German.',
    expectedComplexity: 'SIMPLE',
    domain: 'ecommerce_support',
    sampleResponse: 'French: "Merci d\'avoir contacté le support technique, passez une excellente journée."\nGerman: "Vielen Dank, dass Sie sich an den technischen Support gewandt haben. Einen schönen Tag noch!"'
  },
  {
    prompt: 'What are the operating hours for the London headquarters office?',
    expectedComplexity: 'SIMPLE',
    domain: 'ecommerce_support',
    sampleResponse: 'The London HQ operates Monday through Friday from 08:30 to 17:30 GMT.'
  },
  {
    prompt: 'Fix the spelling and grammar in this customer email reply: "we is happy to assist u with the order".',
    expectedComplexity: 'SIMPLE',
    domain: 'ecommerce_support',
    sampleResponse: '"We are happy to assist you with your order."'
  },
  {
    prompt: 'Convert timestamp 1718872800 to human-readable UTC ISO format.',
    expectedComplexity: 'SIMPLE',
    domain: 'developer_copilot',
    sampleResponse: '2024-06-20T08:40:00.000Z'
  },
  {
    prompt: 'Generate 5 catchy email subject lines for our summer clearance discount.',
    expectedComplexity: 'SIMPLE',
    domain: 'ecommerce_support',
    sampleResponse: '1. Summer Steals: Up to 50% Off Today Only!\n2. Sizzle into Savings: Our Big Summer Event\n3. Don\'t Miss Out: Summer Favorites on Sale'
  },

  // EXTRACTION
  {
    prompt: 'Extract the invoice number, billing total, and vendor tax ID from this raw OCR text: "INV-99201 date 04/12 total $4,821.50 TAXID: 99-123481"',
    expectedComplexity: 'EXTRACTION',
    domain: 'legal_finance',
    sampleResponse: '{\n  "invoiceNumber": "INV-99201",\n  "billingTotal": "$4,821.50",\n  "taxId": "99-123481",\n  "date": "04/12"\n}'
  },
  {
    prompt: 'Parse this unstructured customer feedback and return a JSON list of key sentiment entities with polarity scores.',
    expectedComplexity: 'EXTRACTION',
    domain: 'ecommerce_support',
    sampleResponse: '{\n  "entities": [\n    {"feature": "checkout speed", "sentiment": "positive", "score": 0.88},\n    {"feature": "shipping fee", "sentiment": "negative", "score": -0.65}\n  ]\n}'
  },
  {
    prompt: 'Extract all email addresses and phone numbers matching E.164 format from this lead transcript.',
    expectedComplexity: 'EXTRACTION',
    domain: 'legal_finance',
    sampleResponse: 'Found: [sarah.j@enterprise.com (+14155552671), dev.ops@nexus.io (+442071838700)]'
  },
  {
    prompt: 'Classify this tier-1 incoming support ticket: "My payment was charged twice for order #48921"',
    expectedComplexity: 'EXTRACTION',
    domain: 'ecommerce_support',
    sampleResponse: 'Category: BILLING_DISPUTE | Urgency: HIGH | Auto-Action: Trigger Stripe duplicate charge verification webhook.'
  },

  // REASONING
  {
    prompt: 'Analyze the sentiment and underlying risk factors in these quarterly earnings transcripts for a B2B SaaS company.',
    expectedComplexity: 'REASONING',
    domain: 'legal_finance',
    sampleResponse: 'Primary risk factors identified: 1. Net Revenue Retention compression (118% -> 104%). 2. Elevated CAC payback period (14 -> 21 months). Overall sentiment is cautious with defensive margin preservation.'
  },
  {
    prompt: 'Compare the trade-offs between Event Sourcing and CQRS architecture for a high-frequency financial ledger.',
    expectedComplexity: 'REASONING',
    domain: 'developer_copilot',
    sampleResponse: 'Event Sourcing guarantees complete immutable audit trails and replayability at the cost of eventual read consistency and storage amplification. CQRS decouples read/write scaling but introduces eventual consistency drift.'
  },
  {
    prompt: 'Evaluate whether a candidate meets our hiring rubric for Senior Distributed Systems Engineer based on this interview debrief.',
    expectedComplexity: 'REASONING',
    domain: 'general',
    sampleResponse: 'Candidate demonstrates strong domain knowledge in Raft/consensus protocols (Score 4/5) and scalable telemetry (4/5), but showed gaps in failure domain isolation (2.5/5). Recommendation: Strong Lean Hire.'
  },

  // CODE
  {
    prompt: 'Implement a complete asynchronous thread pool and task scheduler in C++20 with work-stealing queues.',
    expectedComplexity: 'CODE',
    domain: 'developer_copilot',
    sampleResponse: '```cpp\n#include <vector>\n#include <deque>\n#include <thread>\n#include <mutex>\n#include <future>\n#include <functional>\n\nclass WorkStealingPool {\n    // Implementation of lock-free work-stealing queue with std::jthread and atomic flags\n};\n```'
  },
  {
    prompt: 'Write a high-performance Python script to parse gigabyte-sized JSONL files using multiprocessing and streaming chunk iterators.',
    expectedComplexity: 'CODE',
    domain: 'developer_copilot',
    sampleResponse: '```python\nimport multiprocessing as mp\nimport json\nfrom itertools import islice\n\ndef process_chunk(lines):\n    return [json.loads(l) for l in lines if l.strip()]\n\ndef stream_parse(filepath, chunk_size=10000):\n    with open(filepath, "r") as f, mp.Pool() as pool:\n        while chunk := list(islice(f, chunk_size)):\n            yield pool.apply_async(process_chunk, (chunk,))\n```'
  },
  {
    prompt: 'Implement a lock-free ring buffer in Rust with atomic memory ordering (Acquire/Release) for inter-thread message passing.',
    expectedComplexity: 'CODE',
    domain: 'developer_copilot',
    sampleResponse: '```rust\nuse std::sync::atomic::{AtomicUsize, Ordering};\n\npub struct LockFreeRingBuffer<T, const CAP: usize> {\n    head: AtomicUsize,\n    tail: AtomicUsize,\n    buffer: [Option<T>; CAP],\n}\n// Implemented atomic compare_exchange with Ordering::AcqRel\n```'
  },
  {
    prompt: 'Debug this React useEffect memory leak caused by uncleaned AbortController in WebSocket subscriptions.',
    expectedComplexity: 'CODE',
    domain: 'developer_copilot',
    sampleResponse: 'The memory leak stems from omitting `ws.close()` and `controller.abort()` inside the cleanup return function of `useEffect`. Fix provided with idempotent teardown handler.'
  },

  // COMPLEX / CONTRACTS / MATH
  {
    prompt: 'Draft a comprehensive Master Services Agreement (MSA) clause covering mutual indemnification, IP ownership carve-outs, and GDPR sub-processor warranties under Delaware law.',
    expectedComplexity: 'COMPLEX',
    domain: 'legal_finance',
    sampleResponse: 'Section 14.1 (Mutual Indemnification): Each Party ("Indemnifying Party") shall defend, indemnify, and hold harmless the other Party, its affiliates, and respective directors against any third-party claims arising from IP Infringement, Gross Negligence, or breach of Article 9 (Data Protection / GDPR).'
  },
  {
    prompt: 'Derive the mathematical proof for convergence rate of stochastic gradient descent with momentum under Lipschitz continuous gradients.',
    expectedComplexity: 'COMPLEX',
    domain: 'general',
    sampleResponse: 'Under L-smoothness and mu-strong convexity with step-size $\\eta < 2/L$, the Lyapunov energy function $V(w_t) = ||w_t - w^*||^2$ contracts at geometric rate $\\mathcal{O}((1 - \\sqrt{\\mu/L})^t)$.'
  },
  {
    prompt: 'Architect a fault-tolerant multi-region disaster recovery strategy for a SOC2-compliant healthcare database with RPO < 5s and RTO < 60s.',
    expectedComplexity: 'COMPLEX',
    domain: 'developer_copilot',
    sampleResponse: '1. Active-Active CockroachDB / Spanner multi-region partition. 2. Cross-region continuous transaction log shipping via Kafka MirrorMaker 2. 3. Route53 health check DNS failover with 10s TTL.'
  }
];
