import React from 'react';

export const MeteorShower: React.FC = () => (
  <div className="meteor-field" aria-hidden="true">
    <div className="meteor-aurora meteor-aurora-green" />
    <div className="meteor-aurora meteor-aurora-cyan" />
    <div className="meteor-stars">
      {Array.from({ length: 42 }, (_, index) => (
        <span
          key={index}
          className="meteor-star"
          style={{
            left: `${(index * 37) % 100}%`,
            top: `${(index * 61) % 100}%`,
            animationDelay: `${(index * 0.19) % 4}s`,
            animationDuration: `${2.4 + (index % 4) * 0.65}s`,
          }}
        />
      ))}
    </div>
    {Array.from({ length: 18 }, (_, index) => (
      <span
        key={index}
        className="meteor"
        style={{
          left: `${4 + ((index * 17) % 94)}%`,
          top: `${-8 + ((index * 23) % 58)}%`,
          animationDelay: `${(index * 0.73) % 7}s`,
          animationDuration: `${4.8 + (index % 5) * 0.8}s`,
          height: `${72 + (index % 5) * 18}px`,
          opacity: 0.42 + (index % 4) * 0.1,
        }}
      />
    ))}
  </div>
);
