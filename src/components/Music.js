import React from 'react';

// TODO - make API
const music = [
  {
    name: 'Pancake Band',
    tracks: [
      { name: 'Another Day', url: 'https://s3-us-west-1.amazonaws.com/tracks.john-shenk.com/PancakeBand-6-Song-Demo-AnotherDay.mp3' },
      { name: 'Caged Dreams', url: 'https://s3-us-west-1.amazonaws.com/tracks.john-shenk.com/PancakeBand-6-Song-Demo-CagedDreams.mp3' },
      { name: 'Debating', url: 'https://s3-us-west-1.amazonaws.com/tracks.john-shenk.com/PancakeBand-6-Song-Demo-Debating.mp3' },
      { name: 'Half Cocked', url: 'https://s3-us-west-1.amazonaws.com/tracks.john-shenk.com/PancakeBand-6-Song-Demo-HalfCocked.mp3' },
      { name: 'Holding On', url: 'https://s3-us-west-1.amazonaws.com/tracks.john-shenk.com/PancakeBand-6-Song-Demo-HoldingOn.mp3' },
      { name: 'Red The Rug Dog', url: 'https://s3-us-west-1.amazonaws.com/tracks.john-shenk.com/PancakeBand-6-Song-Demo-RedTheRugDog.mp3' }
    ]
  }
];

const Music = () => {
  return <div className='Music'>
    {music.map(band => {
      return <div className='band' key={band.name}>
        <h5>{band.name}</h5>
        {band.tracks.map(track => <div key={track.url}><a href={track.url}>{track.name}</a></div>) }
      </div>
    })}
  </div>;
};

export default Music;
