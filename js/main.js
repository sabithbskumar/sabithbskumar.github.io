"use strict"

var timer = null;

function init() {

  swipeToUnlock(document.getElementById("lockscreen"));

}

function boot() {

  let os_name = "Real OS";
  let canvas = document.getElementById("boot-animation");
  let ctx = canvas.getContext("2d");
  const dpr = (int) => window.devicePixelRatio * int;
  const windowW = window.innerWidth;

  canvas.width = Math.floor(dpr(canvas.clientWidth));
  canvas.height = Math.floor(dpr(canvas.clientHeight));

  let cw = canvas.width;
  let ch = canvas.height;
  let font = new FontFace("KanitRegular", "url(css/fonts/Kanit-Regular.ttf)");

  font.load().then(() => {
    initApps();
    let transparency = 0.0;
    ctx.font = `${dpr(60)}px KanitRegular, monospace`;
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    let reqAnimationFrame = window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.requestAnimationFrame;
    const anim = () => {
      if (transparency > 1.0)
        transparency = 1.0;
      ctx.clearRect(0, 0, cw, ch);
      ctx.globalAlpha = transparency;
      ctx.fillText(os_name, (cw / 2), (ch / 2));
      if (transparency < 1) {
        transparency += 0.01;
        reqAnimationFrame(anim);
      }
      else {
        setTimeout(() => {
          initLogin();
          document.getElementById("boot").classList.add("hidden");
          document.getElementById("main").classList.remove("hidden");
        }, 1000);
      }
    }
    reqAnimationFrame(anim);
  });
}

function initLogin(slidedown = false) {
  console.log("Login Screen");
  let lockscreen = document.getElementById("lockscreen");
  document.getElementById("desktop").classList.add("zoomed-in");
  lockscreen.classList.remove("hidden");

  if (slidedown) {
    lockscreen.animate(
      [{
          bottom: '100%'
        },
        {
          bottom: '0'
        }
      ], {
        duration: 500
      }
    );
  }

  document.querySelector("meta[name='theme-color']")
    .setAttribute("content", "#667eea");

  const setDateTime = () => {
    let clock = document.getElementById("lockscreen-time");
    let calender = document.getElementById("lockscreen-date");
    let today = new Date();
    let time = `${today.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}`;
    let date = `${today.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" })}`;
    clock.innerText = time;
    calender.innerText = date;
  }
  setDateTime();
  timer = setInterval(setDateTime, 1000 * 10);
}

function unlock(landscape = false) {
  clearInterval(timer);

  let lockscreen = document.getElementById("lockscreen");
  let desktop = document.getElementById("desktop");
  let hideLockscreen = () => {
    lockscreen.classList.add("hidden");
    lockscreen.style.bottom = `0px`;
    desktop.classList.remove("zoomed-in");
  }
  if (!landscape) {
    console.log(landscape);
    lockscreen.style.bottom = `${window.innerHeight}px`;
  }
  document.querySelector("meta[name='theme-color']")
    .setAttribute("content", "rgb(65, 80, 95)");
  setTimeout(hideLockscreen, 100);
}

function initApps() {
  fetch(`apps.json`)
    .then(response => response.json())
    .then(iconList => createShortcuts(iconList));

  function createShortcuts(icons) {
    const shortcuts = icons["shortcuts"];
    const apps = icons["apps"];
    const page = document.getElementsByClassName("page")[0];
    const appList = document.getElementsByClassName("app-list")[0];
    shortcuts.forEach(shortcut => {
      renderIcons(shortcut.name, shortcut.icon, shortcut.onclick, page);
    });
    for(let app in apps){
      renderIcons(apps[app], `apps/${app}/ic_launcher.png`,
        `openApp("${app}");`, page);
      renderIcons(apps[app], `apps/${app}/ic_launcher.png`,
        `openApp("${app}");`, appList);
    }
  }

  function renderIcons(name, icon, click, rootNode) {
    const iconElement = {
      element: "div",
      attributes: { class: "icon", onclick: click },
      body: [
        {
          element: "img",
          attributes: { src: icon, onError: "this.onerror=null;this.src='/images/ic_launcher.png'" }
        },
        {
          element: "span",
          text: name
        }
      ]
    };
    renderLayout(iconElement, rootNode);
  }
}

