import { faqs } from '../data/faq';

export default function Faq() {
  return (
    <section id="faq" className="container-narrow py-20">
      <div className="mb-10 max-w-2xl">
        <span className="pill mb-3">FAQ</span>
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Reasonable questions, honest answers.
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {faqs.map((item) => (
          <details
            key={item.q}
            className="card group cursor-pointer transition open:border-accent/40"
          >
            <summary className="flex list-none items-center justify-between gap-4 text-left text-base font-medium">
              <span>{item.q}</span>
              <span className="text-accent transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm text-white/70">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
