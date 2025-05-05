const apiKey = "FoMtjrO6MtQUhVbsqHA8L715ILD4lx3O";
let stockChart;

function fetchStock() {
  const ticker = document.getElementById("tickerInput").value.toUpperCase();
  const days = document.getElementById("dayRange").value;

  const today = new Date();
  const end = today.toISOString().split("T")[0];

  const past = new Date(today.setDate(today.getDate() - parseInt(days)));
  const start = past.toISOString().split("T")[0];

  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${start}/${end}?adjusted=true&sort=asc&limit=120&apiKey=${apiKey}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const labels = data.results.map((item) => {
        const date = new Date(item.t);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      });
      const values = data.results.map((item) => item.c);

      drawChart(labels, values, ticker);
    });
}

function drawChart(labels, values, ticker) {
  const ctx = document.getElementById("stockChart").getContext("2d");
  if (stockChart) stockChart.destroy();
  stockChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: `${ticker} Closing Price`,
          data: values,
          borderColor: "blue",
          borderWidth: 2,
        },
      ],
    },
  });
}

function fetchRedditStocks() {
  fetch("https://tradestie.com/api/v1/apps/reddit?date=2022-04-03")
    .then((res) => res.json())
    .then((data) => {
      const top5 = data.slice(0, 5);
      const tbody = document.querySelector("#redditTable tbody");
      tbody.innerHTML = "";
      top5.forEach((stock) => {
        const iconSrc =
          stock.sentiment === "Bullish"
            ? "https://cdn-icons-png.flaticon.com/128/13998/13998112.png"
            : "https://cdn-icons-png.flaticon.com/128/13998/13998114.png";
        const row = document.createElement("tr");
        row.innerHTML = `
          <td><a href="https://finance.yahoo.com/quote/${stock.ticker}" target="_blank">${stock.ticker}</a></td>
          <td>${stock.no_of_comments}</td>
          <td><img src="${iconSrc}" class="sentiment-icon" /></td>
`;

        tbody.appendChild(row);
      });
    });
}

fetchRedditStocks();

// VOICE COMMANDS
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
    "lookup *ticker": (ticker) => {
      document.getElementById("tickerInput").value = ticker.toUpperCase();
      document.getElementById("dayRange").value = "30"; // default to 30
      fetchStock();
    },
  };
  annyang.addCommands(commands);
}
