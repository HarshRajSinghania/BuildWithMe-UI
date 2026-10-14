import { connection } from 'next/server';
import { Catalog } from '@/components/catalog';
import { components, registryStats } from '@/lib/registry';

export const metadata = {
  alternates: { canonical: '/components' },
  title: 'Component collection',
  description: `Browse ${registryStats.designs} component designs across React, Vue, and Svelte.`,
};

export default async function ComponentsPage() {
  // Render URL filters and cards on the first response, rather than replacing a
  // short CSR fallback and shifting the footer during hydration.
  await connection();
  const items = components.map(
    ({
      id,
      title,
      summary,
      domains,
      tags,
      status,
      engines,
      frameworks,
      installation,
      provenance,
    }) => ({
      id,
      title,
      summary,
      domains,
      tags,
      status,
      engines,
      frameworks,
      installation: { ...installation, npm: false },
      provenance,
    }),
  );
  return (
    <main id="main-content" className="catalog-page">
      <header className="catalog-intro">
        <div>
          <p className="section-index">THE COLLECTION / {registryStats.designs}</p>
          <h1>
            Find your
            <br />
            next interaction.
          </h1>
        </div>
        <p>
          Search by job, framework, engine, or installation method. Every design includes React,
          Vue, and Svelte source.
        </p>
      </header>
      <Catalog items={items} />
    </main>
  );
}
