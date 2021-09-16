import React, { Component } from "react";
import TextScroll from "../../../components/textscroll"

require("./style.scss");

export default class AppDetails extends Component {
  timeoutId = null;
  lastKey = null;

  render() {
    const { backgroundSrc, defaultBackgroundSrc, bottom, buttons, description, itemKey, subTitle, title } = this.props;
    // TODO: Fix this hack 
    const key = itemKey + title + (backgroundSrc ? backgroundSrc : '');  

    if (key !== this.lastKey) {
      this.lastKey = key;
      const WAIT = 250;
      const start = new Date().getTime();
      
      if (this.timeoutId) window.clearTimeout(this.timeoutId);

      // Remove display of right details
      let el = document.querySelector('.app-details-right');
      if (el) {
        el.classList.remove('fade-in');              
      }
      if (this.detailsRightRef) {
        this.detailsRightRef.style.backgroundImage = 'none';
      }

      // Common fade in
      const fadeIn = () => {
        const elapsed = new Date().getTime() - start;
        const wait = (elapsed > WAIT ? 0 : (WAIT - elapsed));
        this.timeoutId = window.setTimeout(() => {
          if ((key === this.lastKey) && el) {
            el.classList.add('fade-in');
          }          
        }, wait);
      }

      const displayBackground = (src) => {
        if (key === this.lastKey) {
          if (this.detailsRightRef) {            
            this.detailsRightRef.style.backgroundImage = 'url(' + src + ')'
            fadeIn();
          } else {
            console.error('Detailed right ref is not defined.');
          }
        }
      }

      // Attempt to load the background image
      const img = new Image();
      img.onload = () => { displayBackground(img.src); };
      img.onerror = () => {
        // If an error occurred, attempt to load default background
        const defaultImg = new Image();
        defaultImg.onload = () => { displayBackground(defaultImg.src); };
        defaultImg.src = defaultBackgroundSrc;
      }
      img.src = backgroundSrc;  
    }  

    return (
      <div className="app-details-content">
        <div className="app-details-background">
          <div className="app-details-left"></div>
          <div ref={(detailsRight) => { this.detailsRightRef = detailsRight; }} className="app-details-right"></div>
        </div>
        <div className="app-details-content-container">
          <div className="app-details-content-container-title">{title ? title : ''}</div>
          {subTitle ? (
            <div className="app-details-content-container-subtitle">{subTitle}</div>
          ) : null}
          {description ? (
            <div className="app-details-content-container-description">              
              <TextScroll key={itemKey} text={description}/>
            </div> 
          ) : null}
          <div className="app-details-content-container-buttons">{buttons}</div>
          <div className="app-details-content-container-bottom-comp">{bottom}</div>
        </div>
      </div>
    );
  }
};
