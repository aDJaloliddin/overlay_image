// run fucntion when page loaded
function myFunction() {
  // get load btns
  const loadBtns = document.querySelectorAll('.loadBtns input[type="file"]');
  let dragTarget;
  let draggable = false;
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
    if (!draggable || !dragTarget.classList.contains("foreGraph")) return false;

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
    dragTarget.onmouseup = function () {
      document.removeEventListener("mousemove", onMouseMove);
      dragTarget.onmouseup = null;
      draggable = false;
    };
    // he browser has its own Drag’n’Drop for images and some other elements that runs
    //  automatically and conflicts with ours
    // To disable it:
    dragTarget.ondragstart = function () {
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
        let elem = document.querySelector("#file-2");
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
    image.classList.add("no-tint");
    image.style.filter = "grayscale(0)";

    // check if element has file-1 id
    if (element.id === "file-1") {
      // if so image is background graph
      resizeBox.classList.add("backGraph");
    } else {
      // if not image is foreground graph
      resizeBox.classList.add("foreGraph");

      let sliderOpacity = document.querySelector("#opacity");
      if (!sliderOpacity) {
        sliderOpacity = document.createElement("input");
      }
      sliderOpacity.setAttribute("type", "range");
      sliderOpacity.setAttribute("min", 0);
      sliderOpacity.setAttribute("max", 100);
      sliderOpacity.setAttribute("id", "opacity");
      sliderOpacity.setAttribute("value", "100");
      sliderOpacity.setAttribute("class", "slider");
      sliderOpacity.oninput = function () {
        image.style.opacity = (this.value / 100).toString();
      };

      let sliderRotate = document.querySelector("#rotate");
      if (!sliderRotate) {
        sliderRotate = document.createElement("input");
      }
      sliderRotate.setAttribute("type", "range");
      sliderRotate.setAttribute("min", 0);
      sliderRotate.setAttribute("max", 360);
      sliderRotate.setAttribute("id", "rotate");
      sliderRotate.setAttribute("value", "0");
      sliderRotate.setAttribute("class", "slider");
      sliderRotate.oninput = function () {
        resizeBox.style.transform = "rotate(" + this.value + "deg)";
      };

      let sliderTint = document.querySelector("#slider-tint");
      if (!sliderTint) {
        sliderTint = document.createElement("input");
      }
      sliderTint.setAttribute("type", "range");
      sliderTint.setAttribute("min", 0);
      sliderTint.setAttribute("max", 100);
      sliderTint.setAttribute("id", "slider-tint");
      sliderTint.setAttribute("value", "100");
      sliderTint.setAttribute("class", "slider");
      sliderTint.style.bottom = "10px";
      sliderTint.oninput = function () {
        document.querySelector(
          ".foreGraph img"
        ).style.filter = `grayscale(100%) brightness(40%) sepia(${sliderTint.value}%) saturate(6) contrast(100%) hue-rotate(-50deg) invert(0)`;
      };

      let openCropImageModalBtn = document.querySelector(
        "#openCropImageModalBtn"
      );
      if (!openCropImageModalBtn) {
        openCropImageModalBtn = document.createElement("input");
      }
      openCropImageModalBtn.setAttribute("type", "button");
      openCropImageModalBtn.setAttribute("id", "openCropImageModalBtn");
      openCropImageModalBtn.setAttribute("value", "Start Cropping");
      openCropImageModalBtn.setAttribute("class", "open-modal-btn");
      openCropImageModalBtn.setAttribute("onclick", "openCropImageModal()");

      let toggleTintBtn = document.querySelector("#toggleTintBtn");
      if (!toggleTintBtn) {
        toggleTintBtn = document.createElement("input");
      }
      toggleTintBtn.setAttribute("type", "button");
      toggleTintBtn.setAttribute("id", "toggleTintBtn");
      toggleTintBtn.setAttribute("value", "Add Tint");
      toggleTintBtn.setAttribute("class", "toggle-tint-btn");
      toggleTintBtn.onclick = function () {
        const img = document.querySelector(".foreGraph img");
        if (img.classList.contains("no-tint")) {
          divForTint.style.display = "flex";
          sliderTint.value = "100";
          img.classList.remove("no-tint");
          img.style.filter =
            "grayscale(100%) brightness(40%) sepia(100%) saturate(6) contrast(100%) hue-rotate(-50deg) invert(0)";
          toggleTintBtn.setAttribute("value", "Remove Tint");
        } else {
          divForTint.style.display = "none";
          img.classList.add("no-tint");
          img.style.filter = "grayscale(0)";
          toggleTintBtn.setAttribute("value", "Add Tint");
        }
      };

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

      let divForOpacity = document.querySelector("#opacity-wrapper");
      let labelForOpacity = document.querySelector("#label-opacity");
      if (!divForOpacity) {
        divForOpacity = document.createElement("div");
        labelForOpacity = document.createElement("label");
      }
      labelForOpacity.textContent = "Opacity";
      labelForOpacity.setAttribute("id", "label-opacity");
      labelForOpacity.setAttribute("for", "opacity");
      divForOpacity.setAttribute("id", "opacity-wrapper");
      divForOpacity.classList.add("flex-box-vertical");
      divForOpacity.appendChild(sliderOpacity);
      divForOpacity.appendChild(labelForOpacity);

      let divForRotate = document.querySelector("#rotate-wrapper");
      let labelForRotate = document.querySelector("#label-rotate");
      if (!divForRotate) {
        divForRotate = document.createElement("div");
        labelForRotate = document.createElement("label");
      }
      labelForRotate.textContent = "Rotate";
      labelForRotate.setAttribute("id", "label-rotate");
      labelForRotate.setAttribute("for", "rotate");
      divForRotate.setAttribute("id", "rotate-wrapper");
      divForRotate.classList.add("flex-box-vertical");
      divForRotate.appendChild(sliderRotate);
      divForRotate.appendChild(labelForRotate);

      let divForTint = document.querySelector("#tint-wrapper");
      let labelForTint = document.querySelector("#label-tint");
      if (!divForTint) {
        divForTint = document.createElement("div");
        labelForTint = document.createElement("label");
      }
      labelForTint.textContent = "Tint";
      labelForTint.setAttribute("for", "tint");
      labelForTint.setAttribute("id", "label-tint");
      divForTint.setAttribute("id", "tint-wrapper");
      divForTint.classList.add("flex-box-vertical");
      divForTint.style.display = "none";
      divForTint.appendChild(sliderTint);
      divForTint.appendChild(labelForTint);

      // New version
      document
        .querySelector(".control-actions-list")
        .appendChild(divForOpacity);
      document.querySelector(".control-actions-list").appendChild(divForRotate);
      document.querySelector(".control-actions-list").appendChild(divForTint);
      document
        .querySelector(".control-actions-list")
        .appendChild(toggleTintBtn);
      document
        .querySelector(".control-actions-list")
        .appendChild(openCropImageModalBtn);
    }
    // add image to page
    document
      .querySelector(".app .main")
      .insertAdjacentElement("beforeend", resizeBox);
  }
}
