import 'survey-core/survey-core.css';
import { Model, Survey } from 'survey-react-ui';
import { DefaultLight, DefaultLightPanelless } from "survey-core/themes";
import { useCallback, useEffect, useState } from 'react';
import { registerSortableImages } from './QSortableImages';
import { registerImageSlider } from './QImageSlider';
import { registerImagePositioner } from './QImagePositioner';
import { registerDescriptiveText } from './QDescriptiveText';
import { registerLikertScale } from './QLikertScale';
import { registerSortableImagesReference } from './QSortableImagesReference';
import { registerImageSliderLikert } from './QImageSliderLikert';
import {
   createSubspaceRankingQuestions,
   createAttributeRankingQuestions,
   createAttributeChangeQuestions,
   createAttributePrecisionQuestions,
   createSubspacePositionQuestions,
   createStudyPage,
   shuffleArray
} from './QuestionFactory';
//import attribute_names from 'public/sampled_images/attribute_names.json';


// register custom question components
registerSortableImages();
registerSortableImagesReference();
registerImageSlider();
registerImageSliderLikert();
registerImagePositioner();
registerDescriptiveText();
registerLikertScale();


// json definition of the survey
const surveyTemplate = {
   title: "Subspaces for AI Image Generation Models",
   pages: [{
      name: "Introduction",
      title: "Welcome to this study!",
      elements: [{
         type: "descriptive-text",
         name: "IntroductionText",
         textSize: "medium",
         heading: "Study Information",
         caption: [
            "The aim of this experiment is to evaluate different methods of creating continuous, semantically meaningful subspaces of the latent space of Diffusion models for AI image generation. The subspaces are designed to capture changes in certain image attributes to give users the ability to interactively modify an image they have generated from an initial prompt. Since perceived changes in image attributes are highly subjective it is crucial to get the feedback of real users on how well the subspaces actually capture the desired attributes.",
            "You will be asked to complete a number of image evaluation tasks such as ordering a list of images according to an attribute, or judging how well a slider influences a specified image attribute in the given examples. The survey records your responses to the questions as well as some general performance metrics. No personal or identifiable data is collected and the results cannot be linked to individual participants. The data collected will be used exclusively for scientific research purposes.",
            "Participation is entirely voluntary and you are free to withdraw from the study at any time. However, since no personal or identifying information is collected, it may not be possible to accurately identify and remover your data from the dataset once submitted.",
            "Completing the study typically takes about 10 to 15 minutes."
         ]
      }, {
         type: "checkbox",
         name: "Consent",
         title: "Please confirm your consent to participate in the study",
         isRequired: true,
         choices: [
            "I have read and understood the information above, and I voluntarily consent to participate in this study"
         ]
      }]
   }, {
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
         title: "Select your highest degree of education",
         description: "Completed or currently striving for",
         choices: ["Less than high school degree", "High school degree or equivalent", "Bachelor degree", "Graduate degree (Masters, PhD, M.D)"]
      }, {
         type: "likert-scale",
         name: "AiFamiliarity",
         title: "How familiar are you with AI image generation tools?",
         description: "AI image generation tools include Dall-E in ChatGPT, Imagen in Google Gemini, Midjourney, Adobe Firefly and many more",
         numOfChoices: 7,
         categoryNames: [
            "Never used before",
            "Very familiar"
         ]
      }, {
         type: "likert-scale",
         name: "ArtisticTasksExperience",
         title: "How much experience do you have with visual artistic tasks?",
         description: "Visual artistic tasks include working with visual design in a professional or personal context",
         numOfChoices: 7,
         categoryNames: [
            "No experience",
            "Very experienced"
         ]
      }, {
         type: "likert-scale",
         name: "TechincalUnderstanding",
         title: "Do you have a technical understaning of diffusion models for image generation?",
         description: "How much do you know about how the process of generating an image in a diffusion model works?",
         numOfChoices: 7,
         categoryNames: [
            "No understanding",
            "Thorough understanding"
         ]
      }]
   }, {
      name: "GoodbyePage",
      title: "Study complete, thank you for participating!",
      elements: [{
         type: "text",
         name: "OptionalMail",
         title: "If you want to stay informed about the results of the research you can enter your e-mail here",
         description: "Your e-mail will be stored separately from your study data."
      }]
   }]
};

