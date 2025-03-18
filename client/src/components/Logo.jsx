import React from 'react'
import rose from './rose.svg';
import './Logo.css';

function Logo() {
    return (   
        <figure class="logo-container">
            <a href="/" target="_self" class="link">
                <img src={rose} alt="Logo" class="logo" />
            </a>
            <figcaption class="caption">Smell The<br/>Roses</figcaption>
        </figure>
    )
}

export default Logo