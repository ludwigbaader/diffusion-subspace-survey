import 'survey-core/survey-core.css';
import { Model, Survey } from 'survey-react-ui';
import { DefaultLight } from "survey-core/themes";
import { useCallback } from 'react';
import { registerSortableImages } from './SortableImages';
import { registerImageSlider } from './ImageSlider';
import { registerImagePositioner } from './ImagePositioner';
import { type } from '@testing-library/user-event/dist/type';


// register custom question components
registerSortableImages();
registerImageSlider();
registerImagePositioner();


// json definition of the survey
const surveyJson = {
   title: "Diffusion Model Subspaces",
   pages: [{
      name: "DemographicData",
      title: "Demographic Data",
      elements: [{
         type: "dropdown",
         name: "Age",
         title: "Select your age:",
         choices: ["15 or younger", "16-19", "20-24", "25-29", "30-34", "35-39", "40-44", "45-49", "50-54", "55-59", "60-64", "65 or older"]
      }, {
         type: "dropdown",
         name: "Gender",
         title: "Select your gender:",
         choices: ["Female", "Male", "Non-binary", "Prefer not to say"]
      }, {
         type: "dropdown",
         name: "Education",
         title: "Select your highest degree of education:",
         choices: ["Less than high school degree", "High school degree or equivalent", "Bachelor degree", "Graduate degree (Masters, PhD, M.D)"]
      }, {
         type: "boolean",
         name: "CreativeProfessional",
         title: "Are you a creative professional that works with visual media?"
      }]
   }, {
      name: "Page01",
      title: "Subspaces",
      elements: [{
         type: "sortable-images",
         name: "SortImages",
         title: "Rank these images according to the attribute",
         choices: [
            { url: "/img/image_0000.jpg", id: "01" },
            { url: "/img/image_0001.jpg", id: "02" },
            { url: "/img/image_0002.jpg", id: "03" },
         ],
         attribute: {
            start: "photorealistic",
            end: "stylized"
         }
      }, {
         type: "image-slider",
         name: "ImageSlider01",
         title: "Select a position",
         sliderPosition: 0.0,
         sourceImages: [
            "/img/image_0000.jpg",
            "/img/image_0001.jpg",
            "/img/image_0002.jpg",
            "/img/image_0003.jpg",
            "/img/image_0004.jpg",
         ]
      }, {
         type: "image-positioner",
         name: "ImagePositioner01",
         title: "Select the position you would place the image at in the grid",
         position: [0.5, 0.5],
         image: "/img/image_0000.jpg",
         axisLabels: [
            ["photorealistic", "stylized"],
            ["warm and colorful", "cold and desaturated"]
         ]
      }]
   }]
};

export default function SurveyComponent() {
   const survey = new Model(surveyJson);
   survey.applyTheme(DefaultLight);
   
   const surveyComplete = useCallback(survey => {
      const userId = "";
      survey.setValue("userId", userId);
      
      saveSurveyResults(
         "https://script.google.com/macros/s/AKfycbwglW6j-GxyEho7xcoy5FTJYTbdsqw1nGOP5qAXuf_wYprUkVfIq985M8zVZ73d_XDF/exec",
         survey.data
      );
   }, []);

   survey.onComplete.add(surveyComplete);

   return <Survey model={survey}/>;
}

function saveSurveyResults(url, json) {
   fetch(url, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify(json),
      mode: 'no-cors' // check if this is necessary or needs to be removed once hosted on github pages
   })
   .then(response => {
      if (response.ok) {
         // handle success
         console.log(response);
      } else {
         // handle error
         console.log(response);
      }
   })
   .catch(error => {
      // handle error
      console.log(error);
   });
}
