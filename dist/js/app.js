const menu = document.querySelector("#menu");
const menuItems = document.querySelector("#menu-items");

menu.addEventListener("click", () => {
  menuItems.classList.toggle("hidden");
});

const form = document.querySelector("#form");
const input = document.querySelector("#input");
const outputContainer = document.querySelector("#output-container");
const api = "https://api.shrtco.de/v2";
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let inputVal = input.value.trim();
  let fullUrl = api + "/shorten?url=" + inputVal;
  console.log(fullUrl);
  if (inputVal === null || inputVal === "") {
    setError(input, "Url cannot be blank");
  } else {
    setSuccess(input);
    shortenUrl(fullUrl);
  }
});

async function shortenUrl(link) {
  const response = await fetch(link);
  const data = await response.json();
  console.log(data);
  if (data.ok) {
    let shortLink = data.result.short_link;
    setSuccess(input);
    let div = document.createElement("div");

    div.innerHTML = `
    <p
                class="border-b-grayish border-b md:border-0 pb-4 md:pb-0 w-full"
              >
                ${input.value}
              </p>
              <div
                class="flex flex-col md:flex-row justify-end gap-4 items-center w-full"
              >
                <a href="#" class="text-cyan-500" id='shortLink'>${shortLink}</a>
                <button
                  class="bg-cyan-500 text-white font-bold px-4 py-2 w-full md:w-auto rounded-md transition" onclick="urlCopy(event)"
                >
                  Copy
                </button>
              </div> 
    `;
    div.className =
      "flex flex-col md:flex-row justify-between items-center gap-4 p-4 bg-white md:text-left rounded-md";

    outputContainer.appendChild(div);
  } else {
    if (data.error_code == 10) {
      let msg = "The link you entered is a disallowed link";
      setError(input, msg);
    } else if (data.error_code == 2) {
      let msg = "This is not a valid url";
      setError(input, msg);
    }
  }
}

const setError = (element, message = "Please add a link") => {
  element.classList.add("error");
  parentEl = element.parentNode;
  errMsg = parentEl.querySelector(".errMsg");
  errMsg.innerText = message;
};
const setSuccess = (element) => {
  element.classList.remove("error");
  parentEl = element.parentNode;
  errMsg = parentEl.querySelector(".errMsg");
  errMsg.innerText = "";
};
function urlCopy(event) {
  let el = event.target;
  let parentEl = el.parentNode;
  const toCopy = parentEl.querySelector("#shortLink");
  navigator.clipboard.writeText(toCopy.innerText);
  el.innerText = "Copied!";
  el.classList.add("bg-darkViolet");
}
