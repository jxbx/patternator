const smallContainer = document.getElementById("smallContainer");
const bigContainer = document.getElementById("bigContainer");
const gridItems = document.getElementsByClassName("item");
const box = document.getElementById("box");
const alternating = document.getElementById("alternating");
const spacing = 300;

let coordinates = [];
let svgReady;

let state = {
  character:null,
  fontWeight: null,
  fontSize: null,
  dropShadow: null,
  zoom: null,
  angle: null,
  alternating: null,
  color0: null,
  color1: null,
  color2: null,
}

//DOM elements

const angle = document.getElementById("angle");
const angleValue = document.getElementById("angleValue");
angle.addEventListener("input", display);

const dropShadow = document.getElementById("dropShadow");
const dropShadowValue = document.getElementById("dropShadowValue");
dropShadow.addEventListener("input", display);

const fontSize = document.getElementById("fontSize");
const fontSizeValue = document.getElementById("fontSizeValue");
fontSize.addEventListener("input", display);

const fontWeight = document.getElementById("fontWeight");
const fontWeightValue = document.getElementById("fontWeightValue");
fontWeight.addEventListener("input", display);

const zoom = document.getElementById("zoom");
const zoomValue = document.getElementById("zoomValue");
zoom.addEventListener("input", display);

const characterInput = document.getElementById("characterInput");
characterInput.addEventListener("input", display);

//generate SVG coordinates for the text elements that make up the pattern

function generateCoordinates() {
  let min = -150;
  for (let y=0; y<3; y++){
    for (let x=0; x<3; x++){
      let item = [];
      item.push(min + 150*x);
      item.push(min + 150*y);
      coordinates.push(item);
    }
  }
}

//applies styles to text elements, crops out a repeating tile using viewbox, and returns an array including code for inline svg and css background;

function generateSvg() {

    while (smallContainer.childNodes.length > 2) {
      smallContainer.removeChild(smallContainer.lastChild);
    }

    coordinates = [];
    generateCoordinates();

    for (let i=0; i<9; i++){
      const shape = document.createElementNS('http://www.w3.org/2000/svg',"text");
      shape.setAttributeNS(null, "id", "item"+i);
      shape.setAttributeNS(null, "x", coordinates[i][0]);
      shape.setAttributeNS(null, "y", coordinates[i][1]);
      shape.setAttributeNS(null, "class", "item");
      const text  = document.createTextNode(characterInput.value);
      shape.appendChild(text);
      smallContainer.appendChild(shape);
    }

    for (const item of gridItems){
      state.dropShadow <= 0 ? item.style.filter = null : item.style.filter = "drop-shadow("+ state.dropShadow +"px 0 " + state.color2 + ")";

      item.style.fontSize = state.fontSize + "px";
      item.style.fontWeight = state.fontWeight;
      item.style.fill = state.color1;
      item.style.transformBox = "fill-box";
      item.style.transformOrigin = "center";
      item.style.textAnchor = "middle";
      item.style.dominantBaseline = "middle";
      item.style.fontFamily = "Raleway";
    }
    for (let i=0; i<9; i++){
      if (alternating.checked && i%2 === 0){
        gridItems[i].style.transform = null;
      }
      else {
        gridItems[i].style.transform = "rotate("+angle.value+"deg)";
      }
    }


  smallContainer.setAttributeNS(null, "viewBox", -0.5*spacing + " " + -0.5*spacing + " " + spacing + " " + spacing);


  let svgOutput = btoa(smallContainer.outerHTML);
  let svgOutputArray = []

  svgOutputArray.push("background-image: url(\'data:image/svg+xml;base64," + svgOutput + "\'); background-size: " + zoom.value + "px;");
  svgOutputArray.push(svgOutput);

  return svgOutputArray;
}


//updates state, updates DOM sliders, calls generateSvg() and displays pattern as background

function display() {

  dropShadowValue.innerHTML = dropShadow.value;
  fontSizeValue.innerHTML = fontSize.value;
  fontWeightValue.innerHTML = fontWeight.value;
  zoomValue.innerHTML = zoom.value;
  angleValue.innerHTML = angle.value;

  state.character = characterInput.value;
  state.angle = angle.value;
  state.dropShadow = dropShadow.value;
  state.fontSize = fontSize.value;
  state.fontWeight = fontWeight.value;
  state.zoom = zoom.value;
  state.alternating = alternating.checked;

  // state.colour0 = picker0.color.rgbaString;
  // state.colour1 = picker1.color.rgbaString;
  // state.colour2 = picker2.color.rgbaString;

  svgReady = generateSvg();

 document.body.setAttribute("style", svgReady[0]);
}


const parent0 = document.getElementById('parent0');
const picker0 = new Picker({
  parent: parent0,
  color: "#2197ac",
  popup: "bottom",
  alpha: false,
  onChange: function (color) {
    smallContainer.style.backgroundColor = color.rgbaString;
    parent0.style.backgroundColor = color.rgbaString;
    state.color0 = color.rgbaString;
    display();
    }
  });

