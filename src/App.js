import React, { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

const Video = (props) => {
  const videoNode = useRef(null);
  const [player, setPlayer] = useState(null);
  useEffect(() => {
    if (videoNode.current) {
      const _player = videojs(videoNode.current, props);
      setPlayer(_player);
      return () => {
        if (player !== null) {
          player.dispose();
        }
      };
    }
  }, []);

  return (
    <div data-vjs-player>
      <video ref={videoNode} className="video-js"></video>
    </div>
  );
};

export default function App() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentChannel, setCurrentChannel] = useState("https://v3.szjal.cn/20191101/PZzNpqB1/index.m3u8");
  
  const loadM3u = () => {
    fetchData();
  }
  const changeChannel = (e) => {
    const channel = items[e.currentTarget.dataset.idx]
    console.log(channel.url);
    //console.log(channel);
    setCurrentChannel(channel.url);
  }
  async function fetchData() {
    try {
      console.log('download started')
      const url = 'https://bitbucket.org/!api/2.0/snippets/fluxustv/KpaEKX/60c3e0d18b350c95249a40e06665a1f13085ca48/files/FTV-ENG';
      const response = await fetch(url, { timeout: 120000 });
      const data = await response.text();
      console.log('download complete parsing m3u')
      // Process your M3U data here
      const parser = require('iptv-playlist-parser')
      const result = parser.parse(data)
      //setCurrentChannel(data.items[0].url);
      //play.sources.src = currentChannel;
      console.log('parsing complete')
      //console.log(result.items)
      
      //const channelItems = result.items.map((channel) =>
      //  <li key={channel.name.toString()}>
      //    {channel.url}
      //  </li>
      //);
      setItems(result.items);
      setIsLoading(false);
      //setCurrentChannels(channelItems);
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  }
  const play = {
    fill: true,
    fluid: true,
    autoplay: true,
    controls: true,
    preload: "metadata",
    sources: [
      {
        src: currentChannel,
        type: "application/x-mpegURL"
      }
    ]
  };
  return (
    <div className="App">
      <ul>
        {isLoading && <li>Please Load M3u <button onClick={loadM3u}>Load M3u</button></li>}
        {!isLoading && items.map(function(d, idx){
          return (<li key={d.line} onClick={changeChannel} data-idx={idx}>{d.name}</li>)
        })}
      </ul>
      <Video {...play} />
       
    </div>
  );
}