function curPosX(e) {
  if (e.type == 'touchstart' || e.type == 'touchmove' ||
    e.type == 'touchend' || e.type == 'touchcancel') {
    return e.touches[0].pageX;
  }
  else if (e.type == 'mousedown' || e.type == 'mouseup' ||
    e.type == 'mousemove' || e.type == 'mouseover' ||
    e.type == 'mouseout' || e.type == 'mouseenter' ||
    e.type == 'mouseleave') {
    return e.pageX;
  }
}

function curPosY(e) {
  if (e.type == 'touchstart' || e.type == 'touchmove' ||
    e.type == 'touchend' || e.type == 'touchcancel') {
    return e.touches[0].pageY;
  }
  else if (e.type == 'mousedown' || e.type == 'mouseup' ||
    e.type == 'mousemove' || e.type == 'mouseover' ||
    e.type == 'mouseout' || e.type == 'mouseenter' ||
    e.type == 'mouseleave') {
    return e.pageY;
  }
}

function curPosXY(e) {
  if (e.type == 'touchstart' || e.type == 'touchmove'  ||
    e.type == 'touchend' || e.type == 'touchcancel') {
    return [e.touches[0].pageX, e.touches[0].pageY];
  }
  else if (e.type == 'mousedown' || e.type == 'mouseup' ||
    e.type == 'mousemove' || e.type == 'mouseover' ||
    e.type == 'mouseout' || e.type == 'mouseenter' ||
    e.type == 'mouseleave') {
    return [e.pageX, e.pageY];
  }
}

function swipeToUnlock(element) {
  var initialPos = 0,
    curY = 0;

  element.onmousedown = element.ontouchstart = swipeStart;

  function swipeStart(e) {
    e = e || window.event;
    initialPos = curY = curPosY(e);

    document.onmouseup = document.ontouchend =
      document.onmouseleave = swipeEnd;
    document.onmousemove = document.ontouchmove = swipeMove;
  }

  function swipeMove(e) {
    e = e || window.event;

    curY = curPosY(e);

    if (initialPos - curY >= 0) {
      let bottom = `${initialPos - curY}px`;
      element.style.setProperty("bottom", bottom);
    }
  }

  function swipeEnd() {
    document.onmouseup = document.ontouchend = document.onmouseleave =
      document.onmousemove = document.ontouchmove = null;
    element.style.setProperty("bottom", 0);
    if (initialPos - curY > window.innerHeight / 4)
      unlock();
  }
}

function windowResizer(element) {
  var startX, startY, initialWidth, initialHeight;

  const resizeArrow = document.createElement("div");
  resizeArrow.classList.add("resize-arrow");
  element.appendChild(resizeArrow);
  resizeArrow.onmousedown = resizeArrow.ontouchstart = dragStart;

  function dragStart(e) {
    [startX, startY] = curPosXY(e);
    initialWidth = parseInt(
      document.defaultView.getComputedStyle(element).width
    );
    initialHeight = parseInt(
      document.defaultView.getComputedStyle(element).height
    );
    document.onmousemove = document.ontouchmove = dragResize;
    document.onmouseup = document.ontouchend = document.onmouseleave = dragEnd;
  }

  function dragResize(e) {
    if(curPosX(e) > startX - initialWidth)
      resizeArrow.parentElement.style.setProperty(
        "--width", `${initialWidth+curPosX(e)-startX}px`
      );
    if(curPosY(e) > startY - initialHeight)
      resizeArrow.parentElement.style.setProperty(
        "--height", `${initialHeight+curPosY(e)-startY}px`
      );
  }

  function dragEnd(e) {
    document.onmousemove = document.ontouchmove = null;
    document.onmouseup = document.ontouchend = document.onmouseleave = null;
  }
}


function setAsActive(app, icon) {
  if (app.classList.contains("active"))
    return;
  console.log("Active app");
  [...document.getElementsByClassName("app active")]
    .forEach(e => e.classList.remove("active"));
  app.classList.add("active");
  app.classList.remove("minimized");
  app.classList.remove("hide");
  [...document.getElementsByClassName("app-activity-icon active")]
    .forEach(e => e.classList.remove("active"));
  icon.classList.add("active");
  document.getElementById("desktop").appendChild(app);
}

