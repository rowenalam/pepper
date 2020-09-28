'use strict';
const Alexa = require('ask-sdk-v1adapter');
const APP_ID = undefined;

/***********
Data: Customize the data below as you please.
***********/

const SKILL_NAME = "Pepper";
const STOP_MESSAGE = "Catch you later! Bye";
const CANCEL_MESSAGE = "Oh. Do you want to try a different recipe instead?";

const HELP_START = "I can help you find a recipe and walk you through cooking your meal.";
const HELP_START_REPROMPT = "What type of meal would you like to prepare?";
const HELP_RECIPE = "Say 'Yes' if you want to cook this recipe or say 'No' if you want to hear a different one. Say 'Cancel' to change the meal type";
const HELP_RECIPE_REPROMPT = "Pick a recipe you would like to try! You can also ask me about the ingredients";
const HELP_INSTRUCTIONS = "You can ask me to 'repeat' the instructions or say 'next' to hear the next step.";
const HELP_INSTRUCTIONS_REPROMPT = "I can repeat the previous step or move on with the recipe if you say next. You can also say cancel to exit this recipe.";
const HELP_CANCEL = "We can switch recipes or we could continue on with this one.";
const HELP_CANCEL_REPROMPT = "Say 'Yes' to switch to a different meal type or 'No' if you want to return to the recipe.";

const CHOOSE_TYPE_MESSAGE = "Hi, I'm Pepper, your cooking assistant! What would you like to cook today? I can show you recipes if you tell me what type of meal you're looking for. Please say breakfast, lunch, dinner or snack";
const REPROMPT_TYPE = "Say either breakfast, lunch, dinner or snack and I will recommend some recipes to you!";
const MEALTYPE_NOT_IN_LIST = chosenType => `Sorry, I couldn't find any recipes for ${chosenType}. Do you want a breakfast, lunch, dinner or snack recipe?`;

const RECIPE_ADJECTIVES = [
  "awesome",
  "simple",
  "fun",
  "tasty",
  "quick",
  "yummy",
  "great",
  "delicious"
];
const SUGGEST_RECIPE = recipeName => `I found this ${_pickRandom(RECIPE_ADJECTIVES)} ${recipeName} recipe! Shall we start making the ${recipeName}? You could also ask to hear the ingredients`;
const MISUNDERSTOOD_RECIPE_ANSWER = "Sorry, was that a yes or a no? If you want to change the meal type, say Cancel.";
const NO_REMAINING_RECIPE = "That's all the recipes I know for now...for more, you'll need to wait until the next release!"
const INGREDIENTS_INTRO = "We will need"; // Here follows a list of ingredients
const INGREDIENTS_ENDING = "How does that sound to you? Salivating yet?"; // Will be said after the list of ingredients


const FIRST_TIME_INSTRUCTIONS = "Say 'next' to continue to the next step. Say 'repeat' if you want to go back to the previous step.";
const REPROMPT_INSTRUCTIONS = "Did you want to repeat the last step or move on to the next step?";
const MISUNDERSTOOD_INSTRUCTIONS_ANSWER = "Sorry, salt must have gotten into my ears, what did you say?";
const CLOSING_MESSAGE = "Looks wonderful. Hope you have a great meal!";

