export async function createSubspaceRankingQuestions() {
   // create the 5 subspace ranking questions who's data is stored in:
   // public/data/attribute_extremes/xx

   const selected_prompts = [
      "prompt_001",
      "prompt_003",
      "prompt_016",
      "prompt_010",
      "prompt_012",
   ]

   const questions = [];

   // load all 5 questions
   for (let i = 1; i <= 5; i++) {
      const base_folder = `data/attribute_extremes/${selected_prompts[i - 1]}/`;

      // load the reference image
      const reference_img = base_folder + "image_reference.jpg";

      // load the 5 images of each of the subspaces
      const imgs = [];
      for (let j = 0; j < 5; j++) {
         imgs.push({
            id: j,
            url: base_folder + `image_subspace_${j.toString().padStart(2, '0')}.jpg`
         });
      }

      // load the attribute info
      const attribute_info = await load_attribute_file(base_folder);
      const attribute = attribute_info["attribute"];

      questions.push({
         type: "sortable-images-reference",
         name: `SortImgsReference_${i}`,
         title: `Sort the images by how well you think the attribute "${attribute}" is emphasized in them compared to the reference image`,
         description: "Place the image you think emphasizes the attribute the most at the top, the one that emphasizes it the least at the bottom",
         images: imgs,
         referenceImage: reference_img,
         attribute: attribute
      });
   }

   return questions;
}

export async function createAttributeRankingQuestions(userId) {
   const selected_prompts = [
      "prompt_001",
      "prompt_003",
      "prompt_007",
      "prompt_010",
      "prompt_012",
   ]

   const attribute_axis = [1, 0, 0, 1, 0];

   const questions = [];

   // I won't just have 5 questions for this but actually 25
   // -> choose one from the 5 different prompts - ensure the subspace number rotates between the users

   const user_offset = userId % 5;

   for (let i = 1; i <= 5; i++) {
      let base_folder = `data/attribute_axis/${selected_prompts[i - 1]}/${((user_offset + i) % 5 + 1).toString().padStart(3, '0')}/`;
      base_folder += attribute_axis[i - 1] == 0 ? 'x/' : 'y/';

      // load 5 images spread across the 15 image range
      const imgs = [];
      for (let j = 1; j < 16; j+= 3) {
         imgs.push({
            id: j,
            url: base_folder + `image_${j.toString().padStart(2, '0')}.jpg`
         });
      }
      shuffleArray(imgs);

      // load the attribute info
      const attribute_info = await load_attribute_file(base_folder);
      const attributes = attribute_info["attribute"];

      questions.push({
         type: "sortable-images",
         name: `SortImgsAttribute_${i}`,
         title: "Sort the images according to the specified attributes",
         description: `Position images that look more "${attributes[0]}" to you at the top and images you consider to be more "${attributes[1]}" at the bottom`,
         images: imgs,
         attribute: {
            start: attributes[0],
            end: attributes[1],
         }
      });
   } 

   return questions;
}

export async function createAttributeChangeQuestions(userId) {
   const selected_prompts = [
      "prompt_001",
      "prompt_004",
      "prompt_007",
      "prompt_011",
      "prompt_016",
   ]

   // use this array to define whether to use attribute axis x or y on a per-question basis
   const attribute_axis = [3, 2, 2, 0, 1];
  
   const questions = [];

   const user_offset = userId % 5;

   for (let i = 1; i <= 5; i++) {
      let base_folder = `data/attribute_axis/${selected_prompts[i - 1]}/${((user_offset + i) % 5 + 1).toString().padStart(3, '0')}/`;
      base_folder += attribute_axis[i - 1] < 2 ? 'x/' : 'y/';

      // load the images of one attribute - potentially choose 
      const imgs = [];
      for (let j = 0; j < 8; j++) {
         let j_abs = j;
         if ((attribute_axis[i - 1] % 2) == 1) {
            j_abs += 7;
         }
         imgs.push(base_folder + `image_${j.toString().padStart(2, '0')}.jpg`);
      }
      // invert the order of the list
      if ((attribute_axis[i - 1] % 2 == 0)) {
         imgs.reverse();
      }

      // load the attribute info
      const attribute_info = await load_attribute_file(base_folder);
      const attributes = attribute_info["attribute"];

      console.log("attribute: " + attributes[attribute_axis[i - 1] % 2])

      questions.push({
         type: "image-slider-likert",
         name: `AttributeChange_${i}`,
         title: "Modify the image with the slider to get a feel for what it does",
         sliderPosition: 0.0,
         sourceImages: imgs,
         sliderAttribute: attributes[attribute_axis[i - 1] % 2],
         likertQuestionText: "How does the slider affect the image? Does the image change at a consistent rate across the range of the slider or does the rate of change vary?",
         numOfChoices: 7,
         categoryNames: [
            "Constant rate of change",
            "Varying rate of change"
         ]
      });
   }

   return questions;
}

