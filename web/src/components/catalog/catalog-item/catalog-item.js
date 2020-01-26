import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import "./catalog-item.scss";

export default class CatalogItem extends Component {


     render() {
          
          const { id, name, year, albumsCount, index } = this.props;
          const { onSelectedBeer } = this.props;

          let finalName = this._fillSearchPos();

          return (
               <Link className="catalog-item" to={`/catalog/${id}`}>
                    <div className="catalog-item-index">{index}</div>
                    <div className="catalog-item-info catalog-item-name">{ finalName }</div>
                    <div className="catalog-item-info">{ year }</div>
                    <div className="catalog-item-info">{ albumsCount }</div>
               </Link>
          );
     }

     _fillSearchPos = () => {
          const { name, search } = this.props;

          if(!search) return name;

          let startIndex = name.toLowerCase().indexOf(search.toLowerCase());
          let left = name.substr(0, startIndex);
          let middle = name.substr(startIndex, search.length);
          let right = name.substr(left.length + middle.length, name.length);

          return <span>{left}<b style={{textDecoration: "underline"}}>{middle}</b>{right}</span>
     }
}