const recipes = {
  breakfast: [
    {
      name: "Breakfast Burrito",
      instructions: [
        "Coat a small skillet with oil and set it at medium heat.",
        "When the pan is warm, add 2 eggs and 1/4 cup of spinach. Stir until eggs are cooked and spinach is wilted.",
        "Remove from heat and stir in salsa.",
        "Season to taste with salt and pepper.",
        "Heat the tortilla in a microwave for 10 seconds.",
        "Spread your cheese in the middle of the tortilla and add your egg mixture on top.",
        "Fold in the sides of the wrap, then roll up tightly from the bottom.",
        "Enjoy it while it's still warm!"
      ],
      ingredients: [
        "eggs",
        "spinach",
        "salsa",
        "tortilla",
        "cheddar cheese",
        "salt and pepper"
      ]
    },
    {
      name: "Apple Pie Oatmeal",
      instructions: [
        "Mix a third cup quick oats and two thirds cup milk.",
        "Cook in microwave or on stove.",
        "Scoop oatmeal into a bowl and put yogurt on top.",
        "Add the apple sauce, chopped apples, and raisins.",
        "Sprinkle with cinnamon and enjoy!"
      ],
      ingredients: [
        "quick oats",
        "milk",
        "vanilla greek yogurt",
        "apple sauce",
        "granny smith apple",
        "raisins",
        "cinnamon"
      ]
    },
    {
      name: "Avocado Toast",
      instructions: [
        "Toast 2 slices of bread to your desired color or crispiness.",
        "Cut avocado in half and remove the seed.",
        "Scoop avocado out of skin and mash in a bowl.",
        "Cook your egg as desired: fried, scrambled or poached are great options.",
        "Spread your avocado on the toast, top wth the egg and salt and pepper to taste."
      ],
      ingredients: [
        "avocado",
        "bread",
        "eggs",
        "salt and pepper"
      ]
    },
    {
      name: "French Toast Mug",
      instructions: [
        "Spray a 12 ounce microwave safe mug with nonstick spray.",
        "Combine egg, 2 tablespoons syrup, milk, cinnamon, and salt in the mug.",
        "Tear bread into bite size peices and submerge it into the mug mixture.",
        "Microwave in 30 second intervals for 1.5 to 2 minutes or until done.",
        "Top with your favorite ingredients, I like banana and orange slices with a drizzle of honey."
      ],
      ingredients: [
        "egg",
        "syrup",
        "milk",
        "cinnamon",
        "salt",
        "bread"
      ]
    },
    {
      name: "Breakfast Parfait",
      instructions: [
        "Scoop the greek yogurt into a glass or bowl.",
        "Top with granola and fruit.",
        "Drizzle the honey on top and enjoy!"
      ],
      ingredients: [
        "granola",
        "greek yogurt",
        "banana",
        "berries",
        "honey"
      ]
    },
    {
      name: "Banana Pancake in a Mug",
      instructions: [
        "Mix a smashed banana, egg, and greek yogurt in a mug.",
        "Add in the flour and baking power and mix.",
        "Pour batter into a mug.",
        "Microwave for 3 minutes.",
        "Add some fruit on top! Bon Appetit!"
      ],
      ingredients: [
        "banana",
        "an egg",
        "greek yogurt",
        "flour",
        "baking powder",
        "your favorite fruit topping"
      ]
    },
    {
      name: "Morning Magic Smoothie",
      instructions: [
        "Combine all ingredients into a blender.",
        "Blend thoroughly.",
        "Enjoy!"
      ],
      ingredients: [
        "Vanilla Almond Milk",
        "Coffee",
        "Banana",
        "Chocolate Powder",
        "Rolled Oats"
      ]
    },
    {
      name: "Breakfast Tacos",
      instructions: [
        "Cook your eggs as desired and season with salt and pepper to taste.",
        "Heat sausages according to package instructions.",
        "Warm tortillas on a hot griddle.",
        "Compile your taco and top with your favorite toppings.",
        "Mmmmm. Yo Quiero breakfast tacos."
      ],
      ingredients: [
        "tortillas",
        "box of fully cooked sausages",
        "eggs",
        "cheddar cheese",
        "avocado",
        "your preferred toppings like salsa, sour cream, cilantro, lime",
        "salt and pepper"
      ]
    },
    {
      name: "Smoothie Bowl",
      instructions: [
        "Add 2-3 tablespoons of mikl, a cup of frozen berries and a small ripe banana into a blender and blend on low.",
        "pour or scoop the smoothie into a bowl.",
        "Top with your favorite things. Some ideas are chia seeds, hemp seeds, coconut flakes, granola, nuts, or more fresh fruit.",
        "Best eaten fresh, but you can save leftovers in the freezer to enjoy later."
      ],
      ingredients: [
        "frozen mixed berries",
        "ripe banana",
        "your choice of milk"
      ]
    },
    {
      name: "Protein Breakfast Sandwich",
      instructions: [
        "Toast the english muffin.",
        "Whisk the egg in a bowl and microwave for 65 seconds.",
        "Top with cheese and microwave another 15 seconds.",
        "drain and wash the black beans then mash them with chili powder, garlic powder and salt and pepper to taste.",
        "Spread the black beans on the english muffin and top it with avocado.",
        "Add the agg on top and add a dash of hot sauce for some kick.",
        "Bam! a protein packed breakfast!"
      ],
      ingredients: [
        "engilsh muffin",
        "black beans",
        "chili powder",
        "garlic powder",
        "avocado",
        "egg",
        "cheddar cheese",
        "hot sauce",
        "salt and pepper"
      ]
    }
  ],
  lunch: [
    {
      name: "Grilled Cheese",
      instructions: [
        "Melt the butter and add parmesan cheese. Mix together.",
        "Spread the mixture on the outsides of the bread.",
        "Put cheddar cheese in the middle.",
        "Flip when you reach desired crispiness.",
        "Wait until the otherside is of equal crispiness and voila! the perfect grilled cheese."
      ],
      ingredients: [
        "parmesan cheese",
        "butter",
        "cheddar cheese",
        "bread"
      ]
    },
    {
      name: "Chicken Quesadilla",
      instructions: [
        "Microwave 2 tortillas for 1 minute.",
        "Mix chicken, diced bell peppers, and 1 tablespoon taco seasoning into a bowl and microwave for 2 minutes.",
        "Spread mixture on tortilla and top with cheese.",
        "Top with second tortilla and microwave for another minute.",
        "Slice and serve! Yummmm."
      ],
      ingredients: [
        "Flour tortilla",
        "Cooked Chicken",
        "bell pepper",
        "taco seasoning",
        "cheddar cheese"
      ]
    },
    {
      name: "Chicken Salad Lettuce Wraps",
      instructions: [
        "In a large bowl, combine yogurt and bleu cheese. Season with lemon juice to taste and stir in the chicken until fully coated.",
        "Spoon chicken into the center ribs of romaine lettuce leaves.",
        "Sprinkle walnuts and raspberries on top.",
        "Serve immediately. A double dose of healthy and delicious."
      ],
      ingredients: [
        "plain yogurt",
        "bleu cheese",
        "lemon juice",
        "cooked shredded chicken",
        "romaine lettuce leaves",
        "walnuts",
        "raspberries"
      ]
    },
    {
      name: "BBQ Chicken Nachos",
      instructions: [
        "Mix the chicken with the barbeque sauce, then spread evenly over a bed of tortilla chips.",
        "Spread the pico de gallo and cheese evenly on top, then microwave for about 1-3 minutes until the cheese is melted and bubbly.",
        "Dollop with some guacamole and sour cream, then serve.",
      ],
      ingredients: [
        "shredded rotisserie chicken",
        "BBQ sauce",
        "tortilla chips",
        "pico de gallo",
        "cheddar cheese",
        "guacamole",
        "sour cream"
      ]
    },
    {
      name: "Mac and Cheese",
      instructions: [
        "Mix half a cup of macaroni, half a cup of water, and salt in a microwaveable mug.",
        "Microwave for 2-3 minutes, then stir.",
        "Add the milk, cheese, salt, and pepper, then stir.",
        "Microwave for another 30 seconds and then you're done!",
        "Your own easy mac!"
      ],
      ingredients: [
        "elbow macaroni",
        "water",
        "milk",
        "shredded cheddar cheese",
        "salt and pepper to taste"
      ]
    }
  ],
  dinner: [
    {
      name: "Chicken Enchilada",
      instructions: [
        "Spoon chicken in the center of the tortilla.",
        "top with half of the enchilada sauce and half of the cheese.",
        "Roll up the tortilla and place seam side down onto a microwavable plate.",
        "Top with the remaining cheese and sauce.",
        "Microwave for 1 minute and 30 seconds or until cheese is melted.",
        "Smells delicious!"
      ],
      ingredients: [
        "cooked shredded chicken or pork",
        "flour tortilla",
        "enchilada sauce",
        "cheddar jack cheese"
      ]
    },
    {
      name: "Instant Pot Chicken Broccoli and Rice",
      instructions: [
        "Heat the butter in saute mode and when hot, add chicken, onion and garlic.",
        "Cook until onion is translucent then add rice, broth and seasonings. Stir well.",
        "whisk milk and flour and set aside.",
        "Cook on high for 5 minutes.",
        "release the pressure and add the milk and flour mixture. Mix thoroughly.",
        "Add broccoli and cheese and stir until well combined.",
        "Eat it while its hot!"
      ],
      ingredients: [
        "butter",
        "boneless skinless chicken breast",
        "garlic",
        "onion",
        "garlic powder",
        "long grain rice",
        "chicken broth",
        "milk",
        "flour",
        "fresh cooked broccoli",
        "shredded cheddar cheese",
        "salt and pepper"
      ]
    },
    {
      name: "Pepperoni Pizza Quesadilla",
      instructions: [
        "Spread pizza sauce evenly on flatbread.",
        "On half of the flatbread, sprinkle about 2 tablespoons of cheese, basil and lay the pepperoni on top. Sprinkle more cheese.",
        "Fold the other half of the flatbread over the topped half.",
        "Heat a medium nonstick skillet over medium heat.",
        "Cook quesadilla covered for 3 minutes or until toasty golden brown.",
        "Flip and continue cooking covered for an additional minute while the cheese melts.",
        "Remove from heat, cut into wedges and serve with pizza dipping sauce if you like!"
      ],
      ingredients: [
        "italian herb flatbread",
        "pizza sauce",
        "shredded italian cheese blend",
        "dried basil",
        "pepperoni"
      ]
    },
    {
      name: "Instapot Shrimp Scampi Paella",
      instructions: [
        "Combine all ingredients in your instapot and layer the shrimp on top.",
        "Secure lid and set on high for 5 minutes.",
        "Depressurize and serve!"
      ],
      ingredients: [
        "1 pound frozen shrimp",
        "1 cup jasmine rice",
        "quarter cup of butter",
        "1.5 cup water",
        "4 cloves minced garlic",
        "salt and pepper"
      ]
    },
    {
      name: "3 ingredient Stir Fry",
      instructions: [
        "Heat oil in a pan on medium.",
        "Add your 3 ingredients and stir fry them together.",
        "Best served with a side of rice."
      ],
      ingredients: [
        "Any cooked protein meat",
        "Any vegetable",
        "A sauce like teriyaki, sweet and sour or sesame ginger.",
      ]
    }
  ],
  snack: [
    {
      name: "BLTA Wrap",
      instructions: [
        "Put lettuce in the center of the tortilla, then top with tomato, bacon and avocado.",
        "Drizzle any dressing like ranch and sprinkle some pepper on top.",
        "Fold in the sides and roll into a wrap.",
        "Take a big ol' bite!"
      ],
      ingredients: [
        "bacon",
        "lettuce leaves",
        "tomato",
        "avocado",
        "tortillas",
        "pepper and dressing if you choose"
      ]
    },
    {
      name: "Watermelon Sorbet",
      instructions: [
        "Place all of the ingredients in a blender or food processor, and blend until smooth.",
        "Scoop out into a glass or bowl.",
        "Enjoy sorbet immediately or place in a Tupperware container and freeze until you are ready to enjoy!"
      ],
      ingredients: [
        "water",
        "frozen watermelon",
        "frozen strawberries",
        "sweetener of choice",
        "lemon juice"
      ]
    },
    {
      name: "Cheddar Bacon Ranch Dip",
      instructions: [
        "Combine all ingredients in a large mixing bowl, and stir until combined.",
        "Garnish with extra bacon and green onions, if desired.",
        "Serve with chips or refrigerate in a sealed container for up to 3 days."
      ],
      ingredients: [
        "A block of cream cheese",
        "shredded cheddar cheese",
        "greek yogurt",
        "ranch seasoning",
        "bacon",
        "chips"
      ]
    },
    {
      name: "PB Banana Honey Roll Ups",
      instructions: [
        "Spread peanut butter on flatbread.",
        "Slice one banana and spread evenly over the flatbread.",
        "Drizzle the honey on top.",
        "Roll it up and take a bite!"
      ],
      ingredients: [
        "flatout flatbread",
        "Peanut Butter",
        "Banana",
        "Honey"
      ]
    }
  ]
};