export async function createAttributePrecisionQuestions(userId) {
   const selected_prompts = [
      "prompt_002",
      "prompt_003",
      "prompt_009",
      "prompt_010",
      "prompt_015",
   ]

   // use this array to define whether to use attribute axis x or y on a per-question basis
   const attribute_axis = [0, 1, 2, 3, 0];

   const questions = [];

   const user_offset = userId % 5;

   for (let i = 1; i <= 5; i++) {
      let base_folder = `data/attribute_axis/${selected_prompts[i - 1]}/${((user_offset + i) % 5 + 1).toString().padStart(3, '0')}/`;
      base_folder += attribute_axis[i - 1] < 2 ? 'x/' : 'y/';

      // load the images of one attribute - potentially choose 
      const imgs = [];
      for (let j = 0; j < 8; j++) {
         let j_abs = j;
         if ((attribute_axis[i - 1] % 2) == 1) {
            j_abs += 7;
         }
         imgs.push(base_folder + `image_${j_abs.toString().padStart(2, '0')}.jpg`);
      }
      if ((attribute_axis[i - 1] % 2 == 0)) {
         imgs.reverse();
      }

      // load the attribute info
      const attribute_info = await load_attribute_file(base_folder);
      const attributes = attribute_info["attribute"];

      questions.push({
         type: "image-slider-likert",
         name: `AttributePrecision_${i}`,
         title: "Modify the image with the slider to get a feel for what it does",
         sliderPosition: 0.0,
         sourceImages: imgs,
         sliderAttribute: attributes[attribute_axis[i - 1] % 2],
         likertQuestionText: "Does the slider change the described attribute in the image?",
         numOfChoices: 7,
         categoryNames: [
            "Image change does not match the attribute",
            "Image change matches the attribute"
         ]
      });
   }

   return questions;
}

export async function createSubspacePositionQuestions(userId) {
   const selected_prompts = [
      "prompt_002",
      "prompt_004",
      "prompt_009",
      "prompt_011",
      "prompt_016",
   ]

   const questions = [];

   const user_offset = userId % 5;

   for (let i = 1; i <= 5; i++) {
      const base_folder = `data/subspace_position/${selected_prompts[i - 1]}/`;

      // load reference image
      const reference_img = base_folder + "image_reference.jpg";

      // load subject image
      const subject_img = base_folder + `${((user_offset + i) % 5 + 1).toString().padStart(3, '0')}/image_subject.jpg`;

      // load attributes
      const attribute_info = await load_attribute_file(base_folder + `${((user_offset + i) % 5 + 1).toString().padStart(3, '0')}/`);
      
      // TODO - do i need to note somewhere what the actual position for this question is or can I figure that out myself later?
      questions.push({
         type: "image-positioner",
         name: `SubspacePosition_${i}`,
         title: "Select the position you would place the image at in the grid",
         description: "The grid defines a 2-dimensional image space in which the attribute associated with each direction changes in the reference image (which sits at the center of the grid). Select the position at which you think the subject image should be",
         position: [0.5, 0.5],
         image: subject_img,
         referenceImage: reference_img,
         axisLabels: attribute_info["attribute"]
      });
   }

   return questions;
}

export function createStudyPage(name, title, questions) {
   return {
      name: name,
      title: title,
      elements: questions
   }
}


export function shuffleArray(array) {
   let currentIndex = array.length;

   while (currentIndex > 0) {
      // pick random element from the elements that are left to be shuffled
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      
      // swap the two elements
      const tmp = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = tmp;
   }
}

async function load_attribute_file(folder) {
   const response = await fetch(
      "/" + folder + 'attribute_info.json',
      {
         headers: {
            'Content-Type': 'application/json',
            'Accept': 'appliction/json'
         }
      }
   );
   return await response.json();
}
