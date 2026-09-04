"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "@/lib/router";
import { Breadcrumb } from "@/components/breadcrumb";
import { useReveal } from "@/hooks/use-reveal";
import { journal } from "@/lib/data";
import { ABOUT_IMAGES, ATELIER_IMAGES, EMBROIDERY_STORY_IMAGES, FABRIC_IMAGES } from "@/lib/images";
import { formatDate } from "@/lib/utils";

/* ================================ ABOUT ================================ */

const ABOUT_SECTIONS = [
  {
    id: "beginning",
    eyebrow: "01 — Our beginning",
    title: "Born at a sampling table.",
    img: ABOUT_IMAGES.beginning,
    body: [
      "DEEPIER did not start in a boardroom. It started at a sampling table in 2023, with a washed-black tee that refused to stay plain. A crest was stitched on almost as an afterthought — and strangers at the studio kept asking where it was from. That tee sold out in nine days.",
      "The name came from a habit, not a strategy. Every time a detail was good enough, someone would ask: can we go deeper? Deeper into the fabric. Deeper into the stitch. Deeper than the version before it. The question became the brand.",
    ],
  },
  {
    id: "philosophy",
    eyebrow: "02 — Our philosophy",
    title: "Depth over noise.",
    img: ABOUT_IMAGES.editorial,
    body: [
      "We believe premium is not a price point — it is a level of care. Care measured in thread density, in thirty-wash testing, in hems that fall exactly where they should after a year of wear. Most brands add features; we remove shortcuts.",
      "Our silhouettes are deliberately restrained so the embroidery can speak. A DEEPIER piece is quiet at ten metres and unmissable at one — which is, we think, how confidence actually works.",
    ],
  },
  {
    id: "art",
    eyebrow: "03 — The art of embroidery",
    title: "Heritage stitches, modern hands.",
    img: EMBROIDERY_STORY_IMAGES[3],
    body: [
      "Every motif in the line quotes a craft tradition — Kantha running stitches from Bengal, Chikankari whites from Lucknow, the metallic drama of Zardozi. We work with digitisers and workshop floor-masters who treat a 12,000-stitch crest like architecture: load-bearing, tested, permanent.",
      "Thread is our ink. It catches light differently at every hour, it ages with the garment, and it cannot be faked. That is the whole identity — embroidery not as decoration, but as the point.",
    ],
  },
  {
    id: "fabric",
    eyebrow: "04 — Fabric & quality",
    title: "The fabric comes first.",
    img: FABRIC_IMAGES[1],
    body: [
      "An embroidered motif is only as good as the cloth beneath it. We build from 200 to 400 GSM cottons, European flax, washed denim and bonded wool — every lot tested for shrinkage, pilling and colour fastness before it touches a single needle.",
      "If a fabric batch fails, the drop waits. It has waited before. It will again.",
    ],
  },
  {
    id: "future",
    eyebrow: "05 — Our future",
    title: "Deeper, not bigger.",
    img: ABOUT_IMAGES.goldenHour,
    body: [
      "The plan is not to be everywhere. It is to be worth finding — drops that sell to people who wear them, not resell them; a repair program for every embroidered piece; and one day, a DEEPIER atelier where you can watch your own garment being stitched.",
      "Ten thousand customers in. Countless stitches to go. We are just getting to the deep part.",
    ],
  },
];

export function AboutPage() {
  useReveal();
  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[60vh] items-end overflow-hidden bg-ink">
        { }
        <img src={ABOUT_IMAGES.studio} alt="Inside the DEEPIER studio" className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
        <div className="container-x relative pb-16">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About" }]} light className="[&_a]:text-white/60 [&_span]:text-white" />
          <h1 className="display-1 mt-5 text-white">
            The house<br />of deeper<span className="text-bronze">.</span>
          </h1>
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-white/70">
            A clothing brand built on a single belief: embroidery is not decoration. It is identity, stitched.
          </p>
        </div>
      </section>

      {/* Manifesto strip */}
      <section className="border-b border-line bg-white">
        <div className="container-x py-14 text-center">
          <p className="mx-auto max-w-3xl text-[17px] font-semibold leading-relaxed tracking-wide text-ink/80 sm:text-[19px]">
            &ldquo;Premium clothing where embroidery becomes the identity.{" "}
            <span className="text-bronze">Every stitch has a purpose.</span>&rdquo;
          </p>
        </div>
      </section>

      {/* Story sections */}
      {ABOUT_SECTIONS.map((s, i) => (
        <section key={s.id} className={i % 2 === 1 ? "bg-secondary" : ""} aria-label={s.title}>
          <div className={`container-x grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:gap-16 ${i % 2 === 1 ? "" : ""}`}>
            <div className={i % 2 === 1 ? "lg:order-2" : ""}>
              <p className="eyebrow reveal text-bronze">{s.eyebrow}</p>
              <h2 className="display-3 mt-3 reveal">{s.title}</h2>
              {s.body.map((p) => (
                <p key={p.slice(0, 24)} className="reveal mt-5 max-w-lg text-[15px] leading-relaxed text-ink/70">
                  {p}
                </p>
              ))}
            </div>
            <div className={`reveal-scale overflow-hidden ${i % 2 === 1 ? "lg:order-1" : ""}`}>
              { }
              <img src={s.img} alt={s.title} loading="lazy" className="aspect-[4/3] w-full object-cover" />
            </div>
          </div>
        </section>
      ))}

      {/* Stats */}
      <section className="bg-ink py-16 text-bone">
        <div className="container-x grid grid-cols-2 gap-10 text-center lg:grid-cols-4">
          {[
            { n: "10,000+", l: "Happy customers" },
            { n: "4.8/5", l: "Average rating" },
            { n: "42,000", l: "Stitches on a Heirloom" },
            { n: "30×", l: "Wash-tested motifs" },
          ].map((s) => (
            <div key={s.l} className="reveal">
              <p className="text-3xl font-extrabold tracking-tight sm:text-4xl">{s.n}</p>
              <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-x py-20 text-center">
        <h2 className="display-2 reveal">Wear your story.</h2>
        <Link to="/shop/new-arrivals" className="group mt-8 inline-flex reveal items-center gap-2 bg-ink px-10 py-4 text-[11.5px] font-bold uppercase tracking-[0.2em] text-bone hover:opacity-85">
          Shop the latest drop <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </section>
    </div>
  );
}

/* ================================ CRAFT ================================ */

const CRAFT_STEPS = [
  { n: "01", t: "The motif is drawn", d: "Every design begins on paper at the studio — drawn, redrawn, and argued over until the line earns its thread.", img: ATELIER_IMAGES[1] },
  { n: "02", t: "Thread is chosen by behaviour", d: "Two hundred shades, sorted not by colour but by how they catch light, age, and survive friction.", img: EMBROIDERY_STORY_IMAGES[1] },
  { n: "03", t: "The needle does its arithmetic", d: "Digitised paths stitched at 750 stitches per minute — every crest is 12,000 to 42,000 decisions made permanent.", img: EMBROIDERY_STORY_IMAGES[0] },
  { n: "04", t: "Thirty washes, no mercy", d: "Samples run thirty domestic wash cycles. If a motif shifts half a millimetre, it goes back to the table.", img: ATELIER_IMAGES[3] },
];

export function CraftPage() {
  useReveal();
  return (
    <div>
      <section className="relative flex min-h-[55vh] items-end overflow-hidden bg-ink">
        { }
        <img src={EMBROIDERY_STORY_IMAGES[3]} alt="Zardozi embroidery close-up" className="absolute inset-0 h-full w-full object-cover opacity-75" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
        <div className="container-x relative pb-14">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Our Craft" }]} light className="[&_a]:text-white/60 [&_span]:text-white" />
          <h1 className="display-1 mt-5 text-white">Our craft<span className="text-bronze">.</span></h1>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-white/70">
            From a sketch at the sampling table to a motif that survives thirty washes — this is how DEEPIER goes deeper.
          </p>
        </div>
      </section>

      <section className="container-x py-16 sm:py-20">
        <div className="grid gap-14">
          {CRAFT_STEPS.map((s, i) => (
            <div key={s.n} className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-14 ${i % 2 === 1 ? "" : ""}`}>
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <p className="text-6xl font-extrabold text-line reveal sm:text-7xl">{s.n}</p>
                <h2 className="display-3 mt-4 reveal">{s.t}</h2>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink/70 reveal">{s.d}</p>
              </div>
              <div className={`reveal-scale overflow-hidden ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                { }
                <img src={s.img} alt={s.t} loading="lazy" className="aspect-[4/3] w-full object-cover" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fabric specs */}
      <section className="border-y border-line bg-white py-16">
        <div className="container-x">
          <p className="eyebrow reveal text-muted-foreground">The material library</p>
          <h2 className="display-2 mt-2 reveal">Fabric comes first.</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { img: FABRIC_IMAGES[0], t: "Combed Cotton", d: "200–260 GSM tees" },
              { img: FABRIC_IMAGES[2], t: "Heavy Fleece", d: "320–400 GSM winter layers" },
              { img: FABRIC_IMAGES[1], t: "European Flax", d: "Stone-washed linen shirting" },
              { img: FABRIC_IMAGES[3], t: "Washed Denim", d: "8 oz overshirts & jackets" },
            ].map((f) => (
              <figure key={f.t} className="reveal">
                <div className="aspect-square overflow-hidden">
                  { }
                  <img src={f.img} alt={f.t} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
                </div>
                <figcaption className="mt-3">
                  <p className="text-[14px] font-bold uppercase tracking-wide">{f.t}</p>
                  <p className="text-[12.5px] text-muted-foreground">{f.d}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-20 text-center">
        <h2 className="display-2 reveal">The art is in the detail.</h2>
        <Link to="/shop/embroidery" className="group mt-8 inline-flex reveal items-center gap-2 bg-ink px-10 py-4 text-[11.5px] font-bold uppercase tracking-[0.2em] text-bone hover:opacity-85">
          Shop the embroidery collection <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </section>
    </div>
  );
}

/* =============================== JOURNAL =============================== */

export function JournalPage() {
  useReveal();
  return (
    <div className="container-x py-10">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Journal" }]} />
      <h1 className="display-2 mt-5">The Journal.</h1>
      <p className="mt-3 max-w-lg text-[14.5px] text-muted-foreground">
        Stories from the studio — on stitches, fabric, styling and the people behind the needle.
      </p>

      <div className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {journal.map((a, i) => (
          <article key={a.slug} className="reveal group" style={{ transitionDelay: `${(i % 3) * 80}ms` }}>
            <Link to={`/journal/${a.slug}`} className="block overflow-hidden bg-secondary">
              <div className="aspect-[4/3] overflow-hidden">
                { }
                <img
                  src={a.image}
                  alt={a.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                />
              </div>
            </Link>
            <div className="mt-4 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              <span className="text-bronze">{a.category}</span>
              <span aria-hidden>·</span>
              <span>{formatDate(a.date)}</span>
              <span aria-hidden>·</span>
              <span>{a.readTime}</span>
            </div>
            <h2 className="mt-2 text-lg font-extrabold leading-snug">
              <Link to={`/journal/${a.slug}`} className="hover:underline underline-offset-4">{a.title}</Link>
            </h2>
            <p className="mt-2 text-[13.5px] leading-relaxed text-ink/65">{a.excerpt}</p>
            <Link to={`/journal/${a.slug}`} className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-ink">
              Read more <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

export function JournalArticlePage({ slug }: { slug: string }) {
  const a = journal.find((j) => j.slug === slug);
  useReveal([slug]);
  if (!a) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="display-2">Story not found</h1>
        <Link to="/journal" className="mt-8 inline-block bg-ink px-8 py-4 text-[11.5px] font-bold uppercase tracking-[0.2em] text-bone">Back to journal</Link>
      </div>
    );
  }
  const others = journal.filter((j) => j.slug !== slug).slice(0, 3);
  return (
    <article className="pb-20">
      <div className="container-x max-w-3xl pt-10">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Journal", href: "/journal" }, { label: a.title }]} />
        <div className="mt-8 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          <span className="text-bronze">{a.category}</span>
          <span aria-hidden>·</span>
          <span>{formatDate(a.date)}</span>
          <span aria-hidden>·</span>
          <span>{a.readTime} read</span>
        </div>
        <h1 className="mt-4 text-3xl font-extrabold uppercase leading-tight tracking-tight sm:text-4xl">{a.title}</h1>
        <p className="mt-4 text-[16px] leading-relaxed text-ink/70">{a.excerpt}</p>
      </div>
      <div className="container-x mt-10 max-w-4xl">
        <div className="overflow-hidden">
          { }
          <img src={a.image} alt={a.title} className="aspect-[16/9] w-full object-cover" />
        </div>
      </div>
      <div className="container-x mt-12 max-w-2xl">
        {a.body.map((p, i) => (
          <p key={i} className="reveal mb-6 text-[16px] leading-[1.85] text-ink/80 first:mb-6">
            {i === 0 ? <><span className="float-left mr-3 text-[46px] font-extrabold leading-[0.85] text-bronze">{p.slice(0, 1)}</span>{p.slice(1)}</> : p}
          </p>
        ))}
        <div className="mt-12 border-t border-line pt-8">
          <p className="eyebrow text-muted-foreground">Keep reading</p>
          <ul className="mt-5 space-y-4">
            {others.map((o) => (
              <li key={o.slug}>
                <Link to={`/journal/${o.slug}`} className="group flex items-center justify-between gap-6 border-b border-line pb-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-bronze">{o.category}</p>
                    <p className="mt-1 text-[15.5px] font-bold group-hover:underline underline-offset-4">{o.title}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-ink/40 transition-transform group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