/***********
Execution Code: Avoid editing the code below if you don't know JavaScript.
***********/

// Private methods (this is the actual code logic behind the app)

const _getCurrentStep = handler => handler.attributes['instructions'][handler.attributes['current_step']];

const _intentAndSlotPresent = handler => {
  try {
    return handler.event.request.intent.slots.mealType;
  }
  catch (e){
    return false;
  }
};
const _selectedMealType = handler => {
  return _intentAndSlotPresent(handler) && handler.event.request.intent.slots.mealType.value;
};
const _checkMealTypePresence = handler => {
  return Object.keys(recipes).includes(_selectedMealType(handler));
};
const _setMealType = handler => {
  // Reset remaining recipes in case the user went back from before
  handler.attributes['mealType'] = _selectedMealType(handler);
  handler.attributes['remainingRecipes'] = recipes[handler.attributes['mealType']];
  handler.handler.state = states.RECIPEMODE;
  handler.emitWithState("Recipe");
  return true;
};

const _randomIndexOfArray = (array) => Math.floor(Math.random() * array.length);
const _pickRandom = (array) => array[_randomIndexOfArray(array)];

// Handle user input and intents:

const states = {
  STARTMODE: "_STARTMODE",
  RECIPEMODE: "_RECIPEMODE",
  INSTRUCTIONSMODE: "_INSTRUCTIONSMODE",
  CANCELMODE: "_CANCELMODE"
};


