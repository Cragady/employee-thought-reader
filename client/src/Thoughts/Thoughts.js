import React from 'react';

export const Thoughts = props => {
    return(
        <section>
            <img src={props.src} alt={props.name} />
        </section>
    )
};

export default Thoughts;