function appOnDrag(element, icon) {
  var offX = 0,
    offY = 0,
    curX = null,
    curY = null;

  var title = element.getElementsByClassName("title")[0];
  title.onmousedown = title.ontouchstart = dragStart;

  function dragStart(e) {
    e = e || window.event;

    setAsActive(element, icon);
    [curX, curY] = curPosXY(e);

    offX = (curX - element.offsetLeft) / title.offsetWidth;
    offY = (curY - element.offsetTop);

    document.onmouseup = document.ontouchend = document.onmouseleave = dragEnd;
    document.onmousemove = document.ontouchmove = dragMove;
  }

  function dragMove(e) {
    e = e || window.event;
    [curX, curY] = curPosXY(e);
    if (element.classList.contains("win-normal")) {
      let top = curY - offY;
      let left = curX - (title.offsetWidth * offX);
      let desktop = document.getElementById("desktop");
      if (desktop.offsetHeight > top)
        element.style
          .setProperty("--top", `max(0%, ${(top/desktop.offsetHeight)*100}%)`);
      element.style
        .setProperty("--left", `${(left/desktop.offsetWidth)*100}%`);
    }
    if (curX < 20) {
      document.getElementById("desktop").classList.remove("boxshadow");
      document.getElementById("desktop").classList.remove("boxshadow-r");
      document.getElementById("desktop").classList.add("boxshadow-l");
    }
    else if (curX > window.innerWidth - 20) {
      document.getElementById("desktop").classList.remove("boxshadow");
      document.getElementById("desktop").classList.remove("boxshadow-l");
      document.getElementById("desktop").classList.add("boxshadow-r");
    }
    else if (curY < 20) {
      document.getElementById("desktop").classList.remove("boxshadow-l");
      document.getElementById("desktop").classList.remove("boxshadow-r");
      document.getElementById("desktop").classList.add("boxshadow");
    }
    else {
      element.classList.add("win-normal");
      document.getElementById("desktop").classList.remove("boxshadow");
      document.getElementById("desktop").classList.remove("boxshadow-l");
      document.getElementById("desktop").classList.remove("boxshadow-r");
      element.classList.remove("left");
      element.classList.remove("right");
    }
  }

  function dragEnd() {
    document.onmouseup = document.onmousemove = document.onmouseleave =
      document.ontouchmove = document.ontouchend = null;
    document.getElementById("desktop").classList.remove("boxshadow");
    document.getElementById("desktop").classList.remove("boxshadow-l");
    document.getElementById("desktop").classList.remove("boxshadow-r");
    if (curX != null && curX < 20) {
      element.classList.remove("win-normal");
      element.classList.remove("right");
      element.classList.add("left");
    }
    else if (curX > window.innerWidth - 20) {
      element.classList.remove("win-normal");
      element.classList.remove("left");
      element.classList.add("right");
    }
    else if (curY != null && curY < 20) {
      element.classList.remove("win-normal");
      element.classList.remove("left");
      element.classList.remove("right");
    }
  }
}

function attachWindowControls(app, icon) {
  let minBtn = app.getElementsByClassName("min-btn")[0];
  let maxBtn = app.getElementsByClassName("max-btn")[0];
  let closeBtn = app.getElementsByClassName("close-btn")[0];
  let appTitle = app.getElementsByClassName("title")[0];
  let recentCloseBtn = icon.getElementsByClassName("close-app")[0];

  appOnDrag(app, icon);

  closeBtn.onclick = recentCloseBtn.onmouseup = recentCloseBtn.onclick = () => {
    console.log("Closing app");
    app.onclick = icon.onclick = null;
    appTitle.ontouchstart = appTitle.onmousedown = null;
    minBtn.onclick = maxBtn.onclick =
      maxBtn.ondblclick = closeBtn.onclick = null;

    app.remove();
    icon.remove();
    app = icon = null;
  }

  minBtn.onclick = () => {
    console.log("app minimized");
    app.onclick = null;
    app.classList.add("minimized");
    app.classList.remove("active");
    icon.classList.remove("active");
  }

  maxBtn.onclick = appTitle.ondblclick = () => {
    app.classList.toggle("win-normal");
  }

  app.onclick = () => setAsActive(app, icon);
  icon.onclick = () => {
    setAsActive(app, icon);
    app.onclick = () => setAsActive(app, icon);
  }

}

function hideDesktop() {
  [...document.getElementsByClassName('app')]
    .forEach(e => e.classList.add("hide"));
  [...document.getElementsByClassName('app active')]
    .forEach(e => e.classList.remove("active"));
  let recentappbg = document.getElementsByClassName("active-apps")[0];
  if(recentappbg.classList.contains("invisible"))
    return;
  recentAppSwitcher();
}

