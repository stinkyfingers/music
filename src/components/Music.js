import React from 'react';
import parser from 'fast-xml-parser';

const Music = () => {
  const [myTracks, setMyTracks] = React.useState([]);
  const [otherTracks, setOtherTracks] = React.useState([]);

  React.useEffect(() => {
    const getTracks = () => {
      const myBands = [];
      const otherBands = [];

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
              const isOther = info[0].split('/')[0] === 'bands';
              if (isOther) {
                otherBands.push(item);
                continue;
              }
              myBands.push(item);
            }
          }
        })
        .then(() => {
          setMyTracks(myBands);
          setOtherTracks(otherBands);
        });
    };
    getTracks();
  }, []);

  const renderTracks = (tracks) => {
    return tracks.map(track =>
      <tr key={`${track.band}-${track.album}-${track.track}`}>
        <td>{track.band}</td>
        <td>{track.album}</td>
        <td><a href={`https://s3-us-west-1.amazonaws.com/tracks.john-shenk.com/${track.url.replace('&apos;', '\'', -1)}`}>{track.track}</a></td>
      </tr>
    );
  };

  return <div className='Music'>
    <div>
      <h3>My High School Bands</h3>
      <table className='tracks'>
        <thead>
          <tr>
            <th>Band</th>
            <th>Album</th>
            <th>Song</th>
          </tr>
        </thead>
        <tbody>
          {renderTracks(myTracks)}
        </tbody>
      </table>
    </div>

    <div>
      <h3>Other High School Bands</h3>
      <table className='tracks'>
        <thead>
          <tr>
            <th>Band</th>
            <th>Album</th>
            <th>Song</th>
          </tr>
        </thead>
        <tbody>
          {renderTracks(otherTracks)}
        </tbody>
    </table>
    </div>
  </div>;
};

export default Music;
