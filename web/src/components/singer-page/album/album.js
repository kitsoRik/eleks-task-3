import React from 'react'

import ApiHelper from "../../../services/apiHelper"

import './album.scss'

export default class Album extends React.Component {

    state = {
        isOpen: false,
        sortBy: "name",
        sortDesc: false
    }

    onDropdownClick = () => {
        this.setState((old) => {
            return {
                isOpen: !old.isOpen
            }
        });
    }

    onClickSort = (e, sortBy) => {
        e.stopPropagation();

        if(this.state.sortBy === sortBy)
        {
            this.setState((old) => {
                return {
                    sortDesc: !old.sortDesc
                }
            });
            return;
        }

        this.setState((old) => {
            return {
                sortBy,
                sortDesc: false
            }
        });
    }

    render() {

        const { isOpen, sortBy, sortDesc } = this.state;

        const { album } = this.props;

        const { id, singer_id, name, songs } = album;
        
        let sortedSongs = !sortBy ? songs : songs.sort((song1, song2) => {
            if(sortDesc) return song1[sortBy] > song2[sortBy] ? -1 : 1;
            return song1[sortBy] < song2[sortBy] ? -1 : 1;
        })

        const sortArrow = <div className="album-song-header-sort-arrow">^</div>;
        const sortArrowDown = <div style={{transform: "rotateX(180deg)"}} className="album-song-header-sort-arrow">^</div>;

        let songsElement = songs.map((song) => {
                return (
                    <div className="album-song">
                        <span className="album-song-field album-song-name">
                            { song.name }
                        </span>
                        <span className="album-song-field album-song-description">
                            { song.description }
                        </span>
                        <span className="album-song-field album-song-duration">
                            { this._parseDuration(song.duration) }
                        </span>
                    </div>
                )
            });

            console.log(songsElement.length);
        const albumSongsClasses = "album-songs " + (isOpen ? "album-songs-open" : "");

        return (
            <div className="album-container" onClick={this.onDropdownClick}>
                <div className="album-row-data">
                    <div className="album-icon">
                        <img src={`${ApiHelper.host}/photo/albums/${id}_${singer_id}.jpg`} />
                    </div>
                    <span className="album-name">
                        {name}
                    </span>
                    <div className="album-dropdown">
                        &nbsp;
                    </div>
                </div> 
                <div className={albumSongsClasses}>
                    <div className="album-songs-headers">
                        <div 
                            className="album-songs-header" 
                            onClick={(e) => this.onClickSort(e, "name")}>
                            Name 
                            
                            { sortBy === "name" ? 
                                (!sortDesc ? sortArrow : sortArrowDown)
                             : null }
                        </div>
                        <div 
                            className="album-songs-header album-songs-header-description"
                            onClick={(e) => this.onClickSort(e, "description")}>
                            Description 
                            
                            { sortBy === "description" ? 
                                (!sortDesc ? sortArrow : sortArrowDown)
                             : null }
                        </div>
                        <div 
                            className="album-songs-header"
                            onClick={(e) => this.onClickSort(e, "duration")}>
                            Duration 
                            
                            { sortBy === "duration" ? 
                                (!sortDesc ? sortArrow : sortArrowDown)
                             : null }
                        </div>
                    </div>
                    { songsElement }
                </div>
            </div>
        )
    }

    _parseDuration = (duration) => {
        let hour = parseInt(duration / 3600);
        duration %= 3600;
        let min = parseInt(duration / 60);
        duration %= 60;
        let sec = duration;

        if(hour === 0) return `${this._firstZero(min)}:${this._firstZero(sec)}`;

        return `${this._firstZero(hour)}:${this._firstZero(min)}:${this._firstZero(sec)}`;
    }

    _firstZero = (n) => {
        if(n < 10) return `0${n}`;
        return n; 
    }
}