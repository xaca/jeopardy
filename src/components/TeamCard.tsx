import React from 'react';
import QRCode from 'react-qr-code';

interface TeamCardProps {
  id: string;
  name: string;
  score: number;
  partidaId: string;
}

const TeamCard: React.FC<TeamCardProps> = ({ id, name, score, partidaId }) => {
  const playerUrl = `${window.location.origin}/#/player/${partidaId}/${id}`;

  return (
    <div key={id} className="bg-[#000066] p-4 rounded text-white">
      <h3 className="text-base md:text-lg font-bold mb-1">{name}</h3>
      <p className="text-lg md:text-xl lg:text-2xl mb-3">${score}</p>
      <div className="flex justify-center bg-white p-3 rounded-lg">
        <QRCode
          value={playerUrl}
          size={150}
          level="H"
          bgColor="white"
          fgColor="#000066"
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          viewBox={`0 0 150 150`}
        />
      </div>
      <p className="text-xs text-center mt-2 text-gray-300 break-all">
        <a href={playerUrl} target="_blank" rel="noopener noreferrer">Link</a>
      </p>
    </div>
  );
};

export default TeamCard; 