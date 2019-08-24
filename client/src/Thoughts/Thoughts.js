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
                    <br />
                    {props.name &&
                        <div className="text-containers">
                            <p>{props.name}</p>
                        </div>                    
                    }
                </section>
                
                <br />

                {props.name && 
                    <section className="thought-info">
                        <div className="text-containers">
                            {props.currentBeer && <p>Current Beer: {props.currentBeer}</p>}
                        </div>
    
                        <br />
    
                        <div className="text-containers">
                            {props.currentThought && <p>Current Thought: {props.currentThought}</p>}
                        </div> 
                        
                        <br />
                        
                        <div className="daydream-container">
                            {props.daydream && <img src={props.daydream} alt={props.name + " daydrem"} />}
                        </div>
                    </section>
                }

            </section>
        </section>
    )
};

export default Thoughts;