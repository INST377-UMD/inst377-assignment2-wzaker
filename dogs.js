let slider;

async function loadCarouselImages() {
  const res = await fetch("https://dog.ceo/api/breeds/image/random/10");
  const data = await res.json();

  const carousel = document.getElementById("dogCarousel");
  carousel.innerHTML = "";

  data.message.forEach((url) => {
    const img = document.createElement("img");
    img.src = url;
    carousel.appendChild(img);
  });

  slider = simpleslider.getSlider({
    container: wrapper,
    pause: true,
    duration: 0.6,
    delay: 10,
  });
}

async function loadBreedButtons() {
  const res = await fetch("https://dogapi.dog/api/v2/breeds");
  const data = await res.json();

  const container = document.getElementById("breedButtons");
  data.data.forEach((breed) => {
    const btn = document.createElement("button");
    btn.textContent = breed.attributes.name;
    btn.classList.add("breed-buttons");
    btn.setAttribute("data-name", breed.attributes.name.toLowerCase());
    btn.onclick = () => showBreedInfo(breed);
    container.appendChild(btn);
  });
}

function showBreedInfo(breed) {
  const infoBox = document.getElementById("breedInfo");
  infoBox.innerHTML = `
    <h2>${breed.attributes.name}</h2>
    <p><strong>Description:</strong> ${breed.attributes.description}</p>
    <p><strong>Min Life:</strong> ${breed.attributes.life.min}</p>
    <p><strong>Max Life:</strong> ${breed.attributes.life.max}</p>
  `;
  infoBox.style.display = "block";
}

// VOICE COMMANDS
if (annyang) {
  const commands = {
    hello: () => alert("Hello World"),
    "change the color to *color": (color) => {
      document.body.style.backgroundColor = color;
    },
    "navigate to *page": (page) => {
      page = page.toLowerCase();
      if (page.includes("stock")) window.location.href = "stocks.html";
      else if (page.includes("dog")) window.location.href = "dogs.html";
      else if (page.includes("home")) window.location.href = "index.html";
    },
    "load dog breed *name": (name) => {
      const buttons = document.querySelectorAll(".breed-btn");
      buttons.forEach((btn) => {
        if (btn.getAttribute("data-name") === name.toLowerCase()) {
          btn.click();
        }
      });
    },
  };
  annyang.addCommands(commands);
}

loadCarouselImages();
loadBreedButtons();
