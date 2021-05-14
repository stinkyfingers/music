import React from 'react';
import parser from 'fast-xml-parser';

const Music = () => {
  const [myTracks, setMyTracks] = React.useState([]);
  const [otherTracks, setOtherTracks] = React.useState([]);
  const [secretTracks, setSecretTracks] = React.useState([]);
  const [showSecrets] = React.useState(window.location.pathname === '/secrets');

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

    {showSecrets ?
      <div>
        <h3>Nonesense</h3>
        <table className='tracks'>
          <thead>
            <tr>
              <th>Band</th>
              <th>Album</th>
              <th>Song</th>
            </tr>
          </thead>
          <tbody>
            {renderTracks(secretTracks)}
          </tbody>
      </table>
      </div>
    : null }
  </div>;
};

export default Music;
