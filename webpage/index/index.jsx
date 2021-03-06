import ReactDOM from 'react-dom';

import PageHeader from './Header.jsx'
import SearchPanel from './SearchPanel.jsx'

import axios from 'axios'
import $ from 'jquery'

export default class MainContainer extends React.Component {
	constructor(){
		super();
		this.state={
		};

	}
	componentWillMount(){
	}
	componentDidMount(){

	}
	componentWillUnmount(){
	}



	

	render() {
		return (
			<div>
			  <div className="container">
		      	<PageHeader/>
		      	<SearchPanel/>
				<div className = "clearfix"></div>
			  </div>
		  </div>
		);
	}

}

ReactDOM.render(
  <MainContainer/>,
  document.getElementById('content')
);
