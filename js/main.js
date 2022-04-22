/*********************
// Main
*********************/

/********* Switch Color Mode *********/

document.querySelector('[data-switch-color]').addEventListener('click', function () {
  document.body.classList.toggle('dark-mode');
  document.querySelectorAll('.switch-color-mode__svg').forEach(elem => {
    elem.classList.toggle('active');
  });
});


/*********************
// Steps Navigation
*********************/

/********* On Scroll : Slider Steps (gsap) *********/

// TODO : Fix bug to scroll with trackpage (2 step pass instead of 1)
// TODO : Fix superposing steps with summary nav

var currentIndex = 0;
var isAllowScroll = true;
var isAllowClick = true;
var wheelEvents = [];
var prevTime;
var steps = document.querySelectorAll('.step');

window.addEventListener('wheel', handleWheel, {
  passive: false
});

function handleWheel(e) {
  e.preventDefault();

  var time = new Date().getTime();
  var value = e.wheelDelta;
  var delta = Math.max(-1, Math.min(1, value));
  var isVertical = Math.abs(e.wheelDeltaX) < Math.abs(e.wheelDelta);

  if (wheelEvents.length > 149) {
    wheelEvents.shift();
  }

  wheelEvents.push(Math.abs(value));

  var timeDiff = time - prevTime;
  prevTime = time;

  if (timeDiff > 200) {
    wheelEvents = [];
  }

  if (isAllowScroll) {
    var averageEnd = getAverage(wheelEvents, 10);
    var averageMiddle = getAverage(wheelEvents, 70);
    var isAccelerating = averageEnd >= averageMiddle;

    if (isVertical && isAccelerating) {
      if (delta < 0) {
        update(currentIndex + 1);
      } else {
        update(currentIndex - 1);
      }
    }
  }
}

function update(index) {

  if (index >= 0 && index < steps.length) {
    // Update Header Summary
    const summaryItems = document.querySelectorAll('.header__summary-item');
    summaryItems.forEach((elem, elemIndex) => {
      if (elemIndex < index) {
        elem.classList.remove('active');
        elem.classList.remove('passed');
        elem.classList.add('passed');
      } else if (elemIndex == index) {
        elem.classList.remove('active');
        elem.classList.remove('passed');
        elem.classList.add('active');
      } else if (elemIndex > index) {
        elem.classList.remove('active');
        elem.classList.remove('passed');
      }
    });

    // Update Main Nav style
    if (index > 0) {
      document.querySelector('.header__nav-up').classList.add('active');
    } else {
      document.querySelector('.header__nav-up').classList.remove('active');
    }
    if (index < (steps.length - 1)) {
      document.querySelector('.header__nav-down').classList.add('active');
    } else {
      document.querySelector('.header__nav-down').classList.remove('active');
    }

    if (index < 0 || index >= steps.length) {
      return;
    }

    // Upadte Steps style
    steps[currentIndex].classList.remove('show');
    steps[index].classList.add('show');

    isAllowScroll = false;
    isAllowClick = false;

    var direction = index > currentIndex ? '-' : '+';
    gsap.to([steps[currentIndex], steps[index]], 1, {
      y: direction + '=100%',
      ease: 'power2.out',
      onComplete: function () {

        isAllowScroll = true;
        isAllowClick = true;

        // Update Header Step number
        document.querySelector('.header__step-current').innerHTML = `${index + 1}`;

      }
    });

    currentIndex = index;
  }

}

function getAverage(elements, number) {
  var sum = 0;
  var lastElements = elements.slice(Math.max(elements.length - number, 1));

  for (var i = 0; i < lastElements.length; i++) {
    sum = sum + lastElements[i];
  }

  return Math.ceil(sum / number);
}


/********* On Nav Click : Slider steps (gsap) *********/

// On Click Next
const btnStepNext = document.querySelectorAll('[data-step-next]');
btnStepNext.forEach((el) => {
  el.addEventListener('click', function (event) {
    event.preventDefault();
    if (isAllowClick) {
      update(currentIndex + 1);
    }
  })
});

// On Click Prev
const btnStepPrev = document.querySelectorAll('[data-step-prev]');
btnStepPrev.forEach((el) => {
  el.addEventListener('click', function (event) {
    event.preventDefault();
    if (isAllowClick) {
      update(currentIndex - 1);
    }
  })
});


/********* On Swipe : Slider steps (gsap) *********/

const stepsWrapper = document.querySelector('.main-content');
swipedetect(stepsWrapper, function (swipedir) {
  if (isAllowClick && swipedir == 'up') {
    update(currentIndex + 1);
  } else if (isAllowClick && swipedir == 'down') {
    update(currentIndex - 1);
  }
})


/********* On Key Down : Slider steps (gsap) *********/

document.onkeydown = checkKey;

function checkKey(e) {

  if (isAllowClick) {

    e = e || window.event;

    if (e.keyCode == '38') {
      // up arrow
      update(currentIndex - 1);
    }
    else if (e.keyCode == '40') {
      // down arrow
      update(currentIndex + 1);
    }
    else if (e.keyCode == '37') {
      // left arrow
      update(currentIndex - 1);
    }
    else if (e.keyCode == '39') {
      // right arrow
      update(currentIndex + 1);
    }

  }

}


/********* Summary Nav : Slider steps (gsap) *********/

const summaryLinks = document.querySelectorAll('.step-2__summary-item-link');
summaryLinks.forEach((el) => {
  el.addEventListener('click', function (event) {
    
    event.preventDefault();
    const nbStepsToPass = Number(el.getAttribute("nb-steps-to-pass"));

    update(currentIndex + nbStepsToPass);

    steps.forEach((el, index) => {
      if (index > 0 && index <= nbStepsToPass) {
        gsap.to([steps[index]], 1, {
          y: '-200%'
        });
      }
    });
    
  })
});


/*********************
// Steps Content
*********************/

/********* Step 1 : Experimental Pattern *********/

// Generate Items inside Pattern

let patternWidth = document.querySelector('.step-1__pattern-wrap').offsetWidth;
let patternHeight = document.querySelector('.step-1__pattern-wrap').offsetHeight;

let itemsPerRow = Math.floor(patternWidth / 64);
let itemsPerColumn = Math.floor(patternHeight / 64);

let nbItems = itemsPerRow * itemsPerColumn;


function insertItemsToPattern(nbItems) {

  let pattern = document.querySelector('.step-1__pattern-wrap');

  while (nbItems > 0) {

    let item = document.createElement('div');
    item.classList.add('step-1__pattern-item');
    let itemInner = document.createElement('div');
    itemInner.classList.add('step-1__pattern-item-inner');
    item.appendChild(itemInner);

    pattern.appendChild(item);

    nbItems--;
  }

}

insertItemsToPattern(nbItems);
