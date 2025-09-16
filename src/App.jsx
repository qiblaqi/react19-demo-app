import React, { Suspense, use, useState, useActionState, useOptimistic } from 'react';
import { useFormStatus } from 'react-dom';

// Demo 1: use() + Suspense for data fetching
function DataFetchDemo() {
  // use() reads a promise directly during render. When the promise resolves,
  // the component re-renders with the resolved value.
  const data = use(
    fetch('https://jsonplaceholder.typicode.com/todos/1').then((res) => res.json())
  );
  return <pre style={{ background: '#0f1a3a', color: '#b7c4ff', padding: '8px', borderRadius: '8px' }}>{JSON.stringify(data, null, 2)}</pre>;
}

function UseDemo() {
  return (
    <Suspense fallback={<div>Loading data...</div>}>
      <DataFetchDemo />
    </Suspense>
  );
}

// Demo 2: useActionState and Form Actions
function ActionFormDemo() {
  const [state, formAction, pending] = useActionState(
    async (prevState, formData) => {
      const title = formData.get('title');
      // Simulate network latency
      await new Promise((resolve) => setTimeout(resolve, 700));
      if (!title) return { error: 'Title is required' };
      return { success: true };
    },
    null
  );

  // Nested component using useFormStatus to read the parent form's status
  function FormStatus() {
    const { pending: formPending } = useFormStatus();
    return <small style={{ marginLeft: '8px', color: '#7ea1ff' }}>{formPending ? 'Submitting…' : 'Idle'}</small>;
  }

  return (
    <div style={{ marginTop: '8px' }}>
      <form action={formAction} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          name="title"
          placeholder="Post title"
          style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #334e94', flex: '1' }}
        />
        <button
          type="submit"
          disabled={pending}
          style={{ padding: '6px 12px', borderRadius: '6px', background: '#7ea1ff', color: '#fff', border: 'none', cursor: pending ? 'not-allowed' : 'pointer' }}
        >
          {pending ? 'Saving…' : 'Save'}
        </button>
        <FormStatus />
      </form>
      {state?.error && <p style={{ color: '#f66767', marginTop: '4px' }}>{state.error}</p>}
      {state?.success && <p style={{ color: '#4ec07e', marginTop: '4px' }}>Post saved!</p>}
    </div>
  );
}

// Demo 3: useOptimistic for optimistic UI updates
function OptimisticDemo() {
  const [count, setCount] = useState(0);
  const [optimisticCount, applyOptimistic] = useOptimistic(
    count,
    (current, delta) => current + delta
  );

  async function increment() {
    applyOptimistic(1);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setCount((c) => c + 1);
  }

  async function decrement() {
    applyOptimistic(-1);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setCount((c) => c - 1);
  }

  return (
    <div style={{ marginTop: '8px' }}>
      <p>
        <strong>Optimistic:</strong> {optimisticCount}
      </p>
      <p>
        <strong>Committed:</strong> {count}
      </p>
      <button
        onClick={increment}
        style={{ marginRight: '8px', padding: '6px 12px', borderRadius: '6px', background: '#4ec07e', border: 'none', color: '#fff' }}
      >
        +1
      </button>
      <button
        onClick={decrement}
        style={{ padding: '6px 12px', borderRadius: '6px', background: '#f66767', border: 'none', color: '#fff' }}
      >
        –1
      </button>
    </div>
  );
}

// Demo 4: Resource preloading demonstration
function PreloadDemo() {
  const [show, setShow] = useState(false);

  React.useEffect(() => {
    // Preload an image resource by adding a preload link to the head
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = 'https://picsum.photos/400/200';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div style={{ marginTop: '8px' }}>
      <button
        onClick={() => setShow(true)}
        style={{ padding: '6px 12px', borderRadius: '6px', background: '#7ea1ff', color: '#fff', border: 'none' }}
      >
        Show preloaded image
      </button>
      {show && (
        <img
          src="https://picsum.photos/400/200"
          alt="Preloaded"
          style={{ display: 'block', marginTop: '8px', borderRadius: '6px', width: '100%', maxWidth: '400px' }}
        />
      )}
    </div>
  );
}

// Demo 5: Metadata support demonstration
function MetadataDemo() {
  // When this component renders, React will hoist the <title> and <meta>
  // tags into the document head.
  return (
    <>
      <title>React 19 Demo Page</title>
      <meta name="description" content="This page uses React 19 metadata support to set the title and description." />
      <p>Check the page title and meta description in your browser's dev tools.</p>
    </>
  );
}

function Feature({ title, description, Demo }) {
  return (
    <div
      style={{
        border: '1px solid rgba(255,255,255,0.15)',
        padding: '16px',
        marginBottom: '20px',
        borderRadius: '12px',
        background: 'rgba(255,255,255,0.05)',
      }}
    >
      <h2 style={{ marginTop: 0 }}>{title}</h2>
      <p style={{ color: '#a6b1d8' }}>{description}</p>
      {Demo && <Demo />}
    </div>
  );
}

function App() {
  const features = [
    {
      title: 'use() API & Suspense',
      description: 'Use the use() API to read a promise directly in render and display the result with Suspense handling the loading state.',
      Demo: UseDemo,
    },
    {
      title: 'useActionState & Form Actions',
      description: 'Handle form submissions asynchronously using useActionState and built‑in form actions with automatic pending/error handling and useFormStatus.',
      Demo: ActionFormDemo,
    },
    {
      title: 'useOptimistic',
      description: 'Show optimistic UI updates before the async operation commits, then reconcile with the final state when it completes.',
      Demo: OptimisticDemo,
    },
    {
      title: 'Resource Preloading',
      description: 'Declaratively preload a resource (an image in this example) using a preload link and then display it on demand.',
      Demo: PreloadDemo,
    },
    {
      title: 'Metadata Support',
      description: 'Define <title> and <meta> tags directly within a React component to set document metadata.',
      Demo: MetadataDemo,
    },
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', color: '#e8ecff' }}>
      <h1 style={{ marginBottom: '20px' }}>React 19 Feature Demos</h1>
      {features.map((f, idx) => (
        <Feature key={idx} {...f} />
      ))}
    </div>
  );
}

export default App;
