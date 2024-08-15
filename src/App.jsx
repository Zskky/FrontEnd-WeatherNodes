import React, { useState, useEffect } from "react";
import { Navigation } from "./components/navigation";
import { Header } from "./components/header";
import { Features } from "./components/features";
import { About } from "./components/about";
import { Services } from "./components/services";
import { Gallery } from "./components/gallery";
import { Team } from "./components/Team";
import { Contact } from "./components/contact";
import Weather from "./components/weather";
import WeaSea from "./components/weaSea";
import FetchWeather from "./components/fetchWeather";
import JsonData from "./data/data.json";
import SmoothScroll from "smooth-scroll";
import "./App.css";

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const App = () => {
  const [landingPageData, setLandingPageData] = useState({});
  useEffect(() => {
    //set landing page JSON file
    setLandingPageData(JsonData);

    // Set the document title
    document.title = "WeatherNodes Initiative";
  }, []);

  return (
    <div>
      <Navigation />
      <Header data={landingPageData.Header} />
      <Weather data={landingPageData.Weather}/>
      <WeaSea data={landingPageData.WeaSea}/>
      <Features data={landingPageData.Features} />
      <Services data={landingPageData.Services} />
      <About data={landingPageData.About} />
      <Gallery data={landingPageData.Gallery} />
      <Team data={landingPageData.Team} />
      <Contact data={landingPageData.Contact} />
      <FetchWeather data={landingPageData.FetchWeather} />
    </div>
  );
};

export default App;
