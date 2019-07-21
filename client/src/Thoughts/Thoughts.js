import React from 'react';
import './Thoughts.css';

export const Thoughts = props => {
    return(
        <section>
            {props.src && <img src={props.src} alt={props.name} />}
            {props.name && <p>{props.name}</p>}
            {props.currentBeer && <p>Current Beer: {props.currentBeer}</p>}
            {props.currentThought && <p>Current Thought: {props.currentThought}</p>}
            {props.daydream && <img src={props.daydream} alt={props.name + " daydrem"} />}
        </section>
    )
};

export default Thoughts;