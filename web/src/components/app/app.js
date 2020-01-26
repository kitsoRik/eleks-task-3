import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import Catalog from '../catalog'
import SingerPage from '../singer-page'

export default class App extends Component {

     state = {
          containsSingers: {}
     }

     onElementLoaded = (beer) => {
          const { containsSingers } = this.state;

          if(containsSingers[beer.id]) return;

          containsSingers[beer.id] = beer;
	};
	
	getContainsSingerById = (id) => {
          const { containsSingers } = this.state;
          return containsSingers[id];
	}

     render() {
          const catalog = () => <Catalog/>;
          const element = (props) => <SingerPage 
          						getContainsSingerById={this.getContainsSingerById}
                                        onElementLoaded={this.onElementLoaded}
                                        {...props}/>;

          return (
               <div>
                    <Router>
                         <Route path="/" render={() => <Link to="/catalog">Catalog</Link>} exact/>
                         <Route path="/catalog" component={catalog} exact />
                         <Route path="/catalog/:id" component={element} exact />
                    </Router>
               </div>
          );
     }
}