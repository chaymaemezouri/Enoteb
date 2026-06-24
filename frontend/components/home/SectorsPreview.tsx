'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { homeContent } from '@/config/home';
import { Container } from '@/components/ui/Container';
import { resolveThumbnailUrl, truncateText } from '@/lib/utils';
import type { Sector } from '@/types';

interface SectorsPreviewProps {
  sectors: Sector[];
}

function getVisibleCount(width: number) {
  if (width >= 1024) return 3;
  if (width >= 640) return 2;
  return 1;
}

export function SectorsPreview({ sectors }: SectorsPreviewProps) {
  const { sectors: content } = homeContent;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const update = () => setVisibleCount(getVisibleCount(window.innerWidth));
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const maxIndex = Math.max(0, sectors.length - visibleCount);

  useEffect(() => {
    setCurrentIndex((index) => Math.min(index, maxIndex));
  }, [maxIndex]);

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
    },
    [maxIndex],
  );

  const pages = maxIndex + 1;

  return (
    <section className="border-t border-[#2f3136]/8 bg-background py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="mb-12 flex flex-col gap-6 sm:mb-14 sm:flex-row sm:items-end sm:justify-between lg:mb-16">
          <div>
            <p className="text-[0.8125rem] font-bold uppercase tracking-[0.1em] text-[#F36A21]">
              {content.overline}
            </p>
            <h2 className="font-display mt-3 max-w-xl text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-[1.12] tracking-[-0.02em] text-[#2f3136]">
              {content.title}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-600 sm:text-base">
              {content.description}
            </p>
          </div>
          <Link
            href="/secteurs"
            className="link-focus shrink-0 text-sm font-medium text-neutral-500 transition-colors hover:text-[#F36A21] focus-visible:ring-[#F36A21]"
          >
            Tous les secteurs →
          </Link>
        </div>

        {sectors.length > 0 ? (
          <>
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  transform: `translateX(-${(currentIndex * 100) / visibleCount}%)`,
                }}
              >
                {sectors.map((sector, index) => {
                  const imageUrl = resolveThumbnailUrl(sector.imageUrl, sector.slug);

                  return (
                    <div
                      key={sector.id}
                      className="shrink-0 px-2 sm:px-3"
                      style={{ width: `${100 / visibleCount}%` }}
                    >
                      <article className="flex h-full flex-col">
                        <span className="font-display text-[clamp(3rem,7vw,4.25rem)] font-light leading-none text-[#2f3136]/15">
                          {index + 1}
                        </span>

                        <Link
                          href={`/secteurs/${sector.slug}`}
                          className="link-focus group mt-5 flex flex-1 flex-col focus-visible:ring-[#F36A21]"
                        >
                          <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100 shadow-[0_8px_30px_rgb(47_49_54_/_0.08)] ring-1 ring-[#2f3136]/8">
                            <Image
                              src={imageUrl}
                              alt={`Secteur ${sector.name}`}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          </div>

                          <h3 className="mt-6 text-lg font-bold text-[#2f3136] transition-colors group-hover:text-[#F36A21] sm:text-xl">
                            {sector.name}
                          </h3>
                          <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-500">
                            {truncateText(sector.description, 130)}
                          </p>
                        </Link>
                      </article>
                    </div>
                  );
                })}
              </div>
            </div>

            {sectors.length > visibleCount ? (
              <div className="mt-12 flex flex-col items-center gap-5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => goTo(currentIndex - 1)}
                    disabled={currentIndex === 0}
                    aria-label="Secteur précédent"
                    className="link-focus flex h-10 w-10 items-center justify-center border border-[#2f3136]/15 bg-white text-[#2f3136] transition-colors hover:border-[#F36A21]/40 hover:text-[#F36A21] disabled:pointer-events-none disabled:opacity-30 focus-visible:ring-[#F36A21]"
                  >
                    <ChevronLeft className="h-4 w-4" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => goTo(currentIndex + 1)}
                    disabled={currentIndex >= maxIndex}
                    aria-label="Secteur suivant"
                    className="link-focus flex h-10 w-10 items-center justify-center border border-[#2f3136]/15 bg-white text-[#2f3136] transition-colors hover:border-[#F36A21]/40 hover:text-[#F36A21] disabled:pointer-events-none disabled:opacity-30 focus-visible:ring-[#F36A21]"
                  >
                    <ChevronRight className="h-4 w-4" aria-hidden />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {Array.from({ length: pages }).map((_, pageIndex) => (
                    <button
                      key={pageIndex}
                      type="button"
                      onClick={() => goTo(pageIndex)}
                      aria-label={`Aller au groupe ${pageIndex + 1}`}
                      aria-current={pageIndex === currentIndex ? 'true' : undefined}
                      className="link-focus p-1 focus-visible:ring-[#F36A21]"
                    >
                      <span
                        className={
                          pageIndex === currentIndex
                            ? 'block h-0.5 w-6 bg-[#F36A21]'
                            : 'block h-1.5 w-1.5 rounded-full bg-[#2f3136]/20'
                        }
                        aria-hidden
                      />
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <p className="text-sm text-neutral-500">Nos secteurs seront bientôt disponibles.</p>
        )}
      </Container>
    </section>
  );
}
