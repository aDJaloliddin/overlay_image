// run fucntion when page loaded
function myFunction() {
  // get load btns
  const loadBtns = document.querySelectorAll('.loadBtns input[type="file"]');
  let dragTarget;
  let draggable=false;
  loadBtns.forEach((el, i) => {
    // handle file load event
    el.addEventListener("change", function (evt) {
      changeEventHandler(evt.target.files[0], el, i);
    });
  });

  // handle drag n drop event
  function MouseDownDrag(event) {
    // (1) start the process
    dragTarget = this;

    // if draggable is off or target doesn't foreGraph class then stop
    if(!draggable || !dragTarget.classList.contains("foreGraph")) return false;

    // else continue
    // set initial shift of the element relative to the pointer
    let shiftX = event.clientX - dragTarget.getBoundingClientRect().left;
    let shiftY = event.clientY - dragTarget.getBoundingClientRect().top;

    // (2) prepare to moving: make absolute and on top by z-index
    dragTarget.style.position = "absolute";
    dragTarget.style.zIndex = 10;
    // move it out of any current parents directly into body
    // to make it positioned relative to the body
    document.body.append(dragTarget);
    // ...and put that absolutely positioned ball under the pointer

    moveAt(event.pageX, event.pageY);

    // centers the ball at (pageX, pageY) coordinates
    function moveAt(pageX, pageY) {
      dragTarget.style.left = pageX - shiftX + "px";
      dragTarget.style.top = pageY - shiftY + "px";
    }

    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }

    // (3) move the ball on mousemove
    document.addEventListener("mousemove", onMouseMove);

    // (4) drop the ball, remove unneeded handlers
    dragTarget.onmouseup = function() {
      document.removeEventListener("mousemove", onMouseMove);
      dragTarget.onmouseup = null;
      draggable=false;
    };
    // he browser has its own Drag’n’Drop for images and some other elements that runs
    //  automatically and conflicts with ours
    // To disable it:
    dragTarget.ondragstart = function() {
      return false;
    };
  }

  document.onpaste = function (event) {
    let items = (event.clipboardData || event.originalEvent.clipboardData)
      .items;

    for (let index in items) {
      let item = items[index];
      if (item.kind === "file") {
        const file = item.getAsFile();
        let elem = document.querySelector('#file-2');
        changeEventHandler(file, elem, 1);
      }
    }
  };

  function changeEventHandler(file, element, index) {
    // let file = file; // File object
    let image;
    // parent element to make image resizable
    let resizeBox = document.querySelector("#" + "resizeBox-" + (index + 1));
    // if resizeBox was found
    if (resizeBox) {
      // image exists
      image = resizeBox.querySelector("img");
    } else {
      // image doesn't exist
      image = document.createElement("img");
      resizeBox = document.createElement("div");
      resizeBox.id = "resizeBox-" + (index + 1);
      resizeBox.insertAdjacentElement("beforeend", image);
      // drag and drop event
      resizeBox.addEventListener("mousedown", MouseDownDrag);
      // for the resize event to work you must
      // toggle off the drag event by double click on element
      resizeBox.addEventListener("dblclick", function () {
        draggable = !draggable;
      });
    }
    // loading image
    image.src = URL.createObjectURL(file);

    // check if element has file-1 id
    if (element.id === "file-1") {
      // if so image is background graph
      resizeBox.classList.add("backGraph");
    } else {
      // if not image is foreground graph
      resizeBox.classList.add("foreGraph");

      let slider = document.querySelector("#opacity");
      if (!slider) {
        slider = document.createElement("input");
      }
      slider.setAttribute("type", "range");
      slider.setAttribute("min", 0);
      slider.setAttribute("max", 100);
      slider.setAttribute("id", "opacity");
      slider.setAttribute("value", "100");
      slider.setAttribute("class", "slider");
      slider.style.bottom = "10px";
      slider.oninput = function () {
        image.style.opacity = (this.value / 100).toString();
      };

      let sliderOpacity = document.querySelector("#rotate");
      if (!sliderOpacity) {
        sliderOpacity = document.createElement("input");
      }
      sliderOpacity.setAttribute("type", "range");
      sliderOpacity.setAttribute("min", 0);
      sliderOpacity.setAttribute("max", 360);
      sliderOpacity.setAttribute("id", "rotate");
      sliderOpacity.setAttribute("value", "0");
      sliderOpacity.setAttribute("class", "slider");
      sliderOpacity.style.bottom = "10px";
      sliderOpacity.oninput = function () {
        resizeBox.style.transform = "rotate(" + this.value + "deg)";
      };

      let openCropImageModalBtn = document.querySelector("#openCropImageModalBtn");
      if (!openCropImageModalBtn) {
        openCropImageModalBtn = document.createElement("input");
      }
      openCropImageModalBtn.setAttribute("type", "button");
      openCropImageModalBtn.setAttribute("id", "openCropImageModalBtn");
      openCropImageModalBtn.setAttribute("value", "Start Cropping");
      openCropImageModalBtn.setAttribute("class", "open-modal-btn");
      openCropImageModalBtn.setAttribute("onclick", "openCropImageModal()");

      // Old version
      // document
      //   .getElementsByTagName("body")[0]
      //   .insertAdjacentElement("beforeend", slider);
      // document
      //   .getElementsByTagName("body")[0]
      //   .insertAdjacentElement("beforeend", sliderOpacity);
      // document
      //   .getElementsByTagName("body")[0]
      //   .insertAdjacentElement("beforeend", openCropImageModalBtn );
      
      // New version
      document
        .querySelector(".control-actions-list")
        .appendChild(slider);
      document
        .querySelector(".control-actions-list")
        .appendChild(sliderOpacity);
      document
        .querySelector(".control-actions-list")
        .appendChild(openCropImageModalBtn);
    }
    // add image to page
    document
      .querySelector(".app .main")
      .insertAdjacentElement("beforeend", resizeBox);
  }
};