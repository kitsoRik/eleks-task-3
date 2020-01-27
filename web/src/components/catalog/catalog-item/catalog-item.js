import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import PropTypes from 'prop-types'

import "./catalog-item.scss";

class CatalogItem extends Component {

     static propTypes = {
          pid: PropTypes.number.isRequired
     }

     render() {

          const { id, name, year, albumsCount, index } = this.props;

          let finalName = this._fillSearchPos();
          
          return (
               <div className="catalog-item" onClick={() => this.props.history.push(`/catalog/${id}`)}>
                    <div className="catalog-item-index">{index}</div>
                    <div className="catalog-item-info-splitter">&nbsp;</div>
                    <div className="catalog-item-info catalog-item-name">{finalName}</div>
                    <div className="catalog-item-info-splitter">&nbsp;</div>
                    <div className="catalog-item-info">{year}</div>
                    <div className="catalog-item-info-splitter">&nbsp;</div>
                    <div className="catalog-item-info">{albumsCount}</div>

               </div>
          );
     }

     _fillSearchPos = () => {
          const { name, search } = this.props;

          if (!search) return name;

          let startIndex = name.toLowerCase().indexOf(search.toLowerCase());
          let left = name.substr(0, startIndex);
          let middle = name.substr(startIndex, search.length);
          let right = name.substr(left.length + middle.length, name.length);

          return <span>{left}<b style={{ textDecoration: "underline" }}>{middle}</b>{right}</span>
     }
}

export default withRouter(CatalogItem);