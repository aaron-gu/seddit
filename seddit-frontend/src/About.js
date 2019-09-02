import React from 'react';

class About extends React.Component{
    render(){
        return (
           <div className="jumbotron mt-3">
               <h1>Welcome to Seddit!</h1>
               <p className="lead">The social media site for thoughtful discussion. The character MINIMUM, not maximum (<span role="img" aria-label="eye emoji">👀</span> Twitter), is 280.</p>
               <p>Please navigate to the links in the header to register or login. If you run into any bugs or glitches, please contact Aaron Gu. Enjoy!</p>
           </div> 
        );
    }
}

export {About};