function showDesktop() {
  [...document.getElementsByClassName('app')]
    .forEach(e => e.classList.remove("hide"));
}

function renderElement(element) {
  let renderedElement = document.createElement(`${element["element"]}`);
  for (let attr in element.attributes) {
    renderedElement.setAttribute(attr, element.attributes[attr]);
  }
  if (element.text)
    renderedElement.innerText = element.text;
  return renderedElement;
}

function renderLayout(obj, parent) {
  // obj can be an array of elements or an element
  // if obj is an array render all the elements in it by traversing
  // if obj is an element render it and return it
  // if obj has a child then render the element and append the child after
  // rendering the child
  const isObject = e => typeof (e) == "object";
  const isArray = e => Array.isArray(e);
  const isElement = e => e.hasOwnProperty("element");
  const hasChild = e => e.hasOwnProperty("body");

  var element = null;

  if (isArray(obj)) {
    obj.forEach((item) => {
      renderLayout(item, parent);
    });
  }
  else if (isElement(obj)) {
    element = renderElement(obj);
    if (hasChild(obj))
      renderLayout(obj.body, element);
    parent.appendChild(element);
  }
  return element;
}

async function openApp(appname) {

  function renderApp(json) {

    const appLayout = {
      element: "div",
      attributes: {
        class: "app win-normal"
      },
      body: [{
          element: "div",
          attributes: {
            class: "app-header"
          },
          body: [{
              element: "div",
              attributes: {
                class: "title no-select"
              },
              body: {
                element: "span",
                text: json.title
              }
            },
            {
              element: "div",
              attributes: {
                class: "window-controls p-hide"
              },
              body: [{
                  element: "button",
                  attributes: {
                    class: "min-btn"
                  }
                },
                {
                  element: "button",
                  attributes: {
                    class: "max-btn"
                  }
                },
                {
                  element: "button",
                  attributes: {
                    class: "close-btn"
                  }
                }
              ]
            }
          ]
        },
        {
          element: "div",
          attributes: {
            class: "app-body"
          }
        }
      ]
    };

    const taskbarAppIcon = {
      element: "button",
      attributes: {
        class: "app-activity-icon",
        style: `background-image: url(apps/${appname}/ic_launcher.png)`
      },
      body: {
        element: "span",
        text: "Close [x]",
        attributes: { class: "close-app no-select" }
      }
    };


    [...document.getElementsByClassName("app active")]
      .forEach(e => e.classList.remove("active"));
    var app = renderLayout(appLayout, document.getElementById("desktop"));
    var appTaskbarIcon = renderLayout(taskbarAppIcon,
      document.getElementById("active-apps"));

    app.style.setProperty("--width", json.width);
    app.style.setProperty("--height", json.height);
    app.style.setProperty("--top", `calc(50% - var(--height) / 2)`);
    app.style.setProperty("--left", `calc(50% - var(--width) / 2)`);
    if (json.body) {
      let appBody = renderLayout(json.body,
        app.getElementsByClassName("app-body")[0]);
    }
    attachWindowControls(app, appTaskbarIcon);
    windowResizer(app);

    setAsActive(app, appTaskbarIcon);
    app.animate(
      [{
          scale: 0
        },
        {
          scale: 1
        }
      ], {
        duration: 200
      }
    );
    return app;
  }

  function loadAppScript(app) {
    import(`../apps/${appname}/js/script.js`)
      .then(e => e.default(app.getElementsByClassName("app-body")[0]));
  }

  if (!document.getElementById(`app-${appname}-css`)) {
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.id = `app-${appname}-css`;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = `apps/${appname}/css/style.css`;
    link.media = 'all';
    head.appendChild(link);
  }

  fetch(`apps/${appname}/layout.json`)
    .then(response => response.json())
    .then(data => renderApp(data))
    .then(element => loadAppScript(element));
}
var e;
function recentAppSwitcher() {
  let recentappbg = document.getElementsByClassName("active-apps")[0];
  if (recentappbg.classList.contains("invisible")) {
    recentappbg.classList.remove("invisible");
    recentappbg.appendChild(document.getElementById("active-apps"));
  }
  else {
    recentappbg.classList.add("invisible");
    document.getElementById("taskbar")
      .appendChild(document.getElementById("active-apps"));
  }
}


init();
boot();
