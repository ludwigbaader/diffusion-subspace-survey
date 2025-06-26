import 'survey-core/survey-core.css';
import { Model, Survey } from 'survey-react-ui';
import { useCallback } from 'react';

// json definition of the survey
const surveyJson = {
   pages: [{
      name: "PersonalDetails",
      elements: [{
         type: "text",
         name: "FirstName",
         title: "Enter your first name:",
      }, {
         type: "text",
         name: "LastName",
         title: "Enter your last name:",
      }, {
         type: "panel",
         name: "Contacts",
         state: "collapsed",
         title: "Contacts (optional)",
         elements: [{
            type: "text",
            name: "Telegram",
            title: "Telegram:",
         }, {
            type: "text",
            name: "GitHub",
            title: "GitHub username:",
         }]
      }]
   }]
};

export default function SurveyComponent() {
   const survey = new Model(surveyJson);
   
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
