import React from 'react';
import './Thoughts.css';

export const Thoughts = props => {
    return(
        <section className="Thoughts">
            <section className="thought-card rounded">
                <section className="img-name-container">
                    <div className="img-container m-3 rounded">
                        {props.src && <img src={props.src} alt={props.name} />}
                    </div>

                    {/* {props.name && <p>{props.name}</p>} */}
                    <div className="text-containers">
                        <p>{'Test Name'}</p>
                    </div>
                </section>

                {props.currentBeer && <p>Current Beer: {props.currentBeer}</p>}
                {props.currentThought && <p>Current Thought: {props.currentThought}</p>}
                {props.daydream && <img src={props.daydream} alt={props.name + " daydrem"} />}
            </section>
        </section>
    )
};

export default Thoughts;