const newSessionhandlers = {
  'NewSession': function(){
    this.handler.state = states.STARTMODE;
    this.emitWithState('NewSession');
  },
  'AMAZON.HelpIntent': function(){
    this.emit(':ask', HELP_START, HELP_START_REPROMPT);
  },
  'AMAZON.CancelIntent': function(){
    this.emit(':tell', CANCEL_MESSAGE);
  },
  'AMAZON.StopIntent': function(){
    this.emit(':tell', STOP_MESSAGE);
  },
  'Unhandled': function(){
    this.emit(':ask', REPROMPT_TYPE, REPROMPT_TYPE);
  }
};

const startModeHandlers = Alexa.CreateStateHandler(states.STARTMODE, {
  'NewSession': function(startMessage = CHOOSE_TYPE_MESSAGE){
    if(_checkMealTypePresence(this)){
      // Go directly to selecting a meal if mealtype was already present in the slots
      _setMealType(this);
    }else{
      this.emit(':ask', startMessage, REPROMPT_TYPE);
    }
  },
  'ChooseTypeIntent': function(){
    if(_checkMealTypePresence(this)){
      _setMealType(this);
    }else{
      this.emit(':ask', MEALTYPE_NOT_IN_LIST(_selectedMealType(this)), MEALTYPE_NOT_IN_LIST(_selectedMealType(this)));
    }
  },
  'AMAZON.HelpIntent': function(){
    this.emit(':ask', HELP_START, HELP_START_REPROMPT);
  },
  'AMAZON.CancelIntent': function(){
    this.emit(':tell', CANCEL_MESSAGE);
  },
  'AMAZON.StopIntent': function(){
    this.emit(':tell', STOP_MESSAGE);
  },
  'Unhandled': function(){
    this.emit(':ask', REPROMPT_TYPE, REPROMPT_TYPE);
  }
});

const recipeModeHandlers = Alexa.CreateStateHandler(states.RECIPEMODE, {
  'Recipe': function(){
    if(this.new){
      this.attributes['remainingRecipes'] = recipes[this.handler.attributes['mealType']];
    }

    if(this.attributes['remainingRecipes'].length > 0){
      // Select random recipe and remove it form remainingRecipes
      this.attributes['recipe'] = this.attributes['remainingRecipes'].splice(_randomIndexOfArray(this.attributes['remainingRecipes']), 1)[0]; // Select a random recipe
      // Ask user to confirm selection
      this.emit(':ask', SUGGEST_RECIPE(this.attributes['recipe'].name), SUGGEST_RECIPE(this.attributes['recipe'].name));
    }else{
      this.attributes['remainingRecipes'] = recipes[this.attributes['mealType']];
      this.handler.state = states.CANCELMODE;
      this.emitWithState('NoRecipeLeftHandler');
    }
  },
  'IngredientsIntent': function(){
    var ingredients = this.attributes['recipe'].ingredients.join(', ').replace(/,(?!.*,)/gmi, ' and'); // Add 'and' before last ingredient

    this.emit(':ask', `${INGREDIENTS_INTRO} ${ingredients}. ${INGREDIENTS_ENDING}`, `${INGREDIENTS_INTRO} ${ingredients}. ${INGREDIENTS_ENDING}`)
  },
  'AMAZON.YesIntent': function(){
    this.attributes['instructions'] = this.attributes['recipe'].instructions;
    this.attributes['current_step'] = 0;
    this.handler.state = states.INSTRUCTIONSMODE;
    this.emitWithState('InstructionsIntent');
  },
  'AMAZON.NoIntent': function(){
    this.emitWithState('Recipe');
  },
  'AMAZON.HelpIntent': function(){
    this.emit(':ask', HELP_RECIPE, HELP_RECIPE_REPROMPT);
  },
  'AMAZON.CancelIntent': function(){
    this.handler.state = states.CANCELMODE;
    this.emitWithState('AskToCancelHandler');
  },
  'AMAZON.StopIntent': function(){
    this.emit(':tell', STOP_MESSAGE);
  },
  'Unhandled': function(){
    this.emit(':ask', MISUNDERSTOOD_RECIPE_ANSWER, MISUNDERSTOOD_RECIPE_ANSWER);
  }
});

