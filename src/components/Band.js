import React from 'react';

const Band = ({ tracks }) => {
  return <table className='band'>
    <thead>
      <tr>
        <th>Band</th>
        <th>Album</th>
        <th>Song</th>
      </tr>
    </thead>
    <tbody>
      { tracks.map(track =>
        <tr key={`${track.band}-${track.album}-${track.track}`}>
          <td>{track.band}</td>
          <td>{track.album}</td>
          <td><a href={`https://s3-us-west-1.amazonaws.com/tracks.john-shenk.com/${track.url.replace('&apos;', '\'', -1)}`}>{track.track}</a></td>
        </tr>
      ) }
    </tbody>
  </table>;
};

export default Band;