async function generateSurveyConfiguration(userID, pageLayout) {
   // choose which images to use for each question as well as question order
   // construct the surveyJSON based on that and return it
   // have all question types as functions ideally that I can pass which images to use as a parameter and that return the correct config json

   const subspace_ranking_questions = await createSubspaceRankingQuestions();
   const attribute_ranking_questions = await createAttributeRankingQuestions(userID);
   const attribute_change_questions = await createAttributeChangeQuestions(userID);
   const attribute_precision_questions = await createAttributePrecisionQuestions(userID);
   const subspace_position_questions = await createSubspacePositionQuestions(userID);

   // randomize the question order
   shuffleArray(subspace_ranking_questions);
   shuffleArray(attribute_ranking_questions);
   shuffleArray(attribute_change_questions);
   shuffleArray(attribute_precision_questions);
   shuffleArray(subspace_position_questions);

   const surveyPages = [];
   
   if (pageLayout == 0) {
      // option A - have one type of each question per page
      for (let i = 0; i < 5; i++) {
         surveyPages.push(
            createStudyPage(`page_${(i + 1).toString().padStart(2, '0')}`, `Questions ${i + 1}/5`, [
               subspace_ranking_questions[i],
               attribute_ranking_questions[i],
               attribute_change_questions[i],
               attribute_precision_questions[i],
               subspace_position_questions[i]
            ])
         );
      }
   } else {
      // option B - have all questions of one type collected on a single page
      surveyPages.push(...[
         createStudyPage("page_01", "Questions 1/6", subspace_ranking_questions),
         createStudyPage("page_03", "Questions 2/6", attribute_precision_questions),
         createStudyPage("page_02", "Questions 3/6", attribute_ranking_questions),
         createStudyPage("page_04", "Questions 4/6", attribute_change_questions),
         createStudyPage("page_05", "Questions 5/6", subspace_position_questions),
      ]);
   }

   console.log(surveyPages);

   // integrate new pages into the study template
   const surveyJson = surveyTemplate;

   for (const [i, page] of surveyPages.entries()) {
      surveyJson.pages.splice(2 + i, 0, page);
   }

   console.log(surveyJson);

   return surveyJson;
}

export default function SurveyComponent() {
   const [userId, setUserId] = useState(null);
   const [surveyJson, setSurveyJson] = useState(null);

   // get a unique user id for each user
   useEffect(() => {
      // if no userid is defined yet, fetch the current counter from google sheets
      async function fetchUserId() {
         const storedId = localStorage.getItem("userid");
         if (storedId) {
            setUserId(storedId);
         } else {
            try {
               const res = await fetch("https://script.google.com/macros/s/AKfycbzLrYE5ZHO5MigPJp6U1aiSWP5IzI5V58G75iZCUJBA5btRyzs0nfYqbcsaQYhJbffb/exec");
               const data = await res.json();
               localStorage.setItem("userid", data.userId);
               setUserId(data.userID);
            } catch (err) {
               console.error("Failed to fetch user ID", err);
               // use random userid as backup
               const id = Math.floor(Math.random() * 100000);
               setUserId(id);
            }
         }
      }
      fetchUserId();
   }, []);

   // create survey when userId is available
   useEffect(() => {
      if (userId && !surveyJson) {
         async function createSurvey() {
            try {
               const newSurvey = await generateSurveyConfiguration(userId, 1);
               setSurveyJson(newSurvey);
            } catch (error) {
               console.error("Failed to generate survey configuration", error);
            }
         }
         createSurvey();
      }
   }, [userId, surveyJson]);

   // send the survey results to the google sheets endpoint
   const postSurveyData = useCallback(survey => {
      survey.setValue("userId", userId);

      console.log(survey.data);
      
      if (Object.keys(survey.data).length > 1) {
         saveSurveyResults(
            "https://script.google.com/macros/s/AKfycbwglW6j-GxyEho7xcoy5FTJYTbdsqw1nGOP5qAXuf_wYprUkVfIq985M8zVZ73d_XDF/exec",
            survey.data
         );
      }
   }, [userId]);

   // Show loading state while survey is being generated
   if (!surveyJson) {
      return <div>Loading survey...</div>;
   }

   const survey = new Model(surveyJson);
   survey.applyTheme(DefaultLight);
   // survey.applyTheme(DefaultLightPanelless);
   
   survey.onCurrentPageChanged.add(postSurveyData);
   survey.onComplete.add(postSurveyData);

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
