import React, { useState, useEffect } from "react";
import { Navigation } from "./components/navigation";
import { Header } from "./components/header";
import { Features } from "./components/features";
import { About } from "./components/about";
import { Services } from "./components/services";
import { Gallery } from "./components/gallery";
//import { Testimonials } from "./components/testimonials";
import { Team } from "./components/Team";
import { Contact } from "./components/contact";
import Weather from "./components/weather"; // Ensure the path and case are correct
//import WeaHis from "./components/weaHis";
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
    setLandingPageData(JsonData);
  }, []);

  return (
    <div>
      <Navigation />
      <Header data={landingPageData.Header} />
      <Weather data={landingPageData.Weather}/>
      <Features data={landingPageData.Features} />
      <Services data={landingPageData.Services} />
      <About data={landingPageData.About} />
      <Gallery data={landingPageData.Gallery} />
      {/*<Testimonials data={landingPageData.Testimonials} />*/}
      <Team data={landingPageData.Team} />
      {/*<WeaHis data={landingPageData.WeaHis}/>*/}
      <Contact data={landingPageData.Contact} />
    </div>
  );
};

export default App;
