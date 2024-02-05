async function getDrink(url, lookupItem = "") {
  try {
    const response = await fetch(url + lookupItem);
    const data = await response.json();
    return data;
  } catch (error) {
    const data = null;
    return data;
  }
}

async function getDrinkDetails(id, classForQuerySelector) {
  const response = await fetch(
    "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + id
  );
  const data = await response.json();

  let ingredientsList = document.createElement("ul");
  let drinkInstruction = document.createElement("p");
  drinkInstruction.textContent = data.drinks[0].strInstructions;
  for (let i = 1; i <= 15; i++) {
    if (data.drinks[0]["strIngredient" + i]) {
      let drinkIngr = document.createElement("li");
      drinkIngr.textContent =
        (data.drinks[0]["strMeasure" + i] === null
          ? ""
          : data.drinks[0]["strMeasure" + i]) +
        " " +
        data.drinks[0]["strIngredient" + i];
      ingredientsList.appendChild(drinkIngr);
    }
  }

  const drinks = document.querySelector(classForQuerySelector);
  let drink = drinks.querySelector('[id="' + id + '"]');
  let drinkInfo = document.createElement("div");
  drinkInfo.id = "drinkInfo";

  let drinkImg = drink.children[1];

  if (drinkImg.style.display === "none") {
    drinkImg.style.display = "initial";
    drink.lastChild.remove();
  } else {
    drinkImg.style.display = "none";
    drinkInfo.appendChild(ingredientsList);
    drinkInfo.appendChild(drinkInstruction);
    drink.appendChild(drinkInfo);
  }
}

function getDrinkIdOnClick(className, index = 0) {
  const drink =
    document.getElementsByClassName(className)[0].children[4].children;
  const drinks = document.querySelector(`.${className}`);

  for (let i = index; i < drink.length; i++) {
    let drinkID = drinks.querySelectorAll('[id="' + drink[i].id + '"]')[0];
    drinkID.addEventListener("click", () => {
      getDrinkDetails(drink[i].id, `.${className}`);
    });
  }
}

const userDrink = document.getElementById("name");

function displayDrink(jsonData) {
  const drinks = document.getElementsByClassName("drinksContainer")[0];

  drinks.innerHTML = "";
  if (jsonData.drinks === null) {
    noResults("nameSearch", userDrink, "nameNoResult");
  } else {
    if (document.getElementById("nameNoResult")) {
      document
        .getElementById("nameSearch")
        .removeChild(document.getElementById("nameNoResult"));
    }
    for (const drink of jsonData.drinks) {
      let drinkContainer = document.createElement("div");
      drinkContainer.className = "drink";
      drinkContainer.id = drink.idDrink;

      let drinkName = document.createElement("h4");
      drinkName.className = "drinkName";
      drinkName.textContent = drink.strDrink;

      let drinkThumb = document.createElement("img");
      drinkThumb.src = drink.strDrinkThumb;
      drinkThumb.style.width = "350px";
      drinkThumb.style.height = "350px";
      drinkThumb.className = "drinkImg";

      drinkContainer.appendChild(drinkName);
      drinkContainer.appendChild(drinkThumb);
      drinks.appendChild(drinkContainer);
    }
    getDrinkIdOnClick("nameSearch");
  }
}

const searchSubmit = document.getElementById("searchSubmit");

searchSubmit.addEventListener("click", () => {
  getDrink(
    "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=",
    userDrink.value
  ).then((data) => displayDrink(data));
});

function displayRandomDrink(data) {
  let randomContainer = document.getElementsByClassName("randomContainer")[0];

  let drinkName = document.createElement("h4");
  drinkName.classList = "drinkName";
  drinkName.textContent = data.drinks[0].strDrink;

  let drinkThumb = document.createElement("img");
  drinkThumb.src = data.drinks[0].strDrinkThumb;
  drinkThumb.style.width = "350px";
  drinkThumb.style.height = "350px";
  drinkThumb.className = "drinkImg";

  let drinkInstruction = document.createElement("p");
  drinkInstruction.textContent = data.drinks[0].strInstructions;
  drinkInstruction.style.display = "none";

  let drinkIngredients = document.createElement("ul");
  for (let i = 1; i <= 15; i++) {
    if (data.drinks[0]["strIngredient" + i]) {
      let drinkIngr = document.createElement("li");
      drinkIngr.textContent =
        (data.drinks[0]["strMeasure" + i] === null
          ? ""
          : data.drinks[0]["strMeasure" + i]) +
        " " +
        data.drinks[0]["strIngredient" + i];
      drinkIngredients.appendChild(drinkIngr);
    }
  }
  drinkIngredients.style.display = "none";

  let newDrink = document.createElement("div");
  newDrink.id = data.drinks[0].idDrink;
  newDrink.className = "randomDrink";

  randomContainer.innerHTML = "";
  newDrink.appendChild(drinkName);
  newDrink.appendChild(drinkThumb);
  newDrink.appendChild(drinkIngredients);
  newDrink.appendChild(drinkInstruction);
  randomContainer.appendChild(newDrink);

  randomContainer.addEventListener("click", () => {
    if (drinkThumb.style.display === "none") {
      drinkThumb.style.display = "initial";
      drinkIngredients.style.display = "none";
      drinkInstruction.style.display = "none";
    } else {
      drinkThumb.style.display = "none";
      drinkIngredients.style.display = "initial";
      drinkInstruction.style.display = "initial";
    }
  });
}

document.getElementById("randomSubmit").addEventListener("click", () => {
  getDrink("https://www.thecocktaildb.com/api/json/v1/1/random.php").then(
    (data) => {
      displayRandomDrink(data);
    }
  );
});

const userIngredient = document.getElementById("ingredient");

function displayIngredientDrink(data, index = 0) {
  if (data === null) {
    document.getElementById("moreBtn").style.display = "none";
    document.getElementById("moreBtnContainer").style.display = "none";
    noResults("ingredientSearch", userIngredient, "ingredientNoResult");
  } else {
    if (document.getElementById("ingredientNoResult")) {
      document
        .getElementById("ingredientSearch")
        .removeChild(document.getElementById("ingredientNoResult"));
    }
    for (let i = index; i < data.drinks.length; i++) {
      if (i <= index + 19) {
        let drinkContainer = document.createElement("div");
        drinkContainer.className = "drink";
        drinkContainer.id = data.drinks[i].idDrink;

        let drinkName = document.createElement("h4");
        drinkName.className = "drinkName";
        drinkName.textContent = data.drinks[i].strDrink;

        let drinkThumb = document.createElement("img");
        drinkThumb.src = data.drinks[i].strDrinkThumb;
        drinkThumb.style.width = "350px";
        drinkThumb.style.height = "350px";
        drinkThumb.className = "drinkImg";

        drinkContainer.appendChild(drinkName);
        drinkContainer.appendChild(drinkThumb);
        document
          .getElementsByClassName("drinksContainer")[1]
          .appendChild(drinkContainer);

        document.getElementById("moreBtn").style.display = "none";
        document.getElementById("moreBtnContainer").style.display = "none";
      } else {
        document.getElementById("moreBtn").style.display = "initial";
        document.getElementById("moreBtnContainer").style.display = "flex";
        break;
      }
    }
    getDrinkIdOnClick("ingredientSearch", index);
  }
}

document.getElementById("ingredientSubmit").addEventListener("click", () => {
  document.getElementsByClassName("drinksContainer")[1].innerHTML = "";

  getDrink(
    "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=",
    userIngredient.value
  ).then((data) => displayIngredientDrink(data));
});

document.getElementById("moreBtn").addEventListener("click", () => {
  const drinksContainerLength =
    document.getElementsByClassName("drinksContainer")[1].children.length;

  getDrink(
    "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=",
    userIngredient.value
  ).then((data) => displayIngredientDrink(data, drinksContainerLength));
});

function noResults(sectionID, inputField, noResultID) {
  if (document.getElementById(noResultID)) {
    document
      .getElementById(sectionID)
      .removeChild(document.getElementById(noResultID));
  }
  const noResultsParagraph = document.createElement("p");
  noResultsParagraph.className = "noResults notice";
  noResultsParagraph.id = noResultID;
  noResultsParagraph.textContent = `No results for "${inputField.value}"`;
  document.getElementById(sectionID).appendChild(noResultsParagraph);
}

document.getElementById("name").addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    searchSubmit.click();
  }
});

document.getElementById("ingredient").addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("ingredientSubmit").click();
  }
});
