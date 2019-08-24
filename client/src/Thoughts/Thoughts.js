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
                    {props.currentBeer &&
                        <div className="beer-wrapper">
                            <div className="text-containers">
                                <p><span className="p-header">Current Beer:</span> <br /> {props.currentBeer}</p>
                            </div>
                            <br />
                        </div>
                    }
    
    
                    {props.currentThought && 
                        <div className="current-thought-wrapper">
                            <div className="text-containers">
                                <p><span className="p-header">Current Thought:</span> <br /> {props.currentThought}</p>
                            </div>                         
                            <br />
                        </div>
                    }
                        
                    {props.daydream && 
                        <div className="daydream-container">
                            <img src={props.daydream} alt={props.name + " daydrem"} />
                        </div>
                    }
                    </section>
                }

            </section>
        </section>
    )
};

export default Thoughts;