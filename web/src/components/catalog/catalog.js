import React, { Component } from 'react'

import CatalogItem from './catalog-item'

import "./catalog.scss"

import ApiHelper from '../../services/apiHelper'

export default class Catalog extends Component {

     query = {
          search: null,
          sort: "name",
          sortType: "ASC",
          limit: 5,
          page: 1
     }

     state = {
          loaded: false,
          singers: [],

          pagesCount: 1
     }

     componentDidMount() {
          ApiHelper.getPagesCount(this.query.limit)
                    .then(({ pagesCount }) => {
                         this.setState({
                              pagesCount
                         });
                    });
          this._updateQuery();
     }

     onStartSearch = (text) => {
          this.query.search = text;

          this._updateQuery();
     }

     onStartSort = (field) => {
          if(this.query.sort === field) {
               this.query.sortType = this.query.sortType === "ASC" ? "DESC" : "ASC";
          } else {
               this.query.sort = field;
               this.query.sortType = "ASC";
          }
          this._updateQuery();
     }

     render() {
          const { singers, loaded } = this.state;

          console.log(singers);

          if(!loaded) return (
               <div className="catalog-container">
                    <input placeholder="Search..." onChange={(e) => this.onStartSearch(e.target.value)}/>
               </div>
          )

          let sortArrow;
          if(this.query.sortType === "ASC") {
               sortArrow = <div className="catalog-container-header-sort-arrow">^</div>;
          } else {
               sortArrow = <div style={{transform: "rotateX(180deg)"}} className="catalog-container-header-sort-arrow">^</div>;
          }

          let startIndex = (this.query.page - 1) * this.query.limit;
          const elements = singers.map((singer, index) => {
               return (
                    <CatalogItem index={startIndex + index + 1} search={this.query.search} { ...singer }/>
               )
          });
          
          return (
               <div className="catalog">
               <input placeholder="Search..." onChange={(e) => this.onStartSearch(e.target.value)}/>
               <div className="catalog-container-headers">
                    <div 
                         className="catalog-container-header catalog-container-header-name"
                         onClick={ () => this.onStartSort("name") }>
                         Name
                         { this.query.sort === "name" ? sortArrow : null }
                    </div>
                    <div 
                         className="catalog-container-header"
                         onClick={ () => this.onStartSort("year") }>
                         Year
                         { this.query.sort === "year" ? sortArrow : null }
                    </div>
                    <div 
                         className="catalog-container-header"
                         onClick={ () => this.onStartSort("albumsCount") }>
                         Albums
                         { this.query.sort === "albumsCount" ? sortArrow : null }
                    </div>
               </div>
                    <div className="catalog-container">
                         { elements }
                    </div>
                         <div>
                              <button 
                                   onClick={() => this._changePage("prev")}
                                   style={{display: this.query.page === 1 ? "none" : "inline"}}
                                   >{"<"}</button>
                              <span>{ this.query.page }</span>
                              <button 
                                   onClick={() => this._changePage("next")}
                                   style={{display: this.query.page === this.state.pagesCount ? "none" : "inline"}}
                                   >{">"}</button>
                         </div>
               </div>
               
          );
     }

     _changePage = (direction) => {
          if(direction === "next") {
               this.query.page++;
          } else {
               this.query.page--;
          }

          if(this.query.page < 0) this.query.page = 0;

          this._updateQuery();
     }

     _updateQuery = () => {
          this.setState({ loaded: false });
          ApiHelper.getAllSingers(this.query)
          .then((body) => {
               this.setState({
                    singers: body,
                    loaded: true
               });
          });
     }
}