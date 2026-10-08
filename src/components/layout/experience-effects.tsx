'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useSpring } from 'motion/react';
export function ExperienceEffects() {
  const path = usePathname();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const prepared = new WeakSet<HTMLElement>();
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const element = entry.target as HTMLElement;
          // Animate only position; never reset visible content to opacity zero.
          // Web Animations also leaves React-owned HTML attributes untouched.
          const animation = element.animate([{ translate: '0 14px' }, { translate: '0 0' }], {
            duration: 800,
            easing: 'cubic-bezier(.22,1,.36,1)',
          });
          animations.add(animation);
          animation.finished.then(() => animations.delete(animation)).catch(() => {});
          observer.unobserve(element);
        }
      },
      { threshold: 0, rootMargin: '0px 0px 90px 0px' },
    );
    function prepare() {
      document
        .querySelectorAll<HTMLElement>(
          '.section-heading, .entry-card, .service-card, .process-step, .product-feature, .cta-banner, .about-monogram, .form-card',
        )
        .forEach((element) => {
          if (prepared.has(element)) return;
          prepared.add(element);
          // Never hide content that has already appeared in the viewport.
          if (element.getBoundingClientRect().top < window.innerHeight + 110) {
            return;
          }
          observer.observe(element);
        });
    }
    prepare();
    let frame = 0;
    const mutations = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(prepare);
    });
    mutations.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      mutations.disconnect();
      cancelAnimationFrame(frame);
      animations.forEach((animation) => animation.cancel());
    };
  }, [path]);
  return (
    <motion.div className="reading-progress" style={{ scaleX: progress }} aria-hidden="true" />
  );
}
