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
            "This experiment aims to evaluate different methods of creating continuous, semantically meaningful subspaces within the latent space of diffusion models for AI-generated images. These subspaces are designed to capture changes in specific image attributes, enabling users to interactively modify an image generated from an initial prompt. As perceived changes in image attributes are highly subjective, it is crucial to obtain feedback from real users on how well the subspaces capture the desired attributes.",
            "You will be asked to complete a number of image evaluation tasks, such as ordering a list of images according to certain attributes or judging the effect of a slider on a specified image attribute in the given examples. The survey will record your responses to the questions, as well as some general performance metrics. No personal or identifiable data will be collected, and the results cannot be linked to individual participants. The data collected will be used exclusively for scientific research purposes.",
            "Participation is entirely voluntary and you are free to withdraw from the study at any time. However, since no personal or identifying information is collected, it may not be possible to accurately identify and remover your data from the dataset once submitted.",
            "Completing the study typically takes about 10 minutes.",
            "It is recommended to use a laptop or desktop computer for completing this survey. Some of the questions might only work in a limited manner on mobile devices."
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
      title: "Study completed!",
      elements: [{
         type: "descriptive-text",
         name: "GoodbyeText",
         textSize: "medium",
         heading: "Thank you for participating!",
         caption: [
            "The goal of this study is to evaluate different methods for creating semantically meaningful subspaces of the latent space of diffusion models for image generation. These subspaces aim to map changes in semantically meaningful image attributes to a two-dimensional grid a user can interact with to modify and control the image generation process beyond the image prompt.",
            "This research is part of a Master thesis about user interfaces for AI image generation at Ludwig-Maximilian-University Munich and University of Glasgow."
         ]
      }, {
         type: "text",
         name: "OptionalMail",
         title: "If you want to stay informed about the results of the research you can enter your e-mail here",
         description: "Your e-mail will be stored separately from your study data."
      }]
   }],
   completedHtml: `
   <div>
      <p>The study is finished. You can now close this page.<p>
      <div>
         <p>Person of contact:</br>
            <a href="mailto:l.baader@campus.lmu.de">l.baader@campus.lmu.de</a>
         </p>
      </div>
      <div style="margin-top: 400px; margin-bottom: 100px">
         <img src="${process.env.PUBLIC_URL}/lmu_logo_bw.png" style="height: 70px; margin-right: 20px" />
         <img src="${process.env.PUBLIC_URL}/UoG_colour.svg" style="height: 70px" />
      </div>
   </div>
   `
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

   // integrate new pages into the study template
   const surveyJson = surveyTemplate;

   for (const [i, page] of surveyPages.entries()) {
      surveyJson.pages.splice(2 + i, 0, page);
   }

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
      const currentTime = Date.now();
      const currentPage = survey.currentPage;
      const pageName = currentPage ? currentPage.name : 'unknown';
      
      // Handle page timing using localStorage
      const previousPageStart = localStorage.getItem('pageStartTime');
      const previousPageName = localStorage.getItem('currentPageName');
      
      // If we have a previous page timing, calculate and store it
      if (previousPageStart && previousPageName) {
         const timeSpent = currentTime - parseInt(previousPageStart);
         const existingTimings = JSON.parse(localStorage.getItem('pageTimings') || '[]');
         existingTimings.push({
            pageName: previousPageName,
            timeSpent: timeSpent,
            timestamp: new Date().toISOString()
         });
         localStorage.setItem('pageTimings', JSON.stringify(existingTimings));
      }
      
      // Set up timing for the current page
      localStorage.setItem('pageStartTime', currentTime.toString());
      localStorage.setItem('currentPageName', pageName);

      survey.setValue("userId", userId);
      survey.setValue("fullScreenCounter", localStorage.getItem("fullScreenCounter") || "0");
      
      // Include page timings in survey data
      const pageTimings = JSON.parse(localStorage.getItem('pageTimings') || '[]');
      survey.setValue("pageTimings", pageTimings);
      
      if (Object.keys(survey.data).length > 1) {
         saveSurveyResults(
            "https://script.google.com/macros/s/AKfycbwglW6j-GxyEho7xcoy5FTJYTbdsqw1nGOP5qAXuf_wYprUkVfIq985M8zVZ73d_XDF/exec",
            survey.data
         );
      }
   }, [userId]);

   // Handle survey completion - capture final page timing
   const onSurveyComplete = useCallback(survey => {
      const currentTime = Date.now();
      const previousPageStart = localStorage.getItem('pageStartTime');
      const previousPageName = localStorage.getItem('currentPageName');
      
      // Add final page timing
      if (previousPageStart && previousPageName) {
         const timeSpent = currentTime - parseInt(previousPageStart);
         const existingTimings = JSON.parse(localStorage.getItem('pageTimings') || '[]');
         existingTimings.push({
            pageName: previousPageName,
            timeSpent: timeSpent,
            timestamp: new Date().toISOString()
         });
         
         survey.setValue("pageTimings", existingTimings);
      }
      
      // Call the regular postSurveyData function
      postSurveyData(survey);
      
      // Clean up localStorage after survey completion
      localStorage.removeItem('pageStartTime');
      localStorage.removeItem('currentPageName');
      localStorage.removeItem('pageTimings');
   }, [postSurveyData]);

   // Show loading state while survey is being generated
   if (!surveyJson) {
      return <div>Loading survey...</div>;
   }

   const survey = new Model(surveyJson);
   survey.applyTheme(DefaultLight);
   // survey.applyTheme(DefaultLightPanelless);
   
   // Initialize page timing if not already set
   if (!localStorage.getItem('pageStartTime')) {
      localStorage.setItem('pageStartTime', Date.now().toString());
      localStorage.setItem('currentPageName', 'Introduction');
      localStorage.setItem('pageTimings', '[]');
   }
   
   survey.onCurrentPageChanged.add(postSurveyData);
   survey.onComplete.add(onSurveyComplete);

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
         // console.log(response);
         console.log("Progress saved.")
      } else {
         // handle error
         // console.log(response);
      }
   })
   .catch(error => {
      // handle error
      console.log(error);
   });
}