const parent1 = document.getElementById("parent1");
const picker1 = new Picker({
  parent: parent1,
  color: "#f45555ff",
  popup: "bottom",
  onChange: function (color) {
    for (const item of gridItems){
      item.style.fill = color.rgbaString;
    }
    parent1.style.backgroundColor = color.rgbaString;
    state.color1 = color.rgbaString;
    display();
    }
  });

  const parent2 = document.getElementById("parent2");
  const picker2 = new Picker({
    parent: parent2,
    color: "#356969ff",
    popup: "bottom",
    onChange: function (color) {
      for (const item of gridItems){
          dropShadow.value <= 0 ? item.style.filter = null : item.style.filter = "drop-shadow("+dropShadow.value+"px 0" + color.hex +")";
      };
      parent2.style.backgroundColor = color.rgbaString;
      state.color2 = color.rgbaString;
      display();
      }
    });


const randomiseParameters = document.getElementById("randomiseParameters");

randomiseParameters.onclick = function() {
  dropShadow.value = Math.random()*100;
  angle.value = Math.random()*360;
  fontSize.value = Math.random()*300 + 50;
  fontWeight.value = Math.random()*800 + 100;
  zoom.value = Math.random()*480 + 20;
  characterInput.value = String.fromCharCode(Math.round(Math.random()*93)+33);
  alternating.checked = (Math.random() < 0.5) ? false : true;

  display();
}

const randomiseColors = document.getElementById("randomiseColors");

randomiseColors.onclick = function() {
  function newColor () {
    let letters = '0123456789ABCDEF'.split('');
    let color = '#';
    for (let i = 0; i < 6; i++ ) {
      color += letters[Math.round(Math.random() * 15)];
    }
    return color;
  }

  //setColor() is from the vanillapicker module;

  picker0.setColor(newColor());
  picker1.setColor(newColor());
  picker2.setColor(newColor());

  display();
}

const randomiseEverything = document.getElementById("randomiseEverything");

randomiseEverything.onclick = function() {
  randomiseColors.click();
  randomiseParameters.click();
}

const shareButton = document.getElementById("shareButton");

shareButton.onclick = function updateURL() {


  let newState =  JSON.stringify(state);
  window.location.hash = newState;
  navigator.clipboard.writeText(window.location.href)
    .then(()=>{
      alert("URL copied to clipboard");
    })
    .catch(()=>{
      alert("error");
    })
}

function loadState() {
  let string = window.location.hash.slice(1);
  if (string.length <= 0){
    state = stateLibrary[Math.floor(Math.random()*stateLibrary.length)];
  }
  else {
    state = JSON.parse(decodeURIComponent(string));
  }
    characterInput.value = state.character;
    angle.value = state.angle;
    dropShadow.value = state.dropShadow;
    fontSize.value = state.fontSize;
    fontWeight.value = state.fontWeight;
    zoom.value = state.zoom;
    alternating.checked = state.alternating;

    picker0.setColor(state.color0);
    picker1.setColor(state.color1);
    picker2.setColor(state.color2);

    display();

}

const downloadSVGButton = document.getElementById("downloadSVG");


function downloadSVG() {
  const blob = new Blob([bigContainer.innerHTML], { type: "image/svg+xml" });
  const objectUrl = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = "mypattern";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
}

const cssRepeat = document.getElementById("cssRepeat")
cssRepeat.onclick = function () {
  navigator.clipboard.writeText(svgReady[0])
  .then(()=>{
    alert("CSS copied to clipboard");
  })
  .catch(()=>{
    alert("error");
  })
}

// const inlineSvg = document.getElementById("inlineSvg")
// inlineSvg.onclick = function () {
//   navigator.clipboard.writeText(svgReady[1])
//   .then(()=>{
//     alert("CSS copied to clipboard");
//   })
//   .catch(()=>{
//     alert("error");
//   })
// }


let stateLibrary = [
  {
    "character": ":",
    "fontWeight": "440",
    "fontSize": "172",
    "dropShadow": "18",
    "zoom": "353",
    "angle": "271",
    "alternating": true,
    "color0": "rgba(37,158,89,1)",
    "color1": "rgba(82,170,48,1)",
    "color2": "rgba(198,212,36,1)"
},
{
    "character": "O",
    "fontWeight": "900",
    "fontSize": "219",
    "dropShadow": "0",
    "zoom": "500",
    "angle": "143",
    "alternating": true,
    "color0": "rgba(150,186,187,1)",
    "color1": "rgba(75,30,40,1)",
    "color2": "rgba(113,185,168,1)"
},
{
    "character": "<",
    "fontWeight": "100",
    "fontSize": "250",
    "dropShadow": "43",
    "zoom": "188",
    "angle": "184",
    "alternating": true,
    "color0": "rgba(140,74,74,1)",
    "color1": "rgba(81,211,150,1)",
    "color2": "rgba(84,119,171,1)"
},
{
    "character": "(",
    "fontWeight": "200",
    "fontSize": "250",
    "dropShadow": "13",
    "zoom": "205",
    "angle": "178",
    "alternating": true,
    "color0": "rgba(158,142,42,1)",
    "color1": "rgba(174,67,123,1)",
    "color2": "rgba(20,11,113,1)"
},

{
    "character": "A",
    "fontWeight": "100",
    "fontSize": "192",
    "dropShadow": "75",
    "zoom": "201",
    "angle": "0",
    "alternating": true,
    "color0": "rgba(120,68,42,1)",
    "color1": "rgba(172,67,130,1)",
    "color2": "rgba(235,21,20,1)"
}


];


window.addEventListener("load", loadState);
window.addEventListener("load", display);
alternating.addEventListener("change", display);
downloadSVGButton.addEventListener("click", downloadSVG);
