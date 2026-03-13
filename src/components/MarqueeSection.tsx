"use client";

interface MarqueeItem {
  text: string;
}

interface MarqueeProps {
  items: MarqueeItem[];
}

export default function MarqueeSection({ items }: MarqueeProps) {
  return (
    <section className="marquee-wrapper">
      <div className="marquee-inner">
        <div className="marquee-track">
          {/* Content Set 1 */}
          {items.map((item, index) => (
            <div key={`set1-${index}`} className="marquee-item">
              {item.text} <span>✦</span>
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {items.map((item, index) => (
            <div key={`set2-${index}`} className="marquee-item">
              {item.text} <span>✦</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
