import React from 'react';

interface SpotifyEmbedProps {
  trackId: string;
  width?: number;
  height?: number;
}

export const SpotifyEmbed: React.FC<SpotifyEmbedProps> = ({ 
  trackId, 
  width = 400,
  height = 152
}) => {
  return (
    <div className="flex justify-center px-6 w-full max-w-2xl mx-auto">
      <iframe
        className="rounded-xl w-full"
        src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=1`}
        height={height}
        frameBorder="0"
        allowFullScreen={true}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      />
    </div>
  );
}; 