import "@docs/styles/docs.scss";
import { TestFunction } from "index";

if (window && window.hasOwnProperty("document")) {
  const container = window.document.querySelector(".container");

  const newP = document.createElement("p");
  newP.classList.add("created");
  newP.innerText = TestFunction(
    "This paragraph was added by JavaScript."
  );
  container.appendChild(newP);
}
