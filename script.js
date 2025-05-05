document.addEventListener("DOMContentLoaded", () => {
  fetchQuote();
});

fetch("https://zenquotes.io/api/random")
  .then((res) => res.json())
  .then((data) => {
    const quote = data[0];
    document.getElementById("quote").textContent = `"${quote.q}" — ${quote.a}`;
  });

if (annyang) {
  const commands = {
    hello: () => alert("Hello World"),
    "change the color to *color": (color) =>
      (document.body.style.backgroundColor = color),
    "navigate to *page": (page) => {
      page = page.toLowerCase();
      if (page.includes("stock")) window.location.href = "stocks.html";
      else if (page.includes("dog")) window.location.href = "dogs.html";
      else if (page.includes("home")) window.location.href = "index.html";
    },
  };
  annyang.addCommands(commands);
}
