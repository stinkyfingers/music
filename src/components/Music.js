import React from 'react';
import parser from 'fast-xml-parser';

const Music = () => {
  const [tracks, setTracks] = React.useState([]);

  React.useEffect(() => {
    const getTracks = () => {
      const items = [];
      return fetch('https://s3-us-west-1.amazonaws.com/tracks.john-shenk.com')
        .then(resp => resp.text())
        .then(resp => {
          if(parser.validate(resp) === true) {
            var jsonObj = parser.parse(resp);
            for (let i = 0; i < jsonObj.ListBucketResult.Contents.length; i++) {
              const object = jsonObj.ListBucketResult.Contents[i];
              const info = object.Key.split('_');
              const band = info[0].match(/[A-Z][^A-Z]+/g).join(' ');
              const album = info[1].match(/[A-Z0-9][^A-Z]+/g).join(' ');
              const track = info[2].match(/[A-Z][^A-Z]+/g).join(' ').replace('&apos;', '\'', -1);
              const item = { band, album, track, url: object.Key }
              items.push(item);
            }
          }
        })
        .then(() => {
          setTracks(items);
        });
    };
    getTracks();
  }, []);

  const renderTracks = () => {
    return tracks.map(track =>
      <tr key={`${track.band}-${track.album}-${track.track}`}>
        <td>{track.band}</td>
        <td>{track.album}</td>
        <td><a href={`https://s3-us-west-1.amazonaws.com/tracks.john-shenk.com/${track.url.replace('&apos;', '\'', -1)}`}>{track.track}</a></td>
      </tr>
    );
  };

  return <div className='Music'>
    <table className='tracks'>
      <thead>
        <tr>
          <th>Band</th>
          <th>Album</th>
          <th>Song</th>
        </tr>
      </thead>
      <tbody>
        {renderTracks()}
      </tbody>
    </table>
  </div>;
};

export default Music;
