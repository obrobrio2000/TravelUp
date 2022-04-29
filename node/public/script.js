fetch("/contributors")
  .then((response) => response.json())
  .then((data) => {
    data.forEach((contributor) => {
      // Select the <template> we created in index.html
      const cardTemplate = document.querySelector("template");

      // Clone a copy of the template we can insert in the DOM as a real visible node
      const card = cardTemplate.content.cloneNode(true);

      // Update the content of the cloned template with the contributor data we queried from the backend
      card.querySelector("h4").innerText = contributor.name;
      card.querySelector("p").innerText = contributor.title;

      // Append the card as a child with the contributor data to the <body> element on our page
      document.body.appendChild(card);
    });
  });
