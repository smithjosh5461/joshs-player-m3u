import React, { useEffect, useRef, useState } from "react";

// This imports the functional component from the previous sample.
import VideoJS from './VideoJs'

export default function App() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentChannel,setCurrentChannel] = useState('https://v3.szjal.cn/20191101/PZzNpqB1/index.m3u8');
  const playerRef = React.useRef(null);
  const initialized = useRef(false)
  const [M3uUrl, setM3uUrl] = useState('https://bitbucket.org/!api/2.0/snippets/fluxustv/KpaEKX/60c3e0d18b350c95249a40e06665a1f13085ca48/files/FTV-ENG');

  const handleM3UUrlChange = event => {
    setM3uUrl(event.target.value);
  };

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      const data = localStorage.getItem('m3uList');
      console.log(data)
      if(data){
        parseM3u(JSON.parse(data));
        console.log('result loaded from file')
      }
    }
  },[]);

  const changeChannel = (e) => {
    const channel = items[e.currentTarget.dataset.idx]
    console.log(channel.url);
    console.log(channel);
    setCurrentChannel(channel.url);
  }

  const downloadM3u = async () =>{
    try {
      console.log('download started')
      const url = M3uUrl;
      const response = await fetch(url, { timeout: 120000 });
      const data = await response.text();
      console.log('download complete')

      localStorage.setItem('m3uList', JSON.stringify(data));

      await parseM3u(data)
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  }
  const parseM3u = async (data) => {
      // Process your M3U data here
      console.log('parsing m3u: ')
      const parser = require('iptv-playlist-parser')
      const result = parser.parse(data)
      console.log('setting channel to first channel')
      setCurrentChannel(result.items[1].url);

      setItems(result.items);
      setIsLoading(false);
  }

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [{
      src: currentChannel,
      type: 'application/x-mpegURL'
    }]
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on('waiting', () => {
      console.log('player is waiting');
    });

    player.on('dispose', () => {
      console.log('player will dispose');
    });
  };

  return (
    <>
    <ul>
      <button onClick={downloadM3u}>Load M3u</button><input onChange={handleM3UUrlChange} value={M3uUrl}></input>
      { isLoading && <p>no url loaded</p>}
      {!isLoading && items.map(function(d, idx){
          return (<li key={d.line} onClick={changeChannel} data-idx={idx}>{d.name}</li>)
        })}
      
    
    </ul>
    { !isLoading &&
      <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
    }
    
    </>
  );
}