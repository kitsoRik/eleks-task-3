import React, { Component } from 'react';
import Album from './album';

import "./singer-page.scss";

import ApiHelper from '../../services/apiHelper'
import SavedSingers from '../../services/savedSingers'

export default class SingerPage extends Component {

     state = {
          singer: null
     }

     componentDidMount() {
          
          const { id } = this.props.match.params;
          const { getContainsSingerById } = this.props;
          const { onElementLoaded } = this.props;

          let containsSinger = getContainsSingerById(id);

          if(containsSinger) {
               this.setState({
                    singer: containsSinger
               });
               return;
          }

          if(SavedSingers.hasSinger(id)) {
               this.setState({
                    singer: SavedSingers.getSinger(id)
               })
               return;
          }

          ApiHelper.getSingerById(id)
                    .then((singer) => {
                         this.setState({
                              singer
                         });
                         onElementLoaded(singer);
                    });
     }

     render() {
          if(!this.state.singer) return (<div>Loading...</div>);
          
          const { id, name, type, albums } = this.state.singer;
          
          let albumElement;
          if(albums.length === 0)
          {
               let singer = type === "Group" ? "group" : "singer";
               albumElement = <div style={{color: "white"}}> This {singer} dont have any song. </div>
          } else {
               const albumsElements = albums.map((album) => {
                    return (
                         <Album album={ album }/>
                    )
               });
               albumElement = <div className="singer-albums">
                                   { albumsElements }
                              </div>;
          }
          

          return (
               <div className="singer-page">
                    <div className="singer-container">
                         <div className="singer-title">{ name }</div>
                         <div className="singer-photo">
                              <img src={`${ApiHelper.host}/photo/singers/${id}.jpg`}/>
                         </div>
                         { albumElement }
                    </div>
               </div>
          );
     }
}