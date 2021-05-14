import React from 'react';
import parser from 'fast-xml-parser';
import _ from 'lodash';
import Band from './Band';

const Music = () => {
  const [myTracks, setMyTracks] = React.useState([]);
  const [otherTracks, setOtherTracks] = React.useState([]);
  const [secretTracks, setSecretTracks] = React.useState([]);
  const [showSecrets] = React.useState(window.location.pathname === '/secrets');
  const [band, setBand] = React.useState();

  React.useEffect(() => {
    const getTracks = () => {
      const myBands = [];
      const otherBands = [];
      const secrets = [];

      return fetch('https://s3-us-west-1.amazonaws.com/tracks.john-shenk.com')
        .then(resp => resp.text())
        .then(resp => {
          if(parser.validate(resp) === true) {
            var jsonObj = parser.parse(resp);
            for (let i = 0; i < jsonObj.ListBucketResult.Contents.length; i++) {
              const object = jsonObj.ListBucketResult.Contents[i];
              const info = object.Key.split('/');
              const item = { group: info[0], band: info[1], album: info[2], track: info[3], url: object.Key };
              switch (item.group) {
                case 'john':
                  myBands.push(item);
                  break;
                case 'secret':
                  secrets.push(item);
                  break;
                case 'bands':
                  otherBands.push(item);
                  break;
              }
            }
          }
        })
        .then(() => {
          setMyTracks(myBands);
          setOtherTracks(otherBands);
          setSecretTracks(secrets);
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

  const renderBands = (items) => {
    if (items.length < 1) return null;
    const bands = _.reduce(items, (res, value, key) => {
      (res[value.band] || (res[value.band] = [])).push(value)
      return res;
    }, {});
    return <ul>
      { _.map(bands, (b, key) => <li key={key}><button onClick={() => setBand(b)}>{key}</button></li>)}
    </ul>;
  };

  const renderBand = () => {
    return <Band tracks={band} />;
  };

  return <div className='Music'>
    <div className='Groups'>
      <div>
        <h3>My High School Bands/Podcasts</h3>
        {renderBands(myTracks)}
      </div>

      <div>
        <h3>Other High School Bands</h3>
        {renderBands(otherTracks)}
      </div>

      {showSecrets ?
        <div>
          <h3>Nonesense</h3>
          {renderBands(secretTracks)}
        </div>
      : null }
    </div>
    <div>
      {band ? renderBand() : null}
    </div>
  </div>;
};

export default Music;
