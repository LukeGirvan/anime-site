body {
  padding: 0;
  margin: 0;
  background-color: rgb(0, 0, 0);
  color: white;
  font-family: Lato, Helvetica Neue, helvetica, sans-serif;
  overflow-x: hidden;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.btn {
  display: flex;
  font-size: 1.3rem;
  background-color: rgb(69, 122, 255);
  border: none;
  padding: 1rem;
  width: fit-content;
  color: rgb(255, 255, 255);
  margin-top: 4rem;
}

.watch-now img {
  max-height: 2rem;
  max-width: 2rem;
  position: relative;
}

.flex {
  display: flex;
}

.sr-only {
  visibility: hidden;
}

.flex-column-left {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

@media (min-width: 901px) {
  .latest-release {
    box-sizing: border-box;
    padding: 2rem;
    position: relative;
  }
  .latest-release .card-holder {
    display: block ruby;
    overflow-x: hidden;
    /* Apply hover effects to both .hover-blur and .anime-image */
  }
  .latest-release .card-holder .prev-btn, .latest-release .card-holder .next-btn {
    position: absolute;
    border: none;
    border-radius: 15px;
    top: 45%;
    z-index: 50;
  }
  .latest-release .card-holder .prev-btn {
    background: url("images/arrow-previous-left-icon.svg");
    left: 1%;
    max-width: 25px;
    max-height: 25px;
  }
  .latest-release .card-holder .next-btn {
    background: url("images/arrow-previous-left-icon.svg");
    right: 2%;
    max-width: 25px;
    max-height: 25px;
  }
  .latest-release .card-holder .spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-top: 4px solid #3498db; /* Change color as needed */
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: block; /* Initially hidden */
  }
  .latest-release .card-holder .image-holder {
    white-space: wrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-height: 500px;
    width: 230px;
    position: relative;
    padding-top: 2rem;
    padding-right: 2rem;
  }
  .latest-release .card-holder .image-holder .anime-image {
    height: 350px;
    width: 99%;
    border-radius: 6px;
    transition: transform 0.3s ease;
  }
  .latest-release .card-holder .image-holder .hover-blur {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.9);
    min-height: 370px;
    width: 230px;
    position: absolute;
    top: 6.1%;
    left: 0;
    opacity: 0;
    transition: transform 0.3s ease;
  }
  .latest-release .card-holder .image-holder .hover-blur a {
    width: 150px;
    height: 150px;
  }
  .latest-release .card-holder .image-holder .hover-blur a img {
    max-width: 100%;
    max-height: 100%;
  }
  .latest-release .card-holder .image-holder .hover-blur a:hover {
    cursor: pointer;
  }
  .latest-release .card-holder .image-holder:hover .hover-blur,
  .latest-release .card-holder .image-holder:hover .anime-image {
    transform: translateY(-5%);
    cursor: pointer;
  }
  .latest-release .card-holder .hover-blur:hover {
    opacity: 1;
  }
  .latest-release .h2-holder {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
  }
}
.slide {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100vw;
  height: 80vh;
  color: white;
  transform: translateX(0);
}
.slide .anime-image {
  margin-top: 1rem;
  margin-right: 3rem;
  position: absolute;
  right: 0;
  top: 0;
  width: 890px;
  max-height: 500px;
  border-radius: 12px;
}
.slide .play-triangle {
  max-width: 1.8rem;
  max-height: 1.8rem;
  margin-right: 0.3rem;
}
.slide .rating-age {
  font-size: 1.4rem;
}
.slide .detail-holder {
  position: absolute;
  top: 0;
  padding: 2rem;
  box-sizing: border-box;
}
.slide .detail-holder h2 {
  font-size: 4rem;
}
.slide .detail-holder p {
  font-size: 1.4rem;
  max-width: 500px;
}

.slide.not-active {
  display: none;
  transform: translateX(-100%);
  transition: transform 0.2s ease-in-out;
}

/*# sourceMappingURL=output.cs.map */
