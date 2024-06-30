// document.querySelector('#handle').addEventListener('click', handleText);
document.querySelector('#goBack').addEventListener('click', goBack);
document.querySelector('#goRestart').addEventListener('click', goRestart);
document.querySelector('#actor-1').addEventListener('keyup', handleText)
document.querySelector('#actor-2').addEventListener('keyup', handleText)
document.querySelector('#script-draft').addEventListener('keyup', handleText)

function handleText() {
  const paragraphs = splitByParagraphs(document.querySelector('#script-draft').value);
  const firstActor = document.querySelector('#actor-1').value;
  const secondActor = document.querySelector('#actor-2').value;
  wrapReplicaByDiv(paragraphs, firstActor, secondActor);
  entryActorData();
  allowRehearsal();
}


function wrapReplicaByDiv(arrayOfLines, firstActor = '_', secondActor = '_') {
  document.querySelector('#script-redacted').innerHTML = '';
  arrayOfLines.forEach(line => {
    const divEl = document.createElement('div');
    divEl.textContent = line;
    const whichActor = checkLineStartsWith(line, firstActor, secondActor);

    if (whichActor == 1) divEl.classList.add('actor-1');
    if (whichActor == 2) divEl.classList.add('actor-2');
    if (whichActor == 0) divEl.classList.add('author');
    document.querySelector('#script-redacted').appendChild(divEl);
  });
  deleteEmptyNodes('#script-redacted div');
  /*=SR=*/  inputStrings = document.querySelectorAll('#script-redacted div');  /*=SR=*/
  /*=SR=*/  [listA, listB] = transformStringsToArray(Array.from(inputStrings));  /*=SR=*/
}


function checkLineStartsWith(line, firAct, SecAct) {
  if (line.startsWith(`${firAct}.`) || line.startsWith(`${firAct} (`)) return 1;
  if (line.startsWith(`${SecAct}.`) || line.startsWith(`${SecAct} (`)) return 2;
  return 0;
}


let myName = '';
let myVoice = '';
let myRole = 'actor-2';
let partnerName = 'name';
let partnerVoice = 'sasha';
let partnerRole = 'actor-1';
let replicaCount = 0;
let isHandle = false;

function entryActorData() {
  setGender('.actor-1-voice', getGender('.actor-1-voice'));
  setGender('.actor-2-voice', getGender('.actor-2-voice'));
  document.querySelector('#actor-1').value = document.querySelector('#actor-1').value;
  document.querySelector('#actor-2').value = document.querySelector('#actor-2').value;
  document.querySelector('#actor-1-select').dataset.gender = getGender('.actor-1-voice');
  document.querySelector('#actor-1-select').innerText = document.querySelector('#actor-1').value;
  document.querySelector('#actor-1-select').value = 'actor-1';
  document.querySelector('#actor-2-select').dataset.gender = getGender('.actor-2-voice');
  document.querySelector('#actor-2-select').innerText = document.querySelector('#actor-2').value;
  document.querySelector('#actor-2-select').value = 'actor-2';
}

document.querySelector('#rehearsal').addEventListener('click', () => {
  replicaCount = 0;
  document.querySelector('#speechRecognitionSwitch').style.display = "block";
  document.querySelector('#control-panel').style.display = "flex";
  document.querySelector('.interface').style.display = "none";
  document.querySelector('#script-redacted').classList.add('rehearsal-mode');
  choseActor();
  const partnerReplicas = document.querySelectorAll(`.${partnerRole}`);
  textarea.value = (partnerReplicas[replicaCount].outerText).replace(partnerName, '');
  simulateInputEvent(textarea);
  /*=SR=*/  speechStatus = true;  /*=SR=*/
});


document.querySelector('#textSpeaker').addEventListener('click', () => goNext())


function goNext() {
  if (document.querySelector('#script-redacted').innerText != '') {
  const partnerReplicas = document.querySelectorAll(`.${partnerRole}`);
  const textarea = document.querySelector('#textarea');
  console.log(replicaCount < partnerReplicas.length, replicaCount, partnerReplicas.length);
  handleButtonClick(partnerReplicas[replicaCount]);
  if (replicaCount < partnerReplicas.length - 1) replicaCount++;
  textarea.value = (partnerReplicas[replicaCount].outerText).replace(partnerName, '');
  textarea.focus();
  simulateInputEvent(textarea);
  selectOptionByValue(partnerVoice);
  }
}


function handleButtonClick(partnerReplicas) {
  partnerReplicas.classList.add('active');
  partnerReplicas.scrollIntoView({ block: "center", behavior: "smooth" });
}

function simulateInputEvent(element) {
  // Имитация Input, обязательна для работы!
  element.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
}


