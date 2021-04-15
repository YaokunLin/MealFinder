const search = document.getElementById('search');
const submit = document.getElementById('submit');
const random = document.getElementById('random');
const mealsElement = document.getElementById('meals');
const resultHeading = document.getElementById('result-heading');
const single_mealElement = document.getElementById('single-meal');

//Seach meal and fetch from API
function searchMeal(e) {
  e.preventDefault(); //prevent submitting to an actual file

  //clear single meal
  single_mealElement.innerHTML = '';

  //get search term
  const term = search.value;
  //console.log(term);

  //check for empty
  if (term.trim()) {
    fetch('https://www.themealdb.com/api/json/v1/1/search.php?s='.concat(term))
      .then(res => res.json())
      .then(data => {
        console.log(data);
        resultHeading.innerHTML = "<h2>Search results for '".concat(term).concat("':</h2>");

        if (data.meals == null) {
          resultHeading.innerHTML = '<p>There is no search result. Please try again.</p>'
        }
        else {
          mealsElement.innerHTML = data.meals
            .map(
              meal => `
            <div class="meal">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
              <div class="meal-info" data-mealID="${meal.idMeal}">
                <h3>${meal.strMeal}</h3>
              </div>
            </div>
          `
            )
            .join('');
        }


      });
    //clear search text
    search.value = "";

  } else {
    alert('Please enter a search term');
  }



}

function addMealToDom(mealData) {
  const ingredientsArray = [];

  for (let i = 1; i <= 20; i++) {
    if (mealData[`strIngredient${i}`]) {
      const stringToPush = `${mealData[`strIngredient${i}`]} - ${mealData[`strMeasure${i}`]}`;
      ingredientsArray.push(stringToPush);
      //console.log(stringToPush);
    }
    else {
      break;
    }
  }

  YoutubeStringLocation = mealData.strYoutube.indexOf("watch?v=");
  YoutubeVideoID = mealData.strYoutube.substring(YoutubeStringLocation + 8);


  single_mealElement.innerHTML = `
  <div class="single-meal">
    <h1>${mealData.strMeal}</h1>
    <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}"></img>
    <div class="single-meal-info">
      ${mealData.strCategory ? `<p>${mealData.strCategory}</p>` : ""}
      ${mealData.strArea ? `<p>${mealData.strArea}</p>` : ""}
    </div>
    <div class="main">
        <p>${mealData.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
          ${ingredientsArray.map(ingredient => `<li>${ingredient}<\li>`).join('')}
        </ul>
    </div>

    <div class="YoutubeVideo">
    <iframe width="560" height="315" 
    src="https://www.youtube.com/embed/${YoutubeVideoID}" 
    title="YouTube video player" 
    frameborder="0" 
    allow="accelerometer; 
    autoplay; 
    clipboard-write; 
    encrypted-media; 
    gyroscope; 
    picture-in-picture" allowfullscreen>
    </iframe>

    </div>
    
  </div>`
}

function getRandomMeal() {
  // clear meals and heading
  mealsElement.innerHTML = "";
  resultHeading.innerHTML = "";

  fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    .then(res => res.json())
    .then(data => {
      const mealData = data.meals[0];
      addMealToDom(mealData);

    });
}

//Fetch meal by ID
function getMealByID(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then(data => {
      //console.log(data);
      const mealData = data.meals[0];
      console.log(mealData);

      addMealToDom(mealData);
    });
};

//Event listensiers
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);


mealsElement.addEventListener('click', e => {
  //console.log(e.path);
  const mealInfo = e.path.find(item => {
    //console.log(item);
    if (item.classList) {
      return item.classList.contains('meal-info');
    }
    else {
      return false
    }
  });
  //console.log(mealInfo);
  if (mealInfo) {
    const mealID = mealInfo.getAttribute('data-mealid');
    //console.log(mealID);
    getMealByID(mealID);
  }
}

)
