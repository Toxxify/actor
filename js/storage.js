document.querySelector("#load").addEventListener("click", () => {
  document.querySelector("#modal-load").style.display = "flex";
  addScriptButtons();
});

document.querySelector("#save").addEventListener("click", () => {
  document.querySelector("#modal-save").style.display = "flex";
});

window.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-wrapper")) {
    document.querySelector("#modal-load").style.display = "none";
    document.querySelector("#modal-save").style.display = "none";
  }
});

document.querySelector("#save-no").addEventListener("click", () => {
  document.querySelector("#modal-save").style.display = "none";
});

document.querySelector("#save-yes").addEventListener("click", () => {
  let scripts = JSON.parse(localStorage.getItem("scriptData"));
  if (!scripts) {
    scripts = [];
  }
  const scriptData = {
    actorFirstName: document.querySelector("#actor-1").value,
    actorFirstGender: getGender(".actor-1-voice"),
    actorSecondName: document.querySelector("#actor-2").value,
    actorSecondGender: getGender(".actor-2-voice"),
    text: document.querySelector("#script-draft").value,
    title: document.querySelector("#save-title").value,
    id: generateScriptId()
  };
  scripts.push(scriptData);
  localStorage.setItem("scriptData", JSON.stringify(scripts));
  document.querySelector("#modal-save").style.display = "none";
});

// document.querySelector("#ls").addEventListener("click", () => {
//   const script = JSON.parse(localStorage.getItem("scriptData"));
//   setGender(".actor-1-voice", script.actorFirstGender);
//   setGender(".actor-2-voice", script.actorSecondGender);
//   document.querySelector("#actor-1").value = script.actorFirstName;
//   document.querySelector("#actor-2").value = script.actorSecondName;
//   document.querySelector("#actor-1-select").dataset.gender = script.actorFirstGender;
//   document.querySelector("#actor-2-select").dataset.gender = script.actorSecondGender;
//   document.querySelector("#actor-1-select").innerText = script.actorFirstName;
//   document.querySelector("#actor-2-select").innerText = script.actorSecondName;
//   document.querySelector("#actor-1-select").value = "actor-1";
//   document.querySelector("#actor-2-select").value = "actor-2";
//   document.querySelector("#draft").value = script.text;
//   handleText();
//   document.querySelector(".modal-wrapper").style.display = "none";
// });

function updateActors(actor1, actor2, gender1, gender2, folderNumber, scriptContent) {
  setGender(".actor-1-voice", gender1);
  setGender(".actor-2-voice", gender2);
  document.querySelector("#actor-1").value = actor1;
  document.querySelector("#actor-2").value = actor2;
  document.querySelector("#actor-1-select").dataset.gender = gender1;
  document.querySelector("#actor-2-select").dataset.gender = gender2;
  document.querySelector("#actor-1-select").innerText = actor2;
  document.querySelector("#actor-2-select").innerText = actor1;
  document.querySelector("#actor-1-select").value = "actor-1";
  document.querySelector("#actor-2-select").value = "actor-2";
  document.querySelector("#script-draft").value = scriptContent;
  folder = folderNumber;
  handleText();

  document.querySelector("#modal-load").style.display = "none";
}

// document.querySelector('#ls').addEventListener('click', () => {
//   const script = JSON.parse(localStorage.getItem('scriptData'));
//   updateActors(script.actorFirstName, script.actorSecondName, script.actorFirstGender, script.actorSecondGender, 11, script.text);
// });

function addScriptButtons() {
  const scripts = JSON.parse(localStorage.getItem("scriptData"));
  document.querySelector('#load-list-custom').innerHTML = '';
  if (scripts) {
    scripts.forEach(element => {
      const div = document.createElement("div");
      div.classList = `modal-button-wrapper`;
      div.id = `${element.id}`;
      const button = document.createElement("button");
      button.classList = `button modal-button`;
      button.textContent = `${element.title}`;
      div.appendChild(button);
      document.querySelector('#load-list-custom').appendChild(div);
      button.addEventListener("click", () => {
        updateActors(element.actorFirstName, element.actorSecondName, element.actorFirstGender, element.actorSecondGender, 0, element.text);
      });
      deleteScriptButton(div, element.id);
    });
  }
}

document.querySelector("#s11").addEventListener("click", () => {
  updateActors("Лео", "Пейдж", "male", "female", 11, sc11);
});

document.querySelector("#s12").addEventListener("click", () => {
  updateActors("Лена", "Алексей", "female", "male", 12, sc12);
});

document.querySelector("#s13").addEventListener("click", () => {
  updateActors("Джена", "Бэка", "female", "female", 13, sc13);
});

document.querySelector("#s14").addEventListener("click", () => {
  updateActors("Папа", "Тим", "male", "male", 14, sc14);
});



const generateScriptId = () => Date.now();


function deleteScriptButton(div, scriptId) {
  const button = document.createElement("button");
  button.classList = `modal-delete`;
  button.title = `удалить сценарий`;
  button.addEventListener("click", () => {
    deleteScriptFromLS(scriptId);
    deleteScriptFromDOM(scriptId)
  });
  div.appendChild(button);
}


function deleteScriptFromLS(scriptId){
  const oldArrayScripts = JSON.parse(localStorage.getItem("scriptData"));
  const newArrayScripts = oldArrayScripts.filter(item => item.id !== scriptId);
  localStorage.setItem("scriptData", JSON.stringify(newArrayScripts));
}


function deleteScriptFromDOM(scriptId){
  document.getElementById(scriptId).remove();
}