function choseActor() {
  const selectElement = document.querySelector('#select-actor');
  const options = selectElement.querySelectorAll('option');
  const optionsArray = Array.from(options);
  const selectedOption = optionsArray.find(option => option.selected);

  partnerName = selectedOption.innerText;
  partnerRole = selectedOption.value;
  partnerVoice = selectedOption.dataset.gender == 'male' ? 'anton_samokhvalov' : 'sasha';
  compensator = document.getElementById('actor-1-select').selected ? 1 : 0;
  selectOptionByValue(partnerVoice);
}


document.querySelector('#select-actor').addEventListener('change', function(event) {
  const selectedValue = event.target.value;
  /*=SR=*/  currentActor = selectedValue == 'actor-1' ? presetA : presetB;  /*=SR=*/
  /*=SR=*/  currentActor = selectedValue == 'actor-2' ? presetB : presetA;  /*=SR=*/
  /*=SR=*/  ownLinesResult = currentActor.actorSpeech == 'A' ? listB : listA;  /*=SR=*/
  /*=SR=*/  partnerResults = currentActor.actorSpeech == 'A' ? listA : listB;  /*=SR=*/
  choseActor();
  goRestart();
});


function getGender(actVoi) {
  let val;
  document.querySelectorAll(actVoi).forEach((elem) => {
    if (elem.checked) val = elem.value;
  });
  return val;
}


function setGender(actVoi, voice) {
  document.querySelectorAll(actVoi).forEach((elem) => {
    if (voice == elem.value) elem.checked = true;
  });
}


function selectOptionByValue(value) {
  // Имитируем событие 'change' для выбора голоса.  ['ermil']
  const selectModel = document.getElementById('ttsModel');
  for (const option of selectModel.options) {
    if (option.value === value) {
      option.selected = true; break;
    }
  }
  selectModel.dispatchEvent(new Event('change')); 
}


function goBack() {
  goRestart();
  document.querySelector('#speechRecognitionSwitch').style.display = "none";
  document.querySelector('#control-panel').style.display = "none";
  document.querySelector('.interface').style.display = "flex";
  document.querySelector('#script-redacted').classList.remove('rehearsal-mode');
  document.querySelector(`.interface`).scrollIntoView({ block: "center", behavior: "smooth" });
  /*=SR=*/  speechStatus = false;  /*=SR=*/
}


function goRestart() {
  replicaCount = 0;
  document.querySelectorAll('.active').forEach(el => el.classList.remove('active'));
  const partnerReplicas = document.querySelectorAll(`.${partnerRole}`);
  textarea.value = (partnerReplicas[replicaCount].outerText).replace(partnerName, '');
  simulateInputEvent(textarea);
}


function splitByParagraphs(text) { return text.split('\n').map(paragraph => paragraph.trim()); }

function deleteEmptyNodes(listEl) {
  document.querySelectorAll(listEl).forEach(div => { if (!div.textContent.trim()) div.remove(); });
}

// [200, 7600]



// enterFullScreen(document.documentElement);
function enterFullScreen(docEl) {
  if (docEl.requestFullscreen)            { docEl.requestFullscreen();       } 
  else if (docEl.webkitRequestFullscreen) { docEl.webkitRequestFullscreen(); } 
  else if (docEl.msRequestFullscreen)     { docEl.msRequestFullscreen();     } 
  else if (docEl.mozRequestFullScreen)    { docEl.mozRequestFullScreen();    }
}
function closeFullscreen() {
  if (document.exitFullscreen)            { document.exitFullscreen();       } 
  else if (document.webkitExitFullscreen) { document.webkitExitFullscreen(); } 
  else if (document.mozCancelFullScreen)  { document.mozCancelFullScreen();  } 
  else if (document.msExitFullscreen)     { document.msExitFullscreen();     }
}

// document.addEventListener('keydown', function(event) {
//   if (event.code === 'Space') {
//     console.log('Нажали Space');
//     goNext();
//   }
// });

document.querySelector('#script-redacted').addEventListener('click', () => {
  console.log('Кликнули на экран');
  goNext();
});





// Баг, когда жмёшь стоп, счётчик увеличивается.
// Синхронизировать счётчик для читалки и говорилки.
// В селекте  должна быть текущая роль. 


function allowRehearsal(){
  let act1 = false;
  let act2 = false;
  const sr = document.querySelector('#script-redacted');
  const srList = sr.querySelectorAll('div');
  srList.forEach(element => {
    if(element.classList.contains('actor-1')) act1 = true
    if(element.classList.contains('actor-2')) act2 = true
  });
  if (act1 && act2) {
    document.querySelector('#rehearsal').removeAttribute('disabled');
  } else {
    document.querySelector('#rehearsal').setAttribute('disabled', 'disabled');
  }
}











let compensator = 0;
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var speechSwitch = document.getElementById('speechRecognitionSwitch');
var speechBtn = document.getElementById('speechRecognitionBtn');
speechBtn.addEventListener('click', testSpeech);
setInterval(() => {if (speechSwitch.checked) speechBtn.click()}, 500);


function testSpeech() {
  speechBtn.disabled = true;

  var recognition = new SpeechRecognition();
  var speechRecognitionList = new SpeechGrammarList();
  recognition.grammars = speechRecognitionList;
  recognition.lang = 'ru-Ru';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();


  let lastWord = '_';
  /*=SR=*/  ownLinesResult = currentActor.actorSpeech == 'A' ? listB : listA;  /*=SR=*/
  /*=SR=*/  partnerResults = currentActor.actorSpeech == 'A' ? listA : listB;  /*=SR=*/
  const partnerReplicas = partnerResults;
  if (partnerReplicas[replicaCount - compensator]) {
    const cleanedSentence = removePunctuation(partnerReplicas[replicaCount  - compensator].innerText)
    lastWord = getLastWord(cleanedSentence);
  }

  console.log(replicaCount, lastWord);

  recognition.onresult = function (event) {
    var speechResult = event.results[0][0].transcript.toLowerCase();
    if (speechResult.includes('начинай')) startDialog();
    if (speechResult.includes('сначала')) startDialog();
    if (speechResult.includes('дальше')) nextReplica();
    if (speechResult.includes(lastWord)) nextReplica();
    if (speechResult.includes('повтори')) repeatReplica();
    if (speechResult.includes('подскажи')) tellMe();
    console.log(speechResult, lastWord);
    console.log('Confidence: ' + event.results[0][0].confidence);
  }

  recognition.onspeechend = function () {
    recognition.stop();
    speechBtn.disabled = false;
  }

  recognition.onerror = () => speechBtn.disabled = false;
}





function startDialog() {
  replicaCount = 0;
  playReplica(currentActor.partnerSpeech);
  document.querySelectorAll('.active').forEach(el => el.classList.remove('active'));
  const partnerReplicas = document.querySelectorAll(`.${partnerRole}`);
  partnerReplicas[replicaCount].classList.add('active');
  replicaCount++;
  console.log('Начинаю')
}


let folder = 12;
let speechStatus = false;
let listA, listB;
let inputStrings;
let ownLinesResult;
let partnerResults;

const presetA = { actorSpeech: 'B', actorText: 'B', partnerSpeech: 'A'}
const presetB = { actorSpeech: 'A', actorText: 'A', partnerSpeech: 'B'}
let currentActor = presetA;
let currentPartner = presetB;

function nextReplica() {
  if (replicaCount < ownLinesResult.length && ownLinesResult[replicaCount].innerText != undefined) {
    playReplica(currentActor.partnerSpeech);
    handleButtonClick(ownLinesResult[replicaCount]);
    replicaCount++;
  } else if (replicaCount < ownLinesResult.length) { replicaCount++; }
  console.log('Следующая реплика')
}


function repeatReplica() {
  playReplica(currentActor.partnerSpeech);
  console.log('Повторяю')
}


function tellMe() {
  if (replicaCount > 0) {
    replicaCount -= compensator;
    playReplica(currentActor.actorSpeech);
    replicaCount += compensator;
    console.log('Подсказываю')
  } else { console.log('Вы начинате') }
}


function playReplica(speaker) {
  const audio = document.querySelector('#audio');
  audio.src = `audio/${folder}/${speaker}${replicaCount + 1}.mp3`;
  
  audio.addEventListener('canplaythrough', () => audio.play());

  audio.addEventListener('error', () => {
    console.log('Аудиофайл не найден или не загружен!');
    audio.src = `audio/signal.mp3`;
    audio.play();
  });
}


function removePunctuation(sentence) {
  return sentence.replace(/[.,\/#!$?%\^&\*;:{}=\-_`~()]/g,"").replace(/\s{2,}/g," ").trim();
}

function getLastWord(sentence) { return sentence.trim().split(' ').pop().toLowerCase(); }







// function transformStringsToArray(strings) {
//   const listA = [];
//   const listB = [];
//   let lastA = false;
  
//   strings.forEach(str => {
//     if (str.classList.contains('actor-1')) {
//       listA.push(str);
//       if (lastA) listB.push('');
//       lastA = true;
//     } else if (str.classList.contains('actor-2')) {
//       listB.push(str);
//       lastA = false;
//     }
//   });

//   if (lastA) listB.push(''); 
//   while (listB.length < listA.length) { listB.push('') }
//   return [listA, listB];
// }

function transformStringsToArray(strings) {
  const listA = [];
  const listB = [];
  let currentActor = null;

  strings.forEach(str => {
    if (str.classList.contains('actor-1')) {
      listA.push(str);
      currentActor = 'actor-1';
    } else if (str.classList.contains('actor-2')) {
      listB.push(str);
      currentActor = 'actor-2';
    } else if (currentActor === 'actor-1') {
      listB.push('');
    }
  });

  return [listA, listB];
}