const instructionsModeHandlers = Alexa.CreateStateHandler(states.INSTRUCTIONSMODE, {
  'InstructionsIntent': function(){
    const firstTimeInstructions = (this.attributes['current_step'] === 0) ? FIRST_TIME_INSTRUCTIONS : '';
    this.emit(':ask', `${_getCurrentStep(this)} ${firstTimeInstructions}`, REPROMPT_INSTRUCTIONS);
  },
  'NextStepIntent': function(){
    this.attributes['current_step']++;

    if(this.attributes['current_step'] < this.attributes['instructions'].length - 1){
      this.emitWithState('InstructionsIntent');
    }else{
      this.emitWithState('InstructionsEnded');
    }
  },
  'InstructionsEnded': function(){
    this.emit(':tell', `${_getCurrentStep(this)} ${CLOSING_MESSAGE}`);
  },
  'DifferentRecipeIntent': function(){
    this.handler.state = states.RECIPEMODE;
    this.emitWithState('Recipe');
  },
  'AMAZON.HelpIntent': function(){
    this.emit(':ask', HELP_INSTRUCTIONS, HELP_INSTRUCTIONS_REPROMPT);
  },
  'AMAZON.CancelIntent': function(){
    this.handler.state = states.CANCELMODE;
    this.emitWithState('AskToCancelHandler');
  },
  'AMAZON.StopIntent': function(){
    this.emit(':tell', STOP_MESSAGE);
  },
  'Unhandled': function(){
    this.emit(':ask', MISUNDERSTOOD_INSTRUCTIONS_ANSWER, MISUNDERSTOOD_INSTRUCTIONS_ANSWER);
  }
});


const cancelModeHandlers = Alexa.CreateStateHandler(states.CANCELMODE, {
  'NoRecipeLeftHandler': function(){
    this.emit(':ask', NO_REMAINING_RECIPE, NO_REMAINING_RECIPE);
  },
  'AskToCancelHandler': function(){
    this.emit(':ask', CANCEL_MESSAGE, CANCEL_MESSAGE);
  },
  'AMAZON.YesIntent': function(){
    this.attributes['current_step'] = 0;
    this.handler.state = states.STARTMODE;
    this.emitWithState('NewSession', REPROMPT_TYPE);
  },
  'AMAZON.NoIntent': function(){
    this.emit(':tell', STOP_MESSAGE);
  },
  'AMAZON.HelpIntent': function(){
    this.emit(':ask', HELP_CANCEL, HELP_CANCEL_REPROMPT);
  },
  'AMAZON.CancelIntent': function(){
    this.emit(':tell', STOP_MESSAGE);
  },
  'AMAZON.StopIntent': function(){
    this.emit(':tell', STOP_MESSAGE);
  },
  'Unhandled': function(){
    this.emit(':ask', MISUNDERSTOOD_RECIPE_ANSWER, MISUNDERSTOOD_RECIPE_ANSWER);
  }
});

exports.handler = (event, context, callback) => {
  const alexa = Alexa.handler(event, context);
  alexa.APP_ID = APP_ID;
  alexa.registerHandlers(newSessionhandlers, startModeHandlers, recipeModeHandlers, instructionsModeHandlers, cancelModeHandlers);
  alexa.execute();
};
