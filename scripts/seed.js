import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL  = 'https://hyzapvjzmnwvgqjlsdpv.supabase.co'
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5emFwdmp6bW53dmdxamxzZHB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1Mzk5MjIsImV4cCI6MjA5MDExNTkyMn0.bZs_LgugdFfq1-5ld1yq0jQbOXEuLK6ZxBqraggDCcs'
const DEMO_EMAIL    = 'demo@linkhub.app'
const DEMO_PASSWORD = 'demo1234'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)

const posts = [
  // ── ML / AI ──────────────────────────────────────────────
  {
    title: 'How Transformer Architecture Changed Everything',
    content: `The 2017 paper *"Attention Is All You Need"* quietly redefined what was possible in machine learning.\n\nBefore transformers, sequence models like LSTMs processed tokens one at a time — slow, hard to parallelise, and prone to forgetting context over long sequences. The transformer introduced **self-attention**: every token in a sequence attends to every other token simultaneously.\n\n## Why it matters\n\n- Parallelisation made training on massive datasets feasible\n- Attention weights are interpretable — you can *see* what the model focuses on\n- The architecture generalised far beyond NLP: vision, audio, code, protein folding\n\nGPT, BERT, Stable Diffusion, AlphaFold — they all trace back to this one idea. Worth reading the original paper if you haven't.`,
    tags: ['machine-learning', 'transformers', 'ai'],
    upvotes: 47, downvotes: 2, comments: ['Great breakdown! The attention mechanism was genuinely revolutionary.', 'AlphaFold using transformers for protein folding is still mind-blowing to me.'],
  },
  {
    title: 'RAG vs Fine-Tuning: When to Use Each',
    content: `Two of the most common ways to specialise an LLM for your use case — but they solve different problems.\n\n## Retrieval-Augmented Generation (RAG)\nFetch relevant documents at inference time and stuff them into the context window. Best when:\n- Your knowledge base changes frequently\n- You need citations / traceable sources\n- You want to avoid hallucination on factual queries\n\n## Fine-Tuning\nUpdate the model weights on your domain data. Best when:\n- You need a specific *style* or *format* consistently\n- Latency matters (no retrieval step)\n- Your task is well-defined and your dataset is clean\n\n**The underrated option:** combine both. Fine-tune for tone and format, RAG for up-to-date facts. Most production systems end up here eventually.`,
    tags: ['llm', 'rag', 'fine-tuning', 'ai'],
    upvotes: 38, downvotes: 1, comments: ['Combining both is underrated — saw a 30% accuracy bump doing exactly this.'],
  },
  {
    title: 'Embeddings Explained — The Secret Behind Semantic Search',
    content: `If you've used a vector database or built anything with LLMs, you've used embeddings. But what are they really?\n\nAn embedding is a **dense numerical representation** of meaning. When you embed the sentence *"the cat sat on the mat"*, you get a vector — say, 1536 numbers — where similar meanings produce vectors that are geometrically close.\n\n\`\`\`\nsimilarity("king" - "man" + "woman") ≈ "queen"\n\`\`\`\n\nThis algebraic relationship with meaning is what makes semantic search, recommendation systems, and RAG pipelines work.\n\n## Practical takeaways\n- \`text-embedding-3-small\` is surprisingly good for most use cases\n- Cosine similarity > Euclidean distance for high-dimensional vectors\n- Chunk size matters — too large loses precision, too small loses context`,
    tags: ['embeddings', 'vector-search', 'nlp'],
    upvotes: 31, downvotes: 0, comments: ['The king-queen example always clicks for people. Nice explainer.'],
  },
  {
    title: 'AI Agents in 2025: Hype vs Reality',
    content: `Everyone is shipping "agents" right now. Here's what I've learned actually works.\n\n## What works\n- **Single-purpose agents** with narrow, well-defined tasks (code review, data extraction, email triage)\n- Tool use with strict schemas — LLMs are much more reliable when output is constrained\n- Human-in-the-loop for anything with side effects\n\n## What doesn't (yet)\n- Fully autonomous long-horizon tasks without any human checkpoints\n- Agents that self-improve reliably without careful scaffolding\n- Multi-agent systems at scale — coordination overhead is real\n\nThe most effective "agents" in production are closer to smart automation pipelines than autonomous AI. That's not a criticism — it's what ships and what works.`,
    tags: ['agents', 'ai', 'llm'],
    upvotes: 55, downvotes: 3, comments: ['The "smart automation pipelines" framing is exactly right.', '"Human in the loop for anything with side effects" should be on a poster.'],
  },
  // ── Tech / Engineering ───────────────────────────────────
  {
    title: 'Why I Switched from REST to tRPC',
    content: `After two years of maintaining REST APIs with hand-written TypeScript interfaces on the frontend, I switched to tRPC on my last project. Here's what surprised me.\n\n## The problem with REST + TypeScript\nYou write your Express route, then manually type the response on the client. They drift. You add a field on the backend, forget to update the frontend type, and get a runtime error three weeks later.\n\n## tRPC's answer\nOne TypeScript source of truth. Your router *is* your API contract. The client gets full type inference automatically — no codegen step, no OpenAPI spec, no drift.\n\n\`\`\`ts\n// server\nconst appRouter = router({\n  getUser: publicProcedure\n    .input(z.object({ id: z.string() }))\n    .query(({ input }) => db.user.findUnique({ where: { id: input.id } }))\n})\n\n// client — fully typed, no extra work\nconst user = await trpc.getUser.query({ id: '123' })\n\`\`\`\n\nIf you're building a full-stack TypeScript app with a team, try it on your next project.`,
    tags: ['typescript', 'trpc', 'api', 'fullstack'],
    upvotes: 29, downvotes: 2, comments: ['Been using tRPC for 6 months. The DX is genuinely better.'],
  },
  {
    title: 'The Real Cost of Technical Debt',
    content: `Technical debt isn't just "messy code". It compounds.\n\nA 2023 study estimated that developers spend **42% of their time** working around technical debt rather than shipping features. That's almost half your engineering capacity silently taxed.\n\n## The compounding problem\nDebt makes new features slower to build, which creates schedule pressure, which encourages cutting corners, which creates more debt. This is why codebases don't gradually improve without deliberate effort — they degrade.\n\n## What actually helps\n- Dedicated refactor time in every sprint (not "we'll fix it later")\n- Treating internal quality like a product metric\n- The strangler fig pattern for legacy rewrites — big-bang rewrites almost always fail\n\nThe best teams I've worked on treated the codebase as a shared resource worth maintaining, not a rental car.`,
    tags: ['engineering', 'best-practices', 'software-design'],
    upvotes: 41, downvotes: 1, comments: ['42% is staggering. Bookmarking this for the next sprint planning argument.'],
  },
  {
    title: 'Supabase vs Firebase: An Honest Comparison',
    content: `I've shipped projects with both. Here's my honest take.\n\n## Firebase strengths\n- Battle-tested at scale — Google runs it\n- Realtime out of the box is very polished\n- Auth is extremely easy to set up\n- Great mobile SDK\n\n## Supabase strengths\n- It's just Postgres — you can use any SQL tool, migrate anywhere\n- Row-level security is powerful and explicit\n- Open source — self-hostable\n- REST and GraphQL auto-generated from your schema\n- Pricing is more predictable\n\n## When to pick which\n- Mobile-first, need offline sync → Firebase\n- Web app, need relational data, care about vendor lock-in → Supabase\n\nI default to Supabase now for most web projects. The "it's just Postgres" property alone is worth a lot.`,
    tags: ['supabase', 'firebase', 'backend', 'database'],
    upvotes: 36, downvotes: 4, comments: ['The vendor lock-in point is underappreciated. Supabase being open source matters.', 'Firebase realtime is still smoother for some use cases IMO.'],
  },
  {
    title: 'Understanding React Server Components',
    content: `React Server Components (RSCs) are probably the most significant change to the React mental model since hooks. They're also the most misunderstood.\n\n## What they are\nComponents that render *on the server* and never ship JavaScript to the client. They can directly access databases, file systems, and environment variables.\n\n## What they are NOT\n- A replacement for client components (you still need those for interactivity)\n- The same as SSR (RSCs are a component-level distinction, not a page-level one)\n\n## The mental model shift\nThink of your component tree as having two zones: a server zone (data fetching, heavy logic, secrets) and a client zone (state, events, animations). RSCs let you be explicit about which is which.\n\nThe Next.js App Router builds on this heavily. If you're building with Next.js 14+, understanding RSCs isn't optional anymore.`,
    tags: ['react', 'nextjs', 'frontend'],
    upvotes: 33, downvotes: 2, comments: ['The "two zones" mental model finally made this click for me.'],
  },
  // ── General / Career ─────────────────────────────────────
  {
    title: 'Why Side Projects Teach You More Than Most Jobs',
    content: `The best engineers I know all have one thing in common: they build things outside of work.\n\nNot because side projects look good on a resume (though they do). But because of what the *constraints* force you to do.\n\n## The side project advantage\n- **Full ownership** — you make every decision, including the bad ones\n- **No safety net** — you can't ask a senior engineer. You have to figure it out.\n- **Real stakes** — even if it's small, it's yours. That emotional investment changes how you learn.\n- **Freedom to experiment** — you can try the tech you're curious about, not just what the job requires\n\nThe engineers who grow fastest aren't necessarily the ones with the most demanding jobs. They're the ones building things constantly.`,
    tags: ['career', 'learning', 'side-projects'],
    upvotes: 62, downvotes: 0, comments: ['This resonates deeply. My side projects taught me more than 2 years at a big company.', 'Full ownership + no safety net is such a good way to put it.', 'Currently burning weekends on a project nobody may ever use. Worth it.'],
  },
  {
    title: 'The 5 Books That Actually Changed How I Code',
    content: `A lot of programming books age badly. These haven't.\n\n1. **The Pragmatic Programmer** — Timeless advice on craft. "Don't live with broken windows" and "DRY" both come from here.\n\n2. **Clean Code** — Controversial now, but reading it early will permanently change how you name things.\n\n3. **Designing Data-Intensive Applications (DDIA)** — The best systems design book in existence. Required reading before any senior role.\n\n4. **A Philosophy of Software Design** — Short, dense, and will make you question every class you've ever written.\n\n5. **The Mythical Man-Month** — Written in 1975. Still 100% accurate about why software projects fail.\n\nHonourable mention: *Structure and Interpretation of Computer Programs* (SICP) if you want your brain to hurt productively.`,
    tags: ['books', 'learning', 'career'],
    upvotes: 58, downvotes: 1, comments: ['DDIA is genuinely essential. Everyone working with data should read it.', 'Glad SICP got an honourable mention — challenging but worth it.'],
  },
  {
    title: 'Hot Take: Leetcode is Overrated for Most Jobs',
    content: `Before you close this tab — I'm not saying Leetcode isn't useful. I'm saying the industry has overcalibrated on it.\n\nLeetcode measures your ability to solve algorithmic puzzles under time pressure after weeks of drilling patterns. It weakly correlates with your ability to:\n- Design a scalable system\n- Debug a gnarly production issue at 2am\n- Write code your teammates can read in six months\n- Communicate tradeoffs clearly\n\n## What I'd test instead\n- Pair programming on a real (simplified) problem\n- A small take-home with a code review\n- System design for a system they actually run\n\nCurious what others think.`,
    tags: ['career', 'interviewing', 'hot-take'],
    upvotes: 74, downvotes: 11, comments: ['Finally someone said it.', 'Counterpoint: it does filter for problem-solving ability under pressure, which is real.', 'Agree on system design being more predictive of actual job performance.'],
  },
  {
    title: 'What No One Tells You About Your First Dev Job',
    content: `Things I wish someone had told me before I started:\n\n**1. Reading code is 70% of the job.** You will spend more time understanding existing code than writing new code. Get good at it.\n\n**2. Asking questions is a skill.** "I don't understand X" is not enough. "I tried A and B, got error C, and I think it's related to D — am I on the right track?" will make your team love you.\n\n**3. The most valuable thing you can do as a junior is reduce uncertainty for seniors.** Write clear tickets, give status updates before being asked, document what you figure out.\n\n**4. Your first PR review will sting.** It's not personal. Comments on code are not comments on you.\n\n**5. Slow is smooth, smooth is fast.** Taking 20 minutes to understand a problem properly beats shipping a fix that breaks something else.`,
    tags: ['career', 'junior-dev', 'advice'],
    upvotes: 89, downvotes: 2, comments: ['#2 changed my career when I actually internalised it.', '"Comments on code are not comments on you" — needed to hear this as a junior.', 'The uncertainty reduction point is so underrated. This is what gets you promoted too.'],
  },
]

async function seed() {
  console.log('Signing in as demo user…')
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
  })
  if (authErr) {
    console.error('Auth failed:', authErr.message)
    process.exit(1)
  }
  const userId = authData.user.id
  console.log('Signed in. User ID:', userId)

  console.log('Clearing existing demo posts…')
  await supabase.from('posts').delete().eq('owner', userId)

  console.log('Inserting', posts.length, 'posts…')
  for (const post of posts) {
    const { error } = await supabase.from('posts').insert({ ...post, owner: userId })
    if (error) console.error(' ✗', post.title, '—', error.message)
    else        console.log(' ✓', post.title)
  }
  console.log('\nDone!')
  process.exit(0)
}

seed()
