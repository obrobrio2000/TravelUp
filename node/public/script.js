fetch("/contributors")
  .then((response) => response.json())
  .then((data) => {
    data.forEach((contributor) => {
      const cardTemplate = document.querySelector("template");

      const card = cardTemplate.content.cloneNode(true);

      card.querySelector("h4").innerText = contributor.name;
      card.querySelector("p").innerText = contributor.title;

      document.body.appendChild(card);
    });
  });
