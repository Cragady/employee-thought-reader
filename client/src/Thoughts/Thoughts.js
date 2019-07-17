import React from 'react';
import './Thoughts.css';

export const Thoughts = props => {
    return(
        <section>
            <img src={props.src} alt={props.name} />
            <p>{props.name}</p>
            <p>Current Beer: {props.currentBeer}</p>
            <p>Current Thought: {props.currentThought}</p>
            <img src={props.daydream} alt={props.name + " daydrem"} />
        </section>
    )
};

export default